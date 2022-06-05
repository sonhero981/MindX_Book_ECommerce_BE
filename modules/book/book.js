const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageURL: {
      type: Array,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    publication_date: {
      type: String,
    },
    number_of_page: {
      type: Number,
    },
    manufacturer: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    stars: {
      totalNumberStars: Number,
      totalAmountVotes: Number,
      averageStars: Number,
      usersVote: Array,
    },
  },
  {
    timestamps: true,
  }
);

const BookModel = mongoose.model("Book", BookSchema);
module.exports = BookModel;
