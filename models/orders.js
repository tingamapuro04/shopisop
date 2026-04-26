import { DataTypes } from "sequelize";

export let Order;
// Order model where user can have multiple orders and each order can have multiple products
export const initOrderModel = (sequelize) => {
  Order = sequelize.define("Order", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "completed", "cancelled"]],
      },
    },
    totalPrice: {
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
  tableName: "orders",
  freezeTableName: true,
});

  return Order;
};