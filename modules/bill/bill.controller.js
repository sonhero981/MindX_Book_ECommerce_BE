const BookModel = require("../book/book");
const HTTPError = require("../common/httpError");
const BillModel = require("./bill");
const mongoose = require("mongoose");

// const removeAll = async (req, res) => {
//   const removeBills = await BillModel.remove({ phoneNumber: 965976864 });
//   res.send({ success: 1, data: "success" });
// };

const getBills = async (req, res, next) => {
  const { status, offset, limit } = req.query;
  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 1000;
  const senderUser = req.user;

  const filter = {};
  if (status) {
    filter.status = status;
  }

  const foundBills = await BillModel.find(filter)
    .skip(offsetNumber)
    .limit(limitNumber)
    .populate("sellProducts.book")
    .populate("createdBy");

  if (senderUser.isAdmin !== true) {
    throw new HTTPError(401, "Không phải admin");
  }
  res.send({ success: 1, data: foundBills });
};

const getBillsByUser = async (req, res, next) => {
  const { status, offset, limit } = req.query;
  console.log("status", status);
  const senderUser = req.user;
  if (!senderUser) {
    throw new HTTPError(401, "Chưa đăng nhập");
  }
  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 1000;

  const filter = {};
  if (status) {
    filter.status = status;
  }
  const foundBills = await BillModel.find({
    createdBy: senderUser._id,
    ...filter,
  })
    .skip(offsetNumber)
    .limit(limitNumber)
    .populate("sellProducts.book")
    .populate("createdBy");
  if (!foundBills) {
    throw new HTTPError(401, "Chưa có bill nào");
  }

  res.send({ success: 1, data: foundBills });
};

const createBill = async (req, res, next) => {
  const { sellProducts, address } = req.body;
  const senderUser = req.user;
  const getPriceBook = async _Id => {
    const book = await BookModel.findById(_Id);
    return book.price;
  };

  const checkAmountBook = await sellProducts.forEach(async sellProduct => {
    const foundBook = await BookModel.findById(sellProduct.book);
    console.log("foundBook.amount", foundBook.amount);
    console.log(sellProduct.qualityBook);
    if (foundBook.amount < sellProduct.qualityBook) {
      next(new Error("Bạn đã mua quá số lượng sách trong kho"));
    }
  });

  const totalBill = await sellProducts.reduce(async (acc, cur) => {
    return (await acc) + (await getPriceBook(cur.book)) * cur.qualityBook;
  }, 0);

  const newBill = await BillModel.create({
    sellProducts,
    createdBy: senderUser._id,
    address,
    status: "unprocessed",
    totalBill,
  });

  minusBooks(newBill);

  res.send({ success: 1, data: newBill });
};

const updateStatusBill = async (req, res, next) => {
  const { status } = req.body;
  const { billId } = req.params;
  const foundBill = await BillModel.findOne({ _id: billId });
  if (status === "canceled") {
    addBooks(foundBill);
  }
  const updateBill = await BillModel.findByIdAndUpdate(
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

  if (!foundBill) {
    throw new HTTPError(401, "Không có bill này");
  }

  if (String(foundBill.createdBy) !== String(senderUser._id)) {
    throw new HTTPError(401, "Không phải bill của bạn");
  }
  if (foundBill.status !== "unprocessed") {
    throw new HTTPError(
      401,
      "Đơn hàng đã lên đơn vui lòng liên hệ với admin để hủy đơn hàng"
    );
  }
  addBooks(foundBill);

  const canceledBill = await BillModel.findByIdAndUpdate(billId, {
    status: "canceled",
  });
  res.send({ success: 1, data: "Hủy đơn hàng thành công" });
};

const getStaMonthlyRevenue = async (req, res, next) => {
  const { startTime, endTime } = req.query;
  console.log(startTime, endTime);
  console.log("startTime", new Date(+startTime));
  const start = new Date(+startTime);
  const end = new Date(+endTime);
  const thisMonthOrder = await BillModel.find({
    createdAt: {
      $gte: start,
      $lte: end,
    },
    status: "completed",
  }).select("_id  createdAt totalBill sellProducts");
  res.send({ success: 1, data: thisMonthOrder });
};

const minusBooks = async Bill => {
  Bill.sellProducts.forEach(async sellProduct => {
    const foundBook = await BookModel.findById(sellProduct.book);
    foundBook.amount -= sellProduct.qualityBook;
    if (foundBook.amount < 0) {
      next(new Error("Bạn đã mua quá số lượng sách trong kho"));
    }
    await foundBook.save();
    return;
  });
};

const addBooks = async Bill => {
  Bill.sellProducts.forEach(async sellProduct => {
    const foundBook = await BookModel.findById(sellProduct.book);
    foundBook.amount += sellProduct.qualityBook;
    await foundBook.save();
    return;
  });
};
module.exports = {
  getBills,
  getBillsByUser,
  createBill,
  canceledBill,
  updateStatusBill,
  getStaMonthlyRevenue,
  // removeAll,
};
