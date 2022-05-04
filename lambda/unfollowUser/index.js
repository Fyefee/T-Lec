const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "user"

exports.handler = async (event) => {
    let response = await unfollowUser(JSON.parse(event.body));
    // let response = await unfollowUser({
    //     "authId": "5c14f09e-44fb-46d1-95cb-f43ddf39e07a",
    //     "unfollowEmail": "62070096@it.kmitl.ac.th"
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

async function unfollowUser(requestBody){
    
    try{
        // Get user who want to unfollow and get user
        const user = await docClient.scan(getUserParamsByAuth(requestBody.authId)).promise()
        const unfollowUser = await docClient.scan(getUserParams(requestBody.unfollowEmail)).promise()
        
        // Check have user in DB
        if (user.Count !== 0 || unfollowUser.Count !== 0){
            
            // Check follow user
            let followingArray = [...user.Items[0].following]
            if (!followingArray.includes(requestBody.unfollowEmail)) {
                return buildResponse(403, "Not Follow This User!!")
            } else {
                const followIndex = followingArray.indexOf(requestBody.unfollowEmail)
                followingArray.splice(followIndex, 1)
            }
            
            // Check followed by user
            let followerArray = [...unfollowUser.Items[0].follower]
            if (!followerArray.includes(user.Items[0].email)) {
                return buildResponse(403, "Not Follow By This User!!")
            } else {
                const followerIndex = followerArray.indexOf(user.Items[0].email)
                followerArray.splice(followerIndex, 1)
            }
            
            await docClient.update(updateFollowingParams(user.Items[0].userId, followingArray)).promise()
            await docClient.update(updateFollowerParams(unfollowUser.Items[0].userId, followerArray)).promise()
            
            return buildResponse(200, "Unfollow Complete")
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
//     "unfollowEmail": "62070096@it.kmitl.ac.th"
// }