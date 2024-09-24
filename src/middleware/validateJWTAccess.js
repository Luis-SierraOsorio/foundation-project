require('dotenv').config({ path: "../.env" });
const jwt = require("jsonwebtoken");

function validateJWTAccess(req, res, next) {
    /**
     * middleware function to handle the verification of JWT
     */

    // destructuring header for JWT
    let token = req.headers.authorization;

    // block checks for valid token structure
    if (!token || token.length <= 1) {
        return res.status(401).json({ message: "Please log in." });
    }

    // token is expected in the form of "Bearer <token>"
    token = token.split(" ")[1];

    // block verifies the token
    try {
        // verification function for JWT
        let decodedToken = jwt.verify(token, process.env.MY_SECRET);

        // if token is decoded successfully contents are saved to the request under user
        req.user = decodedToken;

        next();
    } catch (error) {
        res.status(401).json({ message: "Sorry, token not valid." });
    }
}

module.exports = { validateJWTAccess };