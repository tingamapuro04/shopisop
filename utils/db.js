import { Sequelize } from 'sequelize';

const db = process.env.DB
const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASSWORD;
const dbHost = process.env.DBHOST;
const dbDialect = process.env.DBDIALECT;

// connect to a postgres database
const sequelize = new Sequelize(db, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect
});

export default sequelize;
