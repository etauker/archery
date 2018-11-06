var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.getTransactions = (sUserId) => __awaiter(this, void 0, void 0, function* () {
            // this.logger.logObject(sUserId, 'sUserId', 'getTransactions', 'GlucoseServiceCore');
            let oTransaction = new GlucoseTransactionInstance();
            oTransaction.createdBy = sUserId;
            let aResults = yield this.persistence.getTransactions(null, sUserId);
            let aObjects = aResults.map(oResult => {
                return GlucoseTransactionInstance.fromDataLayerObject(oResult);
            });
            let aResult = aObjects.map(oObject => {
                return GlucoseTransactionInstance.toPresentationLayerObject(oObject);
            });
            // this.logger.logObject(aResult, 'end', 'getTransactions', 'GlucoseServiceCore');
            return aResult;
        });
        this.getTransaction = (sTransactionId, sUserId) => {
            return this.persistence.getTransactionById(sTransactionId, sUserId);
        };
        this.saveTransaction = (oTransaction, sUserId) => {
            this.logger.logObject(oTransaction, 'sUserId', 'saveTransaction', 'GlucoseServiceCore');
            this.logger.logObject(oTransaction, 'oTransaction', 'saveTransaction', 'GlucoseServiceCore');
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
        this.logger = new GlucoseLogger(paths);
        this.persistence = new GlucosePersistenceManager(null, paths);
        this.error = new GlucoseErrorGenerator('com.etauker.glucose', 'service', 'GlucoseServiceCore', [], paths);
    }
    ;
}
module.exports = GlucoseServiceCore;
