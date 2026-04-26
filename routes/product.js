// import Router from express
import { Router } from "express";
const productRouter = Router();

import { createProduct } from "../controllers/product.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

productRouter.post("/", upload.single("productImage"), createProduct);

export default productRouter;