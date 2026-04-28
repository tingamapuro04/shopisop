import { Router } from "express";
import { handleMpesaCallback } from "../mpesa/callback.js";
const orderRouter = Router();

import { createOrder, getOrdersByUserId } from "../controllers/orders.js";
orderRouter.post("/", createOrder);
orderRouter.post("/mpesa/callback", handleMpesaCallback);
orderRouter.get("/user/:userId", getOrdersByUserId);

export default orderRouter;
