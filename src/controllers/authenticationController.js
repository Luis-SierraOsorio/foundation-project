// importing the service layer
const service = require("../services/authenticationService");
const { logger } = require("../utils/logger");

async function registerAccount(req, res) {
    /**
     * function to register an account, checks to see if username already exist beforehand
     */

    try {
        // destructing the body of the request, setting role to employee by default if not provided
        const { username, password, role = "employee" } = req.body;

        // using service layer function to retrieve an employee based on the username provided in the body
        const returnedEmployee = await service.getEmployeeByUsername(username);

        // block of checks to see if user exists, if not then create the user
        if (returnedEmployee === null) {
            const response = await service.createEmployee(username, password, role);

            if (response !== null && JSON.stringify(response).length !== 0) {
                return res.status(201).json({ message: "Account created!" });
            } else {
                return res.status(500).json({ message: "Account creation failed!" });
            }
        } else {

            return res.status(409).json({ message: "Account with username already exists!" });
        }
    } catch (error) {
        logger.error(`Error in registerAccount() for username: ${req.body.username}`, error)
        res.status(500).json({ message: "Internal server error during registering" });
    }

}

async function login(req, res) {
    /**
     * function to handle to handle log in of employee, checks if account exists and makes sure that passwords match
     */

    try {

        const { username, password } = req.body;

        // service layer function call to check if the password in the body matches the password associated with the username
        const returnedEmployee = await service.checkPassword(username, password);

        // checks to see if returnedEmployee is null
        if (returnedEmployee === null) {
            return res.status(401).json({ message: "Account does not exists." });
        }

        // else
        return res.status(returnedEmployee.httpStatus).json({ message: returnedEmployee.message });

    } catch (error) {
        logger.error(`Error in login() for username: ${req.body.username}`, error);
        res.status(500).json({ message: "Internal server error during login" });
    }
}

module.exports = {
    registerAccount,
    login
}