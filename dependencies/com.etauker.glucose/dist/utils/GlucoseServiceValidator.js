class GlucoseServiceValidator {
    //===========================================
    //               CONSTRUCTOR
    //===========================================
    constructor(paths) {
        this.errorMessages = [];
        this.idRegex = /.{8}-.{4}-.{4}-.{4}-.{12}/;
        //===========================================
        //             PUBLIC FUNCTIONS
        //===========================================
        this.validateUuid = function (sId) {
            if (!sId || !this.idRegex.test(sId)) {
                this.lastError = this.error.getError(1, { sProvidedId: sId });
                return null;
            }
            return sId;
        };
        this.validateTransaction = function (oTransaction) {
            if (!oTransaction) {
                this.lastError = this.error.getError(2);
                return null;
            }
            return oTransaction;
        };
        this.getLastError = function () {
            return this.lastError;
        };
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        this.errorMessages = [
            { code: 1, http: 422, message: "Invalid uuid provided." },
            { code: 2, http: 400, message: "Missing transaction object in the request body." }
        ];
        this.error = new GlucoseErrorGenerator("com.etauker.glucose", "utils", "GlucoseServiceValidator", this.errorMessages);
        this.lastError = null;
    }
}
;
module.exports = GlucoseServiceValidator;
