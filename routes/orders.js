import { Router } from "express";
const orderRouter = Router();

import { createOrder, getOrdersByUserId } from "../controllers/orders.js";
orderRouter.post("/", createOrder);
orderRouter.get("/user/:userId", getOrdersByUserId);

export default orderRouter;
