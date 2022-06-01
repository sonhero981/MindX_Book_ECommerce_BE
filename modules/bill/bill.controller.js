const BillModal = require("./bill");

const createBill = async (req, res, next) => {
  const { sellProducts, address, phoneNumber } = req.body;
  const senderUser = req.user;

  const totalBill = sellProducts.reduce(
    (totalBill, price) => totalBill + price,
    0
  );

  const newBill = await BillModal.create({
    sellProducts,
    creadBy: senderUser._id,
    address,
    phoneNumber,
    status: "unprocessed",
    totalBill,
  });

  res.sender({ success: 1 });
};

const updateStatusBill = async (req, res, next) => {
  const senderUser = req.user;
  const { status } = req.body;
  const updateBill = await BillModal.findOneAndUpdate(
    { creadBy: senderUser._id },
    { status: status },
    { new: true }
  );
};
