const GlucoseErrorGenerator = require(GlucoseErrorGeneratorPath);

class GlucoseServiceValidator {
    constructor() {
        this.errorMessages = [
            { code: 1, http: 401, message: "Invalid username." }
        ];

        this.error = new GlucoseErrorGenerator(
            "com.etauker.glucose",
            "utils",
            "GlucoseServiceValidator",
            this.errorMessages
        );

        this.lastError = null;
    }
};

GlucoseServiceValidator.prototype.validateTransaction = function(oTransaction) {
    if (!oTransaction) {
        this.lastError = this.error.getError(1);
        return null;
    }
    return oTransaction;
};
// GlucoseServiceValidator.prototype.validatePassword = function(sPassword) {
//     if (!sPassword) {
//         this.lastError = this.error.getError(2);
//         return null;
//     }
//     return sPassword;
// };
// GlucoseServiceValidator.prototype.validateToken = function(sToken) {
//     if (!sToken) {
//         this.lastError = this.error.getError(5);
//         return null;
//     }
//     return sToken;
// };
// GlucoseServiceValidator.prototype.extractAndValidateToken = function(sToken) {
//     if (!sToken) {
//         this.lastError = this.error.getError(5);
//         return null;
//     }
//     return sToken.replace("Bearer ", "");
// };
GlucoseServiceValidator.prototype.getLastError = function() {
    return this.lastError;
};
module.exports = GlucoseServiceValidator;
