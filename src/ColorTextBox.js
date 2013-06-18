(function( $ ){
	var _controlName = "ColorTextBox";
	/*
		Setup jquery stuff and defaults
	*/

	var methods = {	
        init : init,
        setValue : setValue
    }

	$.fn.ColorTextBox = ClicColorLib.Ui.createJqueryObject(_controlName, methods);


	/*
		Define methods
	*/
	function init(options) {
		return this.each(function () {
			var settings = {
	        	startColor: ClicColorLib.ColorMethods.StringToObject('#FFFFFF'),
	        	enableOpacity:false,
	        	valueChanged:null       
	        }
			
			// this merges pased options with default values
			settings = ClicColorLib.Ui.getSettings(settings, options);
			var startState = {
    			settings:settings,
       			state: {
					selectedColor:settings.startColor,
					selectedOpacity:null
				},
				ui: {
					container:$(this),					
					previewArea:null,
					textBox:null
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

	function setValue(newVal) {
		return this.each(function () {
        	var app = ClicColorLib.Ui.getAppData(_controlName,this); 
        	if (newVal === newVal.toString()) {
				app.state.selectedColor = ClicColorLib.ColorMethods.StringToObject(newVal);
        	} else {
        		app.state.selectedColor = newVal;
        	}
    		
    		UpdateUI(app);        	
        });
	}

	/*
		Drawing functions
	*/
	function renderControl(element,app) {
		drawColorTextBox(app);
		UpdateUI(app);
	}

	

	function drawColorTextBox(app) {	
		var parent = ClicColorLib.Ui.addControl(
			"div",
			app.ui.container, 
			{"class":"colorTBParent"}
		);

		 
		var bg = ClicColorLib.Ui.addControl(
			"span",
			parent, 
			{"class":"colorTBBackground"}
		);

		app.ui.previewArea = ClicColorLib.Ui.addControl(
			"span",
			parent, 
			{"class":"colorTBPreview"}
		);

		app.ui.textBox = ClicColorLib.Ui.addControl(
			"input",
			parent, 
			{"class":"colorTBInput", "type":"text"}
		);

		app.ui.textBox.blur(function (e) {textBoxChanged(app);});
		app.ui.textBox.keyup(function (e) {
			 if(e.which == 9 || e.which == 13) {
		        // enter or tab was hit
		        $(this).blur();
		        e.preventDefault();
		    }
		});
	}

	function textBoxChanged(app) {
		var newVal = app.ui.textBox.val();

		if (ClicColorLib.ColorMethods.isColor(newVal)) {

			app.state.selectedColor = ClicColorLib.ColorMethods.StringToObject(newVal);
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
			str = ClicColorLib.ColorMethods.ObjectToRGBAString(app.state.selectedColor);			

		} else {
			str = ClicColorLib.ColorMethods.ObjectToRGBString(app.state.selectedColor);
			
		}

		app.ui.previewArea.css('background',str);
		app.ui.textBox.val(str);
	}
})( jQuery );