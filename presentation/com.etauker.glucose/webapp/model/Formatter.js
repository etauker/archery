sap.ui.define([], function () {
	"use strict";

	return {
		getDate: function (iTimestamp) {
			let oDate = new Date(iTimestamp);
			let sLocale = navigator.language;
			let oOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
			let sDate = oDate.toLocaleDateString(sLocale, oOptions);
			return sDate;
		},
		getTime: function (iTimestamp) {
			let oDate = new Date(iTimestamp);
			let sLocale = navigator.language;
			let oOptions = { hour: "numeric", minute: "numeric" };
			let sDate = oDate.toLocaleTimeString(sLocale, oOptions);
			return sDate;
		},
		getWeekday: function (iTimestamp) {
			let oDate = new Date(iTimestamp);
			let sLocale = navigator.language;
			let oOptions = { weekday: 'long' };
			let sDate = oDate.toLocaleDateString(sLocale, oOptions);
			return sDate;
		}
	};
});
