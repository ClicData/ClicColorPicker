(function( $ ){
	var _controlName = "ClicFullPicker";
	/*
		Setup jquery stuff 
	*/
	var methods = {	
		getColor:getColor,
        init : init
    }
  
  	$.fn.ClicFullPicker = ClicUiLib.createJqueryObject(_controlName, methods);  

	/*
		Define methods
	*/
	function init( options ) {
        return this.each(function () {
        	var settings =  {
	        	startColor: {r:255,g:255,b:255,a:1},
	        	enableOpacity:false,
	        	opacity:1,
	            mainPanelCssClass:"",
	            showDelete:false,
	            deleteClick:null,
	            applyClick:null,
	            cancelClick:null,
	            translations: {
	            	apply:"Apply",
	            	cancel:"Cancel",
	            	delete:"Delete"
	            }
	        }

			// this merges pased options with default values
			settings = ClicUiLib.getSettings(settings, options);

			if (!settings.startColor) {
				settings.startColor = {r:255,g:255,b:255,a:1};
			}

			var hsl = RGBToHSL(settings.startColor)
			if (settings.startColor.a) {settings.opacity = settings.startColor.a;}

			var startState =  {
    			settings:settings,
       			state: {					
					selectedHue:hsl.h,
					selectedSaturation:hsl.s,
					selectedLightness:hsl.l,
					selectedOpacity:settings.opacity,
					mouseIsDown:false
				},
				ui: {
					mainPanel:$(this),
					colorTextBox:null,
					fullPicker:null,
					lightnessLines: new Array(100),					
					hueSlider:null,
					crosshair:null
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

    function getColor(options) {
		var rv = []
		this.each(function () {
        	var app = ClicUiLib.getAppData(_controlName, this);
        	rv.push(getSelectedColor(app));
        });
        return rv[0];
	}

	/*
		Drawing functions
	*/
	function renderControl(element,app) {
		drawFullPicker(app);		
		setTimeout(function(){UpdateUI(app)},1); // finish render before setting ui

	}
	
	function getSelectedColor(app) {
		var rv = HSLToRGB(app.state.selectedHue,app.state.selectedSaturation,app.state.selectedLightness);
		if (app.settings.enableOpacity) {
			rv.a = app.state.selectedOpacity;
		} else {
			rv.a = 1;
		}
		return rv;	
	}

	function drawTextInput(app) {
		var textRow = ClicUiLib.addControl(
			"div",
			app.ui.fullPicker, 
			{"class":"textRow"}
		);

		app.ui.colorTextBox = textRow.ColorTextBox({
			startColor:getSelectedColor(app),
			enableOpacity:app.settings.enableOpacity,
			valueChanged: function (newval) {
				app.state.selectedOpacity = newval.a;
				var hsl = RGBToHSL(newval);
				app.state.selectedHue = hsl.h;
				app.state.selectedSaturation = hsl.s;
				app.state.selectedLightness = hsl.l;
				UpdateUI(app);
			}
		});
	}
	
	function drawPicker(app) {
		var fullArea = ClicUiLib.addControl(
			"div",
			app.ui.fullPicker, 
			{"class":"fullArea"}
		);

		var satAndLightness = ClicUiLib.addControl(
			"div",
			fullArea, 
			{"class":"satAndLightnessArea"}
		);

		for (var i = 0; i<100; i++) {
			app.ui.lightnessLines[i] = ClicUiLib.addControl(
				"div",
				satAndLightness, 
				{"class":"lightnessLine"}
			);

			app.ui.lightnessLines[i].data("lightness",100-i);
			app.ui.lightnessLines[i].click(function () {
				app.state.selectedLightness = $(this).data("lightness");
			}).mousedown(function (e) {
				app.state.selectedLightness = $(this).data("lightness");
			}).mousemove(function (e) {
				if (app.state.mouseIsDown) {
					app.state.selectedLightness = $(this).data("lightness");
				}
			});
		}

		satAndLightness.click(function (e) {
			ChangeSatAndLightness(e, app,satAndLightness);			
		}).mousedown(function (e) {
			app.state.mouseIsDown = true;
			ChangeSatAndLightness(e, app,satAndLightness);			
		}).mousemove(function (e) {
			if (app.state.mouseIsDown) {
				ChangeSatAndLightness(e, app,satAndLightness);
			}
		});

		app.ui.crosshair = $('<img src="images/crosshair.png" style="position:relative;" />');
		app.ui.crosshair.appendTo(satAndLightness);
		$(document).mouseup(function (e) {
			app.state.mouseIsDown = false;
		})

		drawHueSlider(app,fullArea);

		if (app.settings.enableOpacity) {
			drawOpacitySlider(app,fullArea);
		}
	}

	function ChangeSatAndLightness(e,app,satAndLightness) {
		var absX = satAndLightness.offset().left;
		var relX = e.pageX - absX;
		var width = satAndLightness.width();
		
		app.state.selectedSaturation = (100-(relX/width)*100);
		UpdateUI(app);
		e.preventDefault();
	}

	function drawOpacitySlider(app,fullArea) {
		app.ui.opacitySlider = $('<div class="noUiSlider"></div>').noUiSlider({
			range: [0, 1]
			,start: 1
		   	,step: .01
		   	,handles:1
		   	,slide: function(){
		   		app.state.selectedOpacity = $(this).val();
		    	UpdateUI(app);
		   	}
		});		

		var sliderContainer = ClicUiLib.addControl(
			"div",
			fullArea
		);
		app.ui.opacitySlider.appendTo(sliderContainer);
	}

	function drawHueSlider(app,fullArea) {

		var hueGradient = [
			{percent:0,color:ParseHex("#ff0000")},
			{percent:17,color:ParseHex("#ffff00")},
			{percent:33,color:ParseHex("#00ff00")},
			{percent:50,color:ParseHex("#00ffff")},
			{percent:67,color:ParseHex("#0000ff")},
			{percent:83,color:ParseHex("#ff00ff")},
			{percent:100,color:ParseHex("#ff0000")},
		];
		
		app.ui.hueSlider = $('<div class="noUiSlider"></div>').noUiSlider({
			range: [0, 360]
			,start: app.state.selectedHue
		   	,step: 1
		   	,handles:1
		   	,slide: function(){
		   		app.state.selectedHue = $(this).val();
		    	UpdateUI(app);
		   	}
		});		

		ApplyGradientBackground(app.ui.hueSlider,90,hueGradient)

		var sliderContainer =ClicUiLib.addControl(
			"div",
			fullArea
		);
		app.ui.hueSlider.appendTo(sliderContainer);
	}

	function drawDeleteButton(app) {
		var delBtn = ClicUiLib.addControl(
			"input",
			app.ui.fullPicker, 
			{"class":"delete","type":"button"}
		);

		delBtn.val(app.settings.translations.delete);
		delBtn.click(function() {
			if (app.settings.deleteClick) {app.settings.deleteClick();}
		});
	}

	function drawFullPicker(app) {
		app.ui.fullPicker = ClicUiLib.addControl(
			"div",
			app.ui.mainPanel
		);
		if (app.settings.showDelete) {
			drawDeleteButton(app);
		}
		drawTextInput(app);
		drawPicker(app)
		ClicUiLib.drawCommandRow(app, app.ui.fullPicker);
	}


	//methods
	function UpdateUI(app) {
		var rgb = getSelectedColor(app);
		app.ui.colorTextBox.ColorTextBox('setValue',rgb);		

		app.ui.hueSlider.val(app.state.selectedHue);
		if (app.ui.opacitySlider) {
			app.ui.opacitySlider.val(app.state.selectedOpacity);	

			var solid = CloneColor(rgb);		
			var transparent = CloneColor(rgb);
			solid.a = 1;
			transparent.a = 0

			app.ui.opacitySlider.css('background',"linear-gradient(90deg," + ObjectToRGBAString(transparent) + "," + ObjectToRGBAString(solid) + ") , url('images/transparent.png') repeat");		
		}
		
		var offset = 6;
		offset += app.state.selectedLightness*2;
		app.ui.crosshair.css('top', -offset);
		
		offset = -8;
		var width = app.ui.crosshair.parent().width();
		var left = width - (app.state.selectedSaturation * (width/100)) + offset;
		app.ui.crosshair.css('left', left);

		var lightness;
		var empty;
		var mid;
		var full;
		for (var i = 0; i<app.ui.lightnessLines.length; i++) {
			lightness = app.ui.lightnessLines[i].data('lightness');
			empty = HSLToRGB(app.state.selectedHue,0 ,lightness); 
			mid =  HSLToRGB(app.state.selectedHue,50 ,lightness); 
			full = HSLToRGB(app.state.selectedHue,100,lightness);

			var gradients = [
				{percent:0,color:full},
				{percent:50,color:mid},
				{percent:100,color:empty}
			];

			ApplyGradientBackground(app.ui.lightnessLines[i],90,gradients)
		}	
	}
})( jQuery );