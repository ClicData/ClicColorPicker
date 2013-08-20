var ClicColorLib = ClicColorLib || {};
ClicColorLib.Ui = {};


/*
	Basic jquery constructors
	see: http://learn.jquery.com/plugins/basic-plugin-creation/
*/
ClicColorLib.Ui.createJqueryObject = function (name, methods, method) {
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

ClicColorLib.Ui.initControl = function (name, renderer, appState, control) {	
	$(control).data(name, appState);
	renderer(control,appState);
};

ClicColorLib.Ui.getAppData = function (name, control) {
	var app = $(control).data(name);
	if (!app) {
		throw "No app data present, was init called?";
	}
	return app;
}

ClicColorLib.Ui.getSettings = function (defaults, options) {
	return $.extend(defaults, options);
}

/* 
	Ui drawing helper functions
*/

ClicColorLib.Ui.addControl = function (tagName, parent, attributes, innerText) {
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

ClicColorLib.Ui.drawCommandRow = function (app, parent) {
	var commandRow = ClicColorLib.Ui.addControl(
		"div",
		parent, 
		{"class":"commandRow"}
	);

	var apply = ClicColorLib.Ui.addControl(
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

	if (app.settings.showDelete) {
		var delBtn = ClicColorLib.Ui.addControl(
			"input",
			commandRow, 
			{"class":"button","type":"button"}
		);

		delBtn.val(app.settings.translations.del);
		delBtn.click(function() {
			if (app.settings.deleteClick) {app.settings.deleteClick();}
		});
	}

	var cancel = ClicColorLib.Ui.addControl(
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