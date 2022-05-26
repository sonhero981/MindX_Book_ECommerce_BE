const HTTPError = require('../common/httpError')

async function isAdmin(req, res, next) {
  const senderUser = req.user;
  if (senderUser.isAdmin === true) {
    next();
  }
  throw new HTTPError(403,"Only admin can do operation");
}

module.exports = isAdmin;
