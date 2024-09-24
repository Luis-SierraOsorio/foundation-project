// importing ticketService layer
const ticketService = require("../services/ticketService");
const { logger } = require("../utils/logger");

async function submitTicket(req, res) {
    /**
     * controller function to submit ticket
     */
    try {
        // destructuring required params from JWT attribute and request body
        const { employeeId } = req.user;
        const { amount, description, status = "pending" } = req.body;

        // service layer function call to submit ticket, returns null if ticket fails to submit
        const createdTicket = await ticketService.submitTicket(employeeId, amount, description, status);

        // block checks if ticket was submitted properly
        if (!createdTicket) {
            return res.status(500).json({ message: `Failed to create ticket.` });
        } else {
            return res.status(201).json({
                message: `Ticket created.`,
                ticket: {
                    ticketId: createdTicket.ticket_id,
                    amount: createdTicket.amount,
                    description: createdTicket.description
                }
            });
        }

    } catch (error) {
        logger.error(`Error in submitTicket()`, error);
        res.status(500).json({ message: `Internal service error` });
    }
}

async function getTicketsByStatus(req, res) {
    /**
     * controller layer function to handle the querying of tickets by status
     */
    try {
        // destructuring required params
        const { status } = req.query;
        const { role } = req.user

        // service layer function call, returns null, [], [{...}]
        const returnedTicket = await ticketService.getTicketsByStatus(status, role);

        // null updatedTicket means user is not a manager
        if (!returnedTicket) {
            return res.status(401).json({ message: `Unauthorized - only managers can view ${status.toUpperCase()} tickets.` });
        }

        // block checks if returnedTicket is empty list - no tickets
        if (returnedTicket.length < 1) {
            return res.status(404).json({ message: `No existing tickets of ${status.toUpperCase()} status.` });
        }

        // returning data found
        return res.status(200).json({
            message: `${returnedTicket.length} ${status.toUpperCase()} tickets found.`,
            tickets: returnedTicket
        });
    } catch (error) {
        logger.error(`Error at getTicketsByStatus() for status: ${req.params.status}`, error);
        throw new Error(`Error at getTicketsByStatus() for status: ${req.params.status}`);
    }
}

async function getTicketsByEmployeeId(req, res) {
    /**
     * controller layer function to view ticket history (of logged in employee)
     */

    try {
        // destructuring employee id from jwt attribute
        const { employeeId } = req.user;

        // service layer function call, returns [] or [{...}]
        const returnedTickets = await ticketService.getTicketsByEmployeeId(employeeId);

        // block checks if updatedTicket is empty
        if (!returnedTickets || returnedTickets.length === 0) {
            return res.status(404).json({ message: "No ticket history." });
        }

        // returing updatedTicket
        return res.status(200).json({
            message: `${returnedTickets.length} tickets found.`,
            tickets: returnedTickets
        });

    } catch (error) {
        logger.error(`Error at getTicketsByEmployeeId() for employee ${req.user.username}`, error);
        throw new Error(`Error at getTicketsByEmployeeId() for employee ${req.user.username}`);
    }

}

async function updateTicketStatus(req, res) {
    /**
     * controller layer function to handle the updating of ticket status
     */

    try {

        // destructuring the required params
        const { status } = req.body;
        const { ticketId } = req.params;
        const { role } = req.user;

        // service layer function, returns null, []- no updating ,{...} - containing the ticket
        const updatedTicket = await ticketService.updateTicketStatus(status, ticketId, role);

        // block checks updateTicket
        if (!updatedTicket) {
            return res.status(401).json({ message: `No ticket found.` });
        } else if (updatedTicket.length === 0) {
            return res.status(404).json({ message: `Ticket parameters invalid.` });
        }

        return res.status(200).json({
            message: `Ticket updated`,
            ticket: {
                ...updatedTicket
            }
        });

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