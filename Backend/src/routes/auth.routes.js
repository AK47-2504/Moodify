const express = require("express");
const authRouter = express.Router();

const authController = require("../controllers/authController");
const identifyUser = require("../middleware/identifyUser");

// /api/auth/register
authRouter.post("/register", authController.registerUserController);

// / api/auth/login
authRouter.post("/login", authController.loginUserController);

// /api/auth/get-me
// @protected Route - identifyUser Middleware
authRouter.get("/get-me", identifyUser, authController.getMeController);

// /api/auth/logout
authRouter.post("/logout",  authController.logoutUserController);
module.exports = authRouter;
