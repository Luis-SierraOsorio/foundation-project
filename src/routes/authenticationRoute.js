// imports
const express = require("express");
const {
    registerAccount,
    login } = require("../controllers/authenticationController");


// middleware imports
const { validateAuthenticationBodyParams } = require("../middleware/validateAuthenticationBodyParams");


// creating instance of Router class
router = express.Router();

// middleware
// router.use(validateAuthenticationBodyParams);

// route to register, expects username and password in the req.body
router.post("/register", validateAuthenticationBodyParams, registerAccount);

// route to login, expects username and password in the req.body
router.post("/login", validateAuthenticationBodyParams, login);

module.exports = router;