require("dotenv").config();
const app = require("./src/app");
const connectDb = require("./src/db/db");

connectDb();

app.listen(3001, () => {
  console.log("product service listning on port 3001");
});
