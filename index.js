import 'dotenv/config';
import express from 'express';
import userRouter from './routes/user.js';
import sequelize from './utils/db.js';


const app = express();
app.use(express.json());

app.use('/users', userRouter);

const PORT = process.env.PORT || 3000;
// 
const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

dbConnection();