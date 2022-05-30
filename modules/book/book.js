const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    imageURL: {
      type: String,
      // required: true,
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      // required: true,
    },
    category: {
      type: [String],
      // required: true,
    },
    amount: {
      type: Number,
      // required: true,
    },
    stars: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const BookModel = mongoose.model("Book", BookSchema);
module.exports = BookModel;
