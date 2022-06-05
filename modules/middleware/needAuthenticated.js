const UserModal = require("../auth/user");
const jwt = require("jsonwebtoken");
const HTTPError = require("../common/httpError");

async function needAuthenticated(req, res, next) {
  // Định danh người dùng
  // Không phải user => trả luôn kết quá
  // user => next()
  console.log("needAuthen");
  const token = req.headers.authorization;
  if (!token) {
    throw new HTTPError(401, "Not found token");
  }

  const jwtToken = token.split(" ")[1];
  //Check Token có thuộc token của dự án không
  //Check Token có hết hạn hay không
  //Trả về payload
  const data = jwt.verify(jwtToken, process.env.SECRET_KEY);
  const { userId } = data;
  if (!userId) {
    throw new HTTPError(401, "Authorization fail 1");
  }

  const existedUser = await UserModal.findById(userId);
  if (!existedUser) {
    throw new HTTPError(401, "Authorization fail 2");
  }

  //  Nhét thêm thông tin vào biến request
  req.user = existedUser;

  next();
}

module.exports = needAuthenticated;
