const express = require('express');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const SecurityPersistenceManager = require(SecurityPersistenceManagerPath);
const SecurityPasswordManager = require(SecurityPasswordManagerPath);
const SecurityTokenManager = require(SecurityTokenManagerPath);
const SecurityServiceValidator = require(SecurityServiceValidatorPath);

var persistence = new SecurityPersistenceManager();
var password = new SecurityPasswordManager(persistence);
var token = new SecurityTokenManager(persistence);
// console.log(token.persistenceManager);
var validator = new SecurityServiceValidator();

module.exports = function(app) {
    const router = express.Router();
    router.use(bodyParser.json());         // to support JSON-encoded bodies
    router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    router.post('/token', function(req, res) {
        const sUsername = validator.validateUsername(req.body.username);
        const sPassword = validator.validatePassword(req.body.password);
        console.log(sUsername);
        console.log(sUsername && sPassword);

        if (sUsername && sPassword) {
            password.verifyPassword(sUsername, sPassword).then((oUser) => {
                return token.generateToken(oUser);
            }).then(sToken => {
                console.log(sToken);
                res.send(sToken);
            }).catch(oError => {
                console.log(oError.message);

                // Prepare the response object
                let oResponse = _formatErrorResponse(oError);

                // Generalise between incorrect username and password for security purposes
                if ([7.1, 7.2, 7.4, 7.5].includes(oError.code) && oError.class === "SecurityPasswordManager") {
                    oResponse = _formatErrorResponse(validator.getIncorrectUsernameOrPasswordError());
                }
                let sRealm = (REALM ? 'realm="' + REALM + '"' : "");
                res.append("WWW-Authenticate", "Bearer " + sRealm);
                res.status(oResponse.status).send(oResponse);
            });
        } else {
            console.log('No username or password');

            // Prepare the response object
            let oResponse = _formatErrorResponse(validator.getInvalidUsernameOrPasswordError());
            let sRealm = (REALM ? 'realm="' + REALM + '"' : "");
            res.append("WWW-Authenticate", "Bearer " + sRealm);
            res.status(oResponse.status).send(oResponse);
        }
    });

    router.get('/invalidate', function(req, res) {
        const sJwt = validator.extractAndValidateToken(req.headers.authorization);

        if (sJwt) {
            token.invalidateToken(sJwt).then(() => {
                res.send(true);
            }).catch(oError => {
                let oResponse = _formatErrorResponse(oError);
                res.status(oResponse.status).send(oResponse);
            });
        } else {
            let oResponse = _formatErrorResponse(this.validator.getLastError());
            res.status(oResponse.status).send(oResponse);
        }
    });

    router.post('/users', function(req, res){
        // argon2.hash(sPassword).then(sHash => {
        // }).catch(err => {
        //     console.log(err);
        //     res.send(err);
        // });
        res.send('/users');
    });

    function _formatErrorResponse(oError) {
        let oResponse = {};
        oResponse.message = oError.message;
        oResponse.code = oError.code;
        oResponse.status = oError.http ? oError.http : 500;
        return oResponse;
    }
console.log(router.prototype);
    return router;
}
