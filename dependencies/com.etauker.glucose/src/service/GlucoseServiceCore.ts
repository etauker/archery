class GlucoseServiceCore {

    //===========================================
    //               CLASS VARIABLES
    //===========================================
    private persistence;
    private error: any;

    //===========================================
    //                CONSTRUCTOR
    //===========================================
    constructor(paths) {
        const GlucosePersistenceManager = require(paths.GlucosePersistenceManagerPath);
        const GlucoseErrorGenerator = require(paths.GlucoseErrorGeneratorPath);
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
    public getTransactions = () => {
        return new Promise((fnResolve, fnReject) => {
            fnResolve(this.persistence.getTransactions());
        });
    };
    public saveTransaction = (oTransaction) => {
        return new Promise((fnResolve, fnReject) => {
            fnResolve(true);
            //     fnResolve({
            //         sessionTypes: this.persistence.getSessionTypes(),
            //         sessionCategories: this.persistence.getSessionCategory(),
            //         distances: this.persistence.getDistance(),
            //         targetFaces: this.persistence.getTargetFaces(),
            //         bowCategories: this.persistence.getBowCategory()
            //     })
        });
    };
    public parseErrorForClient = (oError: IGlucoseError) => {
        console.log(oError);
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