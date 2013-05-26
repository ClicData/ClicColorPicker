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
			requestingColor: function (callback,oldColor) {SliderRequestsColor(callback,app,oldColor);}
		});

		app.ui.gradientSlider.appendTo(app.ui.gradientPicker);
	}

	function SliderRequestsColor(callback,app,oldColor) {
		var colorPicker = $("<div />").ClicFullPicker({
			enableOpacity:app.settings.enableOpacity,
			startColor:oldColor,
			applyClick: function (e) {
				var color = colorPicker.ClicFullPicker('getColor');
				callback(color);
				colorPicker.hide();
				app.ui.gradientPicker.show();
			},
			cancelClick: function () {
				colorPicker.hide();
				app.ui.gradientPicker.show();
			}
		});

		app.ui.gradientPicker.hide();
		colorPicker.appendTo(app.ui.mainPanel);
	} 	


	function drawForm(app) {
		// todo, get angle, radial/linear, etc...
		var parent = $('<div class="gradForm"></div>');
		var radLinLabel = $('<label>Type</label>');
		app.ui.radField = $('<input name="radlin" type="radio">Radial</input>');
		app.ui.radField.click(function () {
			if($(this).is(':checked')) {
				app.state.radial = true;
				UpdateUI(app);
			}
		});
		
		app.ui.linField = $('<input name="radlin" checked="checked" type="radio">Linear</input>');
		app.ui.linField.click(function () {
			if( $(this).is(':checked') ) {
				app.state.radial = false;
				UpdateUI(app);
			}
		});

		radLinLabel.appendTo(parent);
		app.ui.radField .appendTo(parent );
		app.ui.linField.appendTo(parent );


		var angleLabel = $("<label>Angle</label>");
		angleLabel.appendTo(parent);
		app.ui.anglePicker = $("<div />").anglepicker({
			start: function(e, ui) {

			},
			change: function(e, ui) {
			    $("#label").text(ui.value)
			},
			stop: function(e, ui) {

			},
			value: 0
		});
		
		app.ui.anglePicker.appendTo(parent);

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
			app.ui.anglePicker.hide();
		} else {
			app.ui.anglePicker.show();
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
       				radial:false
				},
				ui: {
					mainPanel:$(control),
					gradientPicker:null,
					gradientSlider:null,
					linField:null,
					radField:null,
					anglePicker:null
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