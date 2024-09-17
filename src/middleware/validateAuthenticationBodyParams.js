function validateAuthenticationBodyParams(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "missing required fields" });
    }

    next();
}

module.exports = { validateAuthenticationBodyParams };