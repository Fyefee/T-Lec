const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "tags"

exports.handler = async (event) => {
    let response = await getAllTagData();
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

async function getAllTagData(){
    const params = {
        TableName: dynamoDBTableName,
        Select: "ALL_ATTRIBUTES"
    }
    try{
        const data = await docClient.scan(params).promise()
        let formatTags = []
        for (let i = 0; i < data.Count; i++) {
            formatTags.push({
                tagName: data.Items[i].tagID,
                count: data.Items[i].count
            })
        }
        return buildResponse(200, formatTags)
    } catch (err){
        return buildResponse(403, err)
    }
}