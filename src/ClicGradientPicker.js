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

	function drawForm(app) {
		var randId = CreateRandomId();
		var parent = $('<div class="gradForm"></div>');		
		
		// radial/linear radio buttons.
		var radLinRow = $('<div class="row"></div>');
		var radLinLabel = $('<label>Type</label>');		
		app.ui.radField = $('<input id="' + randId +'" name="radlin" type="radio"><label for="' + randId + '">Radial</label></input>');
		app.ui.radField.click(function () {
			if($(this).is(':checked')) {
				app.state.radial = true;
				UpdateUI(app);
			}
		});
		
		
		randId = CreateRandomId();
		app.ui.linField = $('<input id="' + randId +'"  name="radlin" checked="checked" type="radio"><label for="' + randId + '">Linear</label></input>');
		app.ui.linField.click(function () {
			if($(this).is(':checked')) {
				app.state.radial = false;
				UpdateUI(app);
			}
		});

		
		radLinLabel.appendTo(radLinRow);
		app.ui.radField .appendTo(radLinRow );
		app.ui.linField.appendTo(radLinRow );
		radLinRow.appendTo(parent);
		
		// angle selector		
		app.ui.angleRow = $('<div class="row"></div>');
		var angleLabel = $("<label>Angle</label>");
		app.ui.anglePicker = $("<div />").anglepicker({
			clockwise: false,
			change: function(e, ui) {
				$('#val').text(ui.value);
				app.state.linearAngle = (ui.value + 90) % 360;
			},
			value: 0
		});
		
		angleLabel.appendTo(app.ui.angleRow);
		app.ui.anglePicker.appendTo(app.ui.angleRow);
		app.ui.angleRow.appendTo(parent);

		// presets 
		var presetRow = $('<div class="row"></div>');
		var presetLabel = $("<label>Presets</label>");
		app.ui.presetControl = $("<div class='presetPicker' />").ClicPresetPicker({onChange:function (e) {
			app.ui.gradientSlider.ClicGradientSlider("setValue",{colorStops:e.selected});
		}});
		
		presetLabel.appendTo(presetRow);
		app.ui.presetControl.appendTo(presetRow);
		presetRow.appendTo(parent);		

		// add to picker
		parent.appendTo(app.ui.gradientPicker);
	}

	function drawGradientPicker(app) {
		app.ui.gradientPicker = $('<div></div>');
		drawGradientSlider(app);
		drawForm(app);
		drawCommandRow(app);
		app.ui.gradientPicker.appendTo(app.ui.mainPanel);
	}

	
	//methods
	function UpdateUI(app) {
		if (app.state.radial) {
			app.ui.angleRow.hide();
			app.ui.presetControl.height(210);
		} else {
			app.ui.angleRow.show();
			app.ui.presetControl.height(149);
		}
	}


	//--------------//
	// 
	// Jquery control setup code
	//
	//--------------//

	function getSettings(options) {
		return $.extend( {   
			enableOpacity:false,                       
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
       				radial:false,
       				linearAngle:null
				},
				ui: {
					mainPanel:$(control),
					gradientPicker:null,
					gradientSlider:null,
					linField:null,
					radField:null,
					anglePicker:null,
					angleRow:null
				}
   			});

			app = $(control).data('ClicGradientPicker');
    	}
    	return app;
	}	

	var methods = {	
		getValue : function (options) {
			var rv = [];
			this.each(function () {
            	var app = getApp(this,options);
            	var val = {
            		isRadial: app.state.radial,
            		linearAngle: app.state.radial?undefined:app.state.linearAngle,
            		colorStops: app.ui.gradientSlider.ClicGradientSlider('getValue')
            	};

            	rv.push(val);
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