var GlucoseTransactionInstance;
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
            let oTransaction = new GlucoseTransactionInstance();
            oTransaction.createdBy = sUserId;
            return this.persistence.getTransactions(oTransaction);
        };
        this.getTransaction = (sTransactionId, sUserId) => {
            return this.persistence.getTransactionById(sTransactionId, sUserId);
        };
        this.saveTransaction = (oTransaction, sUserId) => {
            return this.persistence.saveTransaction(oTransaction, sUserId);
        };
        this.parseErrorForClient = (oError) => {
            let oDefaultError = this.error.getError();
            let oParsedError = {
                code: oError.code || oDefaultError.code,
                message: oError.message || oDefaultError.message,
                status: oError.http || oDefaultError.http
            };
            return oParsedError;
        };
        this.sendErrorToClient = (oResponse, oError) => {
            console.log(oError);
            const oParsedError = this.parseErrorForClient(oError);
            oResponse.status(oParsedError.status).send(oParsedError);
        };
        const GlucosePersistenceManager = require(paths.GlucosePersistenceManagerPath);
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        GlucoseTransactionInstance = require(paths.GlucoseTransactionPath);
        this.persistence = new GlucosePersistenceManager(null, paths);
        this.error = new GlucoseErrorGenerator('com.etauker.glucose', 'service', 'GlucoseServiceCore', [], paths);
    }
    ;
}
module.exports = GlucoseServiceCore;
