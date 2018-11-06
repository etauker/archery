/**
*   Manages user session tokens.
*/
class ArcheryErrorGenerator {
    constructor(sPackage, sModule, sClass, aErrors) {
        this.errors = [{ code: 0, http: 500, message: "An unexpected error occured." }];
        this.errors = this.errors.concat(aErrors);
        this.template = {
            package: sPackage,
            module: sModule,
            class: sClass,
            code: this._mapModuleToCode(sModule),
            message: "",
            http: 500,
            error: {}
        };
    }
}
ArcheryErrorGenerator.prototype.getError = function(iCode, oOriginalError, sMessage, sAdditionalDetails) {
    var oError = JSON.parse(JSON.stringify(this.template));
    oError.code = parseFloat(this.template.code + "." + (iCode || 0));
    oError.message = sMessage || this._getMessage(iCode);
    oError.message += (sAdditionalDetails ? (" " + sAdditionalDetails) : "");
    oError.http = this._getHttp(iCode);
    oError.error = oOriginalError || {};
    // console.log(oError);
    return oError;
}
ArcheryErrorGenerator.prototype.registerErrors = function(aErrors) {
    this.errors = aErrors;
}
ArcheryErrorGenerator.prototype._getMessage = function(iCode) {
    var oError = this.errors.filter(oError => oError.code === iCode)[0] || this.errors[0];
    return oError.message;
}
ArcheryErrorGenerator.prototype._getHttp = function(iCode) {
    var oError = this.errors.filter(oError => oError.code === iCode)[0] || this.errors[0];
    return oError.http;
}
ArcheryErrorGenerator.prototype._mapModuleToCode = function(sModule) {
    switch(sModule) {
        case "persistence":
            return "1";
        case "logic":
            return "2";
        case "service":
            return "3";
        case "utils":
            return "4";
        default:
            return "-1";
    }
}
module.exports = ArcheryErrorGenerator;
