const HTTPError = require("../common/httpError");
const CartModel = require("./cart");

// const createCart = async (req, res, next) => {
//   const { book, qualityBook } = req.body;
//   const senderUser = req.user;

//   const existedCart = await CartModel.findOne({ createdBy: senderUser._id });
//   if (!existedCart) {
//     console.log("create");
//     const newCart = await CartModel.create({
//       sellProducts: [{ book: book, qualityBook: qualityBook }],
//       createdBy: senderUser._id,
//     });

//     res.send({ success: 1, data: newCart });
//     return;
//   }

//   req.cartId = existedCart._id;

//   next();
// };

// const updateCart = async (req, res, next) => {
//   const dataUpdateCart = req.body;
//   const cartId = req.cartId;

//   const UpdateCart = await CartModel.findByIdAndUpdate(
//     String(cartId),
//     {
//       sellProducts: dataUpdateCart,
//     },
//     { new: true }
//   );

//   res.send({ success: 1, data: UpdateCart });
// };

const createOrUpdateCart = async (req, res, next) => {
  const senderUser = req.user;
  const dataUpdateCart = req.body;
  const createOrUpdate = await CartModel.findOneAndUpdate(
    { createdBy: senderUser._id },
    {
      sellProducts: dataUpdateCart,
    },
    {
      new: true,
      upsert: true,
    }
  )
    .populate("createdBy")
    .populate("sellProducts.book");

  res.send({ success: 1, data: createOrUpdate });
};

const getCartByUser = async (req, res, next) => {
  const senderUser = req.user;

  if (!senderUser) {
    throw new HTTPError(401, "Chưa đăng nhập");
  }
  const foundCart = await CartModel.findOne({ createdBy: senderUser._id });
  if (!foundCart) {
    throw new HTTPError(401, "Chưa tạo giỏ hàng");
  }
  res.send({ success: 1, data: foundCart });
};

const deleteCart = async (req, res, next) => {
  const senderUser = req.user;
  const deleteCart = await CartModel.findOneAndDelete({
    createdBy: senderUser._id,
  });
  res.send({ success: 1 });
};

// module.exports = { createCart, updateCart };

module.exports = { createOrUpdateCart, getCartByUser, deleteCart };
