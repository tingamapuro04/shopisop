import { Order } from "../models/orders.js";
import { Product } from "../models/product.js";
import { initiateSTKPush } from "../mpesa/stkpush.js";
import sequelize from "../utils/db.js";

export const createOrder = async (req, res) => {
  let transaction;

  try {
    const { products } = req.body; // [{ productId, quantity }]
    const authenticatedUserId = req.user.id;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: "Products are required",
      });
    }

    let totalPrice = 0;
    const validatedProducts = [];

    // STEP 1: Start transaction
    transaction = await sequelize.transaction();

    // STEP 2: Fetch + validate all products + inventory first
    for (const item of products) {
      const product = await Product.findByPk(item.productId, {
        transaction,
        lock: transaction.LOCK.UPDATE, // prevents race conditions
      });

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          error: `Product with id ${item.productId} not found`,
        });
      }

      const productInventory = await product.getInventory({
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!productInventory) {
        await transaction.rollback();
        return res.status(404).json({
          error: `Inventory not found for product ${product.name}`,
        });
      }

      if (productInventory.quantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Insufficient stock for product ${product.name}`,
        });
      }

      totalPrice += product.price * item.quantity;

      validatedProducts.push({
        product,
        productInventory,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    // STEP 3: Create order inside transaction
    const newOrder = await Order.create(
      {
        userId: authenticatedUserId,
        totalPrice,
        status: "pending",
      },
      { transaction },
    );

    // STEP 4: Reduce inventory + attach products
    for (const item of validatedProducts) {
      await item.productInventory.decrement("quantity", {
        by: item.quantity,
        transaction,
      });

      await newOrder.addProduct(item.product, {
        through: {
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        },
        transaction,
      });
    }

    // STEP 5: Commit DB transaction first
    await transaction.commit();

    // STEP 6: Call M-Pesa AFTER commit
    try {
      const payment = await initiateSTKPush({
        orderId: newOrder.id,
        totalPrice,
      });

      await newOrder.update({
        checkoutRequestId: payment.CheckoutRequestID,
        status: "awaiting_payment",
      });

      return res.status(201).json(newOrder);
    } catch (paymentError) {
      // Order exists, but payment failed
      await newOrder.update({
        status: "payment_failed",
      });

      return res.status(500).json({
        error: "Order created but payment initiation failed",
        name: paymentError.name,
      });
    }
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error)
    return res.status(500).json({
      error: "Internal Server Error",
      name: error.name,
    });
  }
};
// Controller to get all orders for a user and include product details
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    // Ensure the authenticated user is requesting their own orders
    // if (parseInt(userId) !== req.user.id) {
    //   return res.status(403).json({ error: "Forbidden" });
    // }
    const orders = await Order.findAll({
      where: { userId },
      include: {
        model: Product,
        through: { attributes: ["quantity"] },
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", name: error.name });
  }
};  

// Controller to get a single order by id and include product details
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: {
        model: Product,
        through: { attributes: ["quantity"] },
      },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", name: error.name });
  }
};
// const sseClients = new Map();
// export const sseOrderStatusUpdates = async (req, res) => {
//   try {
//     const orderId = req.params.id;
//     console.log("[SSE] client connected for order:", orderId);
//     console.log("[SSE] user from token:", req.user);

//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");
//     res.setHeader("X-Accel-Buffering", "no");
//     res.flushHeaders();
//     console.log("[SSE] headers flushed");

//     if (!sseClients.has(orderId)) sseClients.set(orderId, new Set());
//     sseClients.get(orderId).add(res);
//     console.log(
//       "[SSE] client registered, total clients for order:",
//       sseClients.get(orderId).size,
//     );

//     const heartbeat = setInterval(() => {
//       console.log("[SSE] sending heartbeat for order:", orderId);
//       res.write(": heartbeat\n\n");
//     }, 25000);

//     req.on("close", () => {
//       console.log("[SSE] client disconnected for order:", orderId);
//       clearInterval(heartbeat);
//       sseClients.get(orderId)?.delete(res);
//     });
//   } catch (err) {
//     console.error("[SSE] handler crashed:", err);
//   }
// };

// Call this helper whenever you update an order's status
// export function notifyOrderStatusChange(orderId, newStatus, mpesaRef = null) {
//   const clients = sseClients.get(String(orderId));
//   if (!clients?.size) return;

//   const payload = JSON.stringify({ status: newStatus, mpesaRef });
//   clients.forEach((res) => res.write(`data: ${payload}\n\n`));
// }