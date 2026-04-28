import 'dotenv/config';
import express from 'express';
import userRouter from './routes/user.js';
import productRouter from './routes/product.js';
import inventoryRouter from './routes/inventory.js';
import orderRouter from './routes/orders.js';
import sequelize from './utils/db.js';
import { initUserModel } from './models/user.js';
import { initProductModel, Product } from './models/product.js';
import { initInventoryModel, Inventory } from './models/inventory.js';
import { initOrderItemModel } from './models/orderItem.js';
import { initOrderModel } from './models/orders.js';
import { User } from './models/user.js';
import { Order } from './models/orders.js';
import { OrderItem } from './models/orderItem.js';


const app = express();
app.use(express.json());

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
Product.hasOne(Inventory, { foreignKey: "productId" });
Inventory.belongsTo(Product, { foreignKey: "productId" });
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });
Order.belongsToMany(Product, { through: OrderItem, foreignKey: "orderId" });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: "productId" });
// 
const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync({ alter: true});
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

dbConnection();