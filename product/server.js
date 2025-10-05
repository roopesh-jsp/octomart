require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/db/db");
const porductRouter = require("./src/routes/product.route");

connectDb();

// routes
app.use("/api/products", porductRouter);

app.listen(3001, () => {
  console.log("product service listning on port 3001");
});
