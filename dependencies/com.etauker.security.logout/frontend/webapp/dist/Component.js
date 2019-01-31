sap.ui.define([
	"sap/ui/core/UIComponent",
], function (UIComponent) {
	"use strict";

	var LogoutComponent = UIComponent.extend("com.etauker.security.logout.Component", {
		metadata: {
			manifest: "json"
		}
	});

	return LogoutComponent;
});
