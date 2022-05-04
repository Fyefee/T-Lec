const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBUserTableName = "user"
const dynamoDBPostTableName = "posts"

exports.handler = async (event) => {
    let response = await getRanking();
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


async function getRanking(){
    
    const params = {
        TableName : dynamoDBPostTableName
    }
    
    try {
        // Get All Post And Sort
        const allPosts = await docClient.scan(params).promise()
        let postArray = [...allPosts.Items]
        postArray.sort(sortRank)
        
        let formatData = []
        for (let i = 0; i < postArray.length; i++){
            const owner = await docClient.scan(getUserParamsByEmail(postArray[i].owner)).promise()
            const data = {
                title: postArray[i].title,
                owner: postArray[i].owner,
                ownerImage: owner.Items[0].image
            }
            formatData.push(data)
        }
        
        return buildResponse(200, formatData)
    } catch (err) {
        return buildResponse(403, err)
    }
}

function sortRank(post1, post2){
    let pointPost1 = 0
    if (post1.ratingAvg !== 0) {
        pointPost1 = post1.ratingAvg * post1.viewPost
    } else {
        pointPost1 = post1.viewPost
    }
    
    let pointPost2 = 0
    if (post2.ratingAvg !== 0) {
        pointPost2 = post2.ratingAvg * post2.viewPost
    } else {
        pointPost2 = post2.viewPost
    }
    return pointPost2 - pointPost1;
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
