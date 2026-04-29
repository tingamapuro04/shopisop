// import Router from express
import { Router } from "express";
const productRouter = Router();

import { createProduct, getAllProducts } from "../controllers/product.js";
import multer from "multer";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

productRouter.post("/", upload.single("productImage"), createProduct);
productRouter.get("/", authenticateToken, getAllProducts);

export default productRouter;