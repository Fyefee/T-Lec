const AWS = require('aws-sdk');
const { v4: uuidv4 } = require("uuid");
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "user"

exports.handler = async (event) => {
    let response = await login(JSON.parse(event.body));
    // let response = await login({
    //     "givenName": "Jeffy",
    //     "familyName": "Chawin",
    //     "photoUrl": "",
    //     "email": "62070045@it.kmitl.ac.th"
    // });
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

async function login(requestBody){
    
    if (!checkEmail(requestBody.email.substring(requestBody.email.length - 14, requestBody.email.length))) {
        return buildResponse(200, "wrong domain")
    }
    
    const findByEmailparams = {
        TableName: dynamoDBTableName,
        FilterExpression:
          "attribute_not_exists(deletedAt) AND contains(email, :email)",
        ExpressionAttributeValues: {
          ":email": requestBody.email,
        },
    }
    
    try{
        const userByEmail = await docClient.scan(findByEmailparams).promise()
        if (userByEmail.Count !== 0){
            // Login and get data
            const newAuthId = uuidv4()
            const updateUserData = await docClient.update(updateDataParams(userByEmail.Items[0].userId, requestBody, newAuthId)).promise()
            return buildResponse(200, updateUserData.Attributes)
        } else {
            // Register and get data
            let role = "user"
            if (requestBody.adminPassword === "TLecAdmin349") {
                role = "admin"
            }
            
            const userId = uuidv4()
            const authId = uuidv4()
            
            const userData = {
                userId: userId,
                firstname: requestBody.givenName,
                lastname: requestBody.familyName,
                image: requestBody.photoUrl,
                email: requestBody.email,
                role: role,
                authId: authId,
                following: [],
                follower: [],
                post: [],
                recentView: [],
                notification: []
            }
            
            const createUserparams = {
                TableName: dynamoDBTableName,
                Item: userData
            }
            await docClient.put(createUserparams).promise()
            
            const findByAuthparams = getAuthParams(authId)
            const userByAuth = await docClient.scan(findByAuthparams).promise()
            
            return buildResponse(200, userByAuth.Items[0])
        }
    } catch (err){
        return buildResponse(403, err)
    }
}

const checkEmail = (domain) => {
    return domain == "it.kmitl.ac.th"
}

const getAuthParams = (authId) => {
    return {
        ProjectionExpression: "firstname, lastname, image, email, authId",
        TableName: dynamoDBTableName,
        FilterExpression:
            "attribute_not_exists(deletedAt) AND contains(authId, :authId)",
        ExpressionAttributeValues: {
            ":authId": authId,
        }
    }
}

const updateDataParams = (userId, payload, authId) => {
    return {
        TableName: dynamoDBTableName,
        Key: {
            "userId": userId
        },
        UpdateExpression: "set firstname = :f, lastname = :l, image = :i, email = :e, authId = :a",
        ExpressionAttributeValues: {
            ":f": payload.givenName,
            ":l": payload.familyName,
            ":i": payload.photoUrl,
            ":e": payload.email,
            ":a": authId
        },
        ReturnValues: "UPDATED_NEW"
    }
}