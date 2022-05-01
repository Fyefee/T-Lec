const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBUserTableName = "user"
const dynamoDBPostTableName = "posts"

exports.handler = async (event) => {
    let response = await getLectureData(event.queryStringParameters);
    // let response = buildResponse(200, event.queryStringParameters)
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


async function getLectureData(requestBody){
    
    try {
        // Get All Post And Sort
        const post = await docClient.get(getPostByIdParam(requestBody.postID)).promise()
        
        const user = await docClient.scan(getUserParamsByAuth(requestBody.authId)).promise()
        if (user.Count === 0){
            return buildResponse(403, "Auth Not Pass")
        }
        let recentView = [...user.Items[0].recentView];
        if (recentView.length >= 5) {
            recentView.splice(0, 1);
        }
        if (!recentView.includes(requestBody.postID)) {
            recentView.push(requestBody.postID);
            await docClient.update(updateUserDataParams(user.Items[0].userId, recentView)).promise()
        }
        
        let userRating = 0;
        if (post.Item.rating.length > 0){
            post.Item.rating.forEach((value, key) => {
                if (value.email == user.email) {
                    userRating = value.rating;
                }
            })
        }
        
        const owner = await docClient.scan(getUserParamsByEmail(post.Item.owner)).promise()
        if (owner.Count === 0){
            return buildResponse(403, "Not Found Owner")
        }
        
        const data = {
            postID: requestBody.postID,
            title: post.Item.title,
            contact: post.Item.contact,
            description: post.Item.description,
            permission: post.Item.userPermission,
            privacy: post.Item.privacy,
            tag: post.Item.tag,
            rating: post.Item.ratingAvg,
            comment: post.Item.comment,
            ownerName: owner.Items[0].firstname + " " + owner.Items[0].lastname,
            ownerEmail: owner.Items[0].email,
            ownerImage: owner.Items[0].image,
            downloadCount: post.Item.downloadFromUser.length,
            userRating: userRating
        }
        
        return buildResponse(200, data)
    } catch (err) {
        return buildResponse(403, err)
    }
}

const getUserParamsByAuth = (authId) => {
    return {
        TableName: dynamoDBUserTableName,
        FilterExpression:
          "attribute_not_exists(deletedAt) AND contains(authId, :authId)",
        ExpressionAttributeValues: {
          ":authId": authId
        }
    }
}

const getUserParamsByEmail = (email) => {
    return {
        TableName: dynamoDBUserTableName,
        FilterExpression:
          "attribute_not_exists(deletedAt) AND contains(email, :email)",
        ExpressionAttributeValues: {
          ":email": email
        }
    }
}

const getPostByIdParam = (postID) => {
    return {
        TableName : dynamoDBPostTableName,
        Key: {
            postID: postID
        }
    }
}

const updateUserDataParams = (userId, recentView) => {
    return {
        TableName: dynamoDBUserTableName,
        Key: {
            "userId": userId
        },
        UpdateExpression: "set recentView = :r",
        ExpressionAttributeValues: {
            ":r": recentView
        },
        ReturnValues: "UPDATED_NEW"
    }
}
