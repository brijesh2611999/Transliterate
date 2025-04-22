const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

exports.auth = async (req, res, next) => {
  try {
    console.log("Token validation start");

    const token =
      req.cookies?.token ||
      req.body?.token ||
      (req.header("Authorization")?.startsWith("Bearer ")
        ? req.header("Authorization").replace("Bearer ", "")
        : null);

    console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);

      const existingUser = await User.findById(decoded.id);
      if (!existingUser) {
        return res.status(401).json({ success: false, message: "User not found or deleted" });
      }

      req.user = existingUser; // You can attach decoded instead if you want only the payload
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }
  } catch (error) {
    console.error("Authentication Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};
