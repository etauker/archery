sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/m/Table"
], function (UIComponent, Table) {
	"use strict";

	var GlucoseReadingTable = Table.extend("com.etauker.glucose.controls.GlucoseReadingsTable", {
		metadata: {
			properties : {
		   		"custom" : "value"
			}
		},
		renderer : function(oRm, oControl) {
            sap.m.TableRenderer.render(oRm, oControl);
        },
	});

	GlucoseReadingTable.prototype.init = function () {
		Table.prototype.init.apply(this, arguments);

		// // create the views based on the url/hash
		// this.getRouter().initialize();
		// this.getModel("preferences").setData(this.getUserPreferences());
		// this.oSecurity = new SecurityComponent();
		// this.oSecurity.setup(this, arguments);
	};

	GlucoseReadingTable.prototype.onAfterRendering = function() {
    	Table.prototype.onAfterRendering.apply(this, arguments);
		// if (this.getBackgroundColor()) {
		// 	this.$().css("background-color", this.getBackgroundColor());
		// }
    };

	return GlucoseReadingTable;
});
