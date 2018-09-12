sap.ui.define([
	"com/etauker/archery/controller/BaseController"
], function (BaseController) {
	"use strict";

	var EmployeeOverviewController = BaseController.extend("com.etauker.archery.controller.employee.overview.EmployeeOverview", {

	});

	EmployeeOverviewController.prototype.onBeforeRender = function() {
		console.log("before render");
		
	};

	return EmployeeOverviewController;
});
