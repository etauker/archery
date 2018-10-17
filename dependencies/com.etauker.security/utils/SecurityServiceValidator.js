const SecurityErrorGenerator = require(SecurityErrorGeneratorPath);

class SecurityServiceValidator {
    constructor() {
        this.errorMessages = [
            { code: 1, http: 401, message: "Invalid username." },
            { code: 2, http: 401, message: "Invalid password." },
            { code: 3, http: 401, message: "Invalid username or password provided." },
            { code: 4, http: 401, message: "Incorrect username or password provided." },
            { code: 5, http: 401, message: "Missing authentication token." }
        ];

        this.error = new SecurityErrorGenerator(
            "com.etauker.security",
            "utils",
            "SecurityServiceValidator",
            this.errorMessages
        );

        this.lastError = null;
    }
};

SecurityServiceValidator.prototype.validateUsername = function(sUsername) {
    if (!sUsername) {
        this.lastError = this.error.getError(1);
        return null;
    }
    return sUsername;
};
SecurityServiceValidator.prototype.validatePassword = function(sPassword) {
    if (!sPassword) {
        this.lastError = this.error.getError(2);
        return null;
    }
    return sPassword;
};
SecurityServiceValidator.prototype.validateToken = function(sToken) {
    if (!sToken) {
        this.lastError = this.error.getError(5);
        return null;
    }
    return sToken.replace("Bearer ", "");
};
SecurityServiceValidator.prototype.getLastError = function() {
    return this.lastError;
};
SecurityServiceValidator.prototype.getInvalidUsernameOrPasswordError = function() {
    return this.error.getError(3);
};
SecurityServiceValidator.prototype.getIncorrectUsernameOrPasswordError = function() {
    return this.error.getError(4);
};
module.exports = SecurityServiceValidator;
