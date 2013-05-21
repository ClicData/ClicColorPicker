(function( $ ){
	function Init(element,app) {
		drawGradientPicker(app);
		UpdateUI(app);
	}


	function drawCommandRow(app) {
		var commandRow = $('<div class="commandRow"></div>');
		var apply = $('<input class="button" type="button" />');
		apply.val(app.settings.translations.apply);
		apply.click(function (e) {
			if (app.settings.applyClick) {
				app.settings.applyClick(e);
			}
		});
		apply.appendTo(commandRow);

		var cancel = $('<input class="button" type="button" />');
		cancel.val(app.settings.translations.cancel);
		cancel.click(function (e) {
			if (app.settings.cancelClick) {
				app.settings.cancelClick(e);
			}
		});
		cancel.appendTo(commandRow);
		commandRow.appendTo(app.ui.gradientPicker);
	}

	function drawGradientSlider(app) {

		app.ui.gradientSlider = $('<div class="noUiSlider gradientSlider"></div>').noUiSlider({
			range: [0, 100]
			,start: [0,100]
		   	,step: 1
		   	,slide: function(e) {
		   		var vals = $(this).val();
		   		UpdateSliderState(app, vals, e);
		    	UpdateUI(app);
		   	}
		});			

		app.ui.gradientSlider.children('a').click(function {
			
		});

		app.ui.gradientSlider.appendTo(app.ui.gradientPicker);
	}

	function  UpdateSliderState(app,vals, e) {		
		// need to find out what changed
		for (var i = 0; i < vals.length; i++) {

		}


		app.ui.gradientSlider = $('<div class="noUiSlider gradientSlider"></div>').noUiSlider({
			range: [0, 100]
			,start: [0,100]
		   	,step: 1
		   	,slide: function(e) {
		   		var vals = $(this).val();
		   		UpdateSliderState(app, vals, e);
		    	UpdateUI(app);
		   	}
		});			
	}


	function drawForm() {

	}

	function drawGradientPicker(app) {
		app.ui.gradientPicker = $('<div></div>');
		drawGradientSlider(app);
		drawCommandRow(app);
		app.ui.gradientPicker.appendTo(app.ui.mainPanel);
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
        	startColor:'#FFFFFF',
            defaultPalette:'websafe', // which palette is selected by defaul, only applies to simple mode
            mainPanelCssClass:"",
            applyClick:null,
            cancelClick:null,
            translations: {
            	apply:"Apply",
            	cancel:"Cancel"
            }
        }, options);
	}

	function getApp(control,options) {
		var app = $(control).data('ClicGradientPicker');
    	if (!app) {
    		var settings = getSettings(options)
    		$(control).data('ClicGradientPicker', {
    			settings:settings,
       			state: {
					steps:[{
						x:0,
						color:{r:0,g:0,b:0,a:1}
				},{
						x:100,
						color:{r:255,g:255,b:255,a:1}
				}],
				},
				ui: {
					mainPanel:$(control),
					gradientPicker:null,
					paletteLabel:null,
					colorTextBox:null
				}
   			});

			app = $(control).data('ClicGradientPicker');
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

  $.fn.ClicGradientPicker = function(method) {
  	// Method calling logic
	if ( methods[method] ) {
		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on ClicGradientPicker' );
	}
  };
})( jQuery );