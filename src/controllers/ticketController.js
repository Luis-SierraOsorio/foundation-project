// importing service layer
const service = require("../services/ticketService");
const { logger } = require("../utils/logger");

async function submitTicket(req, res) {
    /**
     * controller function to submit ticket
     */
    try {
        // destructuring employeeId and ticket required values
        const { employeeId } = req.user;
        const { amount, description, status = "pending" } = req.body;

        // calling service layer function for submitting ticket
        const response = await service.submitTicket(employeeId, amount, description, status);

        // block of code checks response to see if ticket was persisted to db
        if (response === null) {
            return res.status(500).json({ message: `failed to create ticket` });
        } else {
            return res.status(201).json({ message: `ticket created` });
        }

    } catch (error) {
        logger.error(`Error in submitTicket()`, error);
        res.status(500).json({ message: `Server error` });
    }
}

function getTicketByStatus(req, res) {
    console.log("Received GET request to see ticket by status");

}

function getTicketByEmployeeId(req, res) {
    console.log("Received GET request to see tickets by employee id");

}

function updateTicketStatus(req, res) {
    console.log("Received POST request to update ticket status");

}

module.exports = {
    submitTicket,
    getTicketByEmployeeId,
    getTicketByStatus,
    updateTicketStatus
};