const argon2 = require('argon2');
const SecurityErrorGenerator = require(SecurityErrorGeneratorPath);

/**
*   Manages user passwords.
*/
class SecurityPasswordManager {
    constructor(oPersistenceManager) {
        this.persistenceManager = oPersistenceManager;
        this.errorMessages = [
            { code: 1, http: 401, message: "Incorrect password provided." },
            { code: 2, http: 401, message: "Incorrect username provided." },
            { code: 3, http: 500, message: "An error occured while verifying user password." },
            { code: 4, http: 401, message: "No username provided." },
            { code: 5, http: 401, message: "No password provided." },
            { code: 6, http: 401, message: "Incorrect username or password provided." }
        ];

        this.error = new SecurityErrorGenerator(
            "com.etauker.security",
            "utils",
            "SecurityPasswordManager",
            this.errorMessages
        );
    }
};
SecurityPasswordManager.prototype.hashPassword = function(sPassword) {
    // TODO: Return a hashed password
};
SecurityPasswordManager.prototype.verifyPassword = function(sUsername, sPassword) {

    return new Promise((fnResolve, fnReject) => {
        if (!sUsername) throw this.error.getError(4);
        if (!sPassword) throw this.error.getError(5);

        let user = {};
        this.persistenceManager.getUserByUsername(sUsername).then(oUser => {
            if (!oUser) fnReject(this.error.getError(2));
            user = oUser;
            return argon2.verify(oUser.password_hash, sPassword);
        }).then(bMatch => {
            if (bMatch) { fnResolve(user); }
            else {
                fnReject(this.error.getError(1));
            };
        }).catch(oError => {
            fnReject(this.error.getError(3, oError));
        });
    });
};

module.exports = SecurityPasswordManager;
