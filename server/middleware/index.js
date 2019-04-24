const {createJWT, decodeJWT, getFile} = require('../helpers');

async function authenticate(req, res, next) {
    var token = req.header('x-auth');

    if (token === undefined) {
        throw new "x-auth Token not set in the request"
    }

    try {
        req.user = await decodeJWT(token);
    } catch (e) {
        throw e;
    }

    try {
        const file = await getFile(req.query.file_id, req.user._id);
        console.log(file);
        if (file === undefined || file === null) {
            throw new "Unable to find file attached to given user";
        }
    } catch (e) {
        throw e;
    }
}

async function setTokenInResponse(req, res) {
    var token = req.header('x-auth');

    if (token === undefined) {
        var created = await createJWT(1);
        res.setHeader('x-auth', created.token);
        req.user = created.user;
        return;
    }

    try {
        req.user = await decodeJWT(token);
    } catch (e) {
        throw e;
    }

    res.setHeader('x-auth', req.header('x-auth'));
}

module.exports = {
    setTokenInResponse,
    authenticate
}