const express = require("express");
const validators = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const authController = require("../controllers/autj.controller");
const router = express.Router();

//POST : api/auth/register
router.post(
  "/register",
  validators.registerUserValidation,
  authController.registerUser
);

//post : api/auth/login
router.post("/login", validators.loginUserValidation, authController.loginUser);

//GET : api/auth/me
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
