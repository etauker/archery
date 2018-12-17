sap.ui.define([
	"com/etauker/glucose/controls/glucoseReadings/Column"
], function (ReadingTableColumn) {
	"use strict";

	const DateColumn = ReadingTableColumn.extend("com.etauker.glucose.controls.glucoseReadings.DateColumn");

	DateColumn.prototype.getStates = function() {
		return [
			{
				width: "",
				display: "Visible", //"Visible", "Inline", "Block", "WithoutHeader", "Hidden"
				screenSize: "Desktop",
				grouping: "Default"
			},
			{
				width: "",
				display: "Hidden",
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
				display: "Hidden",
				screenSize: "Tablet",
				grouping: "Day"
			},
			{
				width: "",
				display: "Visible",
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

	DateColumn.prototype.init = function () {
		this.setup();
	};

	return DateColumn;
});
