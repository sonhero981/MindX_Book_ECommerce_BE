const BookModel = require("./book");
const CommentModel = require("../comment/comment");
const HTTPError = require("../common/httpError");

const getBooks = async (req, res, next) => {
  const { offset, limit } = req.query;
  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 10;

  const books = await BookModel.find({}).skip(offsetNumber).limit(limitNumber);

  const totalBook = await BookModel.countDocuments();
  res.send({ success: 1, data: books, totalBook: totalBook });
};

const getBook = async (req, res, next) => {
  const { bookId } = req.params;
  const foundBook = await BookModel.findById(bookId);
  res.send({ success: 1, data: foundBook });
};

const getCommentsOfBook = async (req, res, next) => {
  const { bookId } = req.params;
  const commentsOfBook = await CommentModel.find({ book: bookId }).populate(
    "createdBy"
  );

  const enhanceUsernameComment = commentsOfBook.map(comment => {
    const cloneComment = JSON.parse(JSON.stringify(comment));
    return {
      ...cloneComment,
      createdUsername: comment.createdBy ? comment.createdBy.username : "",
      createdBy: comment.createdBy ? comment.createdBy._id : "",
    };
  });

  res.send({
    success: 1,
    data: commentsOfBook,
    enhanceUsernameComment: enhanceUsernameComment,
  });
};

const createBook = async (req, res, next) => {
  console.log("create");

  const senderUser = req.user;
  const {
    name,
    description,
    author,
    imageURL,
    category,
    price,
    publisher,
    publisher_date,
    number_of_page,
    amount,
    manufacturer,
  } = req.body;
  const newBook = await BookModel.create({
    name,
    description,
    author,
    imageURL,
    category,
    publisher,
    publisher_date,
    number_of_page,
    manufacturer,
    amount,
    createdBy: senderUser._id,
    price,
    stars: {
      totalNumberStars: 0,
      totalAmountVotes: 0,
      averageStars: 0,
    },
  });

  res.send({ success: 1, data: newBook });
};

const updateBook = async (req, res, next) => {
  const { bookId } = req.params;

  const foundBook = await BookModel.findById(bookId);

  if (!foundBook) {
    throw new HTTPError(400, "Not found post");
  }

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

const sortBookByPrice = async (req, res, next) => {
  const { price } = req.query;
  console.log(price);
  console.log("chay");

  const books = await BookModel.find({ price: { $gt: price } }).sort({
    price: -1,
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

const voteStars = async (req, res, next) => {
  const { numberStars } = req.body;
  const { bookId } = req.params;
  const senderUser = req.user;
  console.log(senderUser);
  const book = await BookModel.findById(bookId);
  const oldUsersVote = book?.stars?.usersVote;
  console.log("oldUserVote", oldUsersVote);
  if (oldUsersVote.length === 0) {
    book.stars = {
      totalNumberStars: 0,
      totalAmountVotes: 0,
      averageStars: 0,
      usersVote: [],
    };
  }

  if (oldUsersVote.includes(String(senderUser._id))) {
    throw new HTTPError(400, "You cannot vote for the same book twice");
  }

  console.log("book.stars.totalNumberStars", book.stars.totalNumberStars);

  const newTotalNumberStars = book.stars.totalNumberStars + numberStars;
  const newTotalAmountVotes = book.stars.totalAmountVotes + 1;
  const newAverageStars = newTotalNumberStars / newTotalAmountVotes;
  const newUsersVote = [...book.stars.usersVote, String(senderUser._id)];

  const updateBook = await BookModel.findByIdAndUpdate(
    book,
    {
      stars: {
        totalNumberStars: newTotalNumberStars,
        totalAmountVotes: newTotalAmountVotes,
        averageStars: newAverageStars,
        usersVote: newUsersVote,
      },
    },
    { new: true }
  );
  res.send({ success: 1, data: updateBook });
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBookByFilter,
  sortBookByPrice,
  getCommentsOfBook,
  voteStars,
};
