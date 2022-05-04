const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "posts"

exports.handler = async (event) => {
    let response = await updateRating(JSON.parse(event.body));
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


async function updateRating(requestBody){
    const postParams = {
        TableName: dynamoDBTableName,
        Key:{
            postID: requestBody.postID
        }
    }
    const post = await docClient.get(postParams).promise()
    let existing = false
    for(const item of post.Item.rating){
        if(item.email === requestBody.email){
            item.rating = requestBody.rating
            existing = true
            break;
        }
    }
    if(!existing){
        const newRating = {
            email: requestBody.email,
            rating: requestBody.rating
        }
        post.Item.rating.push(newRating)
    }
    
    post.Item.ratingAvg = calAvgRating(post.Item.rating)
    
    const updateRatingParams = {
        TableName: dynamoDBTableName,
        Item: post.Item,
    }
    await docClient.put(updateRatingParams).promise()
    return buildResponse(200, "update rating complete.")
}

function calAvgRating(ratingArr){
    let ratingAvg = 0
    for(const item of ratingArr){
        ratingAvg += item.rating
    }
    ratingAvg = ratingAvg/ratingArr.length
    return parseInt(ratingAvg.toFixed(0))
}

// {
//     "email": "62070096@it.kmitl.ac.th",
//     "postID": "c9a0d622-1ed6-8626-46ed-f19a11b9a463",
//     "rating": 5
// }
