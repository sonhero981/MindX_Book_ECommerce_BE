const express = require("express");
const needAuthenticated = require("../middleware/needAuthenticated");
const router = express.Router();
const commentController = require("./comment.controller");

router.get("/", commentController.getComments);
router.get("/:commentId", commentController.getComment);
router.post("/", needAuthenticated, commentController.createComment);
router.put("/:commentId", needAuthenticated, commentController.updateComment);
router.delete(
  "/:commentId",
  needAuthenticated,
  commentController.deleteComment
);
module.exports = router;
