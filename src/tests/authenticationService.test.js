// mocking dependencies
jest.mock("../repositories/employeeDAO");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// getting my dependecies
const employeeDAO = require("../repositories/employeeDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticationService = require("../services/authenticationService");

// block for authentication file
describe("authenticationService", () => {
    // block for querying employee by username
    describe("getEmployeeByUsername", () => {
        test("should return null if employee not found", async () => {
            // mocking the DAO layer
            employeeDAO.getEmployeeByUsername.mockResolvedValue({ Items: [] });

            // calling the service layer function
            const result = await authenticationService.getEmployeeByUsername("fakeusername");

            expect(result).toBeUndefined();
        })

        test("should return employee if found", async () => {
            // creating an object of an employee
            const mockEmployee = { username: "usernameExists", password: "passwordExists" }

            // mocking DAO layer and setting my resolved value
            employeeDAO.getEmployeeByUsername.mockResolvedValue({ Items: [mockEmployee] });

            // calling the service layer function with the username
            const result = await authenticationService.getEmployeeByUsername("usernameExists");

            expect(result).toEqual(mockEmployee);
        })
    })

    // block for testing the creation of the emplooyee
    describe("createEmployee", () => {
        test("should return null if role is invalid", async () => {
            // setting invalid role
            const role = "invalidRole";

            // no need to mock anything since verification happens at the top
            const result = await authenticationService.createEmployee('testuser', 'testpassword', role);

            // expected outcome
            expect(result).toBeNull();
        })

        test("should hash password and return new employee", async () => {
            // mocking bycrypt and putting the expected return
            bcrypt.hashSync.mockReturnValue("hashedPassword");

            // creating a mock employee
            const mockEmployee = {
                username: 'testUsername',
                password: 'hashedPassword',
                role: 'employee'
            }

            // mocking the DAO createEmployee and getEmployeeByUsername and setting the expected resolves
            employeeDAO.createEmployee.mockResolvedValue(mockEmployee);
            employeeDAO.getEmployeeByUsername.mockResolvedValue({ Items: [mockEmployee] });

            // calling the service layer function
            const result = await authenticationService.createEmployee('testUsername', 'password', 'employee');

            // setting my expectations
            expect(result).toEqual(mockEmployee);

            // spying on bcrypt and ensuring that the function was called with passed in params
            expect(bcrypt.hashSync).toHaveBeenCalledWith('password', 10);

        })
    })

    describe("login", () => {
        test("should return null if employee is not found", async () => {
            // expecting an empty items
            employeeDAO.getEmployeeByUsername.mockResolvedValue({ Items: [] });

            // calling the service layer function
            const result = await authenticationService.login("fakeUsername", "password");

            // handling the return
            expect(result).toBeUndefined();

        })

        test("should return empty array if passwords do not match", async () => {
            // creating mock employee
            const mockEmployee = { username: "testUsername", password: "correctPassword", role: "manager" };

            //mocking the resolved value from the db to be the mocked employee 
            employeeDAO.getEmployeeByUsername.mockResolvedValue({ Items: [mockEmployee] });

            // setting the outcome of compareSync to be false
            bcrypt.compareSync.mockReturnValue(false);

            // calling the login function
            const result = await authenticationService.login('testUsername', "wrongPassword");

            // handling return
            expect(result).toEqual([]);
        })

        test("should create and return jwt", async () => {
            // creating a mock employee object
            const mockEmployee = { username: "user", password: "hashedPassword", employeeId: "123", role: "manager" }

            // mock resolve from db call
            employeeDAO.getEmployeeByUsername.mockResolvedValue({ Items: [mockEmployee] });

            // mock bycrypt compareSync to be true
            bcrypt.compareSync.mockReturnValue(true);

            // mock jwt creation
            jwt.sign.mockReturnValue("mockToken");

            // calling our service layer
            const result = await authenticationService.login('user', 'password');

            // handling return 
            expect(result).toEqual({ token: 'mockToken' });

        })
    })
})