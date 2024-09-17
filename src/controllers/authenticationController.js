// importing the service layer
const service = require("../services/authenticationService");

function registerAccount(req, res) {
    res.send("received POST request for register");
}

function login(req, res) {
    res.send("received POST request for login");
}

module.exports = {
    registerAccount,
    login
}