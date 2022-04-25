const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "posts"

exports.handler = async (event) => {
    let response = await deletePost(event.pathParameters.id); // sent id with path
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

async function deletePost(id){
    const params = {
        TableName: dynamoDBTableName,
        Key: {
            postID: id,
        },
    }
    const tagArr = await getPostForTagArr(params)
    await deleteTag(tagArr)
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

async function getPostForTagArr(params){
    const tagArr = await docClient.get(params).promise()
    return tagArr.Item.tag
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
