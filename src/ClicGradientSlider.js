(function( $ ){
	function Init(element,app) {
		drawGradientSlider(app);
		UpdateUI(app);
	}



	function drawGradientSlider(app) {
		app.ui.gradientSlider = $('<div class="gradSlider"></div>');
		app.ui.gradientSlider.click(function (e) {
			if (e.target == this) {
				HandleClick(app);	
			}
		});

		// first stop
		var zero = $('<span class="gradSliderHandle" />');
		zero.css('left','5');
		zero.data('colorStopIndex', 0);
		zero.appendTo(app.ui.gradientSlider);
		zero.click(function (e) {HandleClick(app,$(this))});

		// last stop
		var hundred = $('<span class="gradSliderHandle" />');
		hundred.css('left','230');
		hundred.data('colorStopIndex',  app.state.colorStops.length-1);
		hundred.appendTo(app.ui.gradientSlider);
		hundred.click(function (e) {HandleClick(app,$(this))});

		// others that may exist
		if (app.state.colorStops.length>2) {
			for (var i =1;i<app.state.colorStops.length-1;i++) {
				renderNewStop(app.state.colorStops[i],app);
			}	
		}
		
		app.ui.gradientSlider.appendTo(app.ui.parent);
	}

	function renderNewStop(stop, app) {
		var newb = $('<span class="gradSliderHandle" />');
		newb.css('left',stop.percent + '%');
		app.state.colorStops.push(stop);
		newb.data('colorStopIndex',  app.state.colorStops.length - 1);
		newb.appendTo(app.ui.gradientSlider);
		newb.click(function (e) {
			if (!$(this).hasClass('noclick'))
			HandleClick(app,$(this))
		});

		newb.draggable({axis: "x",containment: "parent",
			start: function () {$(this).addClass("noclick")},
			drag: function(e) {        		
				var parentOffset = $(this).offset().left ;
				var width = $(this).parent().width();
				var percent = (parentOffset / width)* 100;
        		stop.percent = percent;
				UpdateUI(app);
			},
			stop: function () {e.removeClass('noclick')}
		});
	}

	function HandleClick(app, handle) {
		if (app.settings.requestingColor) {
			if (handle) { 
				var stopIndex = handle.data('colorStopIndex');
				app.settings.requestingColor(function (color) {
					app.state.colorStops[stopIndex].color = color;
					UpdateUI(app);
				},
				app.state.colorStops[stopIndex].color);
			} else { 
				var percent = 50;
				app.settings.requestingColor(function (color) {
					// create new stop
					var newStop = {percent:percent ,color:color}  					
  					renderNewStop(newStop,app);
					UpdateUI(app);
				});
			}
		}
	}

	//methods
	function UpdateUI(app) {
		
		

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