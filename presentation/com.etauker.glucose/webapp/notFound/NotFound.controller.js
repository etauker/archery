sap.ui.define([
	"com/etauker/glucose/base/BaseController"
], function (BaseController) {
	"use strict";

	var NotFoundController = BaseController.extend("com.etauker.glucose.notFound.NotFound");

	NotFoundController.prototype.onInit = function () {
		var oRouter = this.getRouter();
		var oTarget = oRouter.getTarget("notFound");
		oTarget.attachDisplay(function (oEvent) {
			this._oData = oEvent.getParameter("data");	// store the data
		}, this);
	};

	NotFoundController.prototype.onNavBack = function (oEvent) {
		var oHistory, sPreviousHash, oRouter;

		// If "fromTarget" parameter is provided, navigate to that page...
		if (this._oData && this._oData.fromTarget) {
			this.getRouter().getTargets().display(this._oData.fromTarget);
			delete this._oData.fromTarget;
			return;
		}

		//...otherwise, call the default handler
		BaseController.prototype.handleNavBack.apply(this, arguments);
	};

	return NotFoundController;
});
