const express = require("express");

const cookieParser = require("cookie-parser");
require("dotenv").config();

const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "order service is running",
  });
});

app.use("/api/order", orderRoutes);

module.exports = app;
