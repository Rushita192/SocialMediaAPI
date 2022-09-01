const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// authenticates user before accessing specified route
const protectRoute = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
      } else {
        res.status(401).json({ message: "Unauthorised Access!!" });
      }
    } catch (err) {
      return res.status(401).json({ message: "Unathorised Access" });
    }
  }
  else{
    return res.status(401).json({ message: "Unathorised Access" });
  }
};

module.exports = protectRoute;
