sap.ui.define([
	"sap/ui/core/UIComponent",
	"com/etauker/security/Component",
], function (UIComponent, SecurityComponent) {
	"use strict";

	var GlucoseAppComponent = UIComponent.extend("com.etauker.glucose.Component", {
		metadata: {
			manifest: "json"
		}
	});

	GlucoseAppComponent.prototype.init = function () {
		UIComponent.prototype.init.apply(this, arguments);

		// create the views based on the url/hash
		this.getRouter().initialize();
		this.getModel("preferences").setData(this.getUserPreferences());
		this.oSecurity = new SecurityComponent();
		this.oSecurity.setup(this, arguments);
	};

	GlucoseAppComponent.prototype.navigateToTarget = function(sTargetName) {
		this.getRouter().navTo(sTargetName);
	};

	GlucoseAppComponent.prototype.sendRestRequest = function(oRequest) {
		var sToken = localStorage.getItem('com.etauker.glucose.security.token');
		oRequest.beforeSend = (xhr) => {
			xhr.setRequestHeader('Authorization', 'Bearer ' + sToken);
		}
		return $.ajax(oRequest);
	};

	GlucoseAppComponent.prototype.getUserPreferences = function() {

		const oDefaultPreferences = {
			appHome: {
				defaultTab: "readings"
			}
		};

		// TODO: Get preferences from the server
		let oPreferences = {};

		oPreferences = oPreferences || oDefaultPreferences;
		oPreferences.appHome = oPreferences.appHome || oDefaultPreferences.appHome;
		oPreferences.appHome.defaultTab = oPreferences.appHome.defaultTab || oDefaultPreferences.appHome.defaultTab;

		return oPreferences;
	}








	return GlucoseAppComponent;
});
