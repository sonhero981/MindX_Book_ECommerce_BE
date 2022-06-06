const CategoryModel = require("./category");

//GET COMMENTS
const getCategories = async (req, res) => {
  const categories = await CategoryModel.find({});
  res.send({ success: 1, data: categories });
};

module.exports = { getCategories };
