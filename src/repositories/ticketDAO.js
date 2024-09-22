const { documentClient } = require("../db/dynamoClient");
const { QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../utils/logger");

async function submitTicket(data) {
    /**
     * function to persist ticket to db
     */

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

async function getTicketsByStatus(status) {
    /**
     * function to query db for tickets by status
     */

    try {

        // params for the 
        const params = {
            TableName: process.env.TABLE_NAME_TICKET,
            IndexName: 'status-index',
            KeyConditionExpression: "#status = :status",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": status
            }
        }

        const data = await documentClient.send(new QueryCommand(params));

        return data.Items;

    } catch (error) {
        logger.error(`Failed to retrieve ticket of status ${status} from database`, error);
        throw new Error(`Failed to retrieve ticket of status ${status} from database`);
    }
}

module.exports = {
    submitTicket,
    getTicketsByStatus
}