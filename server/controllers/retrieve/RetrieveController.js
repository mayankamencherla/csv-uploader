const {validateQueryInput, getFileUrl} = require('../../helpers');
const axios = require('axios');
const fs = require('fs');
const json2csv = require('json2csv').parse;
const rimraf = require('rimraf');
const util = require('util');
require('util.promisify').shim();

const writeFile = util.promisify(fs.writeFile);

module.exports.controller = (app) => {

    /**
     * Retrieves an entity based on input parameters
     */
    app.get('/query', async (req, res, next) => {
        if (!validateQueryInput(req.query)) {
            res.json({
                "Success": false,
                "message": "file_id need to be passed in the query params"
            });

            return;
        }

        // const sendFile = util.promisify(res.sendFile);

        console.log(`Request to retrieve ${req.query.file_id}`);

        const id = req.query.file_id;

        const url = getFileUrl(id);

        const file = await axios.get(url);

        const path = __dirname + `/tmp/${id}.csv`;

        if (!fs.existsSync(__dirname + '/tmp')) {
            fs.mkdirSync(__dirname + '/tmp');
        }

        const csv = json2csv(file.data, {
            fields: Object.keys(file.data[0]),
            quote: ''
        });

        await writeFile(path, csv);

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
