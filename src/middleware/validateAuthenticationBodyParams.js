function validateAuthenticationBodyParams(req, res, next) {
    /**
     * middleware function to handle missing fields for the body in the register/login routes
     */

    const { username, password } = req.body;
    let message = "";

    // block to check if both fields are missing
    if (!username && !password) {
        message = "username and password are required!";
    } else if (!username) {
        message = "username is required!";
    } else if (!password) {
        message = "password is required!";
    } else {
        next();
    }

    return res.status(400).json({ message: message });
}

module.exports = { validateAuthenticationBodyParams };