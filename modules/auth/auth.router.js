const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const validateInput = require("../middleware/validateInput");
const { loginSchema, registerSchema } = require("./auth.validation");

router.post(
  "/register",
  validateInput(registerSchema, "body"),
  authController.register
);

router.post("/login", validateInput(loginSchema, "body"), authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.post("/confirm/forgot", authController.confirmForgotPassword);

module.exports = router;
