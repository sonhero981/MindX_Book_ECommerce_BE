const express = require("express");
const needAuthenticated = require("../middleware/needAuthenticated");
const router = express.Router();
const cartController = require("./cart.controller");

router.get("/", needAuthenticated, cartController.getCartByUser);
router.post(
  "/",
  needAuthenticated,
  // cartController.createCart,
  // cartController.updateCart
  cartController.createOrUpdateCart
);
// router.put("/:cardId", needAuthenticated, cartController);
// router.delete("/:cardId", needAuthenticated, cartController);
module.exports = router;
