const mongoose = require('mongoose');

const database = {
  name: process.env.DB_NAME,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 27017
};

const main = async () => {
  const conn = await mongoose.connect(`mongodb://${database.host}:${database.port}/${database.name}`)
  console.log(`connection done successfully on host: ${conn.connection.host}`)
}

module.exports = main