//Cài đặt biến môi trường
require("dotenv").config();
require("express-async-errors");

const express = require("express");
const mongoose = require("mongoose");
const bookRouter = require("./modules/book/book.router");
const authRouter = require("./modules/auth/auth.router");
const uploadRouter = require("./modules/upload/upload.router");
const commentRouter = require("./modules/comment/comment.router");
const cartRouter = require("./modules/cart/cart.router");
const categoryRouter = require("./modules/category/category.router");
const billRouter = require("./modules/bill/bill.router");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, err => {
  if (err) {
    return console.log("Err connect mongodb", err);
  }
  console.log("Connect DB Successfully");
});

app.use("/api/books", bookRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/comments", commentRouter);
app.use("/api/cart", cartRouter);
app.use("/api/category", categoryRouter);
app.use("/api/bill", billRouter);

app.use("*", (req, res, next) => {
  res.send({ message: "404 not found" });
});

process.on("uncaughtException", function (req, res, error) {
  console.log(error);
});

// Bắt toàn bộ các middleware mà gọi hàm next (error)
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send({ success: 0, message: err.message });
});

app.listen(process.env.PORT || 8080, err => {
  if (err) {
    return console.log("Server Error", err);
  }
  console.log("Server Stated");
});
