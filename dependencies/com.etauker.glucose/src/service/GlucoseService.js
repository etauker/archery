module.exports = function() {

    // Imports
    const express = require('express');
    const bodyParser = require('body-parser')
    console.log(GlucoseServiceCorePath);
    const core = require(GlucoseServiceCorePath);
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
    router.get('/transaction/get', function(req, res) {
        console.log("/transaction/get");
        // const sJwt = validator.validateToken(req.headers.authorization);
        // token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
        //     .then(core.getTransactions)
        //     .then(aRecordedTransactions => res.status(200).send(aRecordedTransactions))
        //     .catch(core.sendErrorToClient.bind(this, res))
        console.log(req);
    });

    return router;
}
