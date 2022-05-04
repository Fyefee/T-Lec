const AWS = require('aws-sdk');
const s3 = new AWS.S3()
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "posts"
const dynamoDBUserTableName = "user"

exports.handler = async (event) => {
    let response = await deletePost(JSON.parse(event.body));
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

async function deletePost(requestBody){
    const params = {
        TableName: dynamoDBTableName,
        Key: {
            postID: requestBody.postID,
        },
    }
    
    const user = await docClient.scan(getUserParamsByAuth(requestBody.authId)).promise()
    if (user.Count == 0) {
        return buildResponse(403, "Auth Fail!!")
    }
        
    const post = await getPost(params)
    
    if (user.Items[0].email !== post.owner) {
        return buildResponse(403, "You're NOT Post Owner")
    }
    
    await deleteTag(post.tag)
    await deletePdfFile(post.fileUrl.substring(41))
    try{
        await docClient.delete(params).promise()
        const body = {
            status: "Delete post success"
        }
        return buildResponse(200, body)
    } catch (err){
        return "Not found post."
    }
}

async function getPost(params){
    const post = await docClient.get(params).promise()
    return post.Item
}

async function deleteTag(tagArr){
    for(const itemTag of tagArr){
        const findTagParams = {
            TableName : 'tags',
            Key:{
                tagID: itemTag
            },
        }
        const exists = await docClient.get(findTagParams).promise()
        if(exists.Item.count > 1){
            exists.Item.count -= 1
            const createTagParams = {
                TableName : 'tags',
                Item: exists.Item
            }
            try{
                await docClient.put(createTagParams).promise()
            } catch (err){
                console.log(err)
            }
        } else {
            const deleteTagParams = {
                TableName: 'tags',
                Key : {
                    tagID: itemTag
                }
            }
            try{
                await docClient.delete(deleteTagParams).promise()
            } catch (err){
                console.log(err)
            }
        }
    }
}

async function deletePdfFile(fileName){
    const deleteFileParams = {
        Bucket: "pdf-bucket-tlec",
        Key: fileName
    }
    try {
        await s3.deleteObject(deleteFileParams).promise();
    } catch (err){
        console.log(err)
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

// {
//     "authId": "b136b1fa-f5bc-4922-9ea1-2c1f33be330e",
//     "postID": "c9a0d622-1ed6-8626-46ed-f19a11b9a463"
// }
