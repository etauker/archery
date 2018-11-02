sap.ui.define([
	"com/etauker/glucose/base/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"com/etauker/security/Component",
	"sap/ui/core/format/DateFormat"
], function (BaseController, JSONModel, MessageToast, SecurityComponent, DateFormat) {
	"use strict";

	var AddReadingController = BaseController.extend("com.etauker.glucose.readings.AddReading");

	AddReadingController.prototype.onInit = function() {
		BaseController.prototype.onInit.call(this);
		this.getRouter().getRoute("addReading").attachMatched(this.handleRouteMatched, this);
		this.oReadingModel = this.getOwnerComponent().getModel("readings");
		this.oReadingModel.setProperty("/new", this._getBlankReading());
		this.oReadingModel.setProperty("/options", this._getBlankOptions());
		console.log(this.oReadingModel.getData());
	};
	AddReadingController.prototype.handleRouteMatched = function() {
		this.oReadingModel.setProperty("/new", this._getBlankReading());
		BaseController.prototype.handleRouteMatched.call(this);
		this._getOptions()
			.then(oResult => this.oReadingModel.setProperty("/options", oResult))
			.fail(this._onRequestFailed.bind(this));
	};
	AddReadingController.prototype.onSave = function() {
		console.log(this.oReadingModel.getData());
		let oObjectBoundToView = this.oReadingModel.getProperty("/new");
		let oNewObject = this._mapViewObjectToPostObject(oObjectBoundToView);

		this._saveReading(oNewObject)
			.then(() => {
				MessageToast.show("Reading saved");
				return this.getOwnerComponent().retrieveReadings();
			})
			.then(oResponse => {
				this.oReadingModel.setProperty("/readings", oResponse);
				this.handleNavBack();
			});
	};
	AddReadingController.prototype.onCancel = function() {
		this.oReadingModel.setProperty("/new", this._getBlankReading());
		this.handleNavBack();
	};
	AddReadingController.prototype._onRequestFailed = function(oError) {
		console.log(oError);
		// this.handleNavBack();
	};
	AddReadingController.prototype._mapViewObjectToPostObject = function(oViewObject) {
		// let oDateTime = new Date(DateFormat.getDateTimeInstance(oViewObject.dateTime).toString());
		let oRegex = /(..)\/(..)\/(....), (..):(..)/;
		let aMatches = oViewObject.dateTime.match(oRegex);
		let sDate = (aMatches[1].length === 1 ? `0${aMatches[1]}` : aMatches[1]);
		let sMonth = (aMatches[2].length === 1 ? `0${aMatches[2]-1}` : aMatches[2]-1);
		let sYear = aMatches[3];
		let sHours = (aMatches[4].length === 1 ? `0${aMatches[4]}` : aMatches[4]);
		let sMinutes = (aMatches[5].length === 1 ? `0${aMatches[5]}` : aMatches[5]);

		// let sDateTime = `${sYear}-${sMonth}-${sDate}T${sHours}:${sMinutes}:00.000Z`;

		let oDateTime = new Date();
		oDateTime.setDate(sDate);
		oDateTime.setMonth(sMonth);
		oDateTime.setFullYear(sYear);
		oDateTime.setHours(sHours);
		oDateTime.setMinutes(sMinutes);

		let oPostObject = {
			reading: oViewObject.reading ? parseFloat(oViewObject.reading) : null,
			carbohydrates: oViewObject.carbohydrates ? parseInt(oViewObject.carbohydrates) : null,
			insulinUnitsShort: oViewObject.insulinUnitsShort ? parseInt(oViewObject.insulinUnitsShort) : null,
			insulinUnitsLong: oViewObject.insulinUnitsLong ? parseInt(oViewObject.insulinUnitsLong) : null,
			correctionUnits: oViewObject.correctionUnits ? parseInt(oViewObject.correctionUnits) : null,
			dateTime: oDateTime.valueOf(),//new Date(oViewObject.dateTime).valueOf(),
			note: oViewObject.note
		}
		return oPostObject;
	};

	AddReadingController.prototype._saveReading = function(oReading) {
		console.log(oReading);
		// return new Promise((fnResolve, fnReject) => {
		// 	let oResult = { readings: [oReading] };
		// 	fnResolve(oResult);
		// })

		var sUrl = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/transactions/add/uri");
		sUrl = sUrl.replace("localhost", "dev01"); //for development

		var sMethod = "POST";
		var oRequest = {
		    url: sUrl,
			method: sMethod,
			data: oReading
		};
		return this.getOwnerComponent().sendRestRequest(oRequest);
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
		let oDateFormat = DateFormat.getDateTimeInstance({pattern: "dd/MM/yyyy, HH:mm"});
		let sDate = oDateFormat.format(new Date(), true);
		return {
			reading: null,
			carbohydrates: null,
			insulinUnitsShort: null,
			insulinUnitsLong: null,
			correctionUnits: null,
			dateTime: sDate,
			note: ""
		};
	};
	AddReadingController.prototype._getBlankOptions = function() {
		return {
			meals: []
		};
	};

	return AddReadingController;
});
