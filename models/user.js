import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export let User;
export const initUserModel = (sequelize) => {
  User = sequelize.define("User", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      //validate if email is valid
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return User;
};