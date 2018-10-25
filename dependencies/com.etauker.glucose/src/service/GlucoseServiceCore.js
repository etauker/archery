// Imports
const GlucosePersistenceManager = require(GlucosePersistenceManagerPath);
const GlucoseErrorGenerator = require(GlucoseErrorGeneratorPath);

// Instantiations
const persistence = new GlucosePersistenceManager();
const error = new GlucoseErrorGenerator(
    "com.etauker.glucose",
    "service",
    "GlucoseServiceCore",
    []
);

let core = {};

// Service logic
core.getTransactionOptions = () => {
    return new Promise(fnResolve => fnResolve({ meals: persistence.getMealTypes() }))
}
core.getTransactions = () => {
    return new Promise((fnResolve, fnReject) => {
        fnResolve(persistence.getTransactions())
    })
}
core.saveTransaction = (oTransaction) => {
    return new Promise((fnResolve, fnReject) => {
        fnResolve(true);
    //     fnResolve({
    //         sessionTypes: persistence.getSessionTypes(),
    //         sessionCategories: persistence.getSessionCategory(),
    //         distances: persistence.getDistance(),
    //         targetFaces: persistence.getTargetFaces(),
    //         bowCategories: persistence.getBowCategory()
    //     })
    })
}

// Error handling helpers
core.parseErrorForClient = oError => {
    let oParsedError = {};
    oParsedError.message = oError.message;
    oParsedError.code = oError.code;
    oParsedError.status = oError.http ? oError.http : 500;
    return oParsedError;
};
core.sendErrorToClient = (oResponse, oError) => {
    const oParsedError = core.parseErrorForClient(oError);
    oResponse.status(oParsedError.status).send(oParsedError);
};

// Log and return
console.log('--- GlucoseServiceCore ---');
console.log(core);
module.exports = core;
