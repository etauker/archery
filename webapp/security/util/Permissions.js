sap.ui.define([], function () {
	"use strict";
    
	return {
		check: function (sRequiredPermission, oJwt) {
			var aUserPermissions = ["com.etauker.archery.Archer"];
			return aUserPermissions.some(function(sPermission) {
                return sPermission === sRequiredPermission;
            })
		}
	};
});