function validateTicketsBodyParams(req, res, next) {

    // destructure required params from body
    const { amount, description } = req.body;

    // block of code checks if either required fields are missing and returns appropiate response
    if (!amount || !description) {
        let message = "";

        if (!amount && !description) {
            message = `Amount and description are required`;
        } else if (!amount) {
            message = `Amount is required`;
        } else {
            message = `Description is required`
        }

        return res.status(400).json({ message: message })
    } else {
        next();
    }

}

module.exports = { validateTicketsBodyParams };