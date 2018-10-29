module.exports = function(app, paths) {

    // Imports
    const express = require('express');
    const bodyParser = require('body-parser')
    const GlucoseServiceCore = require(paths.GlucoseServiceCorePath);
    const SecurityTokenManager = require(paths.SecurityTokenManagerPath);
    const SecurityServiceValidator = require(paths.SecurityServiceValidatorPath);
    const GlucoseServiceValidator = require(paths.GlucoseServiceValidatorPath);

    // Instantiations
    const token = new SecurityTokenManager();
    const securityValidator = new SecurityServiceValidator();
    const glucoseValidator = new GlucoseServiceValidator(paths);
    const core = new GlucoseServiceCore(paths);
    const router = express.Router();
    router.use(bodyParser.json());         // to support JSON-encoded bodies
    router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // Routes
    router.get('/transactions/get', function(req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        console.log(core);
        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(core.getTransactions)
            .then(aRecordedTransactions => res.status(200).send(aRecordedTransactions))
            .catch(core.sendErrorToClient.bind(this, res))
    });
    router.get('/transactions/add', function(req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(core.getTransactionOptions)
            .then(oTransactionOptions => res.status(200).send(oTransactionOptions))
            .catch(core.sendErrorToClient.bind(this, res))
    });
    router.post('/transactions/add', function(req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        const oTransaction = glucoseValidator.validateTransaction(req.body.transaction);

        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(core.saveTransaction)
            .then(() => res.status(201).send())
            .catch(core.sendErrorToClient.bind(this, res))
    });

    return router;
}
