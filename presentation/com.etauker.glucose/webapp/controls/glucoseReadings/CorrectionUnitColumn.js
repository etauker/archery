sap.ui.define([
	"com/etauker/glucose/controls/glucoseReadings/Column"
], function (ReadingTableColumn) {
	"use strict";

	const CorrectionUnitColumn = ReadingTableColumn.extend("com.etauker.glucose.controls.glucoseReadings.CorrectionUnitColumn");

	CorrectionUnitColumn.prototype.getStates = function() {
		return [
			{
				width: "",
				display: "Visible", //"Visible", "Inline", "Block", "WithoutHeader", "Hidden"
				screenSize: "Desktop",
				grouping: "Default"
			},
			{
				width: "",
				display: "Visible",
				screenSize: "Desktop",
				grouping: "Day"
			},
			{
				width: "",
				display: "Hidden",
				screenSize: "Tablet",
				grouping: "Default"
			},
			{
				width: "",
				display: "Hidden",
				screenSize: "Tablet",
				grouping: "Day"
			},
			{
				width: "",
				display: "Hidden",
				screenSize: "Phone",
				grouping: "Default"
			},
			{
				width: "",
				display: "Hidden",
				screenSize: "Phone",
				grouping: "Day"
			}
		]
	};

	CorrectionUnitColumn.prototype.init = function () {
		this.setup();
	};

	return CorrectionUnitColumn;
});
