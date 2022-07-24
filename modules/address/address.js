const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    province: { type: String, required: true },
    ward: { type: String, required: true },
    street: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = AddressSchema;
