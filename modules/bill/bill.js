const mongoose = require("mongoose");
const AddressSchema = require("../address/address");

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
    address: AddressSchema,
    status: {
      type: String,
      enum: ["unprocessed", "processed", "completed", "canceled"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BillModel = mongoose.model("Bill", BillSchema);
module.exports = BillModel;
