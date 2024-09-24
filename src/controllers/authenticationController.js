// importing the service layer
const service = require("../services/authenticationService");
const { logger } = require("../utils/logger");

async function registerAccount(req, res) {
    /**
     * controller function to handle registration, might contain role in body
     */

    try {
        // destructing the body of the request, setting role to employee by default if not provided
        const { username, password, role = "employee" } = req.body;

        // service layer function to get employee by username, returns null or valid object containing employee
        const returnedEmployee = await service.getEmployeeByUsername(username);

        // block checks if returnedEmployee returns existing employee, if not then create new employee
        if (!returnedEmployee) {
            // service layer function to create employee, returns null or valid object containing new employee
            const createdEmployee = await service.createEmployee(username, password, role);

            // block checks if employee was created successfully
            if (createdEmployee) {
                // returning employee fields username and role only
                return res.status(201).json({
                    message: "Account created!",
                    account: {
                        username: createdEmployee.username,
                        role: createdEmployee.role
                    }
                });
            } else {
                return res.status(500).json({ message: "Account creation failed!" });
            }
        } else {
            // employee with username already exists
            return res.status(409).json({ message: "Employee with username already exists!", username: username });
        }
    } catch (error) {
        logger.error(`Error in registerAccount() for username: ${req.body.username}`, error)
        res.status(500).json({ message: "Internal server error during registration" });
    }

}

async function login(req, res) {
    /**
     * controller function to handle login
     */

    try {

        // destructuring required params
        const { username, password } = req.body;

        // service layer function call to handle login
        const returnedEmployee = await service.login(username, password);

        // block checks returnedEmployee, returns null if acc doesn't exists, [] if creds don't match, JWT if successful
        if (!returnedEmployee) {
            // account does not exist
            return res.status(404).json({ message: `Account doesn't exist.` });
        } else if (returnedEmployee.length === 0) {
            // incorrect password
            return res.status(401).json({ message: `Username and/or password do not match.` });
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