(function( $ ){
	var _us = [];
	function Init(element,app) {
		// draw ui
		drawOpener(element,app);
		drawMainPanel(app);

		// set events
		setInternalEvents(app);

		UpdateUI(app);
	}

	function drawOpener(element,app) {
		app.ui.opener = $("<span class='unselectable opener'></span>");
		app.ui.opener.addClass(app.settings.openerCssClass);

		app.ui.previewArea = $("<span class='smallPreview'></span>");
		app.ui.previewArea.appendTo(app.ui.opener);
		
		app.ui.arrowArea = $("<span class='arrowArea'>&#x25BC;</span>");
		app.ui.arrowArea.appendTo(app.ui.opener);

		app.ui.opener.appendTo($(element).parent());
		$(element).hide();
	}

	function drawMainPanel(app) {
		app.ui.mainPanel = $('<div class="mainPanel"></div>');
		app.ui.mainPanel.addClass(app.settings.mainPanelCssClass);
		app.ui.mainPanel.appendTo($('body'));
		app.ui.mainPanel.hide();

		if (app.settings.type == 'gradient') { 
			app.ui.mainPanel.ClicGradientPicker({
				'applyClick':function () {
					var color = app.ui.mainPanel.ClicGradientPicker('getColor');
					ApplyClicked(app,color);					
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
	
	function ApplyClicked(app, newcolor) {
		app.state.mainPanelVisible = false;
		app.state.selectedColor = newcolor;
		UpdateUI(app);

		if (app.settings.onChanged) {
			var e = {
				oldValue:app.state.oldColor,
				newValue:newcolor
			};
			app.settings.onChanged(e);

			app.state.oldColor = newcolor;
		}

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
		
		app.ui.previewArea.css("background-color", ObjectToRGBAString(app.state.selectedColor));
	}

	function SetMainPanelPosition(app) {
		var pos = app.ui.opener.offset();

		var top = pos.top + app.ui.opener.outerHeight();
		var left = pos.width + app.ui.opener.outerWidth();


		app.ui.mainPanel.css('top',top);
		app.ui.mainPanel.css('left',left);
	}


	var methods = {
        init : function( options ) {
            var settings = $.extend( {
            	startColor:'#FFFFFF',
                type:'simple', // can be full, simple, or gradient
                enableOpacity:false, //determines whether opacity selection is enabled
                defaultPalette:'websafe', // which palette is selected by defaul, only applies to simple mode
                openerCssClass:"", // css class for the element that opens the panel
                mainPanelCssClass:"",
                onChanged:null
            }, options);


            return this.each(function () {
            	var app = $(this).data('ClicColorPicker');
            	if (!app) {
            		$(this).data('ClicColorPicker', {
            			settings:settings,
               			state: {
               				mainPanelVisible:false,
							selectedColor: StringToObject(settings.startColor),
							oldColor:StringToObject(settings.startColor),
							simplePaletteIndex:0
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
           			});
					app = $(this).data('ClicColorPicker');
					_us.push(app);
           			Init(this,app);
            	}

                
            });


        }
    }

  $.fn.ClicColorPicker = function(method) {
  	// Method calling logic
	if ( methods[method] ) {
		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on ClicColorPicker' );
	}
  };
})( jQuery );