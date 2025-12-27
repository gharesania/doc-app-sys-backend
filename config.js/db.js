const {Sequelize} = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    define: {
        timestamps: true
    }
})


async function testConnection(){
    try{
        await sequelize.authenticate();
        console.log("Database connected sucessfully ✅");
    }   
    catch(error){
        console.log("Database not connected ❌", error);
    }
}

syncDB = async (force=false, alter=true) => {
    try {
        await sequelize.sync(force,alter)
        console.log("All models synced successfully ✅")

    } catch (error) {
        console.log("Error syncing model ❌", error)
    }    
}
syncDB()

module.exports = {sequelize, testConnection, syncDB}