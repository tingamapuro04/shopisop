import { Order } from "../models/orders.js";
import { Product } from "../models/product.js";
// Controller to create an order for a user with multiple products and calculate total price
export const createOrder = async (req, res) => {
  try {
    const { userId, products } = req.body; // products is an array of { productId, quantity }
    let totalPrice = 0;
    for (let item of products) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product with id ${item.productId} not found` });
      }
      totalPrice += product.price * item.quantity;
    }
    const newOrder = await Order.create({
      userId,
      totalPrice,
    });
    for (const item of products) {
      const product = await Product.findByPk(item.productId);
      await newOrder.addProduct(product, {
        through: { quantity: item.quantity, priceAtPurchase: product.price },
      });
    }
    // call the stk push function here to initiate payment
    const payment = await initiateSTKPush({orderId: newOrder.id});
    // update the order with the checkoutRequestId so we can match it in the callback
    await newOrder.update({ checkoutRequestId: payment.CheckoutRequestID, status: "awaiting_payment" });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get all orders for a user and include product details
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: {
        model: Product,
        through: { attributes: ["quantity"] },
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};  

