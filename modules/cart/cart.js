const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    sellProducts: [
      {
        book: { type: mongoose.Types.ObjectId, ref: "Book" },
        qualityBook: Number,
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
