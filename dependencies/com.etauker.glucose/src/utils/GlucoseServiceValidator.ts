var GlucoseTransactionInstance;

class GlucoseServiceValidator {

    //===========================================
    //              PROPERTIES
    //===========================================
    private error;
    private logger;
    private lastError;
    private errorMessages = [];
    private idRegex = /.{8}-.{4}-.{4}-.{4}-.{12}/;

    //===========================================
    //               CONSTRUCTOR
    //===========================================
    constructor(paths) {
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        GlucoseTransactionInstance = require(paths.GlucoseTransactionPath);
        const GlucoseLogger = require(paths.GlucoseLoggerPath);

        this.logger = new GlucoseLogger(paths);
        this.errorMessages = [
            { code: 1, http: 422, message: "Invalid uuid provided." },
            { code: 2, http: 400, message: "Missing transaction object in the request body." },
            { code: 3, http: 400, message: "Incorrect datatype provided." },
            { code: 4, http: 400, message: "Missing property." }
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
    public validateTransaction = (oTransaction: IPresentationLayerGlucoseTransaction): IPresentationLayerGlucoseTransaction => {
        this.logger.logObject(oTransaction, 'start', 'validateTransaction', 'GlucoseServiceValidator');

        if (!oTransaction) {
            this.lastError = this.error.getError(2);
            return null;
        }

        // oObject, sProperty, sDatatype, bOptional, bNullable
        if (!this._checkProperty(oTransaction, "id", "string", true, true)) return null;
        if (!this._checkProperty(oTransaction, "dateTime", "number", true, true)) return null;
        if (!this._checkProperty(oTransaction, "reading", "number", true, true)) return null;
        if (!this._checkProperty(oTransaction, "carbohydrates", "number", true, true)) return null;
        if (!this._checkProperty(oTransaction, "insulinUnitsShort", "number", true, true)) return null;
        if (!this._checkProperty(oTransaction, "insulinUnitsLong", "number", true, true)) return null;
        if (!this._checkProperty(oTransaction, "correctionUnits", "number", true, true)) return null;
        if (!this._checkProperty(oTransaction, "meal", "string", true, true)) return null;
        if (!this._checkProperty(oTransaction, "note", "string", true, true)) return null;

        try {
            new Date(oTransaction.dateTime);
        } catch (oError) {
            console.log(oError);
            this.lastError = this.error.getError(3, null, '', `Property "dateTime" cannot be converted to a Date object.`);
            return null;
        }

        this.logger.logObject(oTransaction, 'end', 'validateTransaction', 'GlucoseServiceValidator');
        return oTransaction;
    };
    public getLastError = function() {
        return this.lastError;
    };

    //===========================================
    //             PRIVATE FUNCTIONS
    //===========================================
    private _checkProperty = function(oObject: any, sProperty: string, sDatatype: string, bOptional: boolean, bNullable: boolean) {

        // Property is optional and doesn't exist - true
        if (bOptional === true && !oObject[sProperty]) return true;

        // Property is not optional and doesn't exist - false
        if (bOptional === false && !oObject[sProperty]) {
            this.lastError = this.error.getError(3, null, '', `Expected "${sProperty}" to be of type "${sDatatype}" but received "null".`);
            return false;
        }

        //=== Property exists:
            // Property is nullable and is null - true
            if (bNullable === true && oObject[sProperty] === null) return true;

            // Property is not nullable and is null - false
            if (bNullable === false && oObject[sProperty] === null) {
                this.lastError = this.error.getError(4, null, '', `Property "${sProperty}" must be provided.`);
                return false;
            }

            //=== Property is not null:
                // Property is of correct datatype - true
                if (typeof oObject[sProperty] === sDatatype) return true;

                // Property is of incorrect datatype - false
                this.lastError = this.error.getError(3, null, '', `Expected "${sProperty}" to be of type "${sDatatype}" but received "${typeof oObject[sProperty]}".`);
                return false;
    };
};

module.exports = GlucoseServiceValidator;
