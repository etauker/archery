sap.ui.define([
	"sap/ui/core/UIComponent",
	"com/etauker/security/Component",
], function (UIComponent, SecurityComponent) {
	"use strict";

	var ArcheryAppComponent = UIComponent.extend("com.etauker.archery.Component", {
		metadata: {
			manifest: "json"
		}
	});

	ArcheryAppComponent.prototype.init = function () {
		UIComponent.prototype.init.apply(this, arguments);
		SecurityComponent.prototype.init.apply(this, arguments);
		
		// create the views based on the url/hash
		this.getRouter().initialize();
		this.oSecurity = new SecurityComponent(this);
		this.oSecurity.setParentContext(this);
		
		
		

		// this.getModel("security").setData({
		// 	loggedIn: false,
		// 	user: {
		// 		username: ""
		// 	}
		// });

	};
	
	ArcheryAppComponent.prototype.navigateToTarget = function(sTargetName) {
		this.getRouter().navTo(sTargetName);
	};

	

	


	return ArcheryAppComponent;
});
