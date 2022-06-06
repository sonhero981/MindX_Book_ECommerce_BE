const express = require("express");
const needAuthenticated = require("../middleware/needAuthenticated");
const router = express.Router();
const billController = require("./bill.controller");
const isAdmin = require("../middleware/isAdmin");

router.get("/:billId", needAuthenticated, billController.getBill);
router.post("/", needAuthenticated, billController.createBill);
router.put(
  "/:billId",
  needAuthenticated,
  isAdmin,
  billController.updateStatusBill
);

module.exports = router;
