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
    const post = await docClient.get(postParams).promise()
    const user = await findUser(requestBody.authId)
    const newComment = {
        commentId: genId(),
        userImage: user.image,
        userName: user.firstname + " " + user.lastname,
        userEmail: user.email,
        createDate: Date.now(),
        comment: requestBody.comment
    }
    post.Item.comment.push(newComment)
    const updateCommentParams = {
        TableName: dynamoDBTableName,
        Item: post.Item
    }
    await docClient.put(updateCommentParams).promise()
    return buildResponse(200, newComment)
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

function genId(){
    //generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    return(guid())
}