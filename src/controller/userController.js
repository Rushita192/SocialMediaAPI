const bcrypt = require("bcrypt");
const logger = require('pino')()

// token generate
const generateToken = require("../utils/generateToken");

// user model import
const User = require("../models/userModel");
const { registration, login } = require("../utils/validationSchema");


const userRegister = async (req, res, next) => {
  try {
    const { name, email, username, phone, password } = req.body;
    const { error } = await registration.validateAsync({ name, email, username, phone, password });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user_exist = await User.findOne({ username: username });
    if (user_exist) {
      return res.status(400).json({ message: "Username Already Exist!!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      name: name,
      email: email,
      username: username,
      phone: phone,
      password: hashPassword,
    });

    if (!newUser) {
      return res.status(400).json({ message: "User Not Registered!" });
    }
    return res.status(201).json({ message: "User Register Successfully!" });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const userLogin = async (req, res, next) => {
  try {

    const { username, password } = req.body;
    const { error } = await login.validateAsync({ username, password });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid Username or Password!!" });
    }

    let isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Username or Password!!" });
    }

    if (user && isMatch) {
      res.status(200).json({
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  userRegister,
  userLogin,
};
