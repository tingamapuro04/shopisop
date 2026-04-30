import { Router } from "express";
import { handleMpesaCallback } from "../mpesa/callback.js";
const orderRouter = Router();

import { createOrder, getOrdersByUserId, getOrderById } from "../controllers/orders.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorize.js";
orderRouter.post("/", authenticateToken, authorizeRoles('user'), createOrder);
orderRouter.post("/mpesa/callback", handleMpesaCallback);
orderRouter.get("/user/:userId", authenticateToken, getOrdersByUserId);
orderRouter.get("/:id", authenticateToken, getOrderById);


export default orderRouter;
