(function( $ ){
	function Init(element,app) {
		drawGradientSlider(app);
		UpdateUI(app);
	}



	function drawGradientSlider(app) {
		app.ui.gradientSlider = $('<div class="gradSlider"></div>');
		app.ui.gradientSlider.click(function (e) {

		});

		app.ui.gradientSlider.appendTo(app.ui.parent);
	}

	

	function HandleClick(sender, e, app) {
		if (app.settings.requestingColor) {
			var stopIndex = sender.data('colorStopIndex');

			app.settings.requestingColor( app.state.colorStops[stopIndex].color, function (color) {
				
				app.state.colorStops[stopIndex].color = color;
				UpdateUI(app);
			});
		}

		e.preventDefault();
	}

	//methods
	function UpdateUI(app) {
		app.ui.gradientSlider.html('');
		// first stop
		var zero = $('<span class="gradSliderHandle" />');
		zero.css('left','-5');
		zero.data('colorStopIndex', 0);
		zero.appendTo(app.ui.gradientSlider);
		zero.click(function (e) {HandleClick($(this),e,app)});

		// last stop
		var hundred = $('<span class="gradSliderHandle" />');
		hundred.css('left','207');
		hundred.data('colorStopIndex',  app.state.colorStops.length-1);
		hundred.appendTo(app.ui.gradientSlider);
		hundred.click(function (e) {HandleClick($(this),e,app)});

		// now build intermediate stops...
		if (app.state.colorStops.length>2) {

		}


		ApplyGradientBackground(app.ui.gradientSlider,90,app.state.colorStops);


	}


	//--------------//
	// 
	// Jquery control setup code
	//
	//--------------//

	function getSettings(options) {
		return $.extend( {
			requestingColor:null,
        	startColorStops:[
        	{percent:0,color:{r:0,g:0,b:0,a:1}},
        	{percent:100,color:{r:255,g:255,b:255,a:1}},
        ]
        }, options);
	}

	function getApp(control,options) {
		var app = $(control).data('ClicGradientSlider');
    	if (!app) {
    		var settings = getSettings(options);
    		$(control).data('ClicGradientSlider', {
    			settings:settings,
       			state: {
       				colorStops: settings.startColorStops
				},
				ui: {
					parent:$(control),
					gradientSlider:null
				}
   			});

			app = $(control).data('ClicGradientSlider');
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

  $.fn.ClicGradientSlider = function(method) {
  	// Method calling logic
	if ( methods[method] ) {
		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on ClicGradientSlider' );
	}
  };
})( jQuery );