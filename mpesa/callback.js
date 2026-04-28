import {Order} from "../models/orders.js";

export const handleMpesaCallback = async (req, res) => {
  // Always acknowledge Safaricom immediately
  res.json({ ResultCode: 0, ResultDesc: "Success" });

  // Defer business logic so it runs after the response is sent
  setImmediate(async () => {
    const { Body } = req.body;
    const { stkCallback } = Body;

    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    if (ResultCode !== 0) {
      console.log(`Payment failed: ${ResultDesc}`);
      await handleFailedPayment(CheckoutRequestID, ResultDesc);
      return;
    }

    // Payment successful — extract metadata
    const metadata = stkCallback.CallbackMetadata.Item;

    const getValue = (name) =>
      metadata.find((item) => item.Name === name)?.Value;

    const paymentData = {
      amount: getValue("Amount"),
      mpesaReceiptNumber: getValue("MpesaReceiptNumber"),
      transactionDate: getValue("TransactionDate"),
      phoneNumber: getValue("PhoneNumber"),
      checkoutRequestId: CheckoutRequestID,
    };

    console.log("Payment received:", paymentData);
    await handleSuccessfulPayment(paymentData);
  });
};

// --- Your business logic below ---

const handleSuccessfulPayment = async (paymentData) => {
  // 1. Find the order by checkoutRequestId (you stored this when initiating STK)
  const order = await Order.findOne({ checkoutRequestId: paymentData.checkoutRequestId });

  // 2. Update order status
  await Order.update(
    { status: "paid", mpesaRef: paymentData.mpesaReceiptNumber },
    {
      where: { checkoutRequestId: paymentData.checkoutRequestId },
    },
  );

  // 3. Send notification to customer (SMS, email, push notification)
  // await sendNotification(order.customerId, `Payment of KES ${paymentData.amount} received. Ref: ${paymentData.mpesaReceiptNumber}`);

  console.log(
    `✅ Order paid. Receipt: ${paymentData.mpesaReceiptNumber}, Amount: KES ${paymentData.amount}`,
  );
};

const handleFailedPayment = async (checkoutRequestId, reason) => {
  // Update order status to failed/pending
  await Order.update({ checkoutRequestId, status: "payment_failed" }, {
    where: { checkoutRequestId },
  });
  // Optionally notify customer
  console.log(`❌ Payment failed for ${checkoutRequestId}: ${reason}`);
};

