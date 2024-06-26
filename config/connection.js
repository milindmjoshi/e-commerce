//require('dotenv').config();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const Sequelize = require('sequelize');

// Init Sequelize
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        decimalNumbers: true,
      },
    });

module.exports = sequelize;
