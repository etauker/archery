sap.ui.define([
	"com/etauker/glucose/base/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"com/etauker/security/Component"
], function (BaseController, JSONModel, MessageToast, SecurityController) {
	"use strict";

	var AddReadingController = BaseController.extend("com.etauker.glucose.readings.AddReading");

	AddReadingController.prototype.onInit = function() {
		BaseController.prototype.onInit.call(this);
		this.getRouter().getRoute("addReading").attachMatched(this.handleRouteMatched, this);
		this.oReadingModel = this.getOwnerComponent().getModel("readings");
		this.oReadingModel.setProperty("/new", this._getBlankReading());
		this.oReadingModel.setProperty("/options", this._getBlankOptions());
	};
	AddReadingController.prototype.handleRouteMatched = function() {
		BaseController.prototype.handleRouteMatched.call(this);
		this._getOptions()
			.then(oResult => this.oReadingModel.setProperty("/options", oResult))
			.fail(this._onRequestFailed.bind(this));
	};
	AddReadingController.prototype.onSave = function() {
		this._saveReading().then(function(oResponse) {
			MessageToast.show("Reading saved");
			this.oReadingModel.setData(oResponse);
			this.handleNavBack();
		}.bind(this));
	};
	AddReadingController.prototype.onSaveAndContinue = function() {
		this._saveReading().then(function(oResponse) {
			MessageToast.show("Reading saved");
			this.oReadingModel.setData(oResponse);
			this.getRouter().navTo("addScores");
		}.bind(this));
	};
	AddReadingController.prototype.onCancel = function() {
		this.oReadingModel.setProperty("/new", {});
		this.handleNavBack();
	};
	AddReadingController.prototype._onRequestFailed = function(oError) {
		console.log(oError);
		// this.handleNavBack();
	};

	AddReadingController.prototype._saveReading = function() {
		var oSampleReadingData = {
			readings: [{
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
		  	setTimeout(resolve, 100, oSampleReadingData);
		});
	};
	AddReadingController.prototype._getOptions = function() {
		var sUrl = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/transactions/add/uri");
		sUrl = sUrl.replace("localhost", "dev01"); //for development

		var sMethod = "GET";

		var oRequest = {
		    url: sUrl,
			method: sMethod
		};
		return this.getOwnerComponent().sendRestRequest(oRequest);
	};
	AddReadingController.prototype._getBlankReading = function() {
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
	AddReadingController.prototype._getBlankOptions = function() {
		return {
			sessionTypes: [],
            sessionCategories: [],
            distances: [],
            targetFaces: [],
            bowCategories: []
		};
	};



	return AddReadingController;
});
