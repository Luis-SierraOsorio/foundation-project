function validateTicketsBodyParams(req, res, next) {
    /**
     * middleware function to check body params for ticket routes
     */

    // destructure required params from body
    const { amount, description } = req.body;

    // block checks if required fields are missing or invalid
    if (!amount || !description) {
        return res.status(400).json({ message: `Both amount and description are required fields.` })
    } else if (+amount <= 0) {
        return res.status(400).json({ message: `Invalid amount provided.` })
    } else {
        next();
    }
}

module.exports = { validateTicketsBodyParams };