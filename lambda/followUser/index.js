const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "user"

exports.handler = async (event) => {
    let response = await followUser(JSON.parse(event.body));
    // let response = await followUser({
    //     "authId": "5c14f09e-44fb-46d1-95cb-f43ddf39e07a",
    //     "followEmail": "62070096@it.kmitl.ac.th"
    // });
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

async function followUser(requestBody){
    
    try{
        // Get user who want to follow and get user
        const user = await docClient.scan(getUserParamsByAuth(requestBody.authId)).promise()
        const followUser = await docClient.scan(getUserParams(requestBody.followEmail)).promise()
        
        // Check have user in DB
        if (user.Count !== 0 || followUser.Count !== 0){
            
            // Check follow duplicate user
            let followingArray = [...user.Items[0].following]
            if (followingArray.includes(requestBody.followEmail)) {
                return buildResponse(403, "Duplicate follow user")
            } else {
                followingArray.push(requestBody.followEmail)
            }
            
            // Check followed by duplicate user
            let followerArray = [...followUser.Items[0].follower]
            if (followerArray.includes(user.Items[0].email)) {
                return buildResponse(403, "Duplicate followed user")
            } else {
                followerArray.push(user.Items[0].email)
            }
            
            await docClient.update(updateFollowingParams(user.Items[0].userId, followingArray)).promise()
            await docClient.update(updateFollowerParams(followUser.Items[0].userId, followerArray)).promise()
            
            return buildResponse(200, "Follow Complete")
        } else {
            return buildResponse(403, "User Not Found")
        }
    } catch (err){
        return buildResponse(403, err)
    }
}

const getUserParamsByAuth = (authId) => {
    return {
        TableName: dynamoDBTableName,
        FilterExpression:
          "attribute_not_exists(deletedAt) AND contains(authId, :authId)",
        ExpressionAttributeValues: {
          ":authId": authId
        }
    }
}

const getUserParams = (email) => {
    return {
        TableName: dynamoDBTableName,
        FilterExpression:
          "attribute_not_exists(deletedAt) AND contains(email, :email)",
        ExpressionAttributeValues: {
          ":email": email
        }
    }
}

const updateFollowingParams = (userId, following) => {
    return {
        TableName: dynamoDBTableName,
        Key: {
            "userId": userId
        },
        UpdateExpression: "set following = :f",
        ExpressionAttributeValues: {
            ":f": following
        },
    }
}

const updateFollowerParams = (userId, follower) => {
    return {
        TableName: dynamoDBTableName,
        Key: {
            "userId": userId
        },
        UpdateExpression: "set follower = :f",
        ExpressionAttributeValues: {
            ":f": follower
        },
    }
}

// {
//     "authId": "5c14f09e-44fb-46d1-95cb-f43ddf39e07a",
//     "followEmail": "62070096@it.kmitl.ac.th"
// }