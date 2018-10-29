var GlucoseTransactionInstance;

class GlucoseServiceValidator {

    //===========================================
    //              PROPERTIES
    //===========================================
    private error;
    private lastError;
    private errorMessages = [];
    private idRegex = /.{8}-.{4}-.{4}-.{4}-.{12}/;

    //===========================================
    //               CONSTRUCTOR
    //===========================================
    constructor(paths) {
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        GlucoseTransactionInstance = require(paths.GlucoseTransactionPath);

        this.errorMessages = [
            { code: 1, http: 422, message: "Invalid uuid provided." },
            { code: 2, http: 400, message: "Missing transaction object in the request body." }
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
    public validateUuid = (sId: string): string => {
        if (!sId || !this.idRegex.test(sId)) {
            this.lastError = this.error.getError(1, { sProvidedId: sId });
            return null;
        }
        return sId;
    };
    public validateTransaction = (oTransaction: IPresentationLayerGlucoseTransaction): GlucoseTransaction => {
        if (!oTransaction) {
            this.lastError = this.error.getError(2);
            return null;
        }
        return GlucoseTransactionInstance.fromPresentationLayerObject(oTransaction);
    };
    public getLastError = function() {
        return this.lastError;
    };

    //===========================================
    //             PRIVATE FUNCTIONS
    //===========================================
};

module.exports = GlucoseServiceValidator;
