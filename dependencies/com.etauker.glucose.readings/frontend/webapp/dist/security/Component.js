sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/MessageToast",
	"com/etauker/glucose/libs/jwt-decode.min"
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
		this.isPriviledged();
	};
	SecurityComponent.prototype.setParentContext = function (oContext) {
		this.oAppContext = oContext;
	};
	SecurityComponent.prototype.checkLoginState = function () {
		var bLoggedIn = this.oSecurityModel.getProperty("/LOGGED_IN");
		if (!bLoggedIn) {
			var token = localStorage.getItem('com.etauker.security.token');//Cookies.get("token");
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
	SecurityComponent.prototype.handleLogout = function () {
		// Cookies.remove('token');
		localStorage.removeItem('com.etauker.security.token');
		this.oSecurityModel.setProperty("/JWT", {});
		this.oSecurityModel.setProperty("/LOGGED_IN", false);
		this.clearAppContext();
		this.handleNavToLogout();
	};
	SecurityComponent.prototype.handleSuccessfulLogin = function () {
			let sToken = localStorage.getItem('com.etauker.security.token');
			var oDecoded = jwt_decode(sToken);
			this.oSecurityModel.setProperty("/JWT", oDecoded);
			this.oSecurityModel.setProperty("/LOGGED_IN", true);
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
	SecurityComponent.prototype.handleNavToLogin = function(oReading) {
		let protocol = window.location.protocol;
		let host = window.location.host;
		let path = 'login';
		let search = '?return=glucose';
		let href = `${protocol}//${host}/${path}${search}`;
		window.location.href = href;
	};
	SecurityComponent.prototype.handleNavToLogout = function(oReading) {
		let protocol = window.location.protocol;
		let host = window.location.host;
		let path = 'logout';
		let search = '?return=glucose';
		let href = `${protocol}//${host}/${path}${search}`;
		window.location.href = href;
	};
	SecurityComponent.prototype.isPriviledged = function(oReading) {

		try {
			var sToken = localStorage.getItem('com.etauker.security.token');
			var oDecoded = jwt_decode(sToken);
			var hasRole = oDecoded.roles.some(role => role.name.indexOf('com.etauker.glucose') != 1);
			var now = new Date();
			now = now.valueOf() / 1000;

			if (!sToken || oDecoded.exp < now || !hasRole) {
				this.handleNavToLogin();
			} else {
				this.handleSuccessfulLogin();
			}
		} catch (error) {
			this.handleNavToLogin();
		}
	};

	return SecurityComponent;
});
