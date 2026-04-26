import { DataTypes } from "sequelize";

export let OrderItem;
export const initOrderItemModel = (sequelize) => {
  OrderItem = sequelize.define("OrderItem", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // valid quantity must be a non-negative integer;
      validate: {
        isInt: true,
        min: 0,
      },
    },
    priceAtPurchase: {
      type: DataTypes.FLOAT,
      allowNull: false,
      // valid price must be a number;
      validate: {
        isFloat: true,
        min: 0,
      },
    },
  },
{
  timestamps: false,
  tableName: "order_items",
  freezeTableName: true,
});

  return OrderItem;
};