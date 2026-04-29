// import Router from express
import { Router } from "express";
const productRouter = Router();

import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getInStockProducts } from "../controllers/product.js";
import multer from "multer";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { authorizeRoles } from "../middlewares/authorize.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

productRouter.post("/", authenticateToken, authorizeRoles('admin', 'superAdmin'),  upload.single("productImage"), createProduct);
productRouter.get("/", authenticateToken, getAllProducts);
productRouter.get("/instock", authenticateToken, getInStockProducts);
productRouter.get("/:id", authenticateToken, getProductById);
productRouter.put("/:id", authenticateToken, authorizeRoles('admin', 'superAdmin'), upload.single("productImage"), updateProduct);
productRouter.delete("/:id", authenticateToken, authorizeRoles('admin', 'superAdmin'), deleteProduct);

export default productRouter;