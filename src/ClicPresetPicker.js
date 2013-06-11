(function( $ ){
	function Init(element,app) {
		drawPresetPicker(app);
		UpdateUI(app);
	}



	function drawPresetPicker(app) {
		for (var i = 0; i < app.settings.options.length; i++) {
			var option = $('<div class="presetOption"></div>');
			option.data('index',i.toString());
			option.click(function () {
				app.state.selectedPresetIndex = $(this).data('index');
				if (app.settings.onChange) {
					app.settings.onChange({selected:app.settings.options[app.state.selectedPresetIndex]});
				}
			});

			ApplyGradientBackground(option,45,app.settings.options[i],false);
			option.appendTo(app.ui.mainPanel);
		}


		app.ui.mainPanel.appendTo(app.ui.mainPanel);
	}

	
	//methods
	function UpdateUI(app) {
		
	}


	//--------------//
	// 
	// Jquery control setup code
	//
	//--------------//

	function getSettings(options) {
		return $.extend( {
            onChange:null,
            options:gradientPresets
        }, options);
	}

	function getApp(control,options) {
		var app = $(control).data('ClicPresetPicker');
    	if (!app) {
    		var settings = getSettings(options)
    		$(control).data('ClicPresetPicker', {
    			settings:settings,
       			state: {
       				selectedPresetIndex:null
				},
				ui: {
					mainPanel:$(control)
				}
   			});

			app = $(control).data('ClicPresetPicker');
    	}
    	return app;
	}	

	var methods = {	
        init : function( options ) {
            return this.each(function () {
            	var app = getApp(this,options);
            	Init(this,app);
            });
        }
    }

  $.fn.ClicPresetPicker = function(method) {
  	// Method calling logic
	if ( methods[method] ) {
		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on ClicPresetPicker' );
	}
  };
})( jQuery );