const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const register = async (req, res) => {
//   console.log(req.body);
//   let { name, email, password, contactNumber, address } = req.body;

//   try {
//     const existingUser = await User.findOne({
//       where: { email: email },
//     });
//     console.log(existingUser);
//     if (!existingUser) {
//       console.log(password);
//       const salt = await bcrypt.genSalt(10);
//       password = await bcrypt.hash(req.body.password, salt);

//       console.log("hashed password", password);

//       const regUser = await User.create({
//         name,
//         email,
//         password,
//         contactNumber,
//         address,
//       });
//       if (!regUser) {
//         res.status(400).send({ msg: "Not registered", success: false });
//       }
//       res.status(200).send({ msg: "Register successfully", success: true });
//       if (existingUser) {
//         res.status(200).send({ msg: "User already exists", success: false });
//       }
//     }
//   } catch (error) {
//     res.status(500).send({ msg: "Server Error" });
//   }
// };

const register = async (req, res) => {
  console.log(req.body);

  try {
    let { name, email, password, contactNumber, address } = req.body;

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

// const login = async (req, res) => {
//   console.log(req.body);
//   let { email, password } = req.body;
//   try {
//     const loggedUser = await User.findOne({
//       where: { email: email },
//     });
//     console.log(loggedUser, "logged user");
//     if (!loggedUser) {
//       res.status(400).send({ msg: "User not found", success: false });
//     }
//     if (await bcrypt.compare(password, loggedUser.password)) {
//       const payload = { id: loggedUser.id, role: loggedUser.role };

//       const token = jwt.sign(payload, process.env.SECREAT_KEY, {
//         expiresIn: "1d",
//       });

//       res
//         .status(202)
//         .send({ msg: "Logged in succesfull", success: true, token: token });
//     } else {
//       res.status(400).send({ msg: "password incorrect!!!" });
//     }
//   } catch (error) {
//     res.status(500).send({ msg: "Server Error" });
//   }
// };

const login = async (req, res) => {
  console.log(req.body);

  try {
    let { email, password } = req.body;
    password = String(password);

    const loggedUser = await User.findOne({ where: { email } });

    if (!loggedUser) {
      return res.status(404).send({msg: "User not found 👎🏻",success: false,});
    }

    const isMatch = await bcrypt.compare(password, loggedUser.password);

    if (!isMatch) {
      return res.status(401).send({msg: "Incorrect Password ❌",success: false,});
    }

    const payload = {id: loggedUser.id,role: loggedUser.role,};

    console.log("JWT SECRET:", process.env.SECRET_KEY);

    const token = jwt.sign(payload, process.env.SECRET_KEY,{ expiresIn: "1d" });

    return res.status(200).send({msg: "Logged in successfully ✅",success: true, token: token,});
  } catch (error) {
    console.error(error);
    return res.status(500).send({ msg: "Internal Server Error ⚠️" });
  }
};

// const getUserInfo = async (req, res) => {
//   console.log(req.user,"In controller")

//   try {
//     return res.status(200).send({
//       success: true,
//       msg: "User info fetched",
//       user: req.user || null,
//     });
//   } catch (error) {
//     return res.status(500).send({ msg: "Server Error" });
//   }
// };

const getUserInfo = async(req,res) =>{
  console.log(req.user,"In controller")
  
  try{
    const loggedUser = await User.findByPk(
      req.user.id,{
        attributes:["id", "name","email","address","role"]
      }
    )
    
    console.log("------------------",loggedUser);
    res.status(200).send({user:loggedUser,success:true})
    }catch(error){
      console.log(error);
      return res.status(500).send({msg:"Internal Server Error ⚠️"})
    }
}

module.exports = { register, login, getUserInfo };