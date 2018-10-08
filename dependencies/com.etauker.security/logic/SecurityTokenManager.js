const jwt = require('jsonwebtoken');
const SecurityErrorGenerator = require(SecurityErrorGeneratorPath);

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
                { code: 1, http: 406, message: "Failed to decode token. It may be corrupt." }
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
    var uuid = "";
    return this.persistenceManager.getUuid().then(sUuid => {
        uuid = sUuid;
        return this.persistenceManager.getRolesByUser(oUser);
    }).then(aRoles => {
        aRoles = (Array.isArray(aRoles) ? aRoles : new Array(aRoles));
        this.config.notBefore = Math.floor(Date.now() / 1000);

        var sToken = jwt.sign({
            id: uuid,
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
SecurityTokenManager.prototype.invalidateToken = function(sToken) {
    var oDecoded = {};
    try {
        oDecoded = jwt.decode(sToken);
    } catch (oError) {
        oParsedError = this.error.getError(1, oError);
        return new promise((fnResolve, fnReject) => fnReject(oParsedError));
    }
    return this.persistenceManager.invalidateSession(oDecoded.id);
}
module.exports = SecurityTokenManager;
