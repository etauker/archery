// Imports
const ArcheryPersistenceManager = require(ArcheryPersistenceManagerPath);
const ArcheryErrorGenerator = require(ArcheryErrorGeneratorPath);

// Instantiations
const persistence = new ArcheryPersistenceManager();
const error = new ArcheryErrorGenerator(
    "com.etauker.archery",
    "service",
    "ArcheryServiceCore",
    []
);

let core = {};

// Service logic
core.getNewSessionOptions = () => {
    return new Promise((fnResolve, fnReject) => {
        fnResolve({
            sessionTypes: persistence.getSessionTypes(),
            sessionCategories: persistence.getSessionCategory(),
            distances: persistence.getDistance(),
            targetFaces: persistence.getTargetFaces(),
            bowCategories: persistence.getBowCategory()
        })
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
console.log('--- ArcheryServiceCore ---');
console.log(core);
module.exports = core;
