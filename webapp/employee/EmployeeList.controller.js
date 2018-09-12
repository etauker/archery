sap.ui.define([
	"com/etauker/archery/controller/BaseController",
	"com/etauker/archery/libs/jwt-decode.min"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.etauker.archery.controller.employee.EmployeeList", {

		onInit: function(oEvent) {
			BaseController.prototype.onInit.call(this);
			this.getRouter().getRoute("employeeList").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function () {
			// BaseController.prototype.onInit.call(this);
			this.getOwnerComponent().oSecurity.checkLoginState();
			this.oSecurity.checkPermissions(this);
		},
		onBeforeRendering: function(oEvent) {
			this.oSecurity.checkPermissions(this);
		},
		onListItemPressed : function (oEvent) {
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			this.getRouter().navTo("employee",{
				employeeId : oCtx.getProperty("EmployeeID")
			});

		},
		onNavToLogin: function() {
			this.getRouter().navTo("login");
		}
	});

});
