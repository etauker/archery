/**
*   Manages users in the context of security.
*/

class SecurityUserManager {
    constructor() {
        console.log("SecurityUserManager is being constructed");
    }
}

SecurityUserManager.prototype.getUser = function(oUser) {
    // TODO: Return a user using properties corresponding to the provided object
}
SecurityUserManager.prototype.createUser = function(oUser) {
    // TODO: Creates a database entry corresponding to the provided object
    // NOTE: The password must be hashed here befoe saving
}

module.exports = SecurityUserManager;
