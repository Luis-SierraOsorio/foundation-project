const { documentClient } = require("../db/dynamoClient");
const { QueryCommand, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../utils/logger");
const { ReturnValue } = require("@aws-sdk/client-dynamodb");

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

async function getTicketsByEmployeeId(employeeId) {
    /**
     * DAO layer function to handle querying the db for tickets of specified user
     */

    try {
        // params to query the employee_id global index table
        const params = {
            TableName: process.env.TABLE_NAME_TICKET,
            IndexName: "employee_id-index",
            KeyConditionExpression: "#employee_id = :employeeId",
            ExpressionAttributeNames: { "#employee_id": "employee_id" },
            ExpressionAttributeValues: { ":employeeId": employeeId }
        }

        // returns json object containing Items (can be [] or full)
        const response = await documentClient.send(new QueryCommand(params));

        return response.Items;
    } catch (error) {
        logger.error(`Failed to retrieve ticket of employeeId ${employeeId} from database`, error);
        throw new Error(`Failed to retrieve ticket of employeeId ${employeeId} from database`);
    }
}

async function getTicketById(ticketId) {
    /**
     * DAO layer function to get ticket based on the ticket ID
     */
    try {

        // setting params
        const params = {
            TableName: process.env.TABLE_NAME_TICKET,
            KeyConditionExpression: "#ticket_id = :ticketId",
            ExpressionAttributeNames: { "#ticket_id": "ticket_id" },
            ExpressionAttributeValues: { ":ticketId": ticketId }
        }

        // getting existing ticket
        const response = await documentClient.send(new QueryCommand(params));
        return response.Items[0];

    } catch (error) {
        logger.error(`Failed to get ticket of ticket ID: ${ticketId} from database`, error);
        throw new Error(`Failed to getticket of ticket ID: ${ticketId} from database`);
    }
}

async function updateTicketStatus(status, ticketId) {
    /**
     * DAO layer function to update given ticket status
     */
    try {

        // params
        const params = {
            TableName: process.env.TABLE_NAME_TICKET,
            Key: { ticket_id: ticketId },
            UpdateExpression: "set #status = :status",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":status": status
            },
            ReturnValues: "ALL_NEW"

        }

        const response = await documentClient.send(new UpdateCommand(params));
        return response.Attributes;

    } catch (error) {
        logger.error(`Failed to update ticket of ticket ID: ${ticketId} from database`, error);
        throw new Error(`Failed to update ticket of ticket ID: ${ticketId} from database`);
    }
}

module.exports = {
    submitTicket,
    getTicketsByStatus,
    getTicketsByEmployeeId,
    updateTicketStatus,
    getTicketById
}