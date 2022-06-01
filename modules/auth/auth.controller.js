const UserModal = require("./user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HTTPError = require("../common/httpError");

const register = async (req, res, next) => {
  const { username, password, email } = req.body;
  // Check xem tài khoản đã tồn tại chưa
  const existedUser = await UserModal.findOne({ username: username });
  if (existedUser) {
    throw new HTTPError(400, "Username duplicate");
  }
  const existedEmail = await UserModal.findOne({ email: email });

  //Check email đã tồn tại chưa
  if (existedEmail) {
    throw new HTTPError(400, "Email duplicate");
  }
  //Mã hóa password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await UserModal.create({
    username,
    password: hashPassword,
    email,
    isAdmin: false,
  });

  res.send({ success: 1, data: newUser });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  const existedUser = await UserModal.findOne({ username });

  if (!existedUser) {
    throw new HTTPError(400, "Username hoặc password không đúng");
  }

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

  res.send({ success: 1, data: { userId: userId, token } });
};

const forgotPassword = async (req, res, next) => {};

module.exports = { register, login, forgotPassword };
