const BookModel = require("./book");
const CommentModel = require("../comment/comment");
const HTTPError = require("../common/httpError");

const getBooks = async (req, res, next) => {
  const { offset, limit, category, keyword, price } = req.query;
  const offsetNumber = offset && Number(offset) ? Number(offset) : 0;
  const limitNumber = limit && Number(limit) ? Number(limit) : 1000;
  const filter = {};
  if (category) {
    filter.category = category;
  }

  if (price) {
    if (price == 1) {
      filter.price = {
        $lte: 50000,
        $gte: 0,
      };
    } else if (price == 2) {
      filter.price = {
        $lte: 100000,
        $gte: 50000,
      };
    } else if (price == 3) {
      filter.price = {
        $lte: 200000,
        $gte: 100000,
      };
    } else if (price == 4) {
      filter.price = {
        $lte: 500000,
        $gte: 200000,
      };
    } else {
      filter.price = {
        $gte: 500000,
      };
    }
  }

  if (keyword) {
    const regex = new RegExp(`${keyword}`, `i`);
    filter.name = { $regex: regex };
  }

  const books = await BookModel.find(filter)
    .skip(offsetNumber)
    .limit(limitNumber)
    .sort({ createdAt: -1 });

  const totalBook = await BookModel.countDocuments(filter);
  res.send({ success: 1, data: books, totalBook: totalBook });
};

const getBook = async (req, res, next) => {
  const { bookId } = req.params;
  const foundBook = await BookModel.findById(bookId);
  res.send({ success: 1, data: foundBook });
};

const getCommentsOfBook = async (req, res, next) => {
  const { bookId } = req.params;
  console.log("bookId", bookId);
  const commentsOfBook = await CommentModel.find({ bookId: bookId })
    .populate("createdBy")
    .sort({ createdAt: -1 });
  console.log("commentsOfBook", commentsOfBook);

  res.send({
    success: 1,
    data: commentsOfBook,
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
    publication_date,
    amount,
    manufacturer,
    book_cover,
    number_of_page,
  } = req.body;
  const newBook = await BookModel.create({
    name,
    description,
    author,
    imageURL,
    category,
    publisher,
    publication_date,
    manufacturer,
    amount,
    createdBy: senderUser._id,
    price,
    book_cover,
    number_of_page,
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

const updateAllBook = async (req, res, next) => {
  const updateAllBook = await BookModel.find({ number_of_page: 390 });
  updateAllBook.map(async function (book) {
    book.number_of_page = 350;
    await book.save();
  });
  console.log();
  res.send({ success: 1, data: updateAllBook });
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

const voteStars = async (req, res, next) => {
  const { numberStars } = req.body;
  const { bookId } = req.params;
  const senderUser = req.user;

  const book = await BookModel.findById(bookId);
  const oldUsersVote = book?.stars?.usersVote;

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
  sortBookByPrice,
  getCommentsOfBook,
  voteStars,
  updateAllBook,
};
