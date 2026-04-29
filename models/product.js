import { DataTypes } from "sequelize";

export let Product;
export const initProductModel = (sequelize) => {
  Product = sequelize.define("Product", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      // valid price must be a number;
      validate: {
        isFloat: true,
        min: 0,
      },
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
{
  timestamps: false,
  tableName: "products",
  freezeTableName: true,
});

  return Product;
};