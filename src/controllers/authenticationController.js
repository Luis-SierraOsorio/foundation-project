// importing the service layer
const service = require("../services/authenticationService");

async function registerAccount(req, res) {
    /**
     * 
     * registers new employee if employee account does not already exist
     * 
     */

    try {
        const { username, password } = req.body;

        // using service layer function to retrieve an employee based on the username provided in the body
        const employeeTemp = await service.getEmployeeByUsername(username);

        // block of code compares the objects, if object is empty then create a new employee, else return a 409 status code and error message
        if (JSON.stringify(employeeTemp) === JSON.stringify({})) {
            service.createEmployee(username, password);
            return res.status(201).json({ message: "Account created!" })
        } else {
            return res.status(409).json({ message: "Account with username already exists!" });
        }
    } catch (error) {
        console.log(`Something went wrong with the registerAccount(): ${error}`)
    }

}

async function login(req, res) {
    /**
     * 
     * function to handle the logging in of an employee
     * 
     */

    try {

        const { username, password } = req.body;

        // service layer function call to check if the password in the body matches the password associated with the username
        const employeeTemp = await service.checkPassword(username, password);

        // if the function call returns an empty object then return 401 status code, else return 200 code and log in
        if (JSON.stringify(employeeTemp) === JSON.stringify({})) {
            return res.status(401).json({ message: "something went wrong, please try again." });
        } else {
            return res.status(200).json({ message: "logged in succssful!" });
        }
    } catch (error) {
        console.log(`Something went wrong with login(): ${error}`)
    }
}

module.exports = {
    registerAccount,
    login
}