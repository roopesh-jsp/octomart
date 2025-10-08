const { uploadImage } = require("../services/imagekit.service");
async function addProduct(req, res) {
  try {
    const { title, description, amount, currency } = req.body;
    const seller = req.user.id;
    const price = {
      amount: Number(amount),
      currency,
    };
    const images = [];
    const files = await Promise.all(
      (req.files || []).map((file) =>
        uploadImage({ buffer: file.buffer, filename: file.originalname })
      )
    );
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
