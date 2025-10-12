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

//GET get all products of the seller
porductRouter.get(
  "/seller",
  createAuthMiddleware(["seller"]),
  productController.getProductsBySeller
);

//GET api/products/
porductRouter.get("/", productController.getProducts);

//GET api/products/:id
porductRouter.get("/:id", productController.getProductById);

//PATCH api/products/:id

porductRouter.patch(
  "/:id",
  createAuthMiddleware(["seller"]),
  productController.updateProducts
);
porductRouter.delete(
  "/:id",
  createAuthMiddleware(["seller"]),
  productController.deleteProduct
);

module.exports = porductRouter;
