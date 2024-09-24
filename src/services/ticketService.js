const ticketDAO = require("../repositories/ticketDAO");
const { v4: uuidv4 } = require('uuid');
const { logger } = require("../utils/logger");

async function submitTicket(employeeId, amount, description, status) {
    /**
     * service function to submit ticket to db on the DAO layer
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

        // DAO layer function call to submit ticket
        const response = await ticketDAO.submitTicket(ticket);

        // block to return null if persistance fails
        if (!response) {
            return null
        }

        // DAO layer funciton call returns {..., Items: [...{<data>}]}
        return await getTicketById(ticketId);

    } catch (error) {
        logger.error(`Service: Error submitting ticket / submitTicket()`, { error });
        throw new Error(`Service: Failed to submit new ticket`);
    }

}

async function getTicketById(ticketId) {
    /**
     * service layer function to query ticket by id from db
     */
    try {
        //DAO layer function call, returns [], {..., Items: [...{<data>}]}
        const returnedTicket = await ticketDAO.getTicketById(ticketId);

        // block checks returnedTicket
        if (returnedTicket.length === 0) {
            return null;
        } else {
            return returnedTicket.Items[0];
        }
    } catch (error) {
        logger.error(`Service: Error retrieving ticket by id / getTicketById()`, { error });
        throw new Error(`Service: Failed retrieving ticket by id`);
    }
}

async function getTicketsByStatus(status, role) {
    /**
     * service layer function to handle query tickets by status
     */

    try {
        // string sanitization
        status = status.toLowerCase().trim();

        // block checks that role is manager to prevent employee role from accessing
        if (role !== "manager") {
            return null;
        }

        // set to hold possible statuses
        const statuses = new Set(["pending", "approved", "denied"]);

        // block checks if status is within possible statuses
        if (!statuses.has(status)) {
            return [];
        }

        // DAO layer funciton call, returns null, [], {..., Items: [...{<data>}]}
        const returnedTickets = await ticketDAO.getTicketsByStatus(status);
        return returnedTickets.Items;

    } catch (error) {
        logger.error(`Service: Error retrieving ticket by status / getTicketByStatus()`, { error });
        throw new Error(`Service: Failed retrieving ticket by status`);
    }
}

async function getTicketsByEmployeeId(employeeId) {
    /**
     * service layer function to handle querying tickets by provided status
     */

    try {

        // DAO layer function call, returns [], {..., Items: [...{<data>}]}
        const returnedTickets = await ticketDAO.getTicketsByEmployeeId(employeeId);

        return returnedTickets.Items;

    } catch (error) {
        logger.error(`Service: Error retrieving tickets by employee id / getTicketByEmployeeId()`, { error });
        throw new Error(`Service: Failed retrieving ticekts by employee id`);
    }
}

async function updateTicketStatus(status, ticketId, role) {
    /**
     * service layer function to handle the updating of a ticket status
     */

    try {

        // 
        if (!status || !ticketId || role !== 'manager') {
            return null;
        }

        // DAO function call, returns null - no ticket, {..., Items: [...{<data>}]}
        const existingTicket = await ticketDAO.getTicketById(ticketId);

        // block checks existingTicket status to make sure they can't update an already processed ticket
        if (existingTicket.Items.length === 0 || existingTicket.Items[0].status !== "pending") {
            return [];
        }

        const response = await ticketDAO.updateTicketStatus(status, ticketId);
        return response.Attributes;

    } catch (error) {
        logger.error(`Service: Error updating ticket status / updateTicketStatsu()`, { error });
        throw new Error(`Service: Failed updating ticket status`);
    }

}

module.exports = {
    submitTicket,
    getTicketsByStatus,
    getTicketsByEmployeeId,
    updateTicketStatus
}