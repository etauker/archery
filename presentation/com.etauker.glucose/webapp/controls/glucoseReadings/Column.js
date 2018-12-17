sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/m/Column",
	"sap/ui/Device"
], function (UIComponent, Parent, Device) {
	"use strict";

	var Column = Parent.extend("com.etauker.glucose.controls.glucoseReadings.Column", {
		metadata: {
			properties: {
				currentScreenSize: 'Desktop',
				currentGrouping: 'Default',
				states: []
			}
		}
	});

	Column.prototype.setup = function () {
		Parent.prototype.init.apply(this, arguments);
		this.setProperty('currentScreenSize', 'Desktop');
		this.setProperty('currentGrouping', 'Default');
		Device.media.attachHandler(this.onScreenSizeChange.bind(this), null, Device.media.RANGESETS.SAP_STANDARD);

		// Trigger a refresh by triggering a screen change callback
		this.onScreenSizeChange(Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD));
	};

	Column.prototype.onAfterRendering = function() {
    	Parent.prototype.onAfterRendering.apply(this, arguments);
    };

	Column.prototype.onScreenSizeChange = function(mParams) {
		this.setCurrentScreenSize(mParams.name);
		this.refreshState();
    };

	Column.prototype.onGroupingChange = function(oParams) {
		this.setCurrentGrouping(oParams.newGrouping);
		this.refreshState();
	};

	Column.prototype.getState = function(sCurrentGrouping, sScreenSize) {
		sCurrentGrouping = sCurrentGrouping === undefined ? this.getCurrentGrouping() : sCurrentGrouping;
		sScreenSize = sScreenSize === undefined ? this.getCurrentScreenSize() : sScreenSize;

		const newActiveState = this.getStates()
			.filter(state => state.screenSize === this.getCurrentScreenSize())
			.filter(state => state.grouping === this.getCurrentGrouping())[0];

		return newActiveState;
	};

	Column.prototype.setState = function(oNewState) {
		this.setWidth(oNewState.width);
		this.setMinScreenWidth(this.extractMinScreenWidthFromConfig())
		if (oNewState.display === 'Visible') {
			this.setPopinDisplay();
			this.setDemandPopin();
			this.setVisible(true);
		}
		else if (oNewState.display === 'Hidden') {
			this.setPopinDisplay();
			this.setDemandPopin();
			this.setVisible(false);
		}
		else {
			this.setPopinDisplay(oNewState.display);
			this.setDemandPopin(true);
			this.setVisible(true);
		}
	};

	Column.prototype.refreshState = function() {
		const currentState = this.getState();
		this.setState(currentState);
	};

	Column.prototype.extractMinScreenWidthFromConfig = function() {
		let sResult = null;
		const states = this.getSortedStates();
		states.some(state => {
			if (state.screenSize === 'Phone' && state.display === 'Visible') {
				sResult = 'Phone';
				return true;
			}
			else if (state.screenSize === 'Tablet' && state.display === 'Visible') {
				sResult = 'Tablet';
				return true;
			}
			if (state.screenSize === 'Desktop' && state.display === 'Visible') {
				sResult = 'Desktop';
				return true;
			}
		});
		return sResult;
	};

	Column.prototype.getSortedStates = function() {
		const order = [ 'Phone', 'Tablet', 'Desktop' ];
		const sorted = this.getStates().sort((stateA, stateB) => {
			if (order.indexOf(stateA.screenSize) < order.indexOf(stateB.screenSize)) return -1;
			if (order.indexOf(stateA.screenSize) > order.indexOf(stateB.screenSize)) return 1;
			return 0;
		});
		return sorted;
	};

	return Column;
});
