const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    sellProduct: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Cart",
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

const BillModel = mongoose.model("Bill", BillSchema);
module.exports = BillModel;
