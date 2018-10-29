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

    //===========================================
    //                  ROUTES
    //===========================================
    router.get('/transactions/get', function(req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        if (!sJwt) core.sendErrorToClient(res, securityValidator.getLastError());

        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(core.getTransactions)
            .then(aRecordedTransactions => res.status(200).send(aRecordedTransactions))
            .catch(core.sendErrorToClient.bind(this, res))
    });

    router.get('/transactions/get/:transaction_id', function(req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        const sId = glucoseValidator.validateUuid(req.params['transaction_id']);

        if (!sJwt) core.sendErrorToClient(res, securityValidator.getLastError());
        if (!sId) core.sendErrorToClient(res, glucoseValidator.getLastError());

        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(oJwt => core.getTransaction(sId))
            .then(aRecordedTransactions => res.status(200).send(aRecordedTransactions))
            .catch(core.sendErrorToClient.bind(this, res))
    });

    router.get('/transactions/add', function(req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        if (!sJwt) core.sendErrorToClient(res, securityValidator.getLastError());

        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(core.getTransactionOptions)
            .then(oTransactionOptions => res.status(200).send(oTransactionOptions))
            .catch(core.sendErrorToClient.bind(this, res))
    });

    router.post('/transactions/add', function(req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        const oTransaction = glucoseValidator.validateTransaction(req.body);

        if (!sJwt) core.sendErrorToClient(res, securityValidator.getLastError());
        if (!oTransaction) core.sendErrorToClient(res, glucoseValidator.getLastError());

        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(() => core.saveTransaction(oTransaction))
            .then(() => res.status(201).send())
            .catch(core.sendErrorToClient.bind(this, res))
    });

    return router;
}
