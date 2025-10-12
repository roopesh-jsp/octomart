const { uploadImage } = require("../services/imagekit.service");
const productModel = require("../models/product.model");

async function addProduct(req, res) {
  try {
    console.log("adding product");

    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user.id;
    const price = {
      amount: Number(priceAmount),
      currency: priceCurrency,
    };
    const images = await Promise.all(
      (req.files || []).map((file) => {
        return uploadImage({
          buffer: file.buffer,
        });
      })
    );
    const product = await productModel.create({
      title,
      description,
      price,
      seller,
      images,
    });
    return res.status(201).json({
      message: "product added",
      data: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal server error",
    });
  }
}

async function getProducts(req, res) {
  try {
    const { q, minPrice, maxPrice, limit = 20, skip = 0 } = req.query;
    //applying filters
    const filter = {};
    if (q) {
      filter.$text = { $search: q };
    }
    if (minPrice) {
      filter["price.amount"] = {
        ...filter["price.amount"],
        $gte: Number(minPrice),
      };
    }
    if (maxPrice) {
      filter["price.amount"] = {
        ...filter["price.amount"],
        $lte: Number(maxPrice),
      };
    }

    const products = await productModel
      .find(filter)
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 20));

    return res.status(200).json({ data: products });
  } catch (error) {
    console.log("error getting products data", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    return res.status(200).json({ product });
  } catch (error) {
    console.log("error getting product data", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
module.exports = {
  addProduct,
  getProducts,
  getProductById,
};
