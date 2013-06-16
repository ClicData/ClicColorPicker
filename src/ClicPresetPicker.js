(function( $ ){
	var _controlName = "ClicPresetPicker";
	/*
		Setup jquery stuff and defaults
	*/

	var methods = {	
        init : init
    }

	$.fn.ClicPresetPicker = ClicUiLib.createJqueryObject(_controlName, methods);


	/*
		Define methods
	*/
	function init(options) {
		return this.each(function () {
			var settings =  {
	            onChange:null,
	            options:gradientPresets
	        }
			
			// this merges pased options with default values
			settings = ClicUiLib.getSettings(settings, options);
			var startState = {
    			settings:settings,
       			state: {
       				selectedPresetIndex:null
				},
				ui: {
					mainPanel:$(this)
				}
   			}

			ClicUiLib.initControl(
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
		UpdateUI(app);
	}



	function drawPresetPicker(app) {
		for (var i = 0; i < app.settings.options.length; i++) {
			var option = ClicUiLib.addControl(
			"div",
			app.ui.mainPanel, 
			{"class":"presetOption"}
		);


			option.data('index',i.toString());
			option.click(function () {
				app.state.selectedPresetIndex = $(this).data('index');
				if (app.settings.onChange) {
					app.settings.onChange({selected:app.settings.options[app.state.selectedPresetIndex]});
				}
			});

			ApplyGradientBackground(option,45,app.settings.options[i],false);
		}
	}

	
	//methods
	function UpdateUI(app) {
		
	}
})( jQuery );