/**
*   Manages user session tokens.
*/

class SecurityTokenManager {
    constructor() {
        console.log("SecurityTokenManager is being constructed");

    }
}

SecurityTokenManager.prototype.generateToken = function(sUsername) {
    // TODO: Returns a new json web token for the given user
    // TODO: Saves the session information in the SESSION table
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
