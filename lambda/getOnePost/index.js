const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "posts"

exports.handler = async (event) => {
    let response = await getPost(event.pathParameters.id);
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


async function getPost(id){
    const params = {
        TableName : dynamoDBTableName,
        Key: {
            postID: id
        }
    }
    try {
        const post = await docClient.get(params).promise()
        const body = post.Item
        return buildResponse(200, body)
    } catch (err) {
        return err
    }
}

