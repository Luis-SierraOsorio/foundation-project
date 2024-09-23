const ticketDAO = require("../repositories/ticketDAO");
const { v4: uuidv4 } = require('uuid');
const { logger } = require("../utils/logger");

async function submitTicket(employeeId, amount, description, status) {
    /**
     * service function to submit ticket
     */

    try {
        //creating ticket id 
        const ticketId = uuidv4();

        // constructing ticket object
        const ticket = {
            ticketId: ticketId,
            employeeId: employeeId,
            amount: amount,
            description: description,
            status: status
        }

        // calling DAO layer submit ticket
        const response = await ticketDAO.submitTicket(ticket);

        // block of code checks if putcommand failed
        if (response === null) {
            return null
        };

        return response;

    } catch (error) {
        logger.error(`Failed to submit ticket`, error);
        throw new Error(`Failed to submit new ticket for employeeId: ${employeeId}`)
    }

}

async function getTicketsByStatus(status, role) {

    try {
        // some string sanitization
        status = status.toLowerCase().trim();

        // block checks to make sure its a manager
        if (role !== "manager") {
            return null;
        }

        // set to hold possible statuses
        const statuses = new Set(["pending", "approved", "denied"]);

        // checking if given status is within our possible statuses
        if (!statuses.has(status)) {
            return [];
        }

        // repsonse is an array, either null, empty or contains items
        const response = await ticketDAO.getTicketsByStatus(status);

        return response;
    } catch (error) {
        logger.error(`Failed retrieving tickets by status: ${status}`, error);
        throw new Error(`Failed retrieving tickets by status ${status}`);
    }
}

async function getTicketsByEmployeeId(employeeId) {

    try {

        // calling DAO layer function to query tickets of specific logged in employee
        const response = ticketDAO.getTicketsByEmployeeId(employeeId);

        // response should be empty or at least have 1 item
        return response;

    } catch (error) {
        logger.error(`Failed retrieving tickets by employee ID: ${employeeId}`, error);
        throw new Error(`Failed retrieving tickets by employee ID: ${employeeId}`);
    }
}

module.exports = {
    submitTicket,
    getTicketsByStatus,
    getTicketsByEmployeeId
}