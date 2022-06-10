const express = require("express");
const { route } = require("express/lib/router");
const isAdmin = require("../middleware/isAdmin");
const needAuthenticated = require("../middleware/needAuthenticated");
const router = express.Router();
const bookController = require("./book.controller");

router.get("/", bookController.getBooks);
router.get("/:bookId", bookController.getBook);
router.get("/:bookId/comments", bookController.getCommentsOfBook);

router.post("/", needAuthenticated, isAdmin, bookController.createBook);
router.put("/:bookId", needAuthenticated, isAdmin, bookController.updateBook);
router.put("/", bookController.updateAllBook);
router.delete(
  "/:bookId",
  needAuthenticated,
  isAdmin,
  bookController.deleteBook
);

router.get("/price", bookController.sortBookByPrice);
//Vote sao sách
router.put("/:bookId/stars", needAuthenticated, bookController.voteStars);

module.exports = router;
