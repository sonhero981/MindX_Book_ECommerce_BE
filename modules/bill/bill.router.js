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
// router.delete("/", billController.removeAll);

router.get("/", needAuthenticated, billController.getBillsByUser);
router.get(
  "/report",
  needAuthenticated,
  isAdmin,
  billController.getStaMonthlyRevenue
);

router.get("/graph", needAuthenticated, isAdmin, billController.graph);

module.exports = router;
