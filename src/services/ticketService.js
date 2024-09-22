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


module.exports = { submitTicket };