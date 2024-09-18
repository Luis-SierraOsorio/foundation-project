// connecting to the DAO layer
const employeeDAO = require("../DAO/employeeDAO");
const { v4: uuidv4 } = require("uuid");

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
        console.log(`something went wrong with getEmployeeByUsername(): ${error}`);
        throw new Error("something went wrong with getting employee by username");
    }
}

async function checkPassword(username, passwordCheck) {
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

        // block of code to check if passwords match
        if (password !== passwordCheck) {
            return {
                message: "Incorrect passsword",
                httpStatus: 401
            };
        } else {

            return {
                message: "Correct password",
                httpStatus: 202
            };
        }


    } catch (error) {
        console.log(`something went wrong wtih checkPassword(): ${error}`);
        throw new Error("something went wrong with checking the password")
    }
}

async function createEmployee(username, password, role) {
    /**
     * function to create a new employee within the database
    */

    try {
        // new employee object to be passed into the DAO
        let newEmployee = {
            employee_id: uuidv4(),
            username: username,
            password: password,
            role: role
        };

        // persisting the new user
        const savedEmployee = await employeeDAO.createEmployee(newEmployee);

        // block checks that savedEmployee is not null or empty
        if (savedEmployee === null || JSON.stringify(savedEmployee).length === 0) {
            throw new Error("something went wrong with the creation of the object");
        }

        return savedEmployee;

    } catch (error) {
        console.log(`something went wrong with createEmployee(): ${error}`)
        throw new Error("something went wrong with the creation of the new account");
    }

}

module.exports = {
    getEmployeeByUsername,
    checkPassword,
    createEmployee
}