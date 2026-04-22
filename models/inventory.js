import { DataTypes } from "sequelize";

export let Inventory;
export const initInventoryModel = (sequelize) => {
  Inventory = sequelize.define("Inventory", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
{
  timestamps: false,
  tableName: "inventory",
  freezeTableName: true,
});

  return Inventory;
};