const {validateQueryInput, getFileUrl} = require('../../helpers');
const axios = require('axios');
const fs = require('fs');
const rimraf = require('rimraf');
const util = require('util');
require('util.promisify').shim();
const {authenticate} = require('../../middleware');

const writeFile = util.promisify(fs.writeFile);

module.exports.controller = (app) => {

    /**
     * Retrieves an entity based on input parameters
     */
    app.get('/query', async (req, res, next) => {
        if (!validateQueryInput(req.query)) {
            return res.json({
                "Success": false,
                "message": "file_id need to be passed in the query params"
            });
        }

        try {
            await authenticate(req, res, next);
        } catch (e) {
            return res.json({
                "Success": false,
                "message": "Unable to authenticate the user: " + e
            })
        }

        console.log(`Request to retrieve ${req.query.file_id}`);

        const id = req.query.file_id;

        const url = getFileUrl(id);

        let file;

        try {
            file = await axios.get(url);
        } catch (e) {
            return res.json({
                "Success": false,
                "message": "Unable to download file from s3 " + e
            });
        }


        const path = __dirname + `/tmp/${id}.csv`;

        if (!fs.existsSync(__dirname + '/tmp')) {
            fs.mkdirSync(__dirname + '/tmp');
        }

        let csv = file.data.split('|').join("\n");

        try {
            await writeFile(path, csv);
        } catch (e) {
            return res.json({
                "Success": false,
                "message": "Unable to write to csv file " + e
            });
        }

        console.log('Wrote to file');

        res.sendFile(path, (err) => {
            if (err) console.log("Unable to send file to user" + err);
            else {
                console.log("File successfully sent");
                rimraf.sync(__dirname + '/tmp');
            }
        });
    });
};
