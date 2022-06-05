const express = require("express");
const { route } = require("express/lib/router");
const needAuthenticated = require("../middleware/needAuthenticated");
const router = express.Router();
const billController = require("./bill.controller");

router.get("/:billId", billController.getBill);

router.post("/", needAuthenticated, billController.createBill);
router.put("/:billId", needAuthenticated, billController.updateBill);
// router.delete(
//   "/:billId",
//   needAuthenticated,
//   isAdmin,
//   billController.deleteBill
// );

module.exports = router;
