const CommentModel = require("./comment");

//GET COMMENTS
// const getComments = async (req, res) => {
//   const comments = await CommentModel.find({});
//   res.send({ success: 1, data: comments });
// };

//GET COMMENT BY ID
// const getComment = async (req, res) => {
//   const { commentId } = req.params;
//   const foundComment = await CommentModel.findById(commentId);
//   console.log(commentId);
//   res.send({ success: 1, data: foundComment });
// };

//CREATE COMMENT

const createComment = async (req, res) => {
  const { content, book, createBy } = req.body;
  const newComment = await CommentModel.create({
    content,
    book,
    createBy,
  });
  res.send({ success: 1, data: newComment });
};

//UPDATE COMMENT
const updateComment = async (req, res) => {
  const senderUser = req.user;
  const { commentId } = req.params;

  const foundComment = CommentModel.findById(commentId);
  if (!foundComment) {
    throw new HTTPError(400, "Not found comment");
  }

  if (foundComment.createdBy !== senderUser._id) {
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

  const foundComment = CommentModel.findById(commentId);
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
  //   getComments,
  //   getComment,
  createComment,
  updateComment,
  deleteComment,
};