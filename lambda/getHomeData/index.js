const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBUserTableName = "user"
const dynamoDBPostTableName = "posts"

exports.handler = async (event) => {
    let response = await getHomeData(event.queryStringParameters);
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


async function getHomeData(requestBody){
    
    const params = {
        TableName : dynamoDBPostTableName
    }
    
    try {
        // Get All Post And Sort
        const allPosts = await docClient.scan(params).promise()
        let postArray = [...allPosts.Items]
        postArray.sort(sortDate)
        
        const user = await docClient.scan(getUserParamsByAuth(requestBody.authId)).promise()
        if (user.Count == 0) {
            return buildResponse(403, "Auth Fail!!")
        }
        
        const newLec = await formatNewLec(postArray)
        const recentView = await getPostsFromId(user.Items[0].recentView)
        
        const body = {
            recentView: recentView,
            newLec: newLec,
            notification: []
        }
        return buildResponse(200, body)
    } catch (err) {
        return buildResponse(403, err)
    }
}

function sortDate(post1, post2){
    return new Date(post2.createDate) - new Date( post1.createDate);
}

async function formatNewLec(postArray){
    let formatPostArray = []
    for (let i = 0; i < postArray.length; i++){
        if (i >= 5) {
            return formatPostArray
        }
        try {
            const owner = await docClient.scan(getUserParamsByEmail(postArray[i].owner)).promise()
            formatPostArray.push({
                postID: postArray[i].postID,
                title: postArray[i].title,
                photoUrl: owner.Items[0].image,
                lecTag: postArray[i].tag,
                lecDescription: postArray[i].description,
                lecRating: postArray[i].ratingAvg,
                createdDate: postArray[i].createDate,
                owner: postArray[i].owner
            })
        } catch(e) {
            console.log("Not Found User")
        }
    }
    return formatPostArray
}

async function getPostsFromId(postIdArray){
    let formatPostArray = []
    for (let i = 0; i < postIdArray.length; i++){
        try {
            const post = await docClient.get(getPostByIdParam(postIdArray[i])).promise()
            const owner = await docClient.scan(getUserParamsByEmail(post.Item.owner)).promise()
            formatPostArray.push({
                postID: post.Item.postID,
                title: post.Item.title,
                photoUrl: owner.Items[0].image,
                lecTag: post.Item.tag,
                lecDescription: post.Item.description,
                lecRating: post.Item.ratingAvg,
                owner: post.Item.owner
            })
        } catch(e) {
            console.log("Not Found Post")
        }
    }
    return formatPostArray
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
