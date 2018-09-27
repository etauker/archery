var jwt = require('jsonwebtoken');
const SecurityErrorGenerator = require("../utils/SecurityErrorGenerator.js");

/**
*   Manages user session tokens.
*/

class SecurityTokenManager {
    constructor(oPersistenceManager) {
        this.persistenceManager = oPersistenceManager;

        this.error = new SecurityErrorGenerator(
            "com.etauker.security",
            "logic",
            "SecurityTokenManager",
            [
                { code: 1, message: "Incorrect password provided." },
                { code: 2, message: "An error occured while verifying user password." }
            ]
        );

        this.config = {
            expiresIn: process.env.JWT_EXPIRES_IN || 60*60,
            issuer: process.env.JWT_ISSUER || "com.etauker.security",
            audience: process.env.JWT_AUDIENCE || "com.etauker.archery",
            algorithm: process.env.JWT_ALGORITHM || "HS512"
        }
    }
}
SecurityTokenManager.prototype.generateToken = function(oUser) {

    var token = "";
    return this.persistenceManager.getRolesByUser(oUser).then(aRoles => {
        aRoles = (Array.isArray(aRoles) ? aRoles : new Array(aRoles));
        this.config.notBefore = Math.floor(Date.now() / 1000);

        var sToken = jwt.sign({
            user: oUser.username,
            sub: oUser.uuid,
            roles: aRoles.map(oRole => {
                return {
                    id: oRole.id,
                    name: oRole.name,
                    description: oRole.description
                }
            })
        }, process.env.JWT_SECRET, this.config);

        return sToken;
    }).then(sToken => {
        token = sToken;
        return this.persistenceManager.saveSession(sToken, jwt.decode(sToken), this.config);
    }).then(oResult => {
        return token;
    });
}
SecurityTokenManager.prototype.extendToken = function(sToken) {
    // TODO: Returns a json web token with updated information
    // TODO: Saves the session extension information in the SESSION_EXTENSION table
}
SecurityTokenManager.prototype.verifyToken = function(sToken, sRole) {
    // TODO: Returns true if the token is valid
    // TODO: Optionally checks if the token contains the given role
    // TODO: Potentially check the database table to check if the session has been invalidated
}
SecurityTokenManager.prototype.invalidateToken = function(sUsername) {
    // TODO: Adds the username to an array of invalidated tokens
    // TODO: Alternatively updates the session table to set the curreny sessions for this user as invalid
}
module.exports = SecurityTokenManager;
