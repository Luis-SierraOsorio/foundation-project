const employeeDAO = require("../repositories/employeeDAO");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("../utils/logger");
const jwt = require("jsonwebtoken");

require('dotenv').config({ path: "../.env" });

async function getEmployeeByUsername(username) {
    /**
     * service function to query employee by username from DAO layer
     */

    try {
        // DAO layer function to query based on username, returns [] empty or with objects
        const returnedEmployeeArray = await employeeDAO.getEmployeeByUsername(username);

        // block checks if returnedEmployee exists or not
        if (returnedEmployeeArray.length === 0) {
            return null;
        } else {
            return returnedEmployeeArray.Items[0];
        }

    } catch (error) {
        logger.error(`Error retrieving employee by username: ${username}`, error);
        throw new Error(`Failed to retrieve employee data for username: ${username}`);
    }
}

async function createEmployee(username, password, role) {
    /**
     * service layer function to persist employee onto db using DAO layer
    */

    try {
        // new employee object to be passed into the DAO function call
        let newEmployee = {
            employeeId: uuidv4(),
            username: username,
            password: password,
            role: role
        };

        // persisting the new user
        const savedEmployee = await employeeDAO.createEmployee(newEmployee);

        // querying for the new user and returning it
        return await getEmployeeByUsername(username);

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

async function login(username, passwordCheck) {
    /**
     * service function to handle the login of an employee
     */

    try {
        // check to see if employee exists, returns null or {} object 
        const returnedEmployee = await getEmployeeByUsername(username);

        // block checks returnedEmpoyee to be null, account doesn't exists
        if (!returnedEmployee) {
            return returnedEmployee;
        }

        // gets password from existing employee in db
        const { password } = returnedEmployee;

        // block compares password passed from controller and password in db, returns [] or JWT
        if (password !== passwordCheck) {
            return [];
        } else {
            // token creation
            const token = jwt.sign({
                username: returnedEmployee.username,
                role: returnedEmployee.role,
                employeeId: returnedEmployee.employee_id
            },
                process.env.MY_SECRET, {
                expiresIn: '5d'
            });

            return { token };
        }


    } catch (error) {
        logger.error(`Error checking password for username: ${username}`, error);
        throw new Error(`Password check failed for username: ${username}`);
    }
}