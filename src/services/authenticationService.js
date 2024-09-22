// connecting to the DAO layer
const employeeDAO = require("../repositories/employeeDAO");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("../utils/logger");
const jwt = require("jsonwebtoken");

// access to my environment file
require('dotenv').config({ path: "../.env" });

async function getEmployeeByUsername(username) {
    /**
     * function to retrieve an employee object based on the given username
     */

    try {
        const returnedEmployee = await employeeDAO.getEmployeeByUsername(username);

        // block of code to check if returnedEmployee exist or not
        if (returnedEmployee === null) {
            return null;
        }

        return returnedEmployee;

    } catch (error) {
        logger.error(`Error retrieving employee by username: ${username}`, error);
        throw new Error(`Failed to retrieve employee data for username: ${username}`);
    }
}

async function login(username, passwordCheck) {
    /**
     * function to check the password of the user
     */

    try {
        // checking to see if an account with the username exists
        const returnedEmployee = await getEmployeeByUsername(username);

        // block of code to check if employee exist
        if (returnedEmployee === null) {
            return null;
        }

        const { password } = returnedEmployee;

        // block of code to check if passwords match, if they do create and return jwt
        if (password !== passwordCheck) {
            // returning empty object, means that the passwords do not match
            return {}
        } else {

            const token = jwt.sign({
                username: returnedEmployee.username,
                role: returnedEmployee.role,
                employeeId: returnedEmployee.employeeId
            },
                process.env.MY_SECRET, {
                expiresIn: '1h'
            });

            return { token };
        }


    } catch (error) {
        logger.error(`Error checking password for username: ${username}`, error);
        throw new Error(`Password check failed for username: ${username}`);
    }
}

async function createEmployee(username, password, role) {
    /**
     * function to create a new employee within the database
    */

    try {
        // new employee object to be passed into the DAO
        let newEmployee = {
            employeeId: uuidv4(),
            username: username,
            password: password,
            role: role
        };

        // persisting the new user
        const savedEmployee = await employeeDAO.createEmployee(newEmployee);

        // block checks that savedEmployee is not null or empty
        // this should not matter, if repository should throw an error and get caught in our catch block here
        // if (savedEmployee === null || JSON.stringify(savedEmployee).length === 0) {
        //     throw new Error("something went wrong with the creation of the object");
        // }

        return savedEmployee;

    } catch (error) {
        logger.error(`Error creating employee for data: ${newEmployee} `, error);
        throw new Error(`Failed to create a new account for username: ${username}. Check database connection or input data.`);
    }

}

module.exports = {
    getEmployeeByUsername,
    login,
    createEmployee
}