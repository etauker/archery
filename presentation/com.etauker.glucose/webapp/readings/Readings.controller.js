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
		this.getOwnerComponent().retrieveReadings()
			.then(oResponse => this.oReadingModel.setProperty("/readings", oResponse));
		this.oReadingModel.setProperty("/state", {
			tableId: "readingsTable",
			grouping: this._getGroupingFunctions(),
			filtering: this._getFilteringFunctions()
		});

		this.groupFunctions = {
			Weekday: function(oBindingContext) {
				let iDateTime = oBindingContext.getProperty("dateTime");
				return {
					key: this.formatter.getWeekday(iDateTime),
					text: this.formatter.getWeekday(iDateTime)
				};
			}
		}

		// this.SortingFunctions = this._getSorterFunctions();


		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

		// this.byId(this.oReadingModel.getProperty("/state/tableId")).addEventDelegate({
		//      onAfterRendering: this.applyGrouping.bind(this, "Weekday")
		//  }, this);

	};
	ReadingsController.prototype.onAddReading = function(oEvent) {
		this.getRouter().navTo("addReading");
	};
	ReadingsController.prototype.onFilterButtonPressed = function(oEvent) {
		this.createViewSettingsDialog("com.etauker.glucose.readings.fragment.FilterDialog").open();
	};
	ReadingsController.prototype.onGroupButtonPressed = function() {
		this.createViewSettingsDialog("com.etauker.glucose.readings.fragment.GroupDialog").open();
	};
	ReadingsController.prototype.onRouteMatched = function() {

	};

	// TODO: Implement
	ReadingsController.prototype.handleFilterDialogConfirm = function (oEvent) {
		let oTable = this.byId(this.oReadingModel.getProperty("/state/tableId"));
		let oParams = oEvent.getParameters();
		let oBinding = oTable.getBinding("items");
		let aFilters = [];
		let aFunctions = [];


		aFunctions = Object.keys(oParams.filterCompoundKeys)
			.map(sKey => {
				return {
					filterFunction: sKey,
					acceptedValues: Object.keys(oParams.filterCompoundKeys[sKey])
				};
			})

		aFunctions.forEach(oFilter => {
			let fnFilter = this.oReadingModel.getProperty(`/state/filtering/${oFilter.filterFunction}/function`);
			aFilters.push(fnFilter(oFilter.acceptedValues));
		});

		// apply filter settings
		oBinding.filter(aFilters);
	};
	ReadingsController.prototype.handleGroupDialogConfirm = function(oEvent) {
		let oTable = this.byId(this.oReadingModel.getProperty("/state/tableId"));
		let oParams = oEvent.getParameters();
		let oBinding = oTable.getBinding("items");

		// Reset initial table state
		this._showAllColumns();
		oBinding.sort(this._getDefaultSorter());

		if (oParams.groupItem) {
			let bDescending = oParams.groupDescending;
			let sFunction = oParams.groupItem.getKey() || "removeGrouping";
			let sColumn = this.oReadingModel.getProperty(`/state/grouping/${sFunction}/field`);
			let fnGrouping = this.oReadingModel.getProperty(`/state/grouping/${sFunction}/function`);
			oBinding.sort(new Sorter(sColumn, bDescending, fnGrouping.bind(this)));
		}
	};
	ReadingsController.prototype._showAllColumns = function() {
		this.byId(this.oReadingModel.getProperty("/state/tableId")).getColumns()
			.forEach(oColumn => oColumn.setVisible(true))
	};
	ReadingsController.prototype._getDefaultSorter = function() {
		// TODO: Implement preferences based initial sorting
		return new Sorter('dateTime', true);
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


	ReadingsController.prototype._getReadingGroup = function() {
		return {
			periods: [
				{
					periodId: 'beforeBreakfast',
					periodText: 'Before Breakfast',
					startTime: '06:01',
					endTime: '10:00',
					groups: [
						{
							groupId: 'low',
							groupText: 'Low',
							minValue: 0,
							maxValue: 5.5
						},
						{
							groupId: 'good',
							groupText: 'Good',
							minValue: 5.6,
							maxValue: 7.5
						},
						{
							groupId: 'high',
							groupText: 'High',
							minValue: 7.6,
							maxValue: 14
						},
						{
							groupId: 'veryHigh',
							groupText: 'Very High',
							minValue: 14.1,
							maxValue: 50
						}
					]
				},
				{
					periodId: 'beforeMeals',
					periodText: 'Before Meals',
					startTime: '10:01',
					endTime: '22:00',
					groups: [
						{
							groupId: 'low',
							groupText: 'Low',
							minValue: 0,
							maxValue: 4.5
						},
						{
							groupId: 'good',
							groupText: 'Good',
							minValue: 4.6,
							maxValue: 7.5
						},
						{
							groupId: 'high',
							groupText: 'High',
							minValue: 7.6,
							maxValue: 14
						},
						{
							groupId: 'veryHigh',
							groupText: 'Very High',
							minValue: 14.1,
							maxValue: 50
						}
					]
				},
				{
					periodId: 'beforeBed',
					periodText: 'Before Bed',
					startTime: '22:01',
					endTime: '06:00',
					groups: [
						{
							groupId: 'low',
							groupText: 'Low',
							minValue: 0,
							maxValue: 6.5
						},
						{
							groupId: 'good',
							groupText: 'Good',
							minValue: 6.6,
							maxValue: 8
						},
						{
							groupId: 'high',
							groupText: 'High',
							minValue: 8.1,
							maxValue: 14
						},
						{
							groupId: 'veryHigh',
							groupText: 'Very High',
							minValue: 14.1,
							maxValue: 50
						}
					]
				}
			]
		};
	};
	ReadingsController.prototype._getGroupingFunctions = () => {
		return {
			groupByMeals: {
				field: "meal",
				function: function(oBindingContext) {
					let sMeal = oBindingContext.getProperty("meal");

					return {
						key: sMeal,
						text: sMeal ? sMeal : "Meal Unknown"
					};
				}
			},
			groupByReadingGroups: {
				field: "reading",
				function: function(oBindingContext) {
					let iDateTime = oBindingContext.getProperty("dateTime");
					let fReading = parseFloat(oBindingContext.getProperty("reading"));
					let oFilterObject = {
						key: "",
						text: "Unknown Reading Group"
					};
					if (!iDateTime || !fReading) return oFilterObject;

					// TODO: Change to get the reading groups from the backend
					let oReadingGroup = this._getReadingGroup();
					let oDate = new Date(iDateTime);

					oReadingGroup.periods.some(oPeriod => {
						let oDateStart = new Date(oDate.valueOf());
						let sStartHour = oPeriod.startTime.substring(0,2);
						let sStartMinute = oPeriod.startTime.substring(3,5);
						oDateStart.setHours(parseInt(sStartHour));
						oDateStart.setMinutes(parseInt(sStartMinute));

						let oDateEnd = new Date(oDate.valueOf());
						let sEndHour = oPeriod.endTime.substring(0,2);
						let sEndMinute = oPeriod.endTime.substring(3,5);
						oDateEnd.setHours(parseInt(sEndHour));
						oDateEnd.setMinutes(parseInt(sEndMinute));

						// Where period start and end times span over two days
						if (sEndHour < sStartHour && oDate.getHours() < 12) {
							oDateStart.setDate(oDateStart.getDate()-1);
						}
						else if (sEndHour < sStartHour && oDate.getHours() >= 12) {
							oDateEnd.setDate(oDateEnd.getDate()+1);
						}

						if (oDate >= oDateStart && oDate <= oDateEnd) {
							return oPeriod.groups.some(oReadingGroup => {
								let fMin = parseFloat(oReadingGroup.minValue.toString());
								let fMax = parseFloat(oReadingGroup.maxValue.toString());
								if (fReading >= fMin && fReading <= fMax) {
									oFilterObject = {
										key: oReadingGroup.groupId,
										text: oReadingGroup.groupText
									}
									return true;
								}
							});
						}
					});
					return oFilterObject;
				}
			},
			groupByWeekdays: {
				field: "dateTime",
				function: function(oBindingContext) {
					let iDateTime = oBindingContext.getProperty("dateTime");
					if (!iDateTime) return null;

					let sWeekday = this.formatter.getWeekday(iDateTime);
					let sDate = this.formatter.getDate(iDateTime);

					this.byId(this.oReadingModel.getProperty("/state/tableId")).getColumns()
						.forEach(oColumn => {
							if (oColumn.getHeader().getText() === "Date" || oColumn.getHeader().getText() === "Weekday")
								oColumn.setVisible(false);
						})

					return {
						key: sWeekday,
						text: `${sWeekday} (${sDate})`
					};
				}
			},
			groupByDayGroups: {
				field: "dateTime",
				function: function(oBindingContext) {
					let iDateTime = oBindingContext.getProperty("dateTime");
					if (!iDateTime) return null;

					let oDate = new Date(iDateTime);
					let sGroup = (oDate.getDay() === 0 || oDate.getDay() === 6) ? "Weekend" : "Weekday";

					return {
						key: sGroup,
						text: sGroup
					};
				}
			}
		}
	};
	ReadingsController.prototype._getFilteringFunctions = () => {
		return {
			filterByMeals: {
				field: "meal",
				function: function(aAcceptedValues) {
					let sPath = "meal";
					let sOperator = sap.ui.model.FilterOperator.EQ;
					// TODO: Refactor to accept an array of values
					let sValue1 = aAcceptedValues[0];//aAcceptedValues.map(value => new Filter(sPath, 'EQ', value));
					return new Filter(sPath, sOperator, sValue1);
				}
			},
			filterByReadingGroups: {
				field: "reading",
				function: function(oBindingContext) {

				}
			},
			filterByDayGroups: {
				field: "dateTime",
				function: function(oBindingContext) {

				}
			},
			filterByTimestamp: {
				field: "meal",
				function: function(oBindingContext) {

				}
			}
		}
	};


	return ReadingsController;
});
