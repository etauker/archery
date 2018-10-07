class SecurityServiceValidator {
    constructor() {
        this.errorMessages = [
            { code: 1, http: 401, message: "Invalid username." },
            { code: 2, http: 401, message: "Invalid password." },
            { code: 3, http: 401, message: "Invalid username or password provided." },
            { code: 4, http: 401, message: "Incorrect username or password provided." }
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

SecurityServiceValidator.validateUsername = function(sUsername) {
    if (!sUsername) {
        this.lastError = this.error.getError(1);
        return null;
    }
    return sUsername;
};
SecurityServiceValidator.validatePassword = function(sPassword) {
    if (!sPassword) {
        this.lastError = this.error.getError(2);
        return null;
    }
    return sPassword;
};
SecurityServiceValidator.getLastError = function() {
    return this.lastError;
};
SecurityServiceValidator.getIncorrectUsernameOrPasswordError = function() {
    return this.error.getError(3);
};
SecurityServiceValidator.getInvalidUsernameOrPasswordError = function() {
    return this.error.getError(3);
};
module.exports = SecurityServiceValidator;
