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

    else if (request.files.file.mimetype !== 'text/csv') return false;

    return true;
}

function validateQueryInput(query) {
    if (!query.hasOwnProperty('file_id')) return false;
    return true;
}

function getNullColumns(row) {
    var nulls = 0;
    while (row) {
        var ind = row.indexOf(',,');
        if (ind == -1) break;
        row = row.substring(ind+1);
        nulls++;
    }
    return nulls;
}

async function uploadFileToS3(file, key, success, failure, headersSent) {
    let data = '';

    let headers = 0;

    // Streaming to avoid loading entire csv in memory
    await csv({noheader:true, output: "line"}).fromFile(file).subscribe(
        function (row) {
            var columns = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).length;
            columns += getNullColumns(row);
            headers = (data.length > 0) ? headers : columns;
            if (headers !== columns) {
                console.log(headers, columns, row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).length);
                return failure('The number of columns in the row is not the same as the ' +
                    'number of columns in the header');
            }
            data += (data.length > 0) ? '|' + row : row;
        });

    if (headersSent()) return;

    s3.putObject({
        Bucket: 'csv-bucket-2401',
        Key: key,
        Body: data
    }, (err, data) => {
        if (err) failure(err)
        else success()
    });
}

function getFileUrl(id) {
    const url = s3.getSignedUrl('getObject', {Bucket : 'csv-bucket-2401', Key : id});
    return url;
}

module.exports = {uploadFileToS3, validateCsvInput, validateQueryInput, getFileUrl}