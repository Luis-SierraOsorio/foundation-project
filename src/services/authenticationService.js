// connecting to the DAO layer
const employeeDAO = require("../DAO/employeeDAO");
const { v4: uuidv4 } = require("uuid");

async function getEmployeeByUsername(username) {
    /**
     * 
     * function to retrieve an employee object based on the given username
     * 
     */

    try {
        const savedEmployee = await employeeDAO.getEmployeeByUsername(username);

        // block of code to check if the object returned is empty or not, if empty username does not exist
        if (JSON.stringify(savedEmployee) !== JSON.stringify({})) {
            return savedEmployee;
        } else {
            return {};
        }

    } catch (error) {
        console.log(`something went wrong with getEmployeeByUsername(): ${error}`);
        throw new Error("something went wrong with getting employee by username");
    }
}

async function checkPassword(username, passwordCheck) {
    /**
     * 
     * function to check the password of the user
     * 
     */

    try {

        const savedEmployee = await getEmployeeByUsername(username);
        const { password } = savedEmployee;

        // block of code checks to see if object is empty, or if the passwords do not match, return empty object if thats the case
        if (JSON.stringify(savedEmployee) === JSON.stringify({}) || password !== passwordCheck) {
            return {}
        } else {
            return savedEmployee;
        }
    } catch (error) {
        console.log(`something went wrong wtih checkPassword(): ${error}`);
        throw new Error("something went wrong with checking the password")
    }
}

async function createEmployee(username, password, role) {
    /**
     * 
     * function to create a new employee within the database
     * 
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

        // block checks to see if the object was persisted properly, otherwise throws and error
        if (JSON.stringify(savedEmployee) === JSON.stringify({})) {
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