const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "posts"

exports.handler = async (event) => {
    let response = await updateComment(JSON.parse(event.body))
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


async function updateComment(requestBody){
    const postParams = {
        TableName: dynamoDBTableName,
        Key:{
            postID: requestBody.postID
        }
    }
    let post = await docClient.get(postParams).promise()
    const user = await findUser(requestBody.authId)
    const index = findCommentDelete(post.Item.comment, requestBody.commentId, user.email)
    post.Item.comment.splice(index, 1)
    const updateCommentParams = {
        TableName: dynamoDBTableName,
        Item: post.Item
    }
    await docClient.put(updateCommentParams).promise()
    return buildResponse(200, "Delete comment")
}

async function findUser(authId){
    const userParams = {
        TableName: 'user',
        FilterExpression: "contains(authId, :authId)",
        ExpressionAttributeValues: {
            ":authId": authId
        }
    }
    const user = await docClient.scan(userParams).promise()
    return user.Items[0]
}


function findCommentDelete(commentArr, comentId, email){
    for(let i = 0 ; i < commentArr.length ; i ++){
        if(commentArr[i].commentId === comentId && commentArr[i].userEmail === email){
            return i
        }
    }
}