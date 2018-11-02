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
	};
	AddReadingController.prototype.handleRouteMatched = function() {
		BaseController.prototype.handleRouteMatched.call(this);
		this.oReadingModel.setProperty("/new", this._getBlankReading());
		this.getOwnerComponent().retrieveOptions()
			.then(oResult => this.oReadingModel.setProperty("/options", oResult))
			.fail(this._onRequestFailed.bind(this));
	};
	AddReadingController.prototype.onSave = function() {
		let oObjectBoundToView = this.oReadingModel.getProperty("/new");
		let oNewObject = this._mapViewObjectToPostObject(oObjectBoundToView);
		this.getOwnerComponent().saveReading(oNewObject)
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
	};
	AddReadingController.prototype._mapViewObjectToPostObject = function(oViewObject) {

		let oRegex = /(..)\/(..)\/(....), (..):(..)/;
		let aMatches = oViewObject.dateTime.match(oRegex);
		let sDate = (aMatches[1].length === 1 ? `0${aMatches[1]}` : aMatches[1]);
		let sMonth = (aMatches[2].length === 1 ? `0${aMatches[2]-1}` : aMatches[2]-1);
		let sYear = aMatches[3];
		let sHours = (aMatches[4].length === 1 ? `0${aMatches[4]}` : aMatches[4]);
		let sMinutes = (aMatches[5].length === 1 ? `0${aMatches[5]}` : aMatches[5]);

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
			dateTime: oDateTime.valueOf(),
			meal: oViewObject.meal,
			note: oViewObject.note
		}
		return oPostObject;
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
			meal: '',
			note: ''
		};
	};
	AddReadingController.prototype._getBlankOptions = function() {
		return {
			meals: []
		};
	};
	return AddReadingController;
});
