const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "tags"

exports.handler = async (event) => {
    let response = await getTag(event.pathParameters.id);
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


async function getTag(id){
    const params = {
        TableName : dynamoDBTableName,
        Key: {
            tagID: id
        }
    }
    try {
        const tag = await docClient.get(params).promise()
        const body = tag.Item
        return buildResponse(200, body)
    } catch (err) {
        return err
    }
}

