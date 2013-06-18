(function( $ ){

	var _controlName = "ClicGradientSlider";
	/*
		Setup jquery stuff and defaults
	*/

	var methods = {	
		getValue : getValue,	
		setValue : setValue,	
        init : init
    }

	$.fn.ClicGradientSlider = ClicColorLib.Ui.createJqueryObject(_controlName, methods);


	/*
		Define methods
	*/
	function init(options) {
		return this.each(function () {
			var settings =  {
				requestingColor:null,
	        	startColorStops:[
		        	{percent:0,color:{r:0,g:0,b:0,a:1}},
		        	{percent:100,color:{r:255,g:255,b:255,a:1}}
		        ]
	    	}
			settings = ClicColorLib.Ui.getSettings(settings, options);
			var startState = {
				settings:settings,
					state: {
						colorStops: settings.startColorStops
				},
				ui: {
					parent: $(this),
					gradientSlider:null
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

	function getValue(options) {
		var rv = [];
		this.each(function () {
			var app = ClicColorLib.Ui.getAppData(_controlName,this);
			rv.push(app.state.colorStops);
		});
		if (rv[0]) {return rv[0]};
	}

	function setValue(options) {
		var rv = [];
		this.each(function () {
	    	var app = ClicColorLib.Ui.getAppData(_controlName,this);
	    	app.state.colorStops = options.colorStops;
	    	app.ui.gradientSlider.html('');
	    	renderStops(app);
	    	UpdateUI(app);
	    });
	    if (rv[0]) {return rv[0]};
	}


	/*
		Drawing functions
	*/
	function renderControl(element,app) {
		drawGradientSlider(app);
		UpdateUI(app);
	}



	function drawGradientSlider(app) {
		app.ui.gradientSlider = ClicColorLib.Ui.addControl(
			"div",
			app.ui.parent, 
			{"class":"gradSlider","title":"Click to add a gradient stop"}
		);

		 
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
	}

	function renderStops(app) {
		// others that may exist
		if (app.state.colorStops.length>2) {
			for (var i =1;i<app.state.colorStops.length-1;i++) {
				if (app.state.colorStops[i]) {
				    renderNewStop(app.state.colorStops[i],app,i);					
				}
			}	
		}

		// first stop
		var zero = ClicColorLib.Ui.addControl(
			"span",
			app.ui.gradientSlider, 
			{"class":"gradSliderHandle","title":"Click to modify or delete the gradient stop"}
		);
		zero.css('left','5');
		zero.data('colorStopIndex', 0);
		zero.click(function (e) {HandleClick(app,$(this),false)});
		// last stop
		var hundred = ClicColorLib.Ui.addControl(
			"span",
			app.ui.gradientSlider, 
			{"class":"gradSliderHandle","title":"Click to modify or delete the gradient stop"}
		);
		hundred.css('left','230');
		hundred.data('colorStopIndex',  app.state.colorStops.length-1);
		hundred.click(function (e) {HandleClick(app,$(this),false)});
	}

	function renderNewStop(stop, app, index) {
		var newb = ClicColorLib.Ui.addControl(
			"span",
			app.ui.gradientSlider, 
			{"class":"gradSliderHandle","title":"Click to modify or delete the gradient stop"}
		);

		newb.css('left',stop.percent + '%');
		
		if (index) {
			newb.data('colorStopIndex',  index);
		} else {
			app.state.colorStops.push(stop);
			newb.data('colorStopIndex',  app.state.colorStops.length - 1);
		}
		
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
						app.state.colorStops[stopIndex] = null;
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
		ClicColorLib.ColorMethods.ApplyGradientBackground(app.ui.gradientSlider,90,app.state.colorStops);
	}

})( jQuery );