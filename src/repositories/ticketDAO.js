const { documentClient } = require("../db/dynamoClient");
const { QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../utils/logger");

async function submitTicket(data) {

    try {
        // constructing params to pass into putcommand for dynamodb
        const params = {
            TableName: process.env.TABLE_NAME_TICKET,
            Item: {
                ticket_id: data.ticketId,
                employee_id: data.employeeId,
                amount: data.amount,
                description: data.description,
                status: data.status
            }
        }

        // waiting to get response from putcommand
        const response = await documentClient.send(new PutCommand(params));

        return response;

    } catch (error) {
        logger.error(`Failed to persist ticket to database`, error);
        throw new Error(`Failed to persist ticket to database`);
    }
}

module.exports = { submitTicket };