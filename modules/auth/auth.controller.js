const UserModel = require("./user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HTTPError = require("../common/httpError");
const { sendMail } = require("../service/mailer");

const register = async (req, res, next) => {
  const { username, password, email } = req.body;
  // Check xem tài khoản đã tồn tại chưa
  const existedUser = await UserModel.findOne({ username: username });
  if (existedUser) {
    throw new HTTPError(400, "Username duplicate");
  }
  const existedEmail = await UserModel.findOne({ email: email });

  //Check email đã tồn tại chưa
  if (existedEmail) {
    throw new HTTPError(400, "Email duplicate");
  }
  //Mã hóa password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await UserModel.create({
    username,
    password: hashPassword,
    email,
    isAdmin: false,
  });

  res.send({ success: 1, data: newUser });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  const existedUser = await UserModel.findOne({ username });
  if (!existedUser) {
    throw new HTTPError(400, "Username hoặc password không đúng");
  }
  const isAdmin = existedUser?.isAdmin;

  const matchedPassword = await bcrypt.compare(password, existedUser.password);
  if (!matchedPassword) {
    throw new HTTPError(400, "Username hoặc password không đúng");
  }

  const userId = existedUser._id;
  const token = jwt.sign(
    {
      userId,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 60 * 60 * 24 * 7,
    }
  );

  res.send({ success: 1, data: { userId: userId, token, isAdmin } });
};

const verify = (req, res) => {
  const { user } = req;

  res.send({
    success: 1,
    data: user,
  });
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const existedUser = await UserModel.findOne({ email: email });
  if (!existedUser) {
    throw new HTTPError(400, "Email is not found");
  }

  const { createdAt } = existedUser.codeResetPassword;
  console.log(createdAt);
  const currentDate = Date.now();
  if (currentDate - createdAt < 60 * 1000) {
    throw new HTTPError(400, "Không bấm gửi nhiều lần");
  }

  function createCode() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  }
  const codeResetPassword = createCode();

  await sendMail({
    to: email,
    text: `This is code: ${codeResetPassword}, This code will valid for 10 minutes`,
  });

  existedUser.codeResetPassword = {
    code: codeResetPassword,
    time: 5 * 60,
    createdAt: Date.now(),
  };
  console.log(existedUser);
  await existedUser.save();

  res.send({ success: 1, data: "Send success" });
};

const confirmForgotPassword = async (req, res, next) => {
  const { email, code, password, confirmPassword } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new HTTPError(400, "Không tìm thấy user");
  }

  const currentDate = Date.now();
  const { time, createdAt } = user.codeResetPassword;
  const expiresDate = createdAt + time * 1000;

  if (currentDate > expiresDate) {
    throw new HTTPError(400, "Code đổi mật khẩu đã hết hạn");
  }

  if (code !== user.codeResetPassword.code) {
    throw new HTTPError(400, "Code đổi mật khẩu không đúng");
  }

  if (password !== confirmPassword) {
    throw new HTTPError(400, "Mật khẩu không trùng nhau");
  }

  //Mã hóa password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  user.password = hashPassword;
  user.codeResetPassword = null;

  await user.save();
  res.send({ success: 1, data: "Cập nhật mật khẩu thành công" });
};

module.exports = {
  register,
  login,
  verify,
  forgotPassword,
  confirmForgotPassword,
};
