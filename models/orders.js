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
    checkoutRequestId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "awaiting_payment", "paid", "payment_failed"]],
      },
    },
    mpesaRef: {
      type: DataTypes.STRING,
      allowNull: true,
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
      deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
{
  timestamps: false,
  tableName: "orders",
  freezeTableName: true,
});

  return Order;
};