import { Router } from "express";
import { handleMpesaCallback } from "../mpesa/callback.js";
const orderRouter = Router();

import { createOrder, getOrdersByUserId } from "../controllers/orders.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorize.js";
orderRouter.post("/", authenticateToken, authorizeRoles('user'), createOrder);
orderRouter.post("/mpesa/callback", handleMpesaCallback);
orderRouter.get("/user/:userId", getOrdersByUserId);

export default orderRouter;
