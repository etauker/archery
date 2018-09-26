const argon2 = require('argon2');

/**
*   Manages user passwords.
*/

class SecurityPasswordManager {
    constructor(oPersistenceManager) {
        console.log("SecurityPasswordManager is being constructed");
        this.persistenceManager = oPersistenceManager;
    }
};

SecurityPasswordManager.prototype.hashPassword = function(sPassword) {
    // TODO: Return a hashed password
};
SecurityPasswordManager.prototype.verifyPassword = function(sUsername, sPassword) {
    return new Promise((fnResolve, fnReject) => {
        let user = {};
        this.persistenceManager.getUserByUsername(sUsername).then(oUser => {
            user = oUser;
            return argon2.verify(oUser.password_hash, sPassword);
        }).then(bMatch => {
            if (bMatch) { fnResolve(user); }
            else {
                fnReject({
                    error: "",
                    message: "User password does not match"
                });
            };
        }).catch(oError => {
            throw oError;
        });
    });
};

module.exports = SecurityPasswordManager;
