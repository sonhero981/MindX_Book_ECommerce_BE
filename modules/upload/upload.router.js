const express = require("express");
const router = express.Router();
const multer = require("multer");

const uploadController = require("./upload.controller");

const memoryStorage = multer.memoryStorage();
const uploadWithMemoryStorage = multer({ storage: memoryStorage });

router.post(
  "/",
  uploadWithMemoryStorage.single("file"),
  uploadController.uploadToCloud
);

module.exports = router;
