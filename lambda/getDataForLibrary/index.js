const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBUserTableName = "user"
const dynamoDBPostTableName = "posts"

exports.handler = async (event) => {
    let response = await getLibraryData(event.queryStringParameters);
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


async function getLibraryData(requestBody){
    
    const params = {
        TableName : dynamoDBPostTableName
    }
    
    try {
        const user = await docClient.scan(getUserParamsByEmail(requestBody.email)).promise()
        if (user.Count == 0) {
            return buildResponse(403, "Not Have This User!!")
        }
        
        const lectureFromOwner = await docClient.scan(getPostByOwnerParam(requestBody.email)).promise()
        let formatLec = []
        
        let rating = 0
        let haveRatingCount = 0
        
        let postCount = lectureFromOwner.Count;
        let followerCount = user.Items[0].follower.length;
        let followingCount = user.Items[0].following.length;
        
        if (lectureFromOwner) {
            for (let i = 0; i < lectureFromOwner.Count; i++){
                rating += lectureFromOwner.Items[i].ratingAvg
                
                if (lectureFromOwner.Items[i].ratingAvg > 0){
                    haveRatingCount += 1
                }
                
                let lecFormatData = {
                    postID: lectureFromOwner.Items[i].postID,
                    title: lectureFromOwner.Items[i].title,
                    privacy: lectureFromOwner.Items[i].privacy
                }
                formatLec.push(lecFormatData)
            }
        }
        
        if (haveRatingCount === 0){
            rating = null
        } else {
            rating /= haveRatingCount
        }
        
        const isFollow = user.Items[0].follower.includes(requestBody.userEmail)
        
        const data = {
            userFirstName: user.Items[0].firstname,
            userLastName: user.Items[0].lastname,
            userImage: user.Items[0].image,
            userEmail: user.Items[0].email,
            rating: rating,
            postCount: postCount,
            userFollower: followerCount,
            userFollowing: followingCount,
            userLecture: formatLec,
            isFollow: isFollow,
            notification: user.Items[0].notification
        }
        
        return buildResponse(200, data)
    } catch (err) {
        return buildResponse(403, err)
    }
}

function sortDate(post1, post2){
    return new Date(post2.createDate) - new Date( post1.createDate);
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

const getPostByOwnerParam = (owner) => {
    return {
        TableName: dynamoDBPostTableName,
        FilterExpression:
            "attribute_not_exists(deletedAt) AND #email = :o",
        ExpressionAttributeValues: {
            ":o": owner
        },
        ExpressionAttributeNames: {
            "#email": "owner"
        }
    }
}
