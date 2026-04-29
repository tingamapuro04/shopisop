import { Router } from "express";
const inventoryRouter = Router();

import { createInventory, getInventoryByProductId } from "../controllers/inventory.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorize.js";

inventoryRouter.post("/", authenticateToken, authorizeRoles('admin', 'superAdmin'), createInventory);
inventoryRouter.get("/:productId", getInventoryByProductId);

export default inventoryRouter;