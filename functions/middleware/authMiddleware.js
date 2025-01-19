const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET; // Ensure JWT_SECRET is defined in your .env file

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).send({ message: "No token provided. Unauthorized access." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).send({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
