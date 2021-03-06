(function( $ ){
	var _us = [];
	var _controlName = "ClicColorPicker";
	/*
		Setup jquery stuff and defaults
	*/
	var methods = {	
        init : init
    }

	$.fn.ClicColorPicker = ClicColorLib.Ui.createJqueryObject(_controlName, methods);


	/*
		Define methods
	*/
	function init(options) {
		return this.each(function () {
			var settings =  {  // default values
		    	startColor:'#FFFFFF',
		        type:'simple', // can be full, simple, or gradient
		        enableOpacity:false, //determines whether opacity selection is enabled
		        defaultPalette:'websafe', // which palette is selected by defaul, only applies to simple mode
		        openerCssClass:"", // css class for the element that opens the panel
		        mainPanelCssClass:"",
		        onChanged:null,
		        imagePath:null
		    }
			
			// this merges pased options with default values
			settings = ClicColorLib.Ui.getSettings(settings, options);
			var startState = {
    			settings:settings,
       			state: {
       				mainPanelVisible:false,
					selectedColor: ClicColorLib.ColorMethods.StringToObject(settings.startColor),
					oldValue:ClicColorLib.ColorMethods.StringToObject(settings.startColor),
					simplePaletteIndex:0,
					selectedGradient: null
				},
				ui: {
					opener:null,
					previewArea:null,
					arrowArea:null,
					mainPanel:null,
					simplePicker:null,
					fullPicker:null,
					gradientPicker:null
				}
   			}

			ClicColorLib.Ui.initControl(
				_controlName,
				renderControl,
				startState,
				this
			);

			_us.push(startState);
		});
	}

	/*
		Drawing functions
	*/
	function renderControl(element,app) {
		// draw ui
		drawOpener(element,app);
		drawMainPanel(app);

		// set events
		setInternalEvents(app);

		UpdateUI(app);
	}

	function drawOpener(element,app) {
		var css = 'unselectable opener' + app.settings.openerCssClass;
		app.ui.opener = ClicColorLib.Ui.addControl("span",$(element).parent(), {"class":css});

		app.ui.previewArea =  ClicColorLib.Ui.addControl(
			"span",
			app.ui.opener, 
			{"class":"smallPreview"}
		);
		
		app.ui.arrowArea = ClicColorLib.Ui.addControl(
			"span",
			app.ui.opener, 
			{"class":"arrowArea"},
			"&#x25BC;"
		);

		$(element).hide();
	}

	function drawMainPanel(app) {
		var css = "mainPanel " + app.settings.mainPanelCssClass
		app.ui.mainPanel = ClicColorLib.Ui.addControl(
			"div",
			$('body'), 
			{"class":css}
		);

		app.ui.mainPanel.hide();

		if (app.settings.type == 'gradient') { 
			app.ui.mainPanel.css('height','370px');
			app.ui.mainPanel.ClicGradientPicker({
				imagePath:app.settings.imagePath,
				enableOpacity:app.settings.enableOpacity,
				'applyClick':function () {
					var val = app.ui.mainPanel.ClicGradientPicker('getValue');
					ApplyClicked(app,val);					
				},
				'cancelClick':function () {
					app.state.mainPanelVisible = false;
		  			UpdateUI(app);
				}
			});			
		} else if (app.settings.type == 'simple') {
			app.ui.mainPanel.ClicSimplePicker({
				'startColor':app.state.selectedColor,
				'applyClick':function () {
					var color = app.ui.mainPanel.ClicSimplePicker('getColor');
					ApplyClicked(app,color);					
				},
				'cancelClick':function () {
					app.state.mainPanelVisible = false;
		  			UpdateUI(app);
				}
			});
		} else if (app.settings.type == 'full') {
			app.ui.mainPanel.ClicFullPicker({
				'startColor':app.state.selectedColor,
				'enableOpacity':app.settings.enableOpacity,
				'imagePath':app.settings.imagePath,
				'applyClick':function () {
					var color = app.ui.mainPanel.ClicFullPicker('getColor');
					ApplyClicked(app,color);					
				},
				'cancelClick':function () {
					app.state.mainPanelVisible = false;
		  			UpdateUI(app);
				}
			});
		}
	}
	
	function ApplyClicked(app, newvalue) {
		app.state.mainPanelVisible = false;
		var gradientCss = undefined;
		if (app.settings.type == 'gradient') { 
			app.state.selectedGradient = newvalue;

			gradientCss = ClicColorLib.ColorMethods.GetGradientCss(newvalue.linearAngle, newvalue.colorStops, newvalue.isRadial);
		} else {
			app.state.selectedColor = newvalue;
		}

		if (app.settings.onChanged) {
			var e = {
				gradientCss:gradientCss,
				oldValue:app.state.oldValue,				
				newValue:newvalue
			};
			app.settings.onChanged(e);

			app.state.oldValue = newvalue;
		}
		
		UpdateUI(app);
	}

	function setInternalEvents(app)  {
		$("body").click(function(){
		  app.state.mainPanelVisible = false;
		  UpdateUI(app);
		});

		app.ui.opener.click( function(e) {OpenerClick(e,app);});

		app.ui.mainPanel.click(function(e) {e.stopPropagation();});
	}


	// event handlers
	function OpenerClick(e,app) {
		for (var i = 0; i< _us.length;i++) {
			if (_us[i] != app){
				_us[i].state.mainPanelVisible = false;
				UpdateUI(_us[i]);
			}
		};

		app.state.mainPanelVisible = !app.state.mainPanelVisible;
		UpdateUI(app);

		e.stopPropagation();
	}

	
	//methods
	function UpdateUI(app) {
		if (app.state.mainPanelVisible) {
			SetMainPanelPosition(app);
			app.ui.mainPanel.fadeIn('fast');
			app.ui.arrowArea.html('&#x25B2;');
		} else {
			app.ui.mainPanel.fadeOut('fast');
			app.ui.arrowArea.html('&#x25BC;');
		}

		if (app.settings.type == 'gradient' && app.state.selectedGradient) { 
			ClicColorLib.ColorMethods.ApplyGradientBackground(
				app.ui.previewArea,
				app.state.selectedGradient.linearAngle,
				app.state.selectedGradient.colorStops,
				app.state.selectedGradient.isRadial,
				app.settings.imagePath + '/transparent.png'			
			)			
		} else {
			app.ui.previewArea.css("background-color", ClicColorLib.ColorMethods.ObjectToRGBAString(app.state.selectedColor));
		}
		
		
	}

	function SetMainPanelPosition(app) {
		var pos = app.ui.opener.offset();

		var top = pos.top + app.ui.opener.outerHeight();
		var left = pos.left;


		app.ui.mainPanel.css('top',top);
		app.ui.mainPanel.css('left',left);
	}
})( jQuery );