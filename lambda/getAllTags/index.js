const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "tags"

exports.handler = async (event) => {
    let response = await getTags();
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


async function getTags(){
    const params = {
        TableName : dynamoDBTableName
    }
    try {
        const allTags = await docClient.scan(params).promise()
        const body = {
            tags: allTags.Items
        }
        return buildResponse(200, body)
    } catch (err) {
        return err
    }
}