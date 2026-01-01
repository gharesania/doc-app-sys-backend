const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    define: {
      timestamps: true,
    },
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database Connected succesfully... ✅");
  } catch (error) {
    console.log("Error while connection ❌", error);
  }
}

syncDB = async (force = false, alter = true) => {
  try {
    await sequelize.sync(force, alter);
    console.log("✅ All models were synchronized successfully !");
  } catch (error) {
    console.error("❌ Error syncing models:", error);
  }
};
syncDB();

module.exports = { testConnection, sequelize };