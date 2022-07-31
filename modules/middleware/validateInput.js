const HTTPError = require("../common/httpError");

const validateInput = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(".");
      throw new HTTPError(422, message);
    }
  };
};

module.exports = validateInput;
