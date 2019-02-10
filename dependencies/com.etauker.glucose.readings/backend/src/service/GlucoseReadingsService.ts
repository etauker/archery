module.exports = function(app, paths) {

    // Imports
    const express = require('express');
    const bodyParser = require('body-parser')
    const GlucoseReadingsServiceCore = require(paths.GlucoseReadingsServiceCorePath);
    const SecurityTokenManager = require(paths.SecurityTokenManagerPath);
    const SecurityServiceValidator = require(paths.SecurityServiceValidatorPath);
    const GlucoseReadingsServiceParser = require(paths.GlucoseReadingsServiceParserPath);
    const GlucoseReadingsServiceValidator = require(paths.GlucoseReadingsServiceValidatorPath);
    const GlucoseTransactionInstance = require(paths.GlucoseTransactionPath);
    const GlucoseLogger = require(paths.GlucoseLoggerPath);


    // Instantiations
    const token = new SecurityTokenManager();
    const securityValidator = new SecurityServiceValidator();
    const glucoseParser = new GlucoseReadingsServiceParser(paths);
    const glucoseValidator = new GlucoseReadingsServiceValidator(paths);
    const logger = new GlucoseLogger(paths);
    const core = new GlucoseReadingsServiceCore(paths);
    const router = express.Router();
    router.use(bodyParser.json());         // to support JSON-encoded bodies
    router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    //===========================================
    //                  ROUTES
    //===========================================
    router.get('/readings/get', function(req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        if (!sJwt) core.sendErrorToClient(res, securityValidator.getLastError());

        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(oJwt => core.getTransactions(oJwt.sub))
            .then(aRecordedTransactions => res.status(200).send(aRecordedTransactions))
            .catch(core.sendErrorToClient.bind(this, res))
    });

    router.get('/readings/get/:transaction_id', function(req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        const sId = glucoseValidator.validateUuid(req.params['transaction_id']);

        if (!sJwt) core.sendErrorToClient(res, securityValidator.getLastError());
        if (!sId) core.sendErrorToClient(res, glucoseValidator.getLastError());

        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(oJwt => core.getTransaction(sId, oJwt.sub))
            .then(aRecordedTransactions => res.status(200).send(aRecordedTransactions))
            .catch(core.sendErrorToClient.bind(this, res))
    });

    router.get('/readings/add', function(req, res) {
        const sJwt = securityValidator.extractAndValidateToken(req.headers.authorization);
        if (!sJwt) core.sendErrorToClient(res, securityValidator.getLastError());

        token.verifyToken(sJwt, "com.etauker.glucose.Diabetic")
            .then(oJwt => core.getTransactionOptions(oJwt.sub))
            .then(oTransactionOptions => res.status(200).send(oTransactionOptions))
            .catch(core.sendErrorToClient.bind(this, res))
    });

    router.post('/readings/add', function(req, res) {
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
            .catch(core.sendErrorToClient.bind(this, res))
    });

    return router;
}
