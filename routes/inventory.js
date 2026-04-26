import { Router } from "express";
const inventoryRouter = Router();

import { createInventory, getInventoryByProductId } from "../controllers/inventory.js";

inventoryRouter.post("/", createInventory);
inventoryRouter.get("/:productId", getInventoryByProductId);

export default inventoryRouter;