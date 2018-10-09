// const jwt = require('jsonwebtoken');
// const argon2 = require('argon2');
// const mysql = require('mysql');
// const bodyParser = require('body-parser')

const ArcheryPersistenceManager = require(ArcheryPersistenceManagerPath);
// const SecurityPasswordManager = require(SecurityPasswordManagerPath);
const SecurityTokenManager = require(SecurityTokenManagerPath);
// const SecurityServiceValidator = require(SecurityServiceValidatorPath);

var persistence = new ArcheryPersistenceManager();
// var password = new SecurityPasswordManager(persistence);
// var token = new SecurityTokenManager(persistence);
// var validator = new SecurityServiceValidator();

module.exports = function(app) {
    // app.use(bodyParser.json());         // to support JSON-encoded bodies
    // app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    //     extended: true
    // }));

    app.get('/api/session/add', function(req, res) {
        // let sUsername = validator.validateUsername(req.body.username);
        // let sPassword = validator.validatePassword(req.body.password);
        //
        // if (sUsername && sPassword) {
        //     password.verifyPassword(sUsername, sPassword).then((oUser) => {
        //         return token.generateToken(oUser);
        //     }).then(sToken => {
        //         res.send(sToken);
        //     }).catch(oError => {
        //
        //         // Prepare the response object
        //         let oResponse = _formatErrorResponse(oError);
        //
        //         // Generalise between incorrect username and password for security purposes
        //         if ([7.1, 7.2, 7.4, 7.5].includes(oError.code) && oError.class === "SecurityPasswordManager") {
        //             oResponse = _formatErrorResponse(validator.getIncorrectUsernameOrPasswordError());
        //         }
        //         res.status(oResponse.status).send(oResponse);
        //     });
        // } else {
        //
        //     // Prepare the response object
        //     let oResponse = _formatErrorResponse(validator.getInvalidUsernameOrPasswordError());
        //     res.status(oResponse.status).send(oResponse);
        // }

        let oNewSessionOptions = {
            sessionTypes: persistence.getSessionTypes(),
            sessionCategories: persistence.getSessionCategory(),
            distances: persistence.getDistance(),
            targetFaces: persistence.getTargetFaces(),
            bowCategories: persistence.getBowCategory()
        };
        console.log(oNewSessionOptions);
        res.status(200).send(oNewSessionOptions);
    });

    app.get('/api/invalidate', function(req, res) {
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

}
