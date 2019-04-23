const AWS = require('aws-sdk');
const csv = require('csvtojson');
const axios = require('axios');

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey
});

function validateCsvInput(request) {
    if (request.files === null) return false;

    else if (!request.files.hasOwnProperty('file')) return false;

    return true;
}

async function uploadFileToS3(file, key, success, failure) {
    const data = JSON.stringify(await csv().fromFile(file));

    s3.putObject({
        Bucket: 'csv-bucket-2401',
        Key: key,
        Body: data
    }, (err, data) => {
        if (err) failure()
        else success()
    });
}

module.exports = {uploadFileToS3, validateCsvInput}