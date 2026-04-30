import 'dotenv/config';
import express from 'express';
import userRouter from './routes/user.js';
import productRouter from './routes/product.js';
import inventoryRouter from './routes/inventory.js';
import orderRouter from './routes/orders.js';
import sequelize from './utils/db.js';
import rateLimit from "express-rate-limit";
import cors from 'cors';
import { initUserModel } from './models/user.js';
import { initProductModel, Product } from './models/product.js';
import { initInventoryModel, Inventory } from './models/inventory.js';
import { initOrderItemModel } from './models/orderItem.js';
import { initOrderModel } from './models/orders.js';
import { User } from './models/user.js';
import { Order } from './models/orders.js';
import { OrderItem } from './models/orderItem.js';


const app = express();
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  limit: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/inventory', inventoryRouter);
app.use('/orders', orderRouter);


const PORT = process.env.PORT || 3000;
// set up the models and associations

initProductModel(sequelize);
initInventoryModel(sequelize);
initUserModel(sequelize);
initOrderItemModel(sequelize);
initOrderModel(sequelize);
Product.hasOne(Inventory, { foreignKey: "productId", onDelete: "CASCADE" });
Inventory.belongsTo(Product, { foreignKey: "productId" });
User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });
Order.belongsToMany(Product, { through: OrderItem, foreignKey: "orderId" });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: "productId" });
// 
const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true});
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

dbConnection();