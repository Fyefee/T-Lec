const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "user"

exports.handler = async (event) => {
    let response = await getUsers();
    return response
};


function buildResponse(statusCode, body){
    return{
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    }
}

async function getUsers(){
    const params = {
        TableName: dynamoDBTableName,
        Select: "ALL_ATTRIBUTES"
    }
    try{
        const data = await docClient.scan(params).promise()
        return buildResponse(200, data)
    } catch (err){
        return buildResponse(403, err)
    }
}