const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const mysql = require('mysql');
const bodyParser = require('body-parser')

const SecurityPersistenceManager = require(SecurityPersistenceManagerPath);
const SecurityPasswordManager = require(SecurityPasswordManagerPath);
const SecurityTokenManager = require(SecurityTokenManagerPath);
const SecurityParameterValidator = require(SecurityParameterValidatorPath);

var securityPersistenceManager = new SecurityPersistenceManager();
var securityPasswordManager = new SecurityPasswordManager(securityPersistenceManager);
var securityTokenManager = new SecurityTokenManager(securityPersistenceManager);

module.exports = function(app) {
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));

    app.post('/security/token', function(req, res){

        let sUsername = "";
        let sPassword = "";

        SecurityParameterValidator.validateUsername(req.body.username).then(sValidatedUsername => {
            sUsername = sValidatedUsername;
            return SecurityParameterValidator.validatePassword(req.body.password);
        }).then(sValidatedPassword => {
            sUsername = sValidatedPassword;
            return securityPasswordManager.verifyPassword(sUsername, sPassword)
        }).then((oUser) => {
            return securityTokenManager.generateToken(oUser);
        }).then(sToken => {
            res.send(sToken);
        }).catch(oError => {

            // Prepare the response object
            let oResponse = {};
            oResponse.message = oError.message;
            oResponse.code = oError.code;
            oResponse.status = oError.http ? oError.http : 500;

            // Generalise between incorrect username and password for security purposes
            if ([7.1, 7.2, 7.4, 7.5].includes(oResponse.code)) {
                oResponse.message = "Incorrect username or password provided.";
                oResponse.code = 7.6;
            }

            // Send the response
            res.status(oResponse.status).send(oResponse);
        });
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
