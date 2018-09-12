sap.ui.define([
	"com/etauker/archery/controller/BaseController",
	"com/etauker/security/Component"
], function (BaseController, SecurityController) {
	"use strict";

	var ScoresController = BaseController.extend("com.etauker.archery.controller.Scores");

	return ScoresController;
});
