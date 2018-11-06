sap.ui.define([
	"com/etauker/glucose/base/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
	"use strict";

	var LoginController = BaseController.extend("com.etauker.glucose.login.Login");

	LoginController.prototype.onInit = function () {
		BaseController.prototype.onInit.call(this);
		this.oSecurityModel = this.getOwnerComponent().getModel("security");
		this.oLoginModel = new JSONModel({
			username: "", //this.oSecurityModel.getProperty("/USER/USERNAME") || "",
			password: ""
		});
		this.getView().setModel(this.oLoginModel, "login");
	};
	LoginController.prototype.onLogin = function (oEvent) {
		var sUsername = this.oLoginModel.getProperty("/username");
		var sPassword = this.oLoginModel.getProperty("/password");
		this.handleLogin(sUsername, sPassword);
	};
	LoginController.prototype.onLogout = function (oEvent) {
		this.handleLogout();
	};
	LoginController.prototype.onDisplayNotFound = function (oEvent) {
		this.handleDisplayNotFound();
	};
	LoginController.prototype.onCreateAccount = function (oEvent) {
		this.getRouter().navTo("createUser", {}, false);
	};

	return LoginController;
});
