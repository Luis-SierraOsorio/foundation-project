// imports
const express = require("express");
const {
    registerAccount,
    login } = require("../controllers/authenticationController");

// creating instance of Router class
router = express.Router();

// route to register, expects username and password in the req.body
router.post("/register", registerAccount);

// route to login, expects username and password in the req.body
router.post("/login", login);

module.exports = router;