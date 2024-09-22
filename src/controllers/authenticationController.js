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

        // block of checks to see if user exists, if not then create user with passed params
        if (returnedEmployee === null) {
            const response = await service.createEmployee(username, password, role);

            // block of code checks if no response is returned, then return appropiate response to client
            if (response !== null && JSON.stringify(response).length !== 0) {
                return res.status(201).json({ message: "Account created!" });
            } else {
                return res.status(500).json({ message: "Account creation failed!" });
            }
        } else {
            // user with provided username exists so we block user creation
            return res.status(409).json({ message: "Account with username already exists!" });
        }
    } catch (error) {
        // logging and return error message
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
        const returnedEmployee = await service.login(username, password);

        // block of code checks to see if employee exist, passwords match, login if everything is right
        if (returnedEmployee === null) {
            // account does not exist
            return res.status(401).json({ message: "Account does not exists" });
        } else if (Object.keys(returnedEmployee).length === 0) {
            // incorrect password
            return res.status(401).json({ message: "Wrong password" });
        } else {
            // login sucessful
            return res.status(200).json(returnedEmployee);
        }

    } catch (error) {
        // logging and return error message
        logger.error(`Error in login() for username: ${req.body.username}`, error);
        res.status(500).json({ message: "Internal server error during login" });
    }
}

module.exports = {
    registerAccount,
    login
}