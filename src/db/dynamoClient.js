const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

const documentClient = DynamoDBDocumentClient.from(client);

const getCommand = new GetCommand({
    TableName: "test_table",
    Key: {
        "test_key": "1"
    }
});


documentClient.send(getCommand)
    .then(data => console.log(data))
    .catch(err => console.log(err));