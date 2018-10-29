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
        this.getTransactions = () => {
            return new Promise((fnResolve, fnReject) => {
                fnResolve(this.persistence.getTransactions());
            });
        };
        this.getTransaction = (sTransactionId) => {
            return new Promise((fnResolve, fnReject) => {
                fnResolve(this.persistence.getTransactionById(sTransactionId));
            });
        };
        this.saveTransaction = (oTransaction) => {
            return new Promise((fnResolve, fnReject) => {
                this.persistence.saveTransaction(oTransaction)
                    .then(() => fnResolve())
                    .catch(oError => fnReject(oError));
            });
        };
        this.parseErrorForClient = (oError) => {
            console.log(oError);
            let oParsedError = {
                code: "",
                message: "",
                status: 500
            };
            oParsedError.message = oError.message;
            oParsedError.code = oError.code;
            oParsedError.status = oError.http ? oError.http : 500;
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
