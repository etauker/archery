sap.ui.define([
	"com/etauker/archery/controller/BaseController"
], function (BaseController) {
	"use strict";

	var SessionScoreHistoryController = BaseController.extend("com.etauker.archery.controller.charts.SessionScoreHistory");

	SessionScoreHistory.prototype.onInit = function(oEvent) {
		BaseController.prototype.onInit.call(this);
		// this.getRouter().getRoute("employeeList").attachMatched(this._onRouteMatched, this);
	};
	// SessionScoreHistory.prototype._onRouteMatched = function () {
	// 	this.getOwnerComponent().oSecurity.checkLoginState();
	// 	this.oSecurity.checkPermissions(this);
	// };
	// SessionScoreHistory.prototype.onListItemPressed =: function (oEvent) {
	// 	var oItem, oCtx;
	// 	oItem = oEvent.getSource();
	// 	oCtx = oItem.getBindingContext();
	// 	this.getRouter().navTo("employee",{
	// 		employeeId : oCtx.getProperty("EmployeeID")
	// 	});
	// };
	// SessionScoreHistory.prototype.onNavToLogin = function() {
	// 	this.getRouter().navTo("login");
	// };
});
