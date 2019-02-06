"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GlucoseTransactionInstance;
class GlucoseReadingsServiceCore {
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
        this.getTransactions = async (sUserId) => {
            // this.logger.logObject(sUserId, 'sUserId', 'getTransactions', 'GlucoseReadingsServiceCore');
            let oTransaction = new GlucoseTransactionInstance();
            oTransaction.createdBy = sUserId;
            let aResults = await this.persistence.getTransactions(null, sUserId);
            let aObjects = aResults.map(oResult => {
                return GlucoseTransactionInstance.fromDataLayerObject(oResult);
            });
            let aResult = aObjects.map(oObject => {
                return GlucoseTransactionInstance.toPresentationLayerObject(oObject);
            });
            // this.logger.logObject(aResult, 'end', 'getTransactions', 'GlucoseReadingsServiceCore');
            return aResult;
        };
        this.getTransaction = (sTransactionId, sUserId) => {
            return this.persistence.getTransactionById(sTransactionId, sUserId);
        };
        this.saveTransaction = (oTransaction, sUserId) => {
            this.logger.logObject(oTransaction, 'sUserId', 'saveTransaction', 'GlucoseReadingsServiceCore');
            this.logger.logObject(oTransaction, 'oTransaction', 'saveTransaction', 'GlucoseReadingsServiceCore');
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
        const GlucoseLogger = require(paths.GlucoseLoggerPath);
        GlucoseTransactionInstance = require(paths.GlucoseTransactionPath);
        console.log(GlucoseTransactionInstance);
        this.logger = new GlucoseLogger(paths);
        this.persistence = new GlucosePersistenceManager(null, paths);
        this.error = new GlucoseErrorGenerator('com.etauker.glucose', 'service', 'GlucoseReadingsServiceCore', [], paths);
    }
    ;
}
module.exports = GlucoseReadingsServiceCore;
