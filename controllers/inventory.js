import { Inventory } from "../models/inventory.js";
import { Product } from "../models/product.js";
// Controller to create inventory for a product
export const createInventory = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const newInventory = await Inventory.create({
      productId,
      quantity,
    });
    res.status(201).json(newInventory);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", name: error.name});
  }
};

// Controller to get inventory details for a product
export const getInventoryByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const inventory = await Inventory.findOne({ where: { productId } });
    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found for this product" });
    }
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", name: error.name });
  }
};

// get all inventory items and include product name and price
export const getAllInventory = async (req, res) => {
  try {
    const inventoryItems = await Inventory.findAll({
      include: {
        model: Product,
        attributes: ["name", "price"],
      },
    });
    const updatedInventory = [];
    for (let item of inventoryItems) {
      let new_item = item.toJSON();
      if (item.Product) {
        new_item.productName = item.Product.name;
        new_item.productPrice = item.Product.price;
        updatedInventory.push(new_item);
      } else {
        updatedInventory.push(new_item);
      }
    }
    res.status(200).json(updatedInventory);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", name: error.name });
  }
};

// Controller to update inventory quantity for a product
export const updateInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const inventory = await Inventory.findOne({ where: { productId } });
    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found for this product" });
    }
    await inventory.update({ quantity });
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ error: "Internal Server Error", name: error.name });
  }
};
