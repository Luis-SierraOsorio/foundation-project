const { documentClient } = require("../db/dynamoClient");
const { QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { logger } = require("../utils/logger");


require('dotenv').config({ path: "../.env" });

const TABLE_NAME = process.env.TABLE_NAME_EMPLOYEE;

async function getEmployeeByUsername(username) {
    /**
     * DAO function to query employee table based on username
     */

    try {
        // params to get from global secondary index table on username attribute
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'username-index',
            KeyConditionExpression: "#username = :username",
            ExpressionAttributeNames: {
                "#username": "username"
            },
            ExpressionAttributeValues: {
                ":username": username
            }
        }

        // querying data from db, returns [] either empty or with objects under response attribute 
        return await documentClient.send(new QueryCommand(params));
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
                employee_id: employeeObject.employeeId,
                username: employeeObject.username,
                password: employeeObject.password,
                role: employeeObject.role
            }
        };

        // performing the persistance call
        return await documentClient.send(new PutCommand(params));
    } catch (error) {
        logger.error(`Error creating employee with username: ${employeeObject.username}`, error);
        throw new Error(`Failed to persist employee data for username: ${employeeObject.username}. Check table permissions or structure.`);
    }
}

module.exports = { getEmployeeByUsername, createEmployee };