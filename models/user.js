import { DataTypes } from "sequelize";

export let User;
export const initUserModel = (sequelize) => {
  User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
      // validate if password is at least 6 characters long and contains at least one number, one uppercase letter, and one lowercase letter
      validate: {
        len: [5, 100],
        isStrong(value) {
          if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
            throw new Error('Password must contain at least one number, one uppercase, and one lowercase letter');
          }
        }
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: [["user", "admin", "superAdmin"]],
      },
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
{
  timestamps: false,
  tableName: "users",
  freezeTableName: true,
});

  return User;
};