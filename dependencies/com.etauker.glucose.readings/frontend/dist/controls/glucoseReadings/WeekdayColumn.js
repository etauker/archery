sap.ui.define([
	"com/etauker/glucose/controls/glucoseReadings/Column"
], function (ReadingTableColumn) {
	"use strict";

	const WeekdayColumn = ReadingTableColumn.extend("com.etauker.glucose.controls.glucoseReadings.WeekdayColumn");

	WeekdayColumn.prototype.getStates = function() {
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

	WeekdayColumn.prototype.init = function () {
		this.setup();
	};

	return WeekdayColumn;
});
