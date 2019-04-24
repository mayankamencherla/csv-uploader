const {createJWT, decodeJWT} = require('../helpers');

async function setUserInRequest(req) {
    var token = req.header('x-auth');

    if (token === undefined) {
        var created = await createJWT(1);
        req.header['x-auth'] = created.token;
        req.user = created.user;
    } else {
        req.user = decodeJWT(token);
    }
}

module.exports = {
    setUserInRequest
}