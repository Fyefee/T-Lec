const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "posts"

exports.handler = async (event) => {
    let response = await getPosts();
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


async function getPosts(){
    const params = {
        TableName : dynamoDBTableName
    }
    try {
        const allPosts = await docClient.scan(params).promise()
        const body = {
            posts: allPosts.Items
        }
        return buildResponse(200, body)
    } catch (err) {
        return err
    }
}

