const HTTPError = require("../common/httpError");

async function isAdmin(req, res, next) {
  console.log("isAdmin");
  const senderUser = req.user;
  console.log("isAdmin", senderUser.isAdmin);
  if (senderUser.isAdmin === true) {
    next();
    return;
  }
  throw new HTTPError(403, "Only admin can do operation");
}

module.exports = isAdmin;
