const {validateQueryInput, getFileUrl} = require('../../helpers');

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

        console.log(`Request to retrieve ${req.query.file_id}`);

        const id = req.query.file_id;

        const url = getFileUrl(id);

        res.json({"Success": true, "url": url});
    });
};
