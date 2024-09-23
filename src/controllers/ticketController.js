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

async function getTicketsByEmployeeId(req, res) {
    /**
     * controller function to return current employee's ticket history
     */

    try {
        // getting employeeId from the JWT 
        const { employeeId } = req.user;

        // passing into service layer function and awaiting response, should return [] - no tokens OR [{data}] - for history
        const response = await ticketService.getTicketsByEmployeeId(employeeId);

        // block checks if response is empty
        if (!response || response.length === 0) {
            return res.status(404).json({ message: "no ticket history" });
        }

        return res.status(200).json({ response });

    } catch (error) {
        logger.error(`Error at getTicketsByEmployeeId() for employee ${req.user.username}`, error);
        throw new Error(`Error at getTicketsByEmployeeId() for employee ${req.user.username}`);
    }

}

async function updateTicketStatus(req, res) {
    // controller function to update ticket status

    try {

        // I expect new status from the body
        const { status } = req.body;
        const { ticketId } = req.params
        const { role } = req.user;

        // returns null if missing info, or empty list/object if no ticket is found, or returns the new ticket
        const response = await ticketService.updateTicketStatus(status, ticketId, role);

        // block checks if response is null or empty
        if (!response) {
            return res.status(401).json({ message: `Invalid parameters/invalid user` });
        } else if (response.length === 0) {
            return res.status(404).json({ message: `ticket not found` });
        }

        return res.status(200).json({ message: `ticket updated` });

    } catch (error) {
        logger.error(`Error at updateTicketStatus() for managaer ${req.user.username}`, error);
        throw new Error(`Error at updateTicketStatus() for manager ${req.user.username}`);
    }

}


module.exports = {
    updateTicketStatus,
    getTicketsByEmployeeId,
    getTicketsByStatus,
    submitTicket
}