const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const blackListModel = require("../models/blacklist.model");

async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  const UserExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (UserExist) {
    res.status(400).json({
      message: "User Aldready Exist",
    });
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username: username,
    email: email,
    password: hashPassword,
  });
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token);
  return res.status(200).json({
    message: "User Registered Successfully",
    user,
  });
}

async function loginUserController(req, res) {
  const { email, username, password } = req.body;
  const user = await userModel
    .findOne({
      $or: [
        {
          username,
        },
        { email },
      ],
    })
    .select("+password");

  if (!user) {
    res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({
      message: "Invalid Credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token);
  return res.status(200).json({
    message: "User Login Successfully",
    user,
  });
}

async function getMeController(req, res) {
  const { id } = req.user;

  const user = await userModel.findById(id);
  if (!user) {
    return res.status(400).json({
      message: "User Not Found",
    });
  }

  return res.status(200).json({
    message: "User Fetched Successfully",
    user,
  });
}

async function logoutUserController(req, res) {
  const token = req.cookies.token;

  res.clearCookie("token");

  const isTokenBalcklisted = await blackListModel.findOne({ token });
  if (isTokenBalcklisted) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }

  await blackListModel.create({ token });
  return res.status(200).json({
    message: "Logout Successfully",
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  getMeController,
  logoutUserController,
};
