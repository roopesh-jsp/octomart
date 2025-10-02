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

//GET : API/AUTH/LOGOUT
router.get("/logout", authController.logoutUser);

// addresses
// GET : api/auth/users/me/address
router.get("/users/me/address", authMiddleware, authController.getAllAddresses);

// DELETE : api/auth/users/me/address/:addressId
router.delete(
  "/users/me/address/:addressId",
  authMiddleware,
  authController.deleteAddress
);

// POST : api/auth/users/me/address
router.post(
  "/users/me/address",
  validators.addAddressValidator,
  authMiddleware,
  authController.addAddress
);

module.exports = router;
