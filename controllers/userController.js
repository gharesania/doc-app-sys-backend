const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

BASEURL = 'http://localhost:7005/uploads/'

// Register User
const register = async (req, res) => {
  console.log(req.body);
  let { name, email, password, contactNumber, address } = req.body;
  imagePath = req.file ? req.file.filename : null;

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).send({msg: "All fields are required",success: false,});
    }

    // Ensure password is string
    password = String(password);
    console.log("Password before hashing: ", password)

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).send({msg: "User already exists",success: false,});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Hashed Password: ", password)

    const regUser = await User.create({name,email,password: hashedPassword,contactNumber,address});

    if(!regUser){
      res.status(400).send({msg:"Not registered ⚠️",success:false})
    }

    return res.status(201).send({msg: "User Register successfully 👍🏻",success: true});

  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Internal Server Error ❌"});
  }
};

//Login User
const login = async (req, res) => {
  console.log(req.body);
  let { email, password } = req.body;

  try {
    
    password = String(password);

    const loggedUser = await User.findOne({ where: { email } });
    console.log(loggedUser, "logged user");

    if (!loggedUser) {
      return res.status(404).send({msg: "User not found 👎🏻",success: false,});
    }

    const isMatch = await bcrypt.compare(password, loggedUser.password);

    if (isMatch) {
      const payload = {id: loggedUser.id,role: loggedUser.role,};
      
      console.log("JWT SECRET:", process.env.SECRET_KEY);

      const token = jwt.sign(payload, process.env.SECRET_KEY,{ expiresIn: "1d" });

      return res.status(200).send({msg: "Logged in successfull ✅",success: true, token: token,});
    }
    else{
      return res.status(401).send({msg: "Incorrect Password ❌",success: false,});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Internal Server Error ⚠️" });
  }
};

const getUserInfo = async(req,res) =>{
    console.log(req.user,"In controller");

    try{
        const loggedUser = await User.findByPk(
            req.user.id,{
                attributes:["id", "name","email","address","role"]
            }
        )

        loggedUser.imagePath = BASEURL+loggedUser.imagePath;

        console.log("------------------",loggedUser);

        res.status(200).send({user:loggedUser,success:true})
    }catch(error){
        res.status(500).send({msg:"Server Error"})
    }
}

const doctorList = async(req, res) => {
  console.log(req.user, "In Controller");

  try{
    const doctors = await User.findAll({
      where:{role:"Doctor"},
      attributes:["id", "name"]
    })
    return res.status(200).send({doctors: doctors, success:true})
  }
  catch(error){
    console.log(error);
    return res. status(500).send({msg: "Internal Server Error !"})
  }
}

module.exports = { register, login, getUserInfo, doctorList};