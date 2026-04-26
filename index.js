import 'dotenv/config';
import express from 'express';
import userRouter from './routes/user.js';
import productRouter from './routes/product.js';
import inventoryRouter from './routes/inventory.js';
import sequelize from './utils/db.js';
import { initUserModel } from './models/user.js';
import { initProductModel, Product } from './models/product.js';
import { initInventoryModel, Inventory } from './models/inventory.js';


const app = express();
app.use(express.json());

app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/inventory', inventoryRouter);

const PORT = process.env.PORT || 3000;
// set up the models and associations

initProductModel(sequelize);
initInventoryModel(sequelize);
initUserModel(sequelize);
Product.hasOne(Inventory, { foreignKey: "productId" });
Inventory.belongsTo(Product, { foreignKey: "productId" });
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