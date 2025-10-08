const express = require("express");
const productController = require("../controllers/product.controller");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const productValidators = require("../validators/product.validators");
const multer = require("multer");

const porductRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

//POST : API/PRODUCTS/
porductRouter.post(
  "/",
  createAuthMiddleware(["seller", "admin"]),
  upload.array("images", 5),
  productValidators.createProductValidators,
  productController.addProduct
);

module.exports = porductRouter;
