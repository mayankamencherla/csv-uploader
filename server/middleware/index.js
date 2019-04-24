const {createJWT, decodeJWT} = require('../helpers');

async function setUserInRequest(req, res) {
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
    setUserInRequest
}