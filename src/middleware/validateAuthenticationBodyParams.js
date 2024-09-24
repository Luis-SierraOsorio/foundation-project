function validateAuthenticationBodyParams(req, res, next) {
    /**
     * middleware function to check body params for register/login
     */

    // destructure required fields from body
    const { username, password } = req.body;

    // block checks if either the username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: `Both username and password are required fields.` });
    } else {
        next();
    }
}

module.exports = { validateAuthenticationBodyParams };