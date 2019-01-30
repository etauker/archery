sap.ui.define([
	"sap/ui/core/UIComponent",
], function (UIComponent) {
	"use strict";

	var LoginComponent = UIComponent.extend("com.etauker.security.login.Component", {
		metadata: {
			manifest: "json"
		}
	});

	return LoginComponent;
});
