/**
*   Manages user session tokens.
*/
class SecurityErrorGenerator {
    constructor(sPackage, sModule, sClass, aErrors) {
        this.errors = [{ code: 0, message: "An unexpected error occured." }];
        this.errors = this.errors.concat(aErrors);
        this.template = {
            package: sPackage,
            module: sModule,
            class: sClass,
            code: this._mapModuleToCode(sModule),
            message: "",
            error: {}
        };
    }
}
SecurityErrorGenerator.prototype.getError = function(iCode, oOriginalError, sMessage, sAdditionalDetails) {
    var oError = JSON.parse(JSON.stringify(this.template));
    oError.code = this.template.code + "." + (iCode || 0);
    oError.message = sMessage || this._getMessage(iCode);
    oError.message += (sAdditionalDetails ? (" " + sAdditionalDetails) : "");
    oError.error = oOriginalError || {};
    // console.log(oError);
    return oError;
}
SecurityErrorGenerator.prototype.registerErrors = function(aErrors) {
    this.errors = aErrors;
}
SecurityErrorGenerator.prototype._getMessage = function(iCode) {
    var oError = this.errors.filter(oError => oError.code === iCode)[0] || this.errors[0];
    return oError.message;
}
SecurityErrorGenerator.prototype._mapModuleToCode = function(sModule) {
    switch(sModule) {
        case "data":
            return "1";
        case "persistence":
            return "2";
        case "logic":
            return "3";
        case "service":
            return "4";
        case "client":
            return "5";
        case "libs":
            return "6";
        case "util":
            return "7";
        default:
            return "0";
    }
}
module.exports = SecurityErrorGenerator;
