class SecurityParameterValidator {
    // constructor(sPackage, sModule, sClass, aErrors) {
    //     this.errors = [{ code: 0, http: 500, message: "An unexpected error occured." }];
    //     this.errors = this.errors.concat(aErrors);
    //     this.template = {
    //         package: sPackage,
    //         module: sModule,
    //         class: sClass,
    //         code: this._mapModuleToCode(sModule),
    //         message: "",
    //         http: 500,
    //         error: {}
    //     };
    // }
};
SecurityParameterValidator.validateUser = function(oUser) {

    let oValidatedUser = {};
    return new Promise((fnResolve, fnReject) => {

        // TODO: Implement consistent use of SecurityErrorGenerator
        if (!oUser) fnReject(new Error("User is required."));

        var sUsername = this._validateUsername(oUser.username);
        if (sUsername) { oValidatedUser.username = sUsername; };

        // TODO: Implement validation for the following
        // oUser.uuid = oUser.uuid;
        // oUser.password_hash = oUser.password_hash;
        // oUser.created_by = oUser.created_by;
        // oUser.created_at = oUser.created_at;
        // oUser.updated_by = oUser.updated_by;
        // oUser.updated_at = oUser.updated_at;

        fnResolve(oValidatedUser);
    });
};
SecurityParameterValidator.validateUsername = function(sUsername) {
    return new Promise((fnResolve, fnReject) => {
        sUsername = this._validateUsername(sUsername);
        if (sUsername) fnResolve(sUsername);
        else fnReject("Invalid username.");
    });
};
SecurityParameterValidator.validatePassword = function(sPassword) {
    return sPassword;
};
SecurityParameterValidator._validateUsername = function(sUsername) {
    if (!sUsername) return null;
    return sUsername;
};

module.exports = SecurityParameterValidator;
