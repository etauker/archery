const express = require('express');

// const jwt = require('jsonwebtoken');
// const argon2 = require('argon2');
// const mysql = require('mysql');
const bodyParser = require('body-parser')

const ArcheryPersistenceManager = require(ArcheryPersistenceManagerPath);
// const SecurityPasswordManager = require(SecurityPasswordManagerPath);
const SecurityTokenManager = require(SecurityTokenManagerPath);
const SecurityServiceValidator = require(SecurityServiceValidatorPath);
// const SecurityServiceValidator = require(SecurityServiceValidatorPath);

var persistence = new ArcheryPersistenceManager();
var token = new SecurityTokenManager();
var validator = new SecurityServiceValidator();
// var password = new SecurityPasswordManager(persistence);

module.exports = function(app) {
    const router = express.Router();
    router.use(bodyParser.json());         // to support JSON-encoded bodies
    router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    router.get('/session/add', function(req, res) {
        const sJwt = validator.validateToken(req.headers.authorization);

        // TODO: Implement SecurityTokenManager.verifyToken
        token.verifyToken(sJwt, "com.etauker.archery.Archer")
            .then((sJwt) => {
                const oNewSessionOptions = {
                    sessionTypes: persistence.getSessionTypes(),
                    sessionCategories: persistence.getSessionCategory(),
                    distances: persistence.getDistance(),
                    targetFaces: persistence.getTargetFaces(),
                    bowCategories: persistence.getBowCategory()
                };
                res.status(200).send(oNewSessionOptions);
            })
            .catch((oError) => {
                // TODO: Change to use sendErrorResponse
                const oResponse = _formatErrorResponse(oError);
                res.status(oResponse.status).send(oResponse);
            })
    });

    router.get('/invalidate', function(req, res) {
        // let sBearer = req.headers.authorization.replace("Bearer ", "");
        // let sJwt = validator.validateToken(sBearer);
        //
        // if (sJwt) {
        //     token.invalidateToken(sJwt).then(() => {
        //         res.send(true);
        //     }).catch(oError => {
        //         let oResponse = _formatErrorResponse(oError);
        //         res.status(oResponse.status).send(oResponse);
        //     });
        // } else {
        //     let oResponse = _formatErrorResponse(this.validator.getLastError());
        //     res.status(oResponse.status).send(oResponse);
        // }
    });

    function _formatErrorResponse(oError) {
        let oResponse = {};
        oResponse.message = oError.message;
        oResponse.code = oError.code;
        oResponse.status = oError.http ? oError.http : 500;
        return oResponse;
    }
    function sendResponse(oResponseObject, oResultToSend) {
        res.status(oResultToSend.status).send(oResultToSend);
    }
    function sendErrorResponse(oResponseObject, oError) {
        const oResponse = _formatErrorResponse(oError);
        res.status(oResponse.status).send(oResponse);
        return true;
    }
    return router;
}
