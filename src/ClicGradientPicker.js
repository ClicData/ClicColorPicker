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
	            	cancel:"Cancel",
	            	radial:"Radial",
	            	linear:"Linear"
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
					anglePicker:null,
					angleRow:null,
					colorPicker:null
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
			requestingColor: function (callback,previewCallback, oldColor,showDelete) {SliderRequestsColor(callback,previewCallback,app,oldColor,showDelete);}
		});	

		app.ui.gradientSlider.appendTo(app.ui.mainPanel);
	}

	function SliderRequestsColor(callback, previewCallback, app,oldColor,showDelete) {
		if (app.ui.colorPicker) {app.ui.colorPicker.remove();}
		app.ui.colorPicker = $("<div />").ClicFullPicker({
			enableOpacity:app.settings.enableOpacity,
			startColor:oldColor,
			showDelete:showDelete,
			deleteClick: function (e) {
				callback("delete");
				app.ui.colorPicker.remove();
				app.ui.gradientPicker.show();
			},
			applyClick: function (e) {
				var value = app.ui.colorPicker.ClicFullPicker('getColor');
				callback(value);
				app.ui.colorPicker.remove();
				app.ui.gradientPicker.show();
			},
			cancelClick: function () {
				callback("cancel");
				app.ui.colorPicker.remove();
				app.ui.gradientPicker.show();
			},
			previewChanged: function (rgb) {
				if (previewCallback) {previewCallback(rgb);}
			}
		});
		
		app.ui.gradientPicker.hide();
		app.ui.colorPicker.appendTo(app.ui.mainPanel);
	} 	

	function drawToggleButton(app, parent) {
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

		var toggleRow = ClicColorLib.Ui.addControl(
			"div",
			parent, 
			{"class":"row"}
		);
		 
		var radLinToggle = $('<div class="toggle-light" />').toggles({
			text: {on:app.settings.translations.radial,off:app.settings.translations.linear},
			on:app.state.radial,
			width:65,
			type:'select'
		});


		radLinToggle.on('toggle', function (e, active) {
			app.state.radial = active;
			UpdateUI(app);
		});

		radLinToggle.appendTo(toggleRow);
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

		app.ui.anglePicker = $("<div class='noUiSlider' />").noUiSlider({
			range: [0, 360]
			,start: 0
		   	,step: 1
		   	,handles:1
		   	,slide: function(){
		   		app.state.linearAngle = ($(this).val() + 90) % 360;
		    	UpdateUI(app);
		   	}
		});	
		app.ui.anglePicker.css('margin-left', '3px');
		app.ui.anglePicker.appendTo(parent);
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
		
		drawToggleButton(app, parent);
		drawAngleSelector(app, parent);
		drawPresetPicker(app, parent);
	}

	function drawGradientPicker(app) {
		drawGradientSlider(app);
		app.ui.gradientPicker = ClicColorLib.Ui.addControl(
			"div",
			app.ui.mainPanel
		);

		drawForm(app);
		ClicColorLib.Ui.drawCommandRow(app, app.ui.gradientPicker);
	}

	
	//methods
	function UpdateUI(app) {
		if (app.state.radial) {
			app.ui.angleRow.hide();
			app.ui.anglePicker.hide();
			app.ui.presetControl.height(198);
		} else {
			app.ui.angleRow.show();
			app.ui.anglePicker.show();
			app.ui.presetControl.height(149);
		}
	}
})( jQuery );