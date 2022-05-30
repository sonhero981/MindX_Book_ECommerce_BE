const express = require("express");
const isAdmin = require("../middleware/isAdmin");
const needAuthenticated = require("../middleware/needAuthenticated");
const router = express.Router();
const bookController = require("./book.controller");

router.get("/", bookController.getBooks);
router.get("/:bookId", bookController.getBook);
router.get("/:bookId/comments", bookController.getCommentsOfBook);

router.post("/", needAuthenticated, isAdmin, bookController.createBook);
router.put("/:bookId", needAuthenticated, isAdmin, bookController.updateBook);
router.delete(
  "/:bookId",
  needAuthenticated,
  isAdmin,
  bookController.deleteBook
);

module.exports = router;
