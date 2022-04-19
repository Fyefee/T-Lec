const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "post"
const { v4: uuidv4 } = require("uuid");

exports.handler = async (event) => {
    // let response = await createPost(JSON.parse(event.body));
    let response = await createPost();
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

async function createPost(requestBody){
    // const params = {
    //     TableName: dynamoDBTableName,
    //     Item: requestBody
    // }
    try{
        // await docClient.put(params).promise()
        const body = {
            status: "Create post success",
            uuid: uuidv4()
        }
        return buildResponse(200, body)
    } catch (err){
        return err
    }
}