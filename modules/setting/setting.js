const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema();

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
