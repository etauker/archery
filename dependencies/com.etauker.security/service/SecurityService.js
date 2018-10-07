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

    app.post('/security/token2', function(req, res) {
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

    app.post('/security/token', function(req, res) {
        let sJwt = validator.validateToken("eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJzdWIiOiIzNjNlOTVjZC1jYTdlLTExZTgtYTE1NC0wODAwMjdkMmM3ZGQiLCJyb2xlcyI6W3siaWQiOiIzNjNlMjk0OC1jYTdlLTExZTgtYTE1NC0wODAwMjdkMmM3ZGQiLCJuYW1lIjoiY29tLmV0YXVrZXIuYXJjaGVyeS5BZG1pbiIsImRlc2NyaXB0aW9uIjoiQ2x1YiBtZW1iZXIgd2hvIG1hbmFnZXMgdGhlIGNsdWJzIGluZm9ybWF0aW9uIGFuZCByZWdpc3RlcnMgbmV3IG1lbWJlcnMgb24gYmVoYWxmIG9mIHRoZSBjbHViLiJ9XSwiaWF0IjoxNTM4OTUwNDA5LCJuYmYiOjMwNzc5MDA4MTgsImV4cCI6MTUzODk1NDAwOSwiYXVkIjoiY29tLmV0YXVrZXIuYXJjaGVyeSIsImlzcyI6ImNvbS5ldGF1a2VyLnNlY3VyaXR5In0.Xmt8u3Z4H-yXySG7_yixAFNGaBuZVH1RhkCm3c-hvNLLT6bpGqQMX7Gs2_NlhIdkV-zDCpT4QcpLZTjb3nbfUw");

        if (sJwt) {
            token.invalidateToken(sJwt).then(() => {
                res.send(true);
            }).catch(oError => {
console.log(oError);
                // Prepare the response object
                let oResponse = {};
                oResponse.message = oError.message;
                oResponse.code = oError.code;
                oResponse.status = oError.http ? oError.http : 500;

                // Send the response
                res.status(oResponse.status).send(oResponse);
            });
        } else {
            let oError = this.validator.getLastError();
            let oResponse = {};
            oResponse.message = oError.message;
            oResponse.code = oError.code;
            oResponse.status = oError.http ? oError.http : 500;
            res.status(oResponse.status).send(oResponse);
        }
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
