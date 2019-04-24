const csv = require('csvtojson');
const {uploadFileToS3, validateCsvInput} = require('../../helpers');

module.exports.controller = (app) => {

    /**
     * Takes in the file input and saves the data in the DB
     */
    app.post('/csv', async (req, res, next) => {
        if (!validateCsvInput(req)) {
            return res.json({
                "Success": false,
                "message": "CSV File needs to be updloaded via the file parameter in the request"
            });
        }

        const path = req.files.file.tempFilePath;

        console.log('Request to add objects to the DB');

        const key = `file_${new Date().getTime()}`;

        uploadFileToS3(path, key,
            function () {
                console.log('Successfully uploaded the file to s3');
                const url = `${req.headers.host}/query?file_id=${key}`;
                res.json({"Success": true, "download": url, "message": "Just paste the download url in the browser to download the file"});
            },
            function (err) {
                console.log('Did not upload the file to s3: ' + err)
                res.json({"Success": false, "message": "Did not upload the file to s3"});
            });
    });
};
