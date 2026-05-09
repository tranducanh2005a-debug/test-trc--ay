const express = require("express");
const cors = require("cors");

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const categoryRoute = require("./routes/category");
const orderRoute = require("./routes/order");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/images", express.static("images"));
app.use("/api/categories", categoryRoute);
app.use("/api/orders", orderRoute);


app.listen(5000, () => {
  console.log("Server running on port 5000");
});