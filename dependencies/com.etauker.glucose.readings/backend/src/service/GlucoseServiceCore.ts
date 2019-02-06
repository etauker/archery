var GlucoseTransactionInstance;

class GlucoseServiceCore {

    //===========================================
    //               CLASS VARIABLES
    //===========================================
    private persistence;
    private logger;
    private error: any;
    private GlucoseTransaction;

    //===========================================
    //                CONSTRUCTOR
    //===========================================
    constructor(paths) {
        const GlucosePersistenceManager = require(paths.GlucosePersistenceManagerPath);
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
        const GlucoseLogger = require(paths.GlucoseLoggerPath);
        GlucoseTransactionInstance = require(paths.GlucoseTransactionPath);
        this.logger = new GlucoseLogger(paths);
        this.persistence = new GlucosePersistenceManager(null, paths);
        this.error = new GlucoseErrorGenerator(
            'com.etauker.glucose',
            'service',
            'GlucoseServiceCore',
            [],
            paths
        );
    };

    //===========================================
    //             PUBLIC FUNCTIONS
    //===========================================
    public getTransactionOptions = () => {
        return new Promise(fnResolve => fnResolve({ meals: this.persistence.getMealTypes() }));
    };
    public getTransactions = async (sUserId: string) => {
        // this.logger.logObject(sUserId, 'sUserId', 'getTransactions', 'GlucoseServiceCore');

        let oTransaction: GlucoseTransaction = new GlucoseTransactionInstance();
        oTransaction.createdBy = sUserId;
        let aResults = await this.persistence.getTransactions(null, sUserId);
        let aObjects: GlucoseTransaction[] = aResults.map(oResult => {
            return GlucoseTransactionInstance.fromDataLayerObject(oResult)
        });

        let aResult = aObjects.map(oObject => {
            return GlucoseTransactionInstance.toPresentationLayerObject(oObject)
        });
        // this.logger.logObject(aResult, 'end', 'getTransactions', 'GlucoseServiceCore');
        return aResult;
    };
    public getTransaction = (sTransactionId: string, sUserId: string) => {
        return this.persistence.getTransactionById(sTransactionId, sUserId);
    };
    public saveTransaction = (oTransaction: GlucoseTransaction, sUserId: string) => {
        this.logger.logObject(oTransaction, 'sUserId', 'saveTransaction', 'GlucoseServiceCore');
        this.logger.logObject(oTransaction, 'oTransaction', 'saveTransaction', 'GlucoseServiceCore');
        return this.persistence.saveTransaction(oTransaction, sUserId);
    };
    public parseErrorForClient = (oError: IGlucoseError) => {
        let oDefaultError = this.error.getError();
        let oParsedError: IGlucoseHttpError = {
            code: oError.code || oDefaultError.code,
            message: oError.message || oDefaultError.message,
            status: oError.http || oDefaultError.http
        }
        return oParsedError;
    };
    public sendErrorToClient = (oResponse, oError) => {
        console.log(oError);
        const oParsedError: IGlucoseHttpError = this.parseErrorForClient(oError);
        oResponse.status(oParsedError.status).send(oParsedError);
    };

    //===========================================
    //             PRIVATE FUNCTIONS
    //===========================================

}
module.exports = GlucoseServiceCore;
