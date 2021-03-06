const express = require("express");
const needAuthenticated = require("../middleware/needAuthenticated");
const router = express.Router();
const billController = require("./bill.controller");
const isAdmin = require("../middleware/isAdmin");

router.get("/bills/", needAuthenticated, isAdmin, billController.getBills);
router.post("/", needAuthenticated, billController.createBill);
router.put(
  "/:billId",
  needAuthenticated,
  isAdmin,
  billController.updateStatusBill
);
router.put(
  "/canceledBill/:billId",
  needAuthenticated,
  billController.canceledBill
);
router.get("/", needAuthenticated, billController.getBillsById);
// router.get(
//   "/",
//   needAuthenticated,
//   isAdmin,
//   billController.getStaMonthlyRevenue
// );

module.exports = router;
