class GlucoseServiceValidator {
    //===========================================
    //               CONSTRUCTOR
    //===========================================
    constructor(paths) {
        this.errorMessages = [];
        //===========================================
        //             PUBLIC FUNCTIONS
        //===========================================
        this.validateTransaction = function (oTransaction) {
            if (!oTransaction) {
                this.lastError = this.error.getError(1);
                return null;
            }
            return oTransaction;
        };
        this.getLastError = function () {
            return this.lastError;
        };
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        this.errorMessages = [
            { code: 1, http: 401, message: "Invalid username." }
        ];
        this.error = new GlucoseErrorGenerator("com.etauker.glucose", "utils", "GlucoseServiceValidator", this.errorMessages);
        this.lastError = null;
    }
}
;
module.exports = GlucoseServiceValidator;
