import { Sequelize } from 'sequelize';

const db = process.env.DB
const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASSWORD;
const dbHost = process.env.DBHOST;
const dbDialect = process.env.DBDIALECT;
const dbConnectionString = process.env.NEON_DB_CONNECTION_STRING;

// connect to a postgres database
// const sequelize = new Sequelize(db, dbUser, dbPassword, {
//   host: dbHost,
//   dialect: dbDialect,
//   define: {
//     freezeTableName: true
//   },
// });


const sequelize = new Sequelize(dbConnectionString, {
  dialect: dbDialect,
  protocol: 'postgres',
  logging: false, // Disable logging; default: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For self-signed certificates
    },
  },  
  define: {
    freezeTableName: true,
  },
});

export default sequelize;
