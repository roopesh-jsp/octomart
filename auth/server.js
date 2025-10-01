require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./db/db");

connectDb();

app.listen(3000, () => {
  console.log("app running on port 3000");
});
