sap.ui.define([
	"com/etauker/glucose/controls/glucoseReadings/Column"
], function (ReadingTableColumn) {
	"use strict";

	const LongInsulinColumn = ReadingTableColumn.extend("com.etauker.glucose.controls.glucoseReadings.LongInsulinColumn");

	LongInsulinColumn.prototype.getStates = function() {
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
				display: "Visible",
				screenSize: "Tablet",
				grouping: "Default"
			},
			{
				width: "",
				display: "Visible",
				screenSize: "Tablet",
				grouping: "Day"
			},
			{
				width: "",
				display: "Inline",
				screenSize: "Phone",
				grouping: "Default"
			},
			{
				width: "",
				display: "Inline",
				screenSize: "Phone",
				grouping: "Day"
			}
		]
	};

	LongInsulinColumn.prototype.init = function () {
		this.setup();
	};

	return LongInsulinColumn;
});
