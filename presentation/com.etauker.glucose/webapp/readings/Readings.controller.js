sap.ui.define([
	"com/etauker/glucose/base/BaseController",
	"com/etauker/security/Component"
], function (BaseController, SecurityController) {
	"use strict";

	var ReadingsController = BaseController.extend("com.etauker.glucose.readings.Readings");

	ReadingsController.prototype.onInit = function() {
		this.oReadingModel = this.getOwnerComponent().getModel("readings");
		this._retrieveReadings().then(function(oResponse) {
			this.oReadingModel.setData(oResponse);
		}.bind(this));
	};
	ReadingsController.prototype.onAddReading = function(oEvent) {
		this.getRouter().navTo("addReading");
	};
	ReadingsController.prototype._retrieveReadings = function() {
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

	return ReadingsController;
});
