const BookModel = require("./book");

const getBooks = async (req, res, next) => {
  const books = await BookModel.find({});
  res.send({ success: 1, data: books });
};

const getBook = async (req, res, next) => {
  const { bookId } = req.params;
  const foundBook = await BookModel.findById(bookId);
  res.send({ success: 1, data: foundBook });
};

const createBook = async (req, res, next) => {
  const senderUser = res.user;
  const { name, description, author, imageUrl, category } = req.body;
  const newBook = await BookModel.create({
    name,
    description,
    author,
    imageUrl,
    category,
    createdBy: senderUser._id,
  });

  res.send({ success: 1, data: newBook });
};

const updateBook = async (req, res, next) => {
  //Lấy senderUser từ req.user
  const senderUser = req.user;

  const foundBook = await BookModel.findById(bookId);

  if (!foundBook) {
    throw new HTTPError(400,"Not found post");
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

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };
