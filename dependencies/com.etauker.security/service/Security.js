const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const mysql = require('mysql');
const bodyParser = require('body-parser')

const SecurityPersistenceManager = require(SecurityPersistenceManagerPath);
const SecurityPasswordManager = require(SecurityPasswordManagerPath);
const SecurityTokenManager = require(SecurityTokenManagerPath);

var securityPersistenceManager = new SecurityPersistenceManager();
var securityPasswordManager = new SecurityPasswordManager(securityPersistenceManager);
var securityTokenManager = new SecurityTokenManager(securityPersistenceManager);

module.exports = function(app) {
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));

    app.post('/security/token', function(req, res){
        var sUsername = req.body.username;
        var sPassword = req.body.password;

        securityPasswordManager.verifyPassword(sUsername, sPassword).then((oUser) => {
            return securityTokenManager.generateToken(oUser);
        }).then(sToken => {
            res.send(sToken);
        }).catch(oError => {
            var oResponse = {};
            oResponse.message = oError.message;
            oResponse.code = oError.code;
            res.status(500).send(oResponse);
        });
    });

    app.get('/security/token', function(req, res){
        // Develop as a GET for ease of testing

        var sUsername = req.query.username;
        var sPassword = req.query.password;
        securityPasswordManager.verifyPassword(sUsername, sPassword).then((oUser) => {
            return securityTokenManager.generateToken(oUser);
        }).then(sToken => {
            res.send(sToken);
        }).catch(oError => {
            var oResponse = {};
            oResponse.message = oError.message;
            oResponse.code = oError.code;
            res.status(500).send(oResponse);
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
