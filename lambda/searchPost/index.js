const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "posts"

exports.handler = async (event) => {
    let response = await searchPost(event.queryStringParameters)
    return response;
};

async function searchPost(requestParams){
    const searchPostParams = {
        TableName: dynamoDBTableName,
        FilterExpression: "contains (#title, :title) or contains (#owner, :owner) or contains(#tag, :tag)",
        ExpressionAttributeNames:{
            "#title": "title",
            "#owner": "owner",
            "#tag": "tag"
        },
        ExpressionAttributeValues:{
            ":title": requestParams.word,
            ":owner": requestParams.word,
            ":tag": requestParams.word
        }
    }
    const post = await docClient.scan(searchPostParams).promise()
    return buildResponse(200, post)
}

function buildResponse(statusCode, body){
    return{
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    }
}
