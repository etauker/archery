sap.ui.define([
	"com/etauker/glucose/controls/glucoseReadings/Column"
], function (ReadingTableColumn) {
	"use strict";

	const NotesColumn = ReadingTableColumn.extend("com.etauker.glucose.controls.glucoseReadings.NotesColumn");

	NotesColumn.prototype.getStates = function() {
		return [
			{
				width: "20%",
				display: "Visible", //"Visible", "Inline", "Block", "WithoutHeader", "Hidden"
				screenSize: "Desktop",
				grouping: "Default"
			},
			{
				width: "20%",
				display: "Visible",
				screenSize: "Desktop",
				grouping: "Day"
			},
			{
				width: "",
				display: "Inline",
				screenSize: "Tablet",
				grouping: "Default"
			},
			{
				width: "",
				display: "Inline",
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

	NotesColumn.prototype.init = function () {
		this.setup();
	};

	return NotesColumn;
});
