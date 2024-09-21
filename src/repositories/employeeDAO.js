const { documentClient } = require("../db/dynamoClient");
const { QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../utils/logger");


require('dotenv').config({ path: "../.env" });

const TABLE_NAME = process.env.TABLE_NAME_EMPLOYEE;

async function getEmployeeByUsername(username) {
    /**
     * function to get an employee by username from db
     */

    try {
        // params to get from global secondary index table on username attribute
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'username-index',
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        }

        // getting the data returned from the query command
        const data = await documentClient.send(new QueryCommand(params));

        // block to return null if data is empty
        if (!data.Items || data.Items.length === 0) {
            return null;
        }

        return data.Items[0];

    } catch (error) {
        logger.error(`Error retrieving employee by username: ${username}`, error);
        throw new Error(`Database query failed for username: ${username}. Ensure the index exists and the connection is valid.`);
    }
}

async function createEmployee(employeeObject) {
    /**
     * function to persist an employee on the db
     */

    try {
        // params for the object that will be persisted
        const params = {
            TableName: TABLE_NAME,
            Item: {
                employee_id: employeeObject.employee_id,
                username: employeeObject.username,
                password: employeeObject.password,
                role: employeeObject.role
            }
        };

        // performing the persistance call
        const response = await documentClient.send(new PutCommand(params));

        // will always return something no matter what
        return response;
    } catch (error) {
        logger.error(`Error creating employee with username: ${employeeObject.username}`, error);
        throw new Error(`Failed to persist employee data for username: ${employeeObject.username}. Check table permissions or structure.`);
    }
}

module.exports = { getEmployeeByUsername, createEmployee };