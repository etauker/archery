sap.ui.define([
	"com/etauker/glucose/base/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
	"use strict";

	var CreateUserController = BaseController.extend("com.etauker.glucose.createUser.CreateUser");

	CreateUserController.prototype.onInit = function () {
		this.oUserModel = new JSONModel({});
		this.getView().setModel(this.oUserModel, "user");
		this._resetUserModel();
		this.getRouter().attachRouteMatched(function (oEvent) {
			// Overwrite default routeMatched behaviour to prevent redirect to login
		});
	};
	CreateUserController.prototype.handleCreate = function (oEvent) {
		var sUsername = this.oUserModel.getProperty("/username");
		var sPassword = this.oUserModel.getProperty("/password");
		var sPasswordRepeat = this.oUserModel.getProperty("/passwordRepeat");

		if (sPassword !== sPasswordRepeat) {
			// TODO: Show error state for the password input boxes
			MessageToast.show("Passwords do not match!");
		} else {
			this._createUser(sUsername, sPassword).then(function(oResponse) {
				this.getOwnerComponent().getModel("security").setProperty("/user/username", sUsername);
				this._navBack();
				this._resetUserModel();
			}.bind(this)).fail(function(oError) {
				// TODO: Display the correct error to the user
				console.log(oError);
			}.bind(this));
		}
	};
	CreateUserController.prototype.handleCancel = function (oEvent) {
		this._navBack();
	};
	CreateUserController.prototype.handleNavBack = function (oEvent) {
		this._navBack();
	};



	/*
	*	INTERNAL FUNCTIONS
	*/
	CreateUserController.prototype._navBack = function () {
		this._resetUserModel();
		this.handleNavBack();
	};
	CreateUserController.prototype._resetUserModel = function () {
		var oUser = {
			username: "",
			password: "",
			passwordRepeat: ""
		};
		this.oUserModel.setData(oUser);
	};



	/*
	*	AJAX CALLS
	*/
	CreateUserController.prototype._createUser = function (sUsername, sPassword) {
		var sUrl = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/user/uri");
		return $.ajax({
			url: sUrl,
			method: "POST",
			data: {
			   username: sUsername,
			   password: sPassword
		   	}
		});
	};

	return CreateUserController;
});
