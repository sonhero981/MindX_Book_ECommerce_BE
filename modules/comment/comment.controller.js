const CommentModel = require("./comment");
const HTTPError = require("../common/httpError");
const BookModel = require("../book/book");

//GET COMMENTS
const getComments = async (req, res) => {
  const comments = await CommentModel.find({});
  res.send({ success: 1, data: comments });
};

//GET COMMENT BY ID
const getComment = async (req, res) => {
  const { commentId } = req.params;
  const foundComment = await CommentModel.findById(commentId);
  console.log(commentId);
  res.send({ success: 1, data: foundComment });
};

//CREATE COMMENT

const createComment = async (req, res) => {
  const { content, bookId, numberStars } = req.body;
  const senderUser = req.user;
  const book = await BookModel.findById(bookId);

  const oldUsersVote = book?.stars?.usersVote || [];
  console.log("book", book);
  console.log("oldUserVote1", oldUsersVote);
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

  const newComment = await CommentModel.create({
    content,
    bookId,
    createdBy: senderUser._id,
    stars: numberStars,
  });
  res.send({ success: 1, data: { newComment, updateBook } });
};

//UPDATE COMMENT
const updateComment = async (req, res) => {
  const senderUser = req.user;
  const { commentId } = req.params;
  console.log(commentId);

  const foundComment = await CommentModel.findById(commentId);

  if (!foundComment) {
    throw new HTTPError(400, "Not found comment");
  }
  console.log("foundComment", foundComment);
  console.log("a", foundComment.createdBy, senderUser._id);

  if (String(foundComment.createdBy) !== String(senderUser._id)) {
    throw new HTTPError(400, "Can not update other comment");
  }
  const dataUpdateComment = req.body;

  const updatedComment = await CommentModel.findByIdAndUpdate(
    commentId,
    dataUpdateComment,
    { new: true }
  );
  res.send({ success: 1, data: updatedComment });
};

//DELETE COMMENT
const deleteComment = async (req, res) => {
  const senderUser = req.user;
  const { commentId } = req.params;

  const foundComment = await CommentModel.findById(commentId);
  if (!foundComment) {
    throw new HTTPError(400, "Not found comment");
  }

  if (foundComment.createdBy !== senderUser._id) {
    throw new HTTPError(400, "Can not delete other comment");
  }
  await CommentModel.findByIdAndDelete(commentId);
  res.send({ success: 1 });
};

module.exports = {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
};
