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

    const file = getFile(req.query.file_id, req.user._id);

    if (file === undefined) {
        throw new "Unable to find file attached to given user";
    }
}

async function setTokenInResponse(req, res) {
    var token = req.header('x-auth');

    if (token === undefined) {
        var created = await createJWT(1);
        res.setHeader('x-auth', created.token);
        req.user = created.user;
    } else {
        req.user = decodeJWT(token);
        res.setHeader('x-auth', req.header('x-auth'));
    }
}

module.exports = {
    setTokenInResponse,
    authenticate
}