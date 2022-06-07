const BookModel = require("../book/book");
const HTTPError = require("../common/httpError");
const BillModel = require("./bill");
const mongoose = require("mongoose");

const getBill = async (req, res, next) => {
  const { billId } = req.params;
  const senderUser = req.user;
  console.log(" senderUser._id", senderUser._id);

  const foundBill = await BillModel.findById(billId)
    .populate("sellProducts.book")
    .populate("createdBy");

  if (senderUser.isAdmin === true) {
    res.send({ success: 1, data: foundBill });
  }

  if (String(senderUser._id) !== String(foundBill.createdBy._id)) {
    throw new HTTPError(400, "không p bill của b");
  }
  res.send({ success: 1, data: foundBill });
};

const createBill = async (req, res, next) => {
  const { sellProducts, address, phoneNumber } = req.body;
  const senderUser = req.user;

  const totalBill = sellProducts.reduce(
    (acc, cur) => acc + cur.book.price * cur.qualityBook,
    0
  );

  console.log(totalBill);

  const newBill = await BillModel.create({
    sellProducts,
    createdBy: senderUser._id,
    address,
    phoneNumber,
    status: "unprocessed",
    totalBill,
  });

  const populateBill = await BillModel.findById(newBill._id)
    .populate("sellProducts.book")
    .populate("createdBy");
  console.log(
    "sellProducts.map(x => x._id)",
    sellProducts.map(x => x._id)
  );
  const bookIds = sellProducts.map(x => mongoose.Types.ObjectId(x.book._id));

  const foundSelledBook = await BookModel.find({
    _id: { $in: bookIds },
  });

  sellProducts.forEach(prod => {
    try {
      BookModel.findById(prod._id, { $inc: { amount: -prod.qualityBook } });
    } catch (err) {
      console.log(err);
    }
  });

  console.log(foundSelledBook);

  res.send({ success: 1, data: populateBill });
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

module.exports = { getBill, createBill, updateStatusBill };
