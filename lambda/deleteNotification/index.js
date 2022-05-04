const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = "user"

exports.handler = async (event) => {
    let response = await deleteNotification(JSON.parse(event.body));
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

async function deleteNotification(requestBody){
    try {
        const user = await docClient.scan(getUserParamsByAuth(requestBody.authId)).promise()
        if (user.Count === 0){
            return buildResponse(403, "Auth Not Pass")
        }
        
        let oldNotificationArray = [...user.Items[0].notification]
        for (let i = 0; i < oldNotificationArray.length; i++){
            if (oldNotificationArray[i].lectureTitle === requestBody.notification.lectureTitle){
                oldNotificationArray.splice(i, 1)
            }
        }
        await docClient.update(updateDataParams(user.Items[0].userId, oldNotificationArray)).promise()
        
        return buildResponse(200, "Delete Notification Complete" )
    } catch (err) {
        return buildResponse(403, err)
    }
}

const updateDataParams = (userId, notification) => {
    return {
        TableName: 'user',
        Key: {
            "userId": userId
        },
        UpdateExpression: "set notification = :n",
        ExpressionAttributeValues: {
            ":n": notification
        },
        ReturnValues: "UPDATED_NEW"
    }
}

const getUserParamsByAuth = (authId) => {
    return {
        TableName: dynamoDBTableName,
        FilterExpression:
          "attribute_not_exists(deletedAt) AND contains(authId, :authId)",
        ExpressionAttributeValues: {
          ":authId": authId
        }
    }
}

// {
//     "authId": "a23b6254-3556-45a3-9aba-90012f920932",
//     "notification": {
//         "ownerName": "test create post and tags",
//         "lectureTitle": "นายธีรภัทร์ บุญช่วยแล้ว"
//     }
// }