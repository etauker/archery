sap.ui.define([
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"com/etauker/glucose/base/BaseController",
	"com/etauker/security/Component",
	"com/etauker/glucose/model/Formatter"
], function (Filter, Sorter, BaseController, SecurityController, Formatter) {
	"use strict";

	var ReadingsController = BaseController.extend("com.etauker.glucose.readings.Readings", {
		formatter: Formatter
	});

	ReadingsController.prototype.onInit = function() {
		this.oReadingModel = this.getOwnerComponent().getModel("readings");
		this._mViewSettingsDialogs = {};
		this._retrieveReadings().then(function(oResponse) {
			this.oReadingModel.setProperty("/readings", oResponse);
		}.bind(this));
		this.mGroupFunctions = {
			Weekday: function(oBindingContext) {
				let iDateTime = oBindingContext.getProperty("dateTime");
				return {
					key: this.formatter.getWeekday(iDateTime),
					text: this.formatter.getWeekday(iDateTime)
				};
			}
		}
		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

		// this.byId("readingsTable").addEventDelegate({
		//      onAfterRendering: this.applyGrouping.bind(this, "Weekday")
		//  }, this);

	};
	ReadingsController.prototype.onAddReading = function(oEvent) {
		this.getRouter().navTo("addReading");
	};
	ReadingsController.prototype.onFilterButtonPressed = function(oEvent) {
		this.createViewSettingsDialog("com.etauker.glucose.readings.fragment.FilterDialog").open();
	};
	ReadingsController.prototype.onSortButtonPressed = function() {
		this.createViewSettingsDialog("com.etauker.glucose.readings.fragment.SortDialog").open();
	};
	ReadingsController.prototype.onGroupButtonPressed = function() {
		this.createViewSettingsDialog("com.etauker.glucose.readings.fragment.GroupDialog").open();
	};
	ReadingsController.prototype.onRouteMatched = function() {
		// this._retrieveReadings().then(function(oResponse) {
		// 	this.oReadingModel.setData(oResponse);
		// }.bind(this));
	};

	ReadingsController.prototype.handleFilterDialogConfirm = function (oEvent) {
		console.log(oEvent);
		let oTable = this.byId("readingsTable"),
			mParams = oEvent.getParameters(),
			oBinding = oTable.getBinding("items"),
			aFilters = [];

		mParams.filterItems.forEach(function(oItem) {
			let aSplit = oItem.getKey().split("___"),
				sPath = aSplit[0],
				sOperator = aSplit[1],
				sValue1 = aSplit[2],
				sValue2 = aSplit[3],
				oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
			aFilters.push(oFilter);
		});

		// apply filter settings
		oBinding.filter(aFilters);

		// update filter bar
		// this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
		// this.byId("vsdFilterLabel").setText(mParams.filterString);
	};
	ReadingsController.prototype.handleSortDialogConfirm = function(oEvent) {
		var oTable = this.byId("readingsTable"),
			mParams = oEvent.getParameters(),
			oBinding = oTable.getBinding("items"),
			sPath,
			bDescending,
			aSorters = [];

		sPath = mParams.sortItem.getKey();
		bDescending = mParams.sortDescending;
		aSorters.push(new Sorter(sPath, bDescending));

		// apply the selected sort and group settings
		oBinding.sort(aSorters);
	};
	ReadingsController.prototype.handleGroupDialogConfirm = function(oEvent) {
		var oTable = this.byId("readingsTable"),
			mParams = oEvent.getParameters(),
			oBinding = oTable.getBinding("items"),
			sPath,
			bDescending,
			vGroup,
			aGroups = [];

		if (mParams.groupItem) {
			sPath = mParams.groupItem.getKey();
			bDescending = mParams.groupDescending;
			vGroup = this.mGroupFunctions[sPath];
			aGroups.push(new Sorter(sPath, bDescending, vGroup.bind(this)));
			// apply the selected group settings
			oBinding.sort(aGroups);
		}
	};
	//TODO: Refactor to use this
	// ReadingsController.prototype.applyGrouping = function(sGroupFunctionName) {
	// 	let oTable = this.byId("readingsTable");
	// 	let aItems = oTable.getItems();
	// 	let vGroup = this.mGroupFunctions[sGroupFunctionName];
	// 	let aGroups = [];
	// 	aItems.forEach(oItem => {
	// 		let oBindingContext = oItem.getBindingContext("readings");
	// 		let sPath = oBindingContext.getPath() + "/dateTime";
	// 		aGroups.push(new Sorter(sPath, true, vGroup.bind(this)));
	// 	})
	//
	// 	// apply the selected group settings
	// 	oTable.getBinding("items").sort(aGroups);
	// };
	ReadingsController.prototype.groupByWeekday = function(oBindingContext) {
		var oTable = this.byId("readingsTable"),
			oBinding = oTable.getBinding("items"),
			vGroup = this.mGroupFunctions["Weekday"],
			aGroups = [];

			aGroups.push(new Sorter(oBindingContext.getPath(), true, vGroup.bind(this)));
			// apply the selected group settings
			oBinding.sort(aGroups);
	};

	ReadingsController.prototype.createViewSettingsDialog = function (sDialogFragmentName) {
		var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

		if (!oDialog) {
			oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
			this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

			// if (Device.system.desktop) {
			// 	oDialog.addStyleClass("sapUiSizeCompact");
			// }
		}
		return oDialog;
	};



	ReadingsController.prototype._retrieveReadings = async function() {
		let sUrl = this.getOwnerComponent().getManifestEntry("/sap.app/dataSources/transactions/get/uri");
		sUrl = sUrl.replace("localhost", "dev01"); //for development

		let sMethod = "GET";
		let oRequest = {
			url: sUrl,
			method: sMethod
		};
		return await this.getOwnerComponent().sendRestRequest(oRequest);
		// var oSampleReadingData = {
		// 	readings: [{
		// 		id: "aaaaaaaa",
		// 	    dateTime: 1540818000000,
		// 	    reading: 7,
		// 	    carbohydrates: 100,
		// 	    insulinUnitsShort: 10,
		// 	    insulinUnitsLong: null,
		// 	    correctionUnits: 0,
		// 	    meal: "Lunch",
		// 	    note: null
		// 	},
		// 	{
		// 		id: "bbbbbbbb",
		// 	    dateTime:  1540837440000,
		// 	    reading: 9,
		// 	    carbohydrates: 80,
		// 	    insulinUnitsShort: 9,
		// 	    insulinUnitsLong: null,
		// 	    correctionUnits: 1,
		// 	    meal: "Dinner",
		// 	    note: null
		// 	},
		// 	{
		// 		id: "cccccccc",
		// 	    dateTime: 1540853880000,
		// 	    reading: 3.6,
		// 	    carbohydrates: 40,
		// 	    insulinUnitsShort: 3,
		// 	    insulinUnitsLong: 16,
		// 	    correctionUnits: -1,
		// 	    meal: "Before Bed",
		// 	    note: "After excercise"
		// 	},
		// 	{
		// 		id: "dddddddd",
		// 	    dateTime: 1540884840000,
		// 	    reading: 17,
		// 	    carbohydrates: 70,
		// 	    insulinUnitsShort: 10,
		// 	    insulinUnitsLong: 14,
		// 	    correctionUnits: 3,
		// 	    meal: "Breakfast",
		// 	    note: "snacked during the night"
		// 	}]
		// };
		// return new Promise(function(resolve, reject) {
		//   	setTimeout(resolve, 100, oSampleReadingData);
		// });
	};

	return ReadingsController;
});
