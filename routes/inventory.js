import { Router } from "express";
const inventoryRouter = Router();


import { createInventory, getInventoryByProductId, getAllInventory, updateInventory } from "../controllers/inventory.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorize.js";

inventoryRouter.post("/", authenticateToken, authorizeRoles('admin', 'superAdmin'), createInventory);
inventoryRouter.get("/", authenticateToken, getAllInventory);
inventoryRouter.get("/:productId", authenticateToken, getInventoryByProductId);
inventoryRouter.put("/:productId", authenticateToken, authorizeRoles('admin', 'superAdmin'), updateInventory);


export default inventoryRouter;