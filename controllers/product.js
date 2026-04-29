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

// get a single product by id and include image signed URL if it exists
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    let new_product = product.toJSON();
    if (product.productImage) {
      new_product.productImage = await getImageUrl(product.productImage);
      res.status(200).json(new_product);
    } else {
      res.status(200).json(new_product);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", name: error.name });
  }
};

// update a product by id and allow updating the image as well
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const productImage = req.file ? await uploadFileToS3(req.file) : null;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      productImage: productImage || product.productImage,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", name: error.name });
  }
};

// delete a product by id and also delete the associated inventory record if it exists
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", name: error.name });
  }
};

// get all products that are in stock (quantity > 0) and include image signed URLs if they exist
export const getInStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: Inventory,
        where: { quantity: { [Op.gt]: 0 } },
      },
    });
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