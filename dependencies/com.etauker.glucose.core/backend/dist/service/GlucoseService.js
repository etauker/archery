module.exports = function (app, paths) {
    // Imports
    const express = require('express');
    const bodyParser = require('body-parser');
    const GlucoseServiceCore = require(paths.GlucoseServiceCorePath);
    const SecurityTokenManager = require(paths.SecurityTokenManagerPath);
    const SecurityServiceValidator = require(paths.SecurityServiceValidatorPath);
    const GlucoseServiceParser = require(paths.GlucoseServiceParserPath);
    const GlucoseServiceValidator = require(paths.GlucoseServiceValidatorPath);
    const GlucoseTransactionInstance = require(paths.GlucoseTransactionPath);
    const GlucoseLogger = require(paths.GlucoseLoggerPath);
    // Instantiations
    const token = new SecurityTokenManager();
    const securityValidator = new SecurityServiceValidator();
    const glucoseParser = new GlucoseServiceParser(paths);
    const glucoseValidator = new GlucoseServiceValidator(paths);
    const logger = new GlucoseLogger(paths);
    const core = new GlucoseServiceCore(paths);
    const router = express.Router();
    router.use(bodyParser.json()); // to support JSON-encoded bodies
    router.use(bodyParser.urlencoded({
        extended: true
    }));
    //===========================================
    //                  ROUTES
    //===========================================
    router.get('/transactions/get', function (req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        if (!sJwt)
            core.sendErrorToClient(res, securityValidator.getLastError());
        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(oJwt => core.getTransactions(oJwt.sub))
            .then(aRecordedTransactions => res.status(200).send(aRecordedTransactions))
            .catch(core.sendErrorToClient.bind(this, res));
    });
    router.get('/transactions/get/:transaction_id', function (req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        const sId = glucoseValidator.validateUuid(req.params['transaction_id']);
        if (!sJwt)
            core.sendErrorToClient(res, securityValidator.getLastError());
        if (!sId)
            core.sendErrorToClient(res, glucoseValidator.getLastError());
        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(oJwt => core.getTransaction(sId, oJwt.sub))
            .then(aRecordedTransactions => res.status(200).send(aRecordedTransactions))
            .catch(core.sendErrorToClient.bind(this, res));
    });
    router.get('/transactions/add', function (req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        if (!sJwt)
            core.sendErrorToClient(res, securityValidator.getLastError());
        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(oJwt => core.getTransactionOptions(oJwt.sub))
            .then(oTransactionOptions => res.status(200).send(oTransactionOptions))
            .catch(core.sendErrorToClient.bind(this, res));
    });
    router.post('/transactions/add', function (req, res) {
        // logger.logObject(req, 'req', `router.post('/transactions/add'`, 'GlucoseService');
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        if (!sJwt) {
            core.sendErrorToClient(res, securityValidator.getLastError());
            return null;
        }
        const oParsedObject = glucoseParser.parseTransaction(req.body);
        if (!oParsedObject) {
            core.sendErrorToClient(res, glucoseParser.getLastError());
            return null;
        }
        const oValidatedObject = glucoseValidator.validateTransaction(oParsedObject);
        if (!oValidatedObject) {
            core.sendErrorToClient(res, glucoseValidator.getLastError());
            return null;
        }
        const oTransaction = GlucoseTransactionInstance.fromPresentationLayerObject(oValidatedObject);
        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then((oJwt) => core.saveTransaction(oTransaction, oJwt.sub))
            .then(() => res.status(201).send())
            .catch(core.sendErrorToClient.bind(this, res));
    });
    return router;
};
