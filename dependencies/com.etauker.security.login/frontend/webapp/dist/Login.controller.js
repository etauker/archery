sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"com/etauker/security/login/libs/jwt-decode.min"
], function (Controller, JSONModel, MessageToast) {
	"use strict";

	var LoginController = Controller.extend("com.etauker.security.login.Login");



	//===========================================
	//             LIFECYCLE METHODS
	//===========================================
	LoginController.prototype.onInit = function () {

		this.PARAMS = {
			RETURN: 'return'
		}

		const jwt = localStorage.getItem('com.etauker.security.token');
		if (jwt) {
			localStorage.removeItem('com.etauker.security.token');
			location.reload();
		}

		this.oLoginModel = new JSONModel({
			username: "",
			password: ""
		});
		this.getView().setModel(this.oLoginModel, "login");
	};



	//===========================================
	//          EXTERNAL EVENT HANDLERS
	//===========================================
	LoginController.prototype.onLogin = function (oEvent) {
		var sUsername = this.oLoginModel.getProperty("/username");
		var sPassword = this.oLoginModel.getProperty("/password");
		this.handleLogin(sUsername, sPassword);
	};



	//===========================================
	//          INTERNAL EVENT HANDLERS
	//===========================================
	LoginController.prototype.handleLogin = function (sUsername, sPassword) {
		var jwt = localStorage.getItem('com.etauker.security.token');
		if (jwt) {
			this._onSuccessfulLogin(jwt);
		}
		else {
			this._login(sUsername, sPassword)
			.then(this._onSuccessfulLogin.bind(this))
			.fail(this._onFailedLogin.bind(this));
		}
	};



	//===========================================
	//            INTERNAL FUNCTIONS
	//===========================================
	LoginController.prototype._login = function (sUsername, sPassword) {
		let sUrl = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/login/uri");
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
	LoginController.prototype._nav = function() {
		let parameters = window.location.search.split(/[\?&]/);
		let protocol = window.location.protocol;
		let host = window.location.host;
		let path = '/';
		let search = '';

		let returnExists = parameters.some(param => {

			let returnParam = this.PARAMS.RETURN;
			if (param.indexOf(`${returnParam}=`) !== -1) {
				path = param.replace(`${returnParam}=`, '');
				return true;
			}

		});

		if (returnExists) {
			let href = `${protocol}//${host}/${path}${search}`;
			window.location.href = href;
		} else {
			window.history.go(-1);
		}

	};



	//===========================================
	//            INTERNAL CALLBACKS
	//===========================================
	LoginController.prototype._onSuccessfulLogin = function (sResponse) {
		if (sResponse) {
			localStorage.setItem('com.etauker.security.token', sResponse);
			this._nav();
		}
		else {
			MessageToast.show("An unexpected error occured");
		}
	};

	LoginController.prototype._onFailedLogin = function (oError) {
		console.log(oError.responseJSON);
		MessageToast.show("Username or password is incorrect");
	};

	return LoginController;
});
