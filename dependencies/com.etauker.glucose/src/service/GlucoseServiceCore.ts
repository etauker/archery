class GlucoseServiceCore {

    //===========================================
    //               CLASS VARIABLES
    //===========================================
    private persistence;
    private error: any;
    private GlucoseTransaction;

    //===========================================
    //                CONSTRUCTOR
    //===========================================
    constructor(paths) {
        const GlucosePersistenceManager = require(paths.GlucosePersistenceManagerPath);
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        this.GlucoseTransaction = require(paths.GlucoseTransactionPath);
        this.persistence = new GlucosePersistenceManager(null, paths);
        this.error = new GlucoseErrorGenerator("com.etauker.glucose", "service", "GlucoseServiceCore", [

        ], paths);
    };

    //===========================================
    //             PUBLIC FUNCTIONS
    //===========================================
    public getTransactionOptions = () => {
        return new Promise(fnResolve => fnResolve({ meals: this.persistence.getMealTypes() }));
    };
    public getTransactions = (sUserId: string) => {
        return new Promise((fnResolve, fnReject) => {
            this.persistence.getTransactions(sUserId)
                .then(aResult => fnResolve(aResult))
                .catch(oError => fnReject(oError))
        });
    };
    public getTransaction = (sTransactionId: string, sUserId: string) => {
        return new Promise((fnResolve, fnReject) => {
            this.persistence.getTransactionById(sTransactionId, sUserId)
                .then(oResult => fnResolve(oResult))
                .catch(oError => fnReject(oError))
        });
    };
    public saveTransaction = (oTransaction: GlucoseTransaction, sUserId: string) => {
        return new Promise((fnResolve, fnReject) => {
            this.persistence.saveTransaction(oTransaction, sUserId)
                .then(() => fnResolve())
                .catch(oError => fnReject(oError))
        });
    };
    public parseErrorForClient = (oError: IGlucoseError) => {
        let oParsedError: IGlucoseHttpError = {
            code: "",
            message: "",
            status: 500
        }
        oParsedError.message = oError.message;
        oParsedError.code = oError.code;
        oParsedError.status = oError.http ? oError.http : 500;
        return oParsedError;
    };
    public sendErrorToClient = (oResponse, oError) => {
        const oParsedError: IGlucoseHttpError = this.parseErrorForClient(oError);
        oResponse.status(oParsedError.status).send(oParsedError);
    };

    //===========================================
    //             PRIVATE FUNCTIONS
    //===========================================

}
module.exports = GlucoseServiceCore;
