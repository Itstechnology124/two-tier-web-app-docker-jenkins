
const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "taskmanager",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await db.getConnection();

    console.log("MySQL database connected successfully!");

    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    throw error;
  }
}

module.exports = {
  db,
  testConnection
};