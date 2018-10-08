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
                let oResponse = _formatErrorResponse(oError);

                // Generalise between incorrect username and password for security purposes
                if ([7.1, 7.2, 7.4, 7.5].includes(oError.code) && oError.class === "SecurityPasswordManager") {
                    oResponse = _formatErrorResponse(validator.getIncorrectUsernameOrPasswordError());
                }
                res.status(oResponse.status).send(oResponse);
            });
        } else {

            // Prepare the response object
            let oResponse = _formatErrorResponse(validator.getInvalidUsernameOrPasswordError());
            res.status(oResponse.status).send(oResponse);
        }
    });

    app.post('/security/invalidate', function(req, res) {
        let sJwt = validator.validateToken("eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNlYTJlNDgyLWNiMjUtMTFlOC1hMTU0LTA4MDAyN2QyYzdkZCIsInVzZXIiOiJjb2FjaCIsInN1YiI6ImIyNmY4YWY1LWNiMjUtMTFlOC1hMTU0LTA4MDAyN2QyYzdkZCIsInJvbGVzIjpbeyJpZCI6ImIyNmYyN2Q3LWNiMjUtMTFlOC1hMTU0LTA4MDAyN2QyYzdkZCIsIm5hbWUiOiJjb20uZXRhdWtlci5hcmNoZXJ5LkNvYWNoIiwiZGVzY3JpcHRpb24iOiJDbHViIG1lbWJlciB3aG8gY2FuIHZpZXcgdGhlIHNjb3JlcyBvZiBhbnkgb2YgdGhlIGFyY2hlcnMgd2l0aGluIHRoZSBjbHViIHRoZXkgYXJlIGN1cnJlbnRseSBhc3NpZ25lZCB0by4ifV0sImlhdCI6MTUzOTAyMjM4NywibmJmIjozMDc4MDQ0Nzc0LCJleHAiOjE1MzkwMjU5ODcsImF1ZCI6ImNvbS5ldGF1a2VyLmFyY2hlcnkiLCJpc3MiOiJjb20uZXRhdWtlci5zZWN1cml0eSJ9.Rh0JH6-2WZfXWoqtC_4HemOPndm3tHG26CAFj-RKsAGo7EoIRWdxwaMf3LU5JgQkqR73ZlJvb-TsmzPeghF-BA");

        if (sJwt) {
            token.invalidateToken(sJwt).then(() => {
                res.send(true);
            }).catch(oError => {

                // Prepare the response object
                let oResponse = _formatErrorResponse(this.validator.getLastError());
                res.status(oResponse.status).send(oResponse);
            });
        } else {
            let oResponse = _formatErrorResponse(this.validator.getLastError());
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

    function _formatErrorResponse(oError) {
        let oResponse = {};
        oResponse.message = oError.message;
        oResponse.code = oError.code;
        oResponse.status = oError.http ? oError.http : 500;
        return oResponse;
    }

}
