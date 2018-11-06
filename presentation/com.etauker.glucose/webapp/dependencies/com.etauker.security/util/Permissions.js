sap.ui.define([], function () {
	"use strict";

	return {
		check: function (sRequiredPermission, oJwt) {
			if (!oJwt.roles) return false;

			var aUserPermissions = oJwt.roles;
			return aUserPermissions.some(function(oPermission) {
                return oPermission.name === sRequiredPermission;
            })
		}
	};
});
