sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
	"use strict";

	var LogoutController = Controller.extend("com.etauker.security.logout.Login");



	//===========================================
	//             LIFECYCLE METHODS
	//===========================================
	LogoutController.prototype.onInit = function () {
		var jwt = localStorage.getItem('com.etauker.security.token');

		this.PARAMS = {
			RETURN: 'return'
		}

		if (!jwt) { this._onSuccessfulLogout(jwt); }
		else { this.handleLogout(); }
	};



	//===========================================
	//          INTERNAL EVENT HANDLERS
	//===========================================
	LogoutController.prototype.handleLogout = function () {
		var jwt = localStorage.getItem('com.etauker.security.token');
		if (jwt) {
			this._logout(jwt)
				.then(this._onSuccessfulLogout.bind(this))
				.fail(this._onFailedLogout.bind(this));
		}
		else {
			this._onSuccessfulLogout(jwt);
		}
	};



	//===========================================
	//            INTERNAL FUNCTIONS
	//===========================================
	LogoutController.prototype._logout = function (sToken) {
		let sUrl = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/logout/uri");
		let sMethod = "GET";
		return $.ajax({
			url: sUrl,
			type: sMethod,
			beforeSend: function (xhr) {
			    xhr.setRequestHeader('Authorization', 'Bearer ' + sToken);
			}
		});
	};



	//===========================================
	//            INTERNAL CALLBACKS
	//===========================================
	LogoutController.prototype._onSuccessfulLogout = function () {

		let protocol = window.location.protocol;
		let host = window.location.host;
		let path = 'login';
		let search = window.location.search;
		let href = `${protocol}//${host}/${path}${search}`;

		localStorage.removeItem('com.etauker.security.token');
		window.location.href = href;
	};
	LogoutController.prototype._onFailedLogout = function (oError) {
		var oErrorObject = oError.responseJSON;
		console.log(oErrorObject);
		MessageToast.show("An error occured during logout: " + (oErrorObject.message || ""));
	};

	return LogoutController;
});
