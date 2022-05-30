const BookModel = require("./book");

const getBooks = async (req, res, next) => {
  const { offset, limit } = req.query;
  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 10;
  const books = await BookModel.find({}).skip(offsetNumber).limit(limitNumber);

  const totalBook = await BookModel.countDocuments(books);
  res.send({ success: 1, data: books, totalBook: totalBook });
};

const getBook = async (req, res, next) => {
  const { bookId } = req.params;
  const foundBook = await BookModel.findById(bookId);
  res.send({ success: 1, data: foundBook });
};

const getCommentsOfBook = async (req, res, next) => {
  const { bookId } = req.params;
  const commentsOfBook = await CommentModel.find({ book: bookId });
  res.send({ success: 1, data: commentsOfBook });
};

const createBook = async (req, res, next) => {
  const senderUser = res.user;
  const { name, description, author, imageUrl, category, price } = req.body;
  const newBook = await BookModel.create({
    name,
    description,
    author,
    imageUrl,
    category,
    createdBy: senderUser._id,
    price,
  });

  res.send({ success: 1, data: newBook });
};

const updateBook = async (req, res, next) => {
  //Lấy senderUser từ req.user
  const senderUser = req.user;

  const foundBook = await BookModel.findById(bookId);

  if (!foundBook) {
    throw new HTTPError(400, "Not found post");
  }

  if (foundBook.createdBy !== senderUser._id) {
    throw new HTTPError(400, "Can not update other post");
  }

  const { bookId } = req.params;

  const dataUpdateBook = req.body;
  const updatedBook = await BookModel.findByIdAndUpdate(
    bookId,
    dataUpdateBook,
    {
      new: true,
    }
  );

  res.send({ success: 1, data: updatedBook });
};

const deleteBook = async (req, res, next) => {
  const { bookId } = req.params;
  await BookModel.findByIdAndDelete(bookId);

  res.send({ success: 1 });
};

const getBookByStar = async (req, res, next) => {
  const { star } = req.query;
  const books = await BookModel.find({ star: { $gt: star } }).sort({
    star: -1,
  });
  res.send({ success: 1, data: books });
};

const getBookByFilter = async (req, res, next) => {
  const { category, keyword } = req.query;
  const filter = {};
  if (category) {
    filter.category = category;
  }

  if (keyword) {
    const regex = new RegExp(`${keyword}`, `i`);
    filter.name = { $regex: regex };
  }
  const books = await BookModel.find(filter);

  res.send({ success: 1, data: books });
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBookByFilter,
  getBookByStar,
  getCommentsOfBook,
};
