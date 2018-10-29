class GlucoseServiceCore {
    //===========================================
    //                CONSTRUCTOR
    //===========================================
    constructor(paths) {
        //===========================================
        //             PUBLIC FUNCTIONS
        //===========================================
        this.getTransactionOptions = () => {
            return new Promise(fnResolve => fnResolve({ meals: this.persistence.getMealTypes() }));
        };
        this.getTransactions = (sUserId) => {
            return new Promise((fnResolve, fnReject) => {
                this.persistence.getTransactions(sUserId)
                    .then(aResult => fnResolve(aResult))
                    .catch(oError => fnReject(oError));
            });
        };
        this.getTransaction = (sTransactionId, sUserId) => {
            return new Promise((fnResolve, fnReject) => {
                this.persistence.getTransactionById(sTransactionId, sUserId)
                    .then(oResult => fnResolve(oResult))
                    .catch(oError => fnReject(oError));
            });
        };
        this.saveTransaction = (oTransaction, sUserId) => {
            return new Promise((fnResolve, fnReject) => {
                this.persistence.saveTransaction(oTransaction, sUserId)
                    .then(() => fnResolve())
                    .catch(oError => fnReject(oError));
            });
        };
        this.parseErrorForClient = (oError) => {
            let oDefaultError = this.error.getError();
            let oParsedError = {
                code: oError.code || oDefaultError.code,
                message: oError.message || oDefaultError.message,
                status: oError.http || oDefaultError.status
            };
            return oParsedError;
        };
        this.sendErrorToClient = (oResponse, oError) => {
            const oParsedError = this.parseErrorForClient(oError);
            oResponse.status(oParsedError.status).send(oParsedError);
        };
        const GlucosePersistenceManager = require(paths.GlucosePersistenceManagerPath);
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        this.GlucoseTransaction = require(paths.GlucoseTransactionPath);
        this.persistence = new GlucosePersistenceManager(null, paths);
        this.error = new GlucoseErrorGenerator("com.etauker.glucose", "service", "GlucoseServiceCore", [], paths);
    }
    ;
}
module.exports = GlucoseServiceCore;
