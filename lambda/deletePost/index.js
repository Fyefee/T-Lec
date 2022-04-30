const AWS = require('aws-sdk');
const s3 = new AWS.S3()
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "posts"

exports.handler = async (event) => {
    let response = await deletePost(event.pathParameters.id);
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
    const post = await getPost(params)
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
