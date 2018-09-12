sap.ui.define([
	"com/etauker/archery/controller/BaseController",
	"com/etauker/security/Component"
], function (BaseController, SecurityController) {
	"use strict";

	var HomeController = BaseController.extend("com.etauker.archery.controller.Home");
	
	// HomeController.prototype.onLogin = function (oEvent) {
	// 	this.getRouter().navTo("login");
	// };
	
	HomeController.prototype.onInit = function() {
		BaseController.prototype.onInit.call(this);
		this.getRouter().getRoute("appHome").attachMatched(this.handleRouteMatched, this);
		this.oPreferencesModel = this.getOwnerComponent().getModel("preferences");
        this.oPreferencesModel.setData({
			appHome: {
				defaultTab: "sessions"
			}
		});
		this._changeTab(this.oPreferencesModel.getProperty("/appHome/defaultTab"));
	};
	HomeController.prototype.onLogout = function (oEvent) {
		this.handleLogout();
	};
	HomeController.prototype.onTabSelect = function (oEvent) {
		var sTabId = oEvent.getSource().getKey();
		this._changeTab(sTabId);
	};
	HomeController.prototype._changeTab = function (sTabId) {
		var aChildren = this.getView().byId("tab").getItems();
		aChildren.forEach(function(oChild) {
			if (oChild.getId().indexOf(sTabId) === -1) {
				oChild.setVisible(false);
			} else {
				oChild.setVisible(true);
			}
		});
	};
	return HomeController;
});
