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
		return $.ajax(oRequest)
			.error(oError => {
				if (oError.status == 401) {
					this.oSecurity.handleLogout();
				}
				else {
					console.log(oError);
				}
			});
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
	};
	GlucoseAppComponent.prototype.retrieveReadings = function() {
		let sUrl = this.getManifestEntry("/sap.app/dataSources/transactions/get/uri");
		sUrl = sUrl.replace("localhost", "dev01"); //for development

		let sMethod = "GET";
		let oRequest = {
			url: sUrl,
			method: sMethod
		};
		return this.sendRestRequest(oRequest);
	};
	GlucoseAppComponent.prototype.retrieveOptions = function() {
		var sUrl = this.getManifestEntry("/sap.app/dataSources/transactions/add/uri");
		sUrl = sUrl.replace("localhost", "dev01"); //for development

		var sMethod = "GET";
		var oRequest = {
		    url: sUrl,
			method: sMethod
		};
		return this.sendRestRequest(oRequest);
	};
	GlucoseAppComponent.prototype.saveReading = function(oReading) {
		var sUrl = this.getManifestEntry("/sap.app/dataSources/transactions/add/uri");
		sUrl = sUrl.replace("localhost", "dev01"); //for development

		var sMethod = "POST";
		var oRequest = {
		    url: sUrl,
			method: sMethod,
			data: oReading
		};
		return this.sendRestRequest(oRequest);
	};
	return GlucoseAppComponent;
});
