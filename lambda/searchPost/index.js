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
    const formatPostArray = await formatPost(post.Items)
    return buildResponse(200, formatPostArray)
}

async function formatPost (postArray){
    let formatPostArray = []
    for (let i = 0; i < postArray.length; i++){
        const owner = await docClient.scan(getUserParamsByEmail(postArray[i].owner)).promise()
        let lecData = {
            title: postArray[i].title,
            ownerName: owner.Items[0].firstname + " " + owner.Items[0].lastname,
            ownerEmail: postArray[i].owner,
            tag: postArray[i].tag,
            photoUrl: owner.Items[0].image
        }
        formatPostArray.push(lecData)
    }
    return formatPostArray
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

const getUserParamsByEmail = (email) => {
    return {
        TableName: 'user',
        FilterExpression:
          "attribute_not_exists(deletedAt) AND contains(email, :email)",
        ExpressionAttributeValues: {
          ":email": email
        }
    }
}
