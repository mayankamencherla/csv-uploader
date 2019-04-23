const csv = require('csvtojson');
const {uploadFileToS3, validateCsvInput} = require('../../helpers');

module.exports.controller = (app) => {

    /**
     * Takes in the file input and saves the data in the DB
     */
    app.post('/csv', async (req, res, next) => {
        if (!validateCsvInput(req)) {
            res.json({
                "Success": false,
                "message": "File needs to be updloaded via the file parameter in the request"
            });

            return;
        }

        const path = req.files.file.tempFilePath;

        console.log('Request to add objects to the DB');

        const key = `file_${new Date().getTime()}`;

        function success () {
            console.log('Successfully uploaded the file to s3')
            res.json({"Success": true, "file_name": key});
        }

        function failure () {
            console.log('Did not upload the file to s3')
            res.json({"Success": false, "file_name": key});
        }

        uploadFileToS3(path, key, success, failure);
    });
};
