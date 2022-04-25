const AWS = require('aws-sdk')
const s3 = new AWS.S3()
exports.handler = async (event) => {
    const result = await getUploadUrl(JSON.parse(event.body))
    return result
};

const getUploadUrl = async function(requestBody){
    const randomId = parseInt(Math.random()*10000000000)
    const filename = requestBody.name
    const params = {
        Bucket: "pdf-bucket-tlec",
        Key: filename + "-" + randomId + ".pdf",
        ContentType: "application/pdf",
    }
    const url = await s3.getSignedUrlPromise('putObject', params)
    const body = {
        url: url,
        Key: filename + "-" + randomId + ".pdf"
    }
    return buildResponse(200, body)
}

function buildResponse(statusCode, body){
    return{
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    }
}


// {
//     name: "test"
// }