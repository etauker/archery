const jwt = require('jsonwebtoken');
const SecurityErrorGenerator = require(SecurityErrorGeneratorPath);
const SecurityPersistenceManager = require(SecurityPersistenceManagerPath);

/**
*   Manages user session tokens.
*/
class SecurityTokenManager {
    constructor(oPersistenceManager) {
        // console.log(oPersistenceManager);
        this.persistenceManager = oPersistenceManager || new SecurityPersistenceManager();
        this.error = new SecurityErrorGenerator(
            "com.etauker.security",
            "logic",
            "SecurityTokenManager",
            [
                { code: 1, http: 406, message: "Failed to decode token. It may be corrupt. Try to log out and log back in again." },
                { code: 2, http: 401, message: "User session has expired." },
                { code: 3, http: 401, message: "Invalid authentication token provided. Try to log out and log back in again." },
                { code: 4, http: 401, message: "User session has been terminated." },
                { code: 5, http: 403, message: "User does not have sufficient privileges to access the resource." }
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

    return new Promise(async (fnResolve, fnReject) => {

        // Local variables
        let oToken;
        const oOptions = {
            algorithms: [ this.config.algorithm ],
            audience: this.config.audience,
            issuer: this.config.issuer,
            maxAge: this.config.expiresIn
        }

        // Verify token
        try {
            oToken = await jwt.verify(sToken, process.env.JWT_SECRET, oOptions);
            console.log("=== oToken ===");
            console.log(oToken);

            // Check the if the session has been invalidated in the database
            const bInvalidated = await this.persistenceManager.checkSessionValidity(oToken.id)
                .then(bValid => !bValid)
                .catch(oError => fnReject(oError))
            if (bInvalidated) { fnReject(this.error.getError(4)) }
            else {

                // Optionally check if the token contains a role
                if (sRole) {
                    const bHasRole = (oToken.roles.filter(role => role.name === sRole).length > 0);
                    if (!bHasRole) { fnReject(this.error.getError(5)) }
                }

                fnResolve(sToken);
            }
        }
        catch (oError) {
            if (oError.name === "TokenExpiredError") { fnReject(this.error.getError(2, oError)) }
            if (oError.name === "JsonWebTokenError") { fnReject(this.error.getError(3, oError)) }
            fnReject(this.error.getError(0))
        }
    });
};
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
