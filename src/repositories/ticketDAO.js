const { documentClient } = require("../db/dynamoClient");
const { QueryCommand, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../utils/logger");
const { ReturnValue } = require("@aws-sdk/client-dynamodb");
const { CloudSearch } = require("aws-sdk");

async function submitTicket(data) {
    /**
     * DAO layer function to persist ticket into db
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

        // persisting data to db
        return await documentClient.send(new PutCommand(params));

    } catch (error) {
        logger.error(`Failed to persist ticket to database`, error);
        throw new Error(`Failed to persist ticket to database`);
    }
}

async function getTicketById(ticketId) {
    /**
     * DAO layer function to query ticket by ID
     */
    try {

        // setting params
        const params = {
            TableName: process.env.TABLE_NAME_TICKET,
            KeyConditionExpression: "#ticket_id = :ticketId",
            ExpressionAttributeNames: { "#ticket_id": "ticket_id" },
            ExpressionAttributeValues: { ":ticketId": ticketId }
        }

        // returning query
        return await documentClient.send(new QueryCommand(params));
    } catch (error) {
        logger.error(`Failed to get ticket of ticket ID: ${ticketId} from database`, error);
        throw new Error(`Failed to getticket of ticket ID: ${ticketId} from database`);
    }
}

async function getTicketsByStatus(status) {
    /**
     * DAO layer function to to query db for tickets based on status
     */

    try {

        // params for the query
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

        // returns object with Items as attribute (array of tickets)
        return await documentClient.send(new QueryCommand(params));

    } catch (error) {
        logger.error(`Failed to retrieve ticket of status ${status} from database`, error);
        throw new Error(`Failed to retrieve ticket of status ${status} from database`);
    }
}

async function getTicketsByEmployeeId(employeeId) {
    /**
     * DAO layer function to handle querying the db for tickets of specified user by their id
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

        // returns json object object {Items: [...]}
        return await documentClient.send(new QueryCommand(params));
    } catch (error) {
        logger.error(`Failed to retrieve ticket of employeeId ${employeeId} from database`, error);
        throw new Error(`Failed to retrieve ticket of employeeId ${employeeId} from database`);
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

        return await documentClient.send(new UpdateCommand(params));

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