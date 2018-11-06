sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"com/etauker/security/util/Permissions",
	"com/etauker/glucose/libs/jwt-decode.min"
], function(Controller, History, Permissions) {
	"use strict";

	var BaseController = Controller.extend("com.etauker.glucose.base.BaseController", {
		permissions: Permissions
	});

	BaseController.prototype.onInit = function() {
		this.oSecurity = this.getOwnerComponent().oSecurity;
	};
	BaseController.prototype.handleRouteMatched = function () {
		this.oSecurity.checkLoginState();
		this.oSecurity.checkPermissions(this);
	},
	BaseController.prototype.handleLogout = function() {
		this.oSecurity.handleLogout();
	};
	BaseController.prototype.handleLogin = function(sUsername, sPassword) {
		this.oSecurity.handleLogin(sUsername, sPassword);
	};
	BaseController.prototype.getRouter = function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	};
	BaseController.prototype.onNavBack = function(oEvent) {
		this.handleNavBack();
	};
	BaseController.prototype.onNavToLogin = function(oEvent) {
		this.getRouter().navTo("login", {}, true /*no history*/);
	};
	BaseController.prototype.handleNavBack = function() {
		var oHistory = History.getInstance();
		var sPreviousHash = oHistory.getPreviousHash();
		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			this.getRouter().navTo("appHome", {}, true /*no history*/);
		}
	};
	BaseController.prototype.onDisplayNotFound = function (oEvent) {
		this.handleDisplayNotFound();
	};
	BaseController.prototype.handleDisplayNotFound = function(oEvent) {
		// Display "notFound" screen without changing the hash
		this.getRouter().getTargets().display("notFound", {
			fromTarget : "home"
		});
	};

	return BaseController;
});
