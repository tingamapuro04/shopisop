import { Product } from "../models/product.js";
import { uploadFileToS3, getImageUrl } from "../utils/file_upload.js";

//create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const productImage = req.file ? await uploadFileToS3(req.file) : null;
    const newProduct = await Product.create({
      name,
      description,
      price,
      productImage
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", name: error.name });
  }
};

// get all products and include image signed URLs if they exist
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    const updatedProducts = [];
    for (let product of products) {
      let new_product = product.toJSON();
      if (product.productImage) {
        new_product.productImage = await getImageUrl(product.productImage);
        updatedProducts.push(new_product);
      } else {
        updatedProducts.push(new_product);
      }
    }
    res.status(200).json(updatedProducts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", name: error.name });
  }
};