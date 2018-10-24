module.exports = function() {

    // Imports
    const express = require('express');
    const bodyParser = require('body-parser')
    const core = require(ArcheryServiceCorePath);
    const SecurityTokenManager = require(SecurityTokenManagerPath);
    const SecurityServiceValidator = require(SecurityServiceValidatorPath);

    // Instantiations
    const token = new SecurityTokenManager();
    const validator = new SecurityServiceValidator();
    const router = express.Router();

    router.use(bodyParser.json());         // to support JSON-encoded bodies
    router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // Routes
    router.get('/session/add', function(req, res) {
        const sJwt = validator.validateToken(req.headers.authorization);
        token.verifyToken(sJwt, "com.etauker.archery.Archer")
            .then(core.getNewSessionOptions)
            .then(oNewSessionOptions => res.status(200).send(oNewSessionOptions))
            .catch(core.sendErrorToClient.bind(this, res))
    });

    return router;
}
