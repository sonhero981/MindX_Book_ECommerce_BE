const BookModel = require("../book/book");
const HTTPError = require("../common/httpError");
const BillModel = require("./bill");
const mongoose = require("mongoose");

const getBills = async (req, res, next) => {
  const senderUser = req.user;

  const foundBills = await BillModel.find()
    .populate("sellProducts.book")
    .populate("createdBy");

  if (senderUser.isAdmin !== true) {
    throw new HTTPError(401, "Không phải admin");
  }
  res.send({ success: 1, data: foundBills });
};

const getBillsById = async (req, res, next) => {
  const senderUser = req.user;
  if (!senderUser) {
    throw new HTTPError(401, "Chưa đăng nhập");
  }
  const foundBills = await BillModel.find({ createdBy: senderUser._id })
    .populate("sellProducts.book")
    .populate("createdBy");
  if (!foundBills) {
    throw new HTTPError(401, "Chưa có bill nào");
  }

  res.send({ success: 1, data: foundBills });
};

const createBill = async (req, res, next) => {
  const { sellProducts, address, phoneNumber } = req.body;
  const senderUser = req.user;

  const totalBill = sellProducts.reduce(
    (acc, cur) => acc + cur.book.price * cur.qualityBook,
    0
  );

  const newBill = await BillModel.create({
    sellProducts,
    createdBy: senderUser._id,
    address,
    phoneNumber,
    status: "unprocessed",
    totalBill,
  })
    .populate("sellProducts.book")
    .populate("createdBy");

  res.send({ success: 1, data: newBill });
};

const updateStatusBill = async (req, res, next) => {
  const { status } = req.body;
  const { billId } = req.params;
  const updateBill = await BillModal.findByIdAndUpdate(
    billId,
    { status: status },
    { new: true }
  );
  res.send({ success: 1, data: updateBill });
};

const canceledBill = async (req, res, next) => {
  const { billId } = req.params;
  const senderUser = req.user;
  if (!senderUser) {
    throw new HTTPError(401, "Chưa đăng nhập");
  }
  const foundBill = await BillModel.findOne({ _id: billId });
  console.log(foundBill);
  if (!foundBill) {
    throw new HTTPError(401, "Không có bill này");
  }
  console.log("foundbill.creadtedBy", String(foundBill.createdBy));
  console.log("senderUser._id", String(senderUser._id));
  if (String(foundBill.createdBy) !== String(senderUser._id)) {
    throw new HTTPError(401, "Không phải bill của bạn");
  }
  if (foundBill.status !== "unprocessed") {
    throw new HTTPError(401, "Không thể hủy đơn hàng");
  }
  const canceledBill = await BillModel.findByIdAndUpdate(billId, {
    status: "canceled",
  });
  res.send({ success: 1, data: "Hủy đơn hàng thành công" });
};

const getStaMonthlyRevenue = async (req, res, next) => {
  const { year } = req.query;
  console.log("year", year);
  const thisYearOrder = await BillModel.find({
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`),
    },
    status: "completed",
  }).select("_id  createdAt totalBill sellProducts");
  res.send({ success: 1, data: thisYearOrder });
};
module.exports = {
  getBills,
  getBillsById,
  createBill,
  canceledBill,
  updateStatusBill,
  getStaMonthlyRevenue,
};
