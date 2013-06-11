(function( $ ){
	function Init(element,app) {
		drawGradientSlider(app);
		UpdateUI(app);
	}



	function drawGradientSlider(app) {
		app.ui.gradientSlider = $('<div class="gradSlider" title="Click to add a gradient stop"></div>');
		app.ui.gradientSlider.click(function (e) {
			if (e.target == this) {
				var parentLeft = $(this).offset().left;
    			var clickLeft = e.pageX;
    			var howFarFromLeft = clickLeft - parentLeft;
				var width = $(this).parent().width();
				var percent = (howFarFromLeft / width) * 100;
				NewHandle(app, percent);	
			}
		});
		renderStops(app);
		app.ui.gradientSlider.appendTo(app.ui.parent);
	}

	function renderStops(app) {
		// others that may exist
		if (app.state.colorStops.length>2) {
			for (var i =1;i<app.state.colorStops.length-1;i++) {
				renderNewStop(app.state.colorStops[i],app,i);
			}	
		}

		// first stop
		var zero = $('<span class="gradSliderHandle" title="Click to modify or delete the gradient stop" />');
		zero.css('left','5');
		zero.data('colorStopIndex', 0);
		zero.appendTo(app.ui.gradientSlider);
		zero.click(function (e) {HandleClick(app,$(this),false)});
		// last stop
		var hundred = $('<span class="gradSliderHandle" title="Click to modify or delete the gradient stop" />');
		hundred.css('left','230');
		hundred.data('colorStopIndex',  app.state.colorStops.length-1);
		hundred.appendTo(app.ui.gradientSlider);
		hundred.click(function (e) {HandleClick(app,$(this),false)});
	}

	function renderNewStop(stop, app, index) {
		var newb = $('<span class="gradSliderHandle" title="Click to modify or delete the gradient stop" />');
		newb.css('left',stop.percent + '%');
		
		if (index) {
			newb.data('colorStopIndex',  index);
		} else {
			app.state.colorStops.push(stop);
			newb.data('colorStopIndex',  app.state.colorStops.length - 1);
		}
		
		newb.appendTo(app.ui.gradientSlider);
		newb.click(function (e) {
			if ($(this).hasClass('noclick')) {
				$(this).removeClass('noclick');
			} else {
				HandleClick(app,$(this),true);
			}
		});

		newb.draggable({axis: "x",containment: "parent",
			start: function () {$(this).addClass("noclick")},
			drag: function(e) {        		
				var parentOffset = $(this).offset().left - ($(this).width());
				var width = $(this).parent().width();
				var percent = (parentOffset / width)* 100;
        		stop.percent = percent;
				UpdateUI(app);
			},
			stop: function () { setTimeout(function() {$(this).removeClass('noclick')},1);}
		});
	}

	function NewHandle(app, percent) {		
		app.settings.requestingColor(function (color) {
			// create new stop
			var newStop = {percent:percent ,color:color}
			renderNewStop(newStop,app);
			UpdateUI(app);
		},null,false);
	}

	function HandleClick(app, handle,showDelete) {
		if (app.settings.requestingColor) {
			var stopIndex = handle.data('colorStopIndex');
			app.settings.requestingColor(
				function (value) {
					if (value.toString() === "delete") {
						handle.remove();
						app.state.colorStops.splice(stopIndex,1);
					} else {
						app.state.colorStops[stopIndex].color = value;	
					}
					
					UpdateUI(app);
				},
				app.state.colorStops[stopIndex].color,
				showDelete
			);
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
		getValue : function (options) {
			var rv = [];
			this.each(function () {
            	var app = getApp(this,options);
            	rv.push(app.state.colorStops);
            });
            return rv[0];
		},	
		setValue : function (options) {
			var rv = [];
			this.each(function () {
            	var app = getApp(this,options);
            	app.state.colorStops = options.colorStops;
            	app.ui.gradientSlider.html('');
            	renderStops(app);
            	UpdateUI(app);
            });
            return rv[0];
		},	
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