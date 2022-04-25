const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "tags"

exports.handler = async (event) => {
    let response = await createTag(JSON.parse(event.body));
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

async function createTag(requestBody){
    requestBody.tagID = genId()
    const params = {
        TableName: dynamoDBTableName,
        Item: requestBody
    }
    try{
        await docClient.put(params).promise()
        const body = {
            status: "Create tag success"
        }
        return buildResponse(200, body)
    } catch (err){
        return err
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
