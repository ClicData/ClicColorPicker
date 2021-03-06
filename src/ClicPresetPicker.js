(function( $ ){
	var _controlName = "ClicPresetPicker";
	/*
		Setup jquery stuff and defaults
	*/

	var methods = {	
        init : init
    }

	$.fn.ClicPresetPicker = ClicColorLib.Ui.createJqueryObject(_controlName, methods);


	/*
		Define methods
	*/
	function init(options) {
		return this.each(function () {
			var settings =  {
				imagePath:null,
	            onChange:null,
	            options:ClicColorLib.Data.gradientPresets
	        }
			
			// this merges pased options with default values
			settings = ClicColorLib.Ui.getSettings(settings, options);
			var startState = {
    			settings:settings,
       			state: {
       				selectedPresetIndex:null
				},
				ui: {
					mainPanel:$(this)
				}
   			}

			ClicColorLib.Ui.initControl(
				_controlName,
				renderControl,
				startState,
				this
			);
		});
	}

	/*
		Drawing functions
	*/

	function renderControl(element,app) {
		drawPresetPicker(app);
	}



	function drawPresetPicker(app) {
		for (var i = 0; i < app.settings.options.length; i++) {
			var option = ClicColorLib.Ui.addControl(
			"div",
			app.ui.mainPanel, 
			{"class":"presetOption"}
		);


			option.data('index',i.toString());
			option.click(function () {
				app.state.selectedPresetIndex = $(this).data('index');
				if (app.settings.onChange) {
					var cloned = clone(app.settings.options[app.state.selectedPresetIndex]);
					app.settings.onChange({selected:cloned});
				}
			});

			ClicColorLib.ColorMethods.ApplyGradientBackground(option,45,app.settings.options[i],false,app.settings.imagePath + '/transparent.png');
		}
	}

	// http://stackoverflow.com/a/3774429
	function clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
})( jQuery );