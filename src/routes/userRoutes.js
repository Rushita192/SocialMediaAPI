const express = require("express");
const router = express.Router();

// controller define
const { userRegister, userLogin } = require("../controller/userController");

// Register
router.post("/register", userRegister);

// Login
router.post("/login", userLogin);

module.exports = router;
