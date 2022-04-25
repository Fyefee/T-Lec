const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "tags"

exports.handler = async (event) => {
    let response = await deleteTag(event.pathParameters.id);
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

async function deleteTag(id){
    const params = {
        TableName: dynamoDBTableName,
        Key: {
            tagID: id,
        },
    }
    try{
        await docClient.delete(params).promise()
        const body = {
            status: "Delete tag success"
        }
        return buildResponse(200, body)
    } catch (err){
        return "Not found tag."
    }
}
