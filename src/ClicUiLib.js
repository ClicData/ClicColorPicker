var ClicUiLib = {};


/*
	Basic jquery constructors
	see: http://learn.jquery.com/plugins/basic-plugin-creation/
*/
ClicUiLib.createJqueryObject = function (name, methods, method) {
	return function (method) {
	  	// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on ' + name );
		}
	}
};

ClicUiLib.initControl = function (name, renderer, appState, control) {	
	$(control).data(name, appState);
	renderer(control,appState);
};

ClicUiLib.getAppData = function (name, control) {
	var app = $(control).data(name);
	if (!app) {
		throw "No app data present, was init called?";
	}
	return app;
}

ClicUiLib.getSettings = function (defaults, options) {
	return $.extend(defaults, options);
}

/* 
	Ui drawing helper functions
*/

ClicUiLib.addControl = function (tagName, parent, attributes, innerText) {
	var html = "<" + tagName + " ";
	for (var key in attributes) {
		html += key + "='";
		html += attributes[key];
		html += "'";
	}

	html += " />"
	var control = $(html);
	if (innerText) {
		control.text(innerText);
	}

	if (parent) {
		control.appendTo(parent);
	}

	return control;
}

ClicUiLib.drawCommandRow = function (app, parent) {
		var commandRow = ClicUiLib.addControl(
			"div",
			parent, 
			{"class":"commandRow"}
		);

		var apply = ClicUiLib.addControl(
			"input",
			commandRow, 
			{"class":"button","type":"button"}
		);

		apply.val(app.settings.translations.apply);
		apply.click(function (e) {
			if (app.settings.applyClick) {
				app.settings.applyClick(e);
			}
		});

		var cancel = ClicUiLib.addControl(
			"input",
			commandRow, 
			{"class":"button","type":"button"}
		);

		cancel.val(app.settings.translations.cancel);
		cancel.click(function (e) {
			if (app.settings.cancelClick) {
				app.settings.cancelClick(e);
			}
		});
	}