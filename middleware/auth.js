const jwt = require("jsonwebtoken");
require("dotenv").config();

// function auth(req, res, next) {
//   console.log(req.headers.authorization, "***********?????????????????");
//   token = req.headers.authorization;
//   if (token.startsWith("Bearer")) {
//     console.log(token, "_________Token_______");
//     token = token.split(" ")[1];
//     console.log(token, "after removing bearer");

//     decoded = jwt.decode(token, process.env.SECREAT_KEY);
//     console.log("--------decoded---------", decoded);
//     req.user = decoded;
//     next();
//   } else {
//     res.status(400).send({ msg: "auth hearer bearer missing", success: false });
//   }
// }

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. Check if header exists
  if (!authHeader) {
    return res.status(401).json({success: false,msg: "Authorization header missing",});
  }

  // 2. Check Bearer format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({success: false,msg: "Invalid authorization format",});
  }

  // 3. Extract token
  const token = authHeader.split(" ")[1];

  try {
    // 4. VERIFY token (not decode)
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired token",
    });
  }
}

module.exports = { auth };