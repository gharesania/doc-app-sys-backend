const {sequelize} = require('../config.js/db.js')
const {DataTypes} = require('sequelize')

const User = sequelize.define("User", {
    id:{
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING(200),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true    
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    address:{
        type: DataTypes.STRING,
    },
    conatactNumber:{
        type: DataTypes.STRING
    },
    role:{
        type: DataTypes.ENUM('Admin', 'User', 'Doctor'),
        defaultValue:'User'
    }
},{
    timestamps:true,
    tableName: "Users"
})

module.exports = User