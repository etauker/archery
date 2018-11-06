sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/MessageToast"
], function (Component, MessageToast) {
	"use strict";

	var SecurityComponent = Component.extend("com.etauker.security.Component", {
		metadata: {
			manifest: "json"
		}
	});

	SecurityComponent.prototype.setup = function (oContext) {
		this.oAppContext = oContext || null;
		this.oSecurityModel = this.getModel("security");
		this.oSecurityModel.setData({
			JWT: {},
			LOGGED_IN: false,
			APP_ROLES: {
				Diabetic: "com.etauker.glucose.Diabetic"
			}
		});
		this.oAppContext.setModel(this.oSecurityModel, "security");
	};
	SecurityComponent.prototype.setParentContext = function (oContext) {
		this.oAppContext = oContext;
	};
	SecurityComponent.prototype.handleLogin = function (sUsername, sPassword) {
		var jwt = localStorage.getItem('com.etauker.glucose.security.token');//Cookies.get("token");
		if (jwt && jwt !== "undefined") {
			this._onSuccessfulLogin(jwt);
		}
		else {
			this._login(sUsername, sPassword)
				.then(this._onSuccessfulLogin.bind(this))
				.fail(this._onFailedLogin.bind(this));
		}
	};
	SecurityComponent.prototype.handleLogout = function () {
		var jwt = localStorage.getItem('com.etauker.glucose.security.token');//Cookies.get("token");
		if (jwt && jwt !== "undefined") {
			this._logout(jwt)
				.then(this._onSuccessfulLogout.bind(this))
				.fail(this._onFailedLogout.bind(this));
		}
		else {
			this._onSuccessfulLogout(jwt);
		}
	};
	SecurityComponent.prototype.checkLoginState = function () {
		var bLoggedIn = this.oSecurityModel.getProperty("/LOGGED_IN");
		if (!bLoggedIn) {
			var token = localStorage.getItem('com.etauker.glucose.security.token');//Cookies.get("token");
			if (token) {
				token = token.substring("token".length, token.length);
				var decoded = jwt_decode(token);
				this.oSecurityModel.setProperty("/JWT", decoded);
				if (decoded) {
					this.oSecurityModel.setProperty("/LOGGED_IN", true);
				}
			}
		};
	}



	SecurityComponent.prototype._login = function (sUsername, sPassword) {
		let sUrl = this.getManifestEntry("/sap.app/dataSources/login/uri");
		// sUrl = sUrl.replace("localhost", "dev01"); //for development
		// sUrl = sUrl.replace("443", "8888"); //for development
		// sUrl = sUrl.replace("https", "http"); //for development

		let sMethod = "POST";
		return $.ajax({
		    url: sUrl,
			method: sMethod,
			data: {
			   username: sUsername,
			   password: sPassword
		   	}
		});
	};
	SecurityComponent.prototype._logout = function (sToken) {
		let sUrl = this.getManifestEntry("/sap.app/dataSources/logout/uri");
		// sUrl = sUrl.replace("localhost", "dev01"); //for development
		// sUrl = sUrl.replace("443", "8888"); //for development
		// sUrl = sUrl.replace("https", "http"); //for development

		let sMethod = "GET";
		return $.ajax({
			url: sUrl,
			type: sMethod,
			beforeSend: function (xhr) {
			    xhr.setRequestHeader('Authorization', 'Bearer ' + sToken);
			}
		});
	};
	SecurityComponent.prototype._onSuccessfulLogin = function (sResponse) {
		if (sResponse) {
			// Save the token as a cookies
			localStorage.setItem('com.etauker.glucose.security.token', sResponse);
			// Cookies.set("token", sResponse);
			// Decode token
			var oDecoded = jwt_decode(sResponse);
			// Add to security model
			this.oSecurityModel.setProperty("/JWT", oDecoded);
			// this.oSecurityModel.setProperty("/USER/USERNAME", "");
			// Return true
			this.oSecurityModel.setProperty("/LOGGED_IN", true);
			this.oAppContext.navigateToTarget("appHome");
		}
	};
	SecurityComponent.prototype._onFailedLogin = function (oError) {
		var oErrorObject = oError.responseJSON;
		console.log(oErrorObject);
		this.oSecurityModel.setProperty("/LOGGED_IN", false);
		MessageToast.show("Username or password is incorrect");
	};
	SecurityComponent.prototype._onSuccessfulLogout = function () {
		// Cookies.remove('token');
		localStorage.removeItem('com.etauker.glucose.security.token');
		this.oSecurityModel.setProperty("/JWT", {});
		this.oSecurityModel.setProperty("/LOGGED_IN", false);
		this.oAppContext.navigateToTarget("login");
		this.clearAppContext();
	};
	SecurityComponent.prototype._onFailedLogout = function (oError) {
		var oErrorObject = oError.responseJSON;
		console.log(oErrorObject);
		MessageToast.show("An error occured during logout: " + (oErrorObject.message || ""));
	};
	SecurityComponent.prototype._showContent = function(oContext) {
		oContext.getView().byId("unauthorised") ? oContext.getView().byId("unauthorised").setProperty("visible", false) : null;
		oContext.getView().byId("forbidden") ? oContext.getView().byId("forbidden").setProperty("visible", false) : null;
		oContext.getView().byId("main") ? oContext.getView().byId("main").setProperty("visible", true) : null;
		oContext.getView().byId("footer") ? oContext.getView().byId("footer").setProperty("visible", true) : null;
	};
	SecurityComponent.prototype._showUnauthorised = function(oContext) {
		oContext.getView().byId("unauthorised") ? oContext.getView().byId("unauthorised").setProperty("visible", true) : null;
		oContext.getView().byId("forbidden") ? oContext.getView().byId("forbidden").setProperty("visible", false) : null;
		oContext.getView().byId("main") ? oContext.getView().byId("main").setProperty("visible", false) : null;
		oContext.getView().byId("footer") ? oContext.getView().byId("footer").setProperty("visible", false) : null;
	};
	SecurityComponent.prototype._showForbidden = function(oContext) {
		oContext.getView().byId("unauthorised") ? oContext.getView().byId("unauthorised").setProperty("visible", false) : null;
		oContext.getView().byId("forbidden") ? oContext.getView().byId("forbidden").setProperty("visible", true) : null;
		oContext.getView().byId("main") ? oContext.getView().byId("main").setProperty("visible", false) : null;
		oContext.getView().byId("footer") ? oContext.getView().byId("footer").setProperty("visible", false) : null;
	};
	SecurityComponent.prototype.checkPermissions = function(oContext) {
		var bLoggedIn = this.oSecurityModel.getProperty("/LOGGED_IN");
		if (!bLoggedIn) {
			this._showUnauthorised(oContext);
		} else {
			// var bUserHasPermission = false;
            // TODO: check permissions
			// if (bUserHasPermission) {
				this._showContent(oContext);
			// }
			// else {
			// 	this._showForbidden(oContext)
			// }
		}
	};
	SecurityComponent.prototype.clearAppContext = function() {

		// Get all models from app context manifest
		let oModelsConfig = this.oAppContext.getManifestEntry("/sap.ui5/models");

		// Set the data of each of them to empty objects
		Object.entries(oModelsConfig).forEach(aModelConfig => {
			if (aModelConfig[1].type && aModelConfig[1].type === "sap.ui.model.json.JSONModel") {
				const oModel = this.oAppContext.getModel(aModelConfig[0] || "undefined");
				oModel.setData({});
			}
		});
	};



	return SecurityComponent;
});
