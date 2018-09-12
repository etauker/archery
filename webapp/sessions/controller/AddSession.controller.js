sap.ui.define([
	"com/etauker/archery/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"com/etauker/security/Component"
], function (BaseController, JSONModel, MessageToast, SecurityController) {
	"use strict";

	var AddSessionController = BaseController.extend("com.etauker.archery.sessions.controller.AddSession");
	
	AddSessionController.prototype.onInit = function() {
		BaseController.prototype.onInit.call(this);
		this.getRouter().getRoute("addSession").attachMatched(this.handleRouteMatched, this);
		this.oSessionModel = this.getOwnerComponent().getModel("sessions");
		this.oNewSessionModel = new JSONModel(this.getBlankSession(), "new");
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
		this.oNewSessionModel.setData({});
		this.handleNavBack();
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
	AddSessionController.prototype.getBlankSession = function() {
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
	
	return AddSessionController;
});
