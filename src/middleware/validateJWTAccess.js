require('dotenv').config({ path: "../.env" });
const jwt = require("jsonwebtoken");

function validateJWTAccess(req, res, next) {

    // destructure header for JWT
    let token = req.headers.authorization;

    // block checks for valid token
    if (!token) {
        res.status(401).json({ message: "Please log in" });
    }

    // getting token
    token = token.split(" ")[1];

    // verify the token
    try {
        let decodedToken = jwt.verify(token, process.env.MY_SECRET);
        // assign user to the req from the decoded token
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Sorry token not acceptable" });
    }
}

module.exports = { validateJWTAccess };