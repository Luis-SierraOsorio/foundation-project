
// importing dependencies
const ticketDAO = require("../repositories/ticketDAO");
const { v4: uuidv4 } = require("uuid");
const ticketService = require("../services/ticketService");

// mocking dependecies
jest.mock("../repositories/ticketDAO");
jest.mock("uuid");

describe("ticketService", () => {

    describe("ticketService", () => {

        // block incase submitting fails
        test("should return null if the ticket submission fails", async () => {
            // mocking the response of the submitTicket function on the DAO layer
            ticketDAO.submitTicket.mockResolvedValue(null);

            // calling my ticket service layer function
            const result = await ticketService.submitTicket("123", "10", "jest test", "pending");

            // setting my expected results
            expect(result).toBeNull();
        })

        // block for submitting ticket successfully
        test("should return the ticket submit if successful", async () => {

            // mocking the uuidv4 function call
            uuidv4.mockReturnValue("mockedId");

            // creating mocked object
            const mockedTicket = {
                ticketId: uuidv4(),
                employeeId: "123",
                amount: "100",
                description: "jest test",
                status: "pending"
            }

            // mocking DAO layer
            ticketDAO.submitTicket.mockResolvedValue({});
            ticketDAO.getTicketById.mockResolvedValue({ Items: [mockedTicket] });

            // calling my service layer function
            const result = await ticketService.submitTicket("123", "100", "jest test", "pending");

            // setting my expectations
            expect(result).toEqual(mockedTicket);
        })
    })

    describe("getTicketById", () => {

        // test incase no ticket is found
        test("should return null if ticket is not found", async () => {
            // mock the DAO return
            ticketDAO.getTicketById.mockResolvedValue({ Items: [] });

            // calling the service function
            const result = await ticketService.getTicketById("123");

            expect(result).toBeNull();

        })

        // block incase no ticket is found by id
        test("should return an object if the object is found", async () => {

            // creating mocked object
            const mockedTicket = {
                ticketId: '123',
                employeeId: '123',
                amount: "100",
                description: 'jest test',
                status: 'pending'
            }

            // mocking the DAO function call
            ticketDAO.getTicketById.mockResolvedValue({ Items: [] });

            // calling my service layer function
            const result = await ticketService.getTicketById("123");

            // expectation
            expect(result).toBeNull();
        })

    })

    describe("getTicketsByStatus", () => {

        // block incase the role is not manager
        test("should return null if the role is not manager", async () => {
            // calling the service layer function with employee
            const result = await ticketService.getTicketsByStatus("pending", "employee");

            expect(result).toBeNull();
        })

        // block incase invalid status
        test("should return empty array if the status is invalid", async () => {
            // calling the service layer function
            const result = await ticketService.getTicketsByStatus("notvalid", "manager");

            expect(result).toEqual([]);
        })

        // block for success
        test("should return an array of objects if successful", async () => {
            // creating a mocked object
            const mockedTickets = [
                { ticketId: 'ticket-1', status: 'pending' },
                { ticketId: 'ticket-2', status: 'pending' }
            ];

            // mocking my DAO layer
            ticketDAO.getTicketsByStatus.mockResolvedValue({ Items: mockedTickets });

            // calling service layer function
            const result = await ticketService.getTicketsByStatus("pending", "manager");

            expect(result).toEqual(mockedTickets);
        })

    })
    describe("getTicketsByEmployeeId", () => {
        test('should return tickets for valid employee ID', async () => {
            // creating mocked objects
            const mockedTickets = [
                { ticketId: 'ticket-1', employeeId: 'employee-1' },
                { ticketId: 'ticket-2', employeeId: 'employee-1' }
            ];

            // mocking the DAO layer function call
            ticketDAO.getTicketsByEmployeeId.mockResolvedValue({ Items: mockedTickets });

            // calling my service layer function
            const result = await ticketService.getTicketsByEmployeeId('employee-1');

            expect(result).toEqual(mockedTickets);
        });

    })
    describe("updateTicketStatus", () => {
        test('should return null if role is not manager', async () => {
            const result = await ticketService.updateTicketStatus('approved', 'ticket-1', 'employee');

            expect(result).toBeNull();
        });

        test('should return an empty array if ticket is not pending', async () => {
            // creating a mockedObject
            const mockedTicket = { ticketId: 'ticket-1', status: 'approved' };

            // mocking DAO layer function
            ticketDAO.getTicketById.mockResolvedValue({ Items: [mockedTicket] });

            const result = await ticketService.updateTicketStatus('approved', 'ticket-1', 'manager');

            expect(result).toEqual([]);
        });

        test('should update ticket status when valid inputs are provided', async () => {
            // creating the mockedTicket objects
            const mockExistingTicket = { Items: [{ ticketId: 'ticket-1', status: 'pending' }] };
            const mockUpdatedTicket = { Attributes: { ticketId: 'ticket-1', status: 'approved' } };

            // mocking the DAO layer function call and returns
            ticketDAO.getTicketById.mockResolvedValue(mockExistingTicket);
            ticketDAO.updateTicketStatus.mockResolvedValue(mockUpdatedTicket);

            const result = await ticketService.updateTicketStatus('approved', 'ticket-1', 'manager');

            expect(result).toEqual(mockUpdatedTicket.Attributes);
        });
    })
})
