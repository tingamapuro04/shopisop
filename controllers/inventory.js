import { Inventory } from "../models/inventory.js";
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
    console.error("Error creating inventory:", error);
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
    console.error("Error fetching inventory:", error[0].message);
    res.status(500).json({ error: "Internal Server Error", message: error[0] });
  }
};