const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const { validateAuthenticationBodyParams } = require("../middleware/validateAuthenticationBodyParams");

// creating instance of Router class
router = express.Router();

// register route, uses middlware to check body params
router.post("/register", validateAuthenticationBodyParams, authenticationController.registerAccount);

// login route, uses middleware to check body params
router.post("/login", validateAuthenticationBodyParams, authenticationController.login);

module.exports = router;