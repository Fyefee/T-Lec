const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const postTable = "posts"

exports.handler = async (event) => {
    let response = await getDetailPost(event.queryStringParameters);
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


async function getDetailPost(requestBody){
    const postParams = {
        TableName: postTable,
        Key: {
            postID: requestBody.postID
        }
    }
    const post = await docClient.get(postParams).promise()
    const ownerDetail = await getOwnerDetail(post.Item.owner)
    const userRating = await findUserRating(requestBody.authId, post.Item.rating)
    const response = {
        "postID": post.Item.postID,
        "title": post.Item.title,
        "contact": post.Item.contact,
        "description": post.Item.description,
        "permission": post.Item.userPermission,
        "privacy": post.Item.privacy,
        "tag": post.Item.tag,
        "rating": post.Item.ratingAvg,
        "comment": post.Item.comment,
        "ownerName": ownerDetail.firstname + " " + ownerDetail.lastname,
        "ownerEmail": ownerDetail.email,
        "ownerImage": ownerDetail.image,
        "downloadCount": post.Item.downloadFromUser.length,
        "userRating": userRating
    }
    return buildResponse(200, response)
}

async function getOwnerDetail(email){
    const ownerDetailParams = {
        TableName: "user",
        FilterExpression:
          "contains(email, :email)",
        ExpressionAttributeValues: {
          ":email": email
        }
    }
    const ownerDetail = await docClient.scan(ownerDetailParams).promise()
    return ownerDetail.Items[0]
}

async function findUserRating(authId, ratingArr){
    const userDetailParams = {
        TableName : "user",
        FilterExpression: "contains(authId, :authId)",
        ExpressionAttributeValues: {
            ":authId": authId
        }
    }
    const userDetail = await docClient.scan(userDetailParams).promise()
    for(const item of ratingArr){
        if(userDetail.Items[0].email === item.email){
            return item.rating
        } else{
            return 0
        }
    }
    return 0
}

