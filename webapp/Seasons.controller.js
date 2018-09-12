sap.ui.define([
	"com/etauker/archery/controller/BaseController",
	"com/etauker/security/Component"
], function (BaseController, SecurityController) {
	"use strict";

	var SeasonsController = BaseController.extend("com.etauker.archery.controller.Seasons");

	return SeasonsController;
});
