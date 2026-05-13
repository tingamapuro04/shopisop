import { Router } from "express";
import { handleMpesaCallback } from "../mpesa/callback.js";
const orderRouter = Router();

import { createOrder, getOrderById, getMyOrders, sseOrderStatusUpdates } from "../controllers/orders.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorize.js";
orderRouter.post("/", authenticateToken, authorizeRoles('user'), createOrder);
orderRouter.post("/mpesa/callback", handleMpesaCallback);
orderRouter.get("/user", authenticateToken, getMyOrders);
orderRouter.get("/:id", authenticateToken, getOrderById);
// orderRouter.get("/:id/status-update", authenticateToken, sseOrderStatusUpdates);


export default orderRouter;
