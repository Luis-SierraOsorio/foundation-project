const { documentClient } = require("../db/dynamoClient");
const { QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");


require('dotenv').config({ path: "../.env" });

const TABLE_NAME = process.env.TABLE_NAME_EMPLOYEE;

async function getEmployeeByUsername(username) {

    try {
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'username-index',
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username
            }
        }

        const { Items } = await documentClient.send(new QueryCommand(params));
        return Items.length > 0 ? Items[0] : {};

    } catch (error) {
        console.log(`something went wrong with the getEmployeeByUsername(): ${error}`);
        throw new Error("something went wrong");
    }
}

async function createEmployee(employeeObject) {

    try {
        const params = {
            TableName: TABLE_NAME,
            Item: {
                employee_id: employeeObject.employee_id,
                username: employeeObject.username,
                password: employeeObject.password,
                role: employeeObject.role
            }
        };

        const response = await documentClient.send(new PutCommand(params));
        return response;
    } catch (error) {
        console.log(`something went wrong with createEmployee`);
        throw new Error("something went wrong");
    }
}

module.exports = { getEmployeeByUsername, createEmployee };