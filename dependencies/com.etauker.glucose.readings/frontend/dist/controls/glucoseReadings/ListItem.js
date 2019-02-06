sap.ui.define([
	"sap/m/ColumnListItem"
], function (Parent) {
	"use strict";

	var ListItem = Parent.extend("com.etauker.glucose.controls.glucoseReadings.ListItem", {
		renderer : function(oRm, oControl) {
			Parent.prototype.getRenderer().render(oRm, oControl);
		}
	});

	ListItem.prototype.init = function () {
		Parent.prototype.init.apply(this, arguments);
	};

	ListItem.prototype.onAfterRendering = function() {
    	Parent.prototype.onAfterRendering.apply(this, arguments);
		this.getCells().forEach(oCell => {
			if (oCell.getProperty('text') === "") {
				oCell.$().closest('.sapMListTblSubCntRow').hide();
			}
		});
    };

	return ListItem;
});
