const app = require("./src/app");
const db = require("./src/db/db");

db();

app.listen(3002, () => {
  console.log("cart service running on port 3002");
});
