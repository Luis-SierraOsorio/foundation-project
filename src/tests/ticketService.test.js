// mocking dependecies
jest.mock("../repositories/ticketDAO");
jest.mock("uuid");

// importing dependencies
const ticketDAO = require("../repositories/ticketDAO");
const { v4: uuidv4 } = require("uuid");
const ticketService = require("../services/ticketService");


describe("ticketService", () => {

    describe("ticketService", () => {

    })

    describe("getTicketById", () => {

    })

    describe("getTicketsByStatus", () => {

    })
    describe("getTicketsByEmployeeId", () => {

    })
    describe("updateTicketStatus", () => {

    })

})
