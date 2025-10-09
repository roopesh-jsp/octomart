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

module.exports = {
  addProduct,
};
