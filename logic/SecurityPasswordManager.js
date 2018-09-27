const argon2 = require('argon2');
const SecurityErrorGenerator = require("../utils/SecurityErrorGenerator.js");

/**
*   Manages user passwords.
*/

class SecurityPasswordManager {
    constructor(oPersistenceManager) {
        this.persistenceManager = oPersistenceManager;

        this.error = new SecurityErrorGenerator(
            "com.etauker.security",
            "logic",
            "SecurityPasswordManager",
            [
                { code: 1, message: "Incorrect password provided." },
                { code: 2, message: "Incorrect username provided." },
                { code: 3, message: "An error occured while verifying user password." }
            ]
        );
    }
};
SecurityPasswordManager.prototype.hashPassword = function(sPassword) {
    // TODO: Return a hashed password
};
SecurityPasswordManager.prototype.verifyPassword = function(sUsername, sPassword) {
    return new Promise((fnResolve, fnReject) => {
        let user = {};
        this.persistenceManager.getUserByUsername(sUsername).then(oUser => {
            if (!oUser) fnReject(this.error.getError(2, null));
            user = oUser;
            return argon2.verify(oUser.password_hash, sPassword);
        }).then(bMatch => {
            if (bMatch) { fnResolve(user); }
            else {
                fnReject(this.error.getError(1));
            };
        }).catch(oError => {
            // console.log(oError);
            // if (typeof oError.package === "string") throw oError;
            throw this.error.getError(3, oError);
        });
    });
};

module.exports = SecurityPasswordManager;
