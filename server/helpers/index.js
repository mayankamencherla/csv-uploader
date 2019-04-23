const AWS = require('aws-sdk');
const csv = require('csvtojson');
const axios = require('axios');
const FormData = require('form-data');

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  signatureVersion: 'v4',
  region: 'us-east-2'
});

function validateCsvInput(request) {
    if (request.files === null || request.files === undefined) return false;

    else if (!request.files.hasOwnProperty('file')) return false;

    return true;
}

function validateQueryInput(query) {
    if (!query.hasOwnProperty('file_id')) return false;
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

function getFileUrl(id) {
    const url = s3.getSignedUrl('getObject', {Bucket : 'csv-bucket-2401', Key : id});
    return url;
}

module.exports = {uploadFileToS3, validateCsvInput, validateQueryInput, getFileUrl}