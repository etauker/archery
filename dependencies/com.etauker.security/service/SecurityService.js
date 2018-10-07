const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const mysql = require('mysql');
const bodyParser = require('body-parser')

const SecurityPersistenceManager = require(SecurityPersistenceManagerPath);
const SecurityPasswordManager = require(SecurityPasswordManagerPath);
const SecurityTokenManager = require(SecurityTokenManagerPath);
const SecurityServiceValidator = require(SecurityServiceValidatorPath);

var persistence = new SecurityPersistenceManager();
var password = new SecurityPasswordManager(persistence);
var token = new SecurityTokenManager(persistence);
var validator = new SecurityServiceValidator();

module.exports = function(app) {
    app.use(bodyParser.json());         // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    app.post('/security/token', function(req, res) {
        let sUsername = validator.validateUsername(req.body.username);
        let sPassword = validator.validatePassword(req.body.password);

        if (sUsername && sPassword) {
            password.verifyPassword(sUsername, sPassword).then((oUser) => {
                return token.generateToken(oUser);
            }).then(sToken => {
                res.send(sToken);
            }).catch(oError => {

                // Prepare the response object
                let oResponse = {};
                oResponse.message = oError.message;
                oResponse.code = oError.code;
                oResponse.status = oError.http ? oError.http : 500;

                // Generalise between incorrect username and password for security purposes
                if ([7.1, 7.2, 7.4, 7.5].includes(oError.code) && oError.class === "SecurityPasswordManager") {
                    oError = validator.getIncorrectUsernameOrPasswordError();
                    oResponse.message = oError.message;
                    oResponse.code = oError.code;
                    oResponse.status = oError.http;
                }

                // Send the response
                res.status(oResponse.status).send(oResponse);
            });
        } else {

            // Prepare the response object
            let oResponse = {};
            oError = validator.getInvalidUsernameOrPasswordError();
            oResponse.message = oError.message;
            oResponse.code = oError.code;
            oResponse.status = oError.http;

            // Send the response
            res.status(oResponse.status).send(oResponse);
        }
    });

    app.post('/security/invalidate', function(req, res){
        // argon2.hash(sPassword).then(sHash => {
        // }).catch(err => {
        //     console.log(err);
        //     res.send(err);
        // });
        res.send('/security/users');
    });

    app.post('/security/users', function(req, res){
        // argon2.hash(sPassword).then(sHash => {
        // }).catch(err => {
        //     console.log(err);
        //     res.send(err);
        // });
        res.send('/security/users');
    });

}
