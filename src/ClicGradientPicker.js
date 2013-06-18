(function( $ ){
	var _controlName = "ClicGradientPicker";
	/*
		Setup jquery stuff 
	*/
	var methods = {	
		getValue:getValue,
        init : init
    }
  
  	$.fn.ClicGradientPicker = ClicColorLib.Ui.createJqueryObject(_controlName, methods);  

	/*
		Define methods
	*/
	function init( options ) {
        return this.each(function () {
        	var settings =  {   
				enableOpacity:false,                       
	            applyClick:null,
	            cancelClick:null,
	            translations: {
	            	apply:"Apply",
	            	cancel:"Cancel"
	            }
	        }
			
			// this merges pased options with default values
			settings = ClicColorLib.Ui.getSettings(settings, options);
			var startState =  {
    			settings:settings,
       			state: {
       				radial:false,
       				linearAngle:null
				},
				ui: {
					mainPanel:$(this),
					gradientPicker:null,
					gradientSlider:null,
					linField:null,
					radField:null,
					anglePicker:null,
					angleRow:null
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
        	var app = ClicColorLib.Ui.getAppData(_controlName, this);
        	var val = {
        		isRadial: app.state.radial,
        		linearAngle: app.state.radial?undefined:app.state.linearAngle,
        		colorStops: app.ui.gradientSlider.ClicGradientSlider('getValue')
        	};

        	rv.push(val);
        });
        return rv[0];
	}

	/*
		Drawing functions
	*/
	function renderControl(element,app) {
		drawGradientPicker(app);
		UpdateUI(app);
	}

	function drawGradientSlider(app) {
		app.ui.gradientSlider = $('<div></div>').ClicGradientSlider({
			requestingColor: function (callback,oldColor,showDelete) {SliderRequestsColor(callback,app,oldColor,showDelete);}
		});	

		app.ui.gradientSlider.appendTo(app.ui.gradientPicker);
	}

	function SliderRequestsColor(callback,app,oldColor,showDelete) {
		var colorPicker = $("<div />").ClicFullPicker({
			enableOpacity:app.settings.enableOpacity,
			startColor:oldColor,
			showDelete:showDelete,
			deleteClick: function (e) {
				callback("delete");
				colorPicker.remove();
				app.ui.gradientPicker.show();
			},
			applyClick: function (e) {
				var value = colorPicker.ClicFullPicker('getColor');
				callback(value);
				colorPicker.remove();
				app.ui.gradientPicker.show();
			},
			cancelClick: function () {
				colorPicker.remove();
				app.ui.gradientPicker.show();
			}
		});
		
		app.ui.gradientPicker.hide();
		colorPicker.appendTo(app.ui.mainPanel);
	} 	

	// we need ids for some elements, yet we want to allow multiple controls per page without id conflicts
	function CreateRandomId()
	{
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	    for( var i=0; i < 5; i++ ) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }	        

	    return text;
	}

	function drawRadioButtons(app, parent) {
		var radLinRow = ClicColorLib.Ui.addControl(
			"div",
			parent, 
			{"class":"row"}
		);

		var radLinLabel = ClicColorLib.Ui.addControl(
			"label",
			radLinRow, 
			{},
			"Type"
		);
		 
		app.ui.radField = drawRadioButton(radLinRow, "Radial");
		app.ui.radField.click(function () {
			if($(this).is(':checked')) {
				app.state.radial = true;
				UpdateUI(app);
			}
		});
		
		
		randId = CreateRandomId();

		app.ui.linField = drawRadioButton(radLinRow, "Linear"); 
		app.ui.linField.click(function () {
			if($(this).is(':checked')) {
				app.state.radial = false;
				UpdateUI(app);
			}
		});
	}

	function drawAngleSelector(app, parent) {
		app.ui.angleRow = ClicColorLib.Ui.addControl(
			"div",
			parent, 
			{"class":"row"}
		);

		var angleLabel = ClicColorLib.Ui.addControl(
			"label",
			app.ui.angleRow, 
			{},
			"Angle"
		);

		 $("<label>Angle</label>");
		app.ui.anglePicker = $("<div />").anglepicker({
			clockwise: false,
			change: function(e, ui) {
				$('#val').text(ui.value);
				app.state.linearAngle = (ui.value + 90) % 360;
			},
			value: 0
		});
		
		app.ui.anglePicker.appendTo(app.ui.angleRow);
	}

	function drawPresetPicker(app, parent) {
		// presets 
		var presetRow = ClicColorLib.Ui.addControl(
			"div",
			parent, 
			{"class":"row"}
		);

		var presetLabel = ClicColorLib.Ui.addControl(
			"label",
			presetRow,
			{},
			"Presets"
		);

		 $("<label>Presets</label>");
		app.ui.presetControl = $("<div class='presetPicker' />").ClicPresetPicker({onChange:function (e) {
			app.ui.gradientSlider.ClicGradientSlider("setValue",{colorStops:e.selected});
		}});
		
		app.ui.presetControl.appendTo(presetRow);
	}

	function drawForm(app) {
		var parent = ClicColorLib.Ui.addControl(
			"div",
			app.ui.gradientPicker, 
			{"class":"gradForm"}
		);
		
		drawRadioButtons(app, parent);
		drawAngleSelector(app, parent);
		drawPresetPicker(app, parent);
	}

	function drawRadioButton(parent, text) {
		var randId = CreateRandomId();
		var rv = ClicColorLib.Ui.addControl(
			"input",
			parent, 
			{"id":randId,"name":"radlin","type":"radio"}
		);

		var lbl = ClicColorLib.Ui.addControl(
			"label",
			parent, 
			{"for":randId},
			text
		);

		return rv;
	}

	function drawGradientPicker(app) {
		app.ui.gradientPicker = ClicColorLib.Ui.addControl(
			"div",
			app.ui.mainPanel
		);
		drawGradientSlider(app);
		drawForm(app);
		ClicColorLib.Ui.drawCommandRow(app, app.ui.gradientPicker);
	}

	
	//methods
	function UpdateUI(app) {
		if (app.state.radial) {
			app.ui.angleRow.hide();
			app.ui.presetControl.height(210);
			app.ui.radField.prop("checked", true)
		} else {
			app.ui.angleRow.show();
			app.ui.presetControl.height(149);
			app.ui.linField.prop("checked", true)
		}
	}
})( jQuery );