const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "posts"

exports.handler = async (event) => {
    let response = await updatePost(JSON.parse(event.body));
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


async function updatePost(requestBody){
    await findPostAndReduceTag(requestBody.postID)
    await updateTag(requestBody.tag)
    const params = {
        TableName : dynamoDBTableName,
        Key: {
            postID: requestBody.postID
        },
        UpdateExpression: `set #contact = :contact, #title = :title,
        #description = :description, #tag = :tag, #privacy = :privacy,
        #userPermission = :userPermission`,
        ExpressionAttributeNames: {
            "#contact": "contact",
            "#title": "title",
            "#description": "description",
            "#tag": "tag",
            "#privacy": "privacy",
            "#userPermission": "userPermission"
        },
        ExpressionAttributeValues: {
            ":contact": requestBody.contact,
            ":title": requestBody.title,
            ":description": requestBody.description,
            ":tag": requestBody.tag,
            ":privacy": requestBody.privacy,
            ":userPermission": requestBody.userPermission
        }
    }
    try {
        const post = await docClient.update(params).promise()
        const body = {
            status: "Update post success"
        }
        return buildResponse(200, body)
    } catch (err) {
        return err
    }
}


async function findPostAndReduceTag(id){
    const findPostParams = {
        TableName: dynamoDBTableName,
        Key: {
            postID: id
        }
    }
    try {
        const post = await docClient.get(findPostParams).promise()
        await reduceCountTag(post.Item.tag)
    } catch (err){
        console.log(err)
    }
}

async function reduceCountTag(tagArr){
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

async function updateTag(tagArr){
    for(const itemTag of tagArr){
        const findTagParams = {
            TableName : 'tags',
            Key:{
                tagID: itemTag
            },
        }
        const exists = await docClient.get(findTagParams).promise()
        if(!exists.Item){
            const newTagObj = {
                tagID: itemTag,
                count: 1
            }
            const createTagParams = {
                TableName : 'tags',
                Item: newTagObj
            }
            try{
                await docClient.put(createTagParams).promise()
            } catch (err){
                console.log(err)
            }
        } else {
            exists.Item.count += 1
            const addCountParams = {
                TableName : 'tags',
                Item: exists.Item
            }
            try {
                await docClient.put(addCountParams).promise()
            } catch (err){
                console.log(err)
            }
            
        }
    }
}

// {
//     "contact": "",
//     "description": "",
//     "postID": "c9a0d622-1ed6-8626-46ed-f19a11b9a463",
//     "privacy": "public",
//     "tag": Array [],
//     "title": "Jeff Test Edit",
//     "userPermission": Array [],
// }