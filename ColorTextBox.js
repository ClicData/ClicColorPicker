(function( $ ){
	

	function Init(element,app) {
		drawColorTextBox(app);
		UpdateUI(app);
	}

	

	function drawColorTextBox(app) {	
		var parent = $("<div class='colorTBParent'></div>")	
		app.ui.previewArea =  $('<span class="colorTBPreview"></span>');
		app.ui.previewArea.appendTo(parent);


		app.ui.textBox =  $('<input type="text" class="colorTBInput" />');		
		app.ui.textBox.blur(function (e) {textBoxChanged(app);});
		app.ui.textBox.keyup(function (e) {
			 if(e.which == 9 || e.which == 13) {
		        // enter or tab was hit
		        $(this).blur();
		        e.preventDefault();
		    }
		})
		app.ui.textBox.appendTo(parent);

 		parent.appendTo(app.ui.container);
	}

	function textBoxChanged(app) {
		var newVal = app.ui.textBox.val();

		if (isColor(newVal)) {

			app.state.selectedColor = StringToObject(newVal);
			UpdateUI(app);
			app.ui.textBox.removeClass('invalid');
			if (app.settings.valueChanged) {
				app.settings.valueChanged(app.state.selectedColor);
			}
		} else {
			app.ui.textBox.addClass('invalid');
		}


		
	}
		

	//methods
	function UpdateUI(app) {	
		var str;
		if (app.settings.enableOpacity) {
			str = ObjectToRGBAString(app.state.selectedColor);
		} else {
			str = ObjectToRGBString(app.state.selectedColor);
		}

		app.ui.previewArea.css("background-color",str);
		app.ui.textBox.val(str);
		
	}


	//--------------//
	// 
	// Jquery control setup code
	//
	//--------------//

	function getSettings(options) {
		return $.extend( {
        	startColor: StringToObject('#FFFFFF'),
        	enableOpacity:false,
        	valueChanged:null       
        }, options);
	}

	function getApp(control,options) {
		var app = $(control).data('ColorTextBox');
    	if (!app) {
    		var settings = getSettings(options);
    		$(control).data('ColorTextBox', {
    			settings:settings,
       			state: {
					selectedColor:settings.startColor,
					selectedOpacity:null
				},
				ui: {
					container:$(control),					
					previewArea:null,
					textBox:null
				}
   			});

			app = $(control).data('ColorTextBox');
    	}
    	return app;
	}

	var methods = {
		setOpacity:function (newVal) {
			return this.each(function () {
            	var app = getApp(this);
            	app.state.selectedColor.a = newVal	;            	
            	UpdateUI(app);
            });
		},
		setValue:function (newVal) {
			return this.each(function () {
            	var app = getApp(this); 
            	if (newVal === newVal.toString()) {
					app.state.selectedColor = StringToObject(newVal);
            	} else {
            		app.state.selectedColor = newVal;
            	}
        		
        		UpdateUI(app);        	
            });
            
		},
        init : function( options ) {
            return this.each(function () {
            	var app = getApp(this,options);
            	Init(this,app);
            });
        }
    }

  $.fn.ColorTextBox = function(method) {
  	// Method calling logic
	if ( methods[method] ) {
		return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
		return methods.init.apply( this, arguments );
	} else {
		$.error( 'Method ' +  method + ' does not exist on ColorTextBox' );
	}
  };
})( jQuery );