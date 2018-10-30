sap.ui.define([
	"com/etauker/glucose/base/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"com/etauker/security/Component"
], function (BaseController, JSONModel, MessageToast, SecurityController) {
	"use strict";

	var AddSessionController = BaseController.extend("com.etauker.glucose.sessions.AddSession");

	AddSessionController.prototype.onInit = function() {
		BaseController.prototype.onInit.call(this);
		this.getRouter().getRoute("addSession").attachMatched(this.handleRouteMatched, this);
		this.oSessionModel = this.getOwnerComponent().getModel("sessions");
		this.oSessionModel.setProperty("/new", this._getBlankSession());
		this.oSessionModel.setProperty("/options", this._getBlankOptions());
	};
	AddSessionController.prototype.handleRouteMatched = function() {
		BaseController.prototype.handleRouteMatched.call(this);
		this._getOptions()
			.then(oResult => this.oSessionModel.setProperty("/options", oResult))
			.fail(this._onRequestFailed.bind(this));
	};
	AddSessionController.prototype.onSave = function() {
		this._saveSession().then(function(oResponse) {
			MessageToast.show("Session saved");
			this.oSessionModel.setData(oResponse);
			this.handleNavBack();
		}.bind(this));
	};
	AddSessionController.prototype.onSaveAndContinue = function() {
		this._saveSession().then(function(oResponse) {
			MessageToast.show("Session saved");
			this.oSessionModel.setData(oResponse);
			this.getRouter().navTo("addScores");
		}.bind(this));
	};
	AddSessionController.prototype.onCancel = function() {
		this.oSessionModel.setProperty("/new", {});
		this.handleNavBack();
	};
	AddSessionController.prototype._onRequestFailed = function(oError) {
		console.log(oError);
		// this.handleNavBack();
	};

	AddSessionController.prototype._saveSession = function() {
		var oSampleSessionData = {
			sessions: [{
				date: "22/06/2018",
				startTime: "19:30",
				arrowCount: 30,
				location: "Home",
				type: "Training",
				sessionCategory: "Indoor",
				distance: "18m",
				targetFaceType: "3 spot",
				notes: "Tired after work.",
				bowCategory: "Recurve",
				identifier: "Evening"
			},
			{
				date: "25/06/2018",
				startTime: "20:00",
				arrowCount: 102,
				location: "Kingfisher, Galway",
				type: "Training",
				sessionCategory: "Outdoor",
				distance: "70m",
				targetFaceType: "90cm",
				notes: "Scorching sun.",
				bowCategory: "Recurve",
				identifier: "Evening"
			},
			{
				date: "26/06/2018",
				startTime: "10:00",
				arrowCount: 72,
				location: "University of Limerick",
				type: "Competition",
				sessionCategory: "Indoor",
				distance: "18m",
				targetFaceType: "3 spot",
				notes: "Keep bow arm up after release.",
				bowCategory: "Recurve",
				identifier: "Morning"
			},
			{
				date: "26/06/2018",
				startTime: "18:00",
				arrowCount: 72,
				location: "Home",
				type: "Training",
				sessionCategory: "Indoor",
				distance: "18m",
				targetFaceType: "3 spot",
				notes: "Training after competition.",
				bowCategory: "Recurve",
				identifier: "Evening"
			}]
		};
		return new Promise(function(resolve, reject) {
		  	setTimeout(resolve, 100, oSampleSessionData);
		});
	};
	AddSessionController.prototype._getOptions = function() {
		var sUrl = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/session/add/uri");
		sUrl = sUrl.replace("localhost", "dev01"); //for development

		var sMethod = "GET";

		var oRequest = {
		    url: sUrl,
			method: sMethod
		};
		return this.getOwnerComponent().sendRestRequest(oRequest);
	};
	AddSessionController.prototype._getBlankSession = function() {
		return {
			date: "",
			startTime: "",
			arrowCount: 0,
			location: "",
			type: "",
			sessionCategory: "",
			distance: "",
			targetFaceType: "",
			notes: "",
			bowCategory: "",
			identifier: ""
		};
	};
	AddSessionController.prototype._getBlankOptions = function() {
		return {
			sessionTypes: [],
            sessionCategories: [],
            distances: [],
            targetFaces: [],
            bowCategories: []
		};
	};



	return AddSessionController;
});
