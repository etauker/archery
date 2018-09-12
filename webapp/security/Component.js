sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/MessageToast",
	"com/etauker/security/libs/js.cookie"
], function (Component, MessageToast) {
	"use strict";

	var SecurityComponent = Component.extend("com.etauker.security.Component", {
		metadata: {
			manifest: "json"
		}
	});

	SecurityComponent.prototype.init = function () {
		this.oAppContext = null;
		this.oSecurityModel = this.getModel("security");
		this.oSecurityModel.setData({
			JWT: {},
			LOGGED_IN: false,
			APP_ROLES: {
				Archer: "com.etauker.archery.Archer",
				Coach: "com.etauker.archery.Coach",
				Admin: "com.etauker.archery.Admin"
			}
		});
	};
	SecurityComponent.prototype.setParentContext = function (oContext) {
		this.oAppContext = oContext;
	};
	SecurityComponent.prototype.handleLogin = function (sUsername, sPassword) {
		var jwt = Cookies.get("token");
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
		// Invalidate session cookie
		Cookies.remove('token');
		// Make a REST call
        // TODO: remove session on the backend
		// Remove token from security model
		this.oSecurityModel.setProperty("/JWT", {});
		this.oSecurityModel.setProperty("/LOGGED_IN", false);
		this.oAppContext.navigateToTarget("login");
	};
	SecurityComponent.prototype.checkLoginState = function () {
		var bLoggedIn = this.oSecurityModel.getProperty("/LOGGED_IN");
		if (!bLoggedIn) {
			var token = Cookies.get("token");
			if (token) {
				token = token.substring("token".length, token.length);
				var decoded = jwt_decode(token);
				this.oSecurityModel.setProperty("/JWT", decoded);
				if (decoded) {
					this.oSecurityModel.setProperty("/LOGGED_IN", true);
				}
			}
			// this.checkPermissions();
		};
	}
	
	
	
	SecurityComponent.prototype._login = function (sUsername, sPassword) {
		var sUrl = this.getManifestEntry("/sap.app/dataSources/login/uri");
		return $.ajax({
		    url: sUrl,
			method: "POST",
			data: {
			   username: sUsername,
			   password: sPassword
		   	}
		});
	};
	SecurityComponent.prototype._onSuccessfulLogin = function (sResponse) {	
		if (sResponse) {
			// Save the token as a cookies
			Cookies.set("token", sResponse); 
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
		// Log error
		var oErrorObject = oError.responseJSON; 
		console.log(oErrorObject);
		this.oSecurityModel.setProperty("/LOGGED_IN", false);
		MessageToast.show("Username or password is incorrect");
	};
	SecurityComponent.prototype._showContent = function(oContext) {
		oContext.getView().byId("unauthorised").setProperty("visible", false);
		oContext.getView().byId("forbidden").setProperty("visible", false);
		oContext.getView().byId("main").setProperty("visible", true);
	};
	SecurityComponent.prototype._showUnauthorised = function(oContext) {
		oContext.getView().byId("unauthorised").setProperty("visible", true);
		oContext.getView().byId("forbidden").setProperty("visible", false);
		oContext.getView().byId("main").setProperty("visible", false);
	};
	SecurityComponent.prototype._showForbidden = function(oContext) {
		oContext.getView().byId("unauthorised").setProperty("visible", false);
		oContext.getView().byId("forbidden").setProperty("visible", true);
		oContext.getView().byId("main").setProperty("visible", false);
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

	return SecurityComponent;
});
