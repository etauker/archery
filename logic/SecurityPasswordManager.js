/**
*   Manages user passwords.
*/

class SecurityPasswordManager {
    constructor() {
        console.log("SecurityPasswordManager is being constructed");
    }
}

SecurityPasswordManager.prototype.hashPassword = function(sPassword) {
    // TODO: Return a hashed password
}
SecurityPasswordManager.prototype.verifyPassword = function(sHash, sPassword) {
    // TODO: Returns true if the hash matches the password
}

module.exports = SecurityPasswordManager;
