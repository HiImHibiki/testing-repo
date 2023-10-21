const asyncFunc = require("../middleware/async");
const User = require("../models").User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.login = asyncFunc(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });
  if (!user) {
    res.status(404).json({
      message: "Not Found",
    });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  const token = generateToken(user.id);
  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (user && checkPassword) {
    res.status(200).cookie("token", token, options).json({
      message: "Login Success",
      id: user.id,
      username: user.username,
      token: token,
    });
  } else {
    res.status(200).json({
      message: "Login Failed",
    });
  }
});

exports.register = asyncFunc(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });
  if (user) {
    res.status(400).json({
      message: "Username already used",
    });
  }

  // Hash: passwd + (1234) =  passwd1234 = 1234passwd
  // One way: password123, 12345efweuifhewuifhwfuweghf
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const savedUser = await User.create({
    username: username,
    password: hashedPassword,
  });

  await res.status(200).json({
    message: "Login Success",
    data: savedUser,
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d", // 1d, 24h, 3600s
  });
};
