const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    sellProducts: [
      {
        book: { type: mongoose.Types.ObjectId, ref: "Book" },
        qualityBook: Number,
      },
    ],
    totalBill: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["unprocessed", "processed", "completed"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BillModel = mongoose.model("Bill", BillSchema);
module.exports = BillModel;
