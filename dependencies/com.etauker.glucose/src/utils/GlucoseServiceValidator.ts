class GlucoseServiceValidator {

    //===========================================
    //              PROPERTIES
    //===========================================
    private error;
    private lastError;
    private errorMessages = [];

    //===========================================
    //               CONSTRUCTOR
    //===========================================
    constructor(paths) {
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);

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

    //===========================================
    //             PUBLIC FUNCTIONS
    //===========================================
    public validateTransaction = function(oTransaction) {
        if (!oTransaction) {
            this.lastError = this.error.getError(1);
            return null;
        }
        return oTransaction;
    };
    public getLastError = function() {
        return this.lastError;
    };

    //===========================================
    //             PRIVATE FUNCTIONS
    //===========================================
};

module.exports = GlucoseServiceValidator;
