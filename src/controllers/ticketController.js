// importing ticketService layer
const ticketService = require("../services/ticketService");
const { logger } = require("../utils/logger");

async function submitTicket(req, res) {
    /**
     * controller function to submit ticket
     */
    try {
        // destructuring employeeId and ticket required values
        const { employeeId } = req.user;
        const { amount, description, status = "pending" } = req.body;

        // calling ticketService layer function for submitting ticket
        const response = await ticketService.submitTicket(employeeId, amount, description, status);

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

async function getTicketsByStatus(req, res) {
    /**
     * function to be able to get ticket by status based on url param
     */
    try {
        const { status } = req.params;
        const { role } = req.user

        // should return empty or at least 1 array
        const response = await ticketService.getTicketsByStatus(status, role);

        // response is null meaning user is not a manager
        if (!response) {
            return res.status(401).json({ message: `Only managers can view ${status} tickets` });
        }

        // block to check for empty array or null status
        if (response.length < 1) {
            return res.status(404).json({ message: `Sorry no tickets with the status: ${status.toUpperCase()} were found` });
        }

        // returning data found
        return res.status(200).json({ response });
    } catch (error) {
        logger.error(`Error at getTicketsByStatus() for status: ${req.params.status}`, error);
        throw new Error(`Error at getTicketsByStatus() for status: ${req.params.status}`);
    }
}

function getTicketsByEmployeeId(req, res) {
    console.log("Received GET request to see tickets by employee id");

}

function updateTicketStatus(req, res) {
    console.log("Received POST request to update ticket status");

}


module.exports = {
    updateTicketStatus,
    getTicketsByEmployeeId,
    getTicketsByStatus,
    submitTicket
}