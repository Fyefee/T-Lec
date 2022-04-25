const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "posts"

exports.handler = async (event) => {
    let response = await createPost(JSON.parse(event.body));
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

async function createPost(requestBody){
    requestBody.postID = genId()
    requestBody.rating = []
    requestBody.ratingAvg = 0
    requestBody.downloadFromUser = []
    requestBody.comment = []
    requestBody.createDate = Date.now();
    await createTags(requestBody.tag)
    const params = {
        TableName: dynamoDBTableName,
        Item: requestBody
    }
    try{
        await docClient.put(params).promise()
        const body = {
            status: "Create post success"
        }
        return buildResponse(200, body)
    } catch (err){
        return err
    }
}

async function createTags(tagArr){
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

function genId(){
    //generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    return(guid())
}

// {
//     "title": "test create post and tags",
//     "description": "description test",
//     "contact": "no contact",
//     "tag": ["tag1", "tag2"],
//     "privacy": "private",
//     "owner": "TeerapatEarth",
//     "userPermission": [],
//     "fileUrl": "https://pdf-bucket-tlec.s3.amazonaws.com/test-6933926308.pdf"
// }
