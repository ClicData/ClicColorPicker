(function( $ ){
	var _controlName = "ClicSimplePicker";
	/*
		Setup jquery stuff 
	*/
	var methods = {	
		getColor:getColor,
        init : init
    }
  
  	$.fn.ClicSimplePicker = ClicUiLib.createJqueryObject(_controlName, methods);  

	/*
		Define methods
	*/
	function init( options ) {
        return this.each(function () {
        	var settings =  {
	        	startColor:'#FFFFFF',
	            defaultPalette:'websafe', // which palette is selected by defaul, only applies to simple mode
	            mainPanelCssClass:"",
	            applyClick:null,
	            cancelClick:null,
	            translations: {
	            	apply:"Apply",
	            	cancel:"Cancel"
	            },
	            simplePalettes:
	            	[
	            		{
	            			name:'Web Safe',
	            			values:['rgb(255,255,255)','rgb(255,255,204)','rgb(255,255,153)','rgb(255,255,102)','rgb(255,255,51)','rgb(255,255,0)','rgb(255,204,255)','rgb(255,204,204)','rgb(255,204,153)','rgb(255,204,102)','rgb(255,204,51)','rgb(255,204,0)','rgb(255,153,255)','rgb(255,153,204)','rgb(255,153,153)','rgb(255,153,102)','rgb(255,153,51)','rgb(255,153,0)','rgb(255,102,255)','rgb(255,102,204)','rgb(255,102,153)','rgb(255,102,102)','rgb(255,102,51)','rgb(255,102,0)','rgb(255,51,255)','rgb(255,51,204)','rgb(255,51,153)','rgb(255,51,102)','rgb(255,51,51)','rgb(255,51,0)','rgb(255,0,255)','rgb(255,0,204)','rgb(255,0,153)','rgb(255,0,102)','rgb(255,0,51)','rgb(255,0,0)','rgb(204,255,255)','rgb(204,255,204)','rgb(204,255,153)','rgb(204,255,102)','rgb(204,255,51)','rgb(204,255,0)','rgb(204,204,255)','rgb(204,204,204)','rgb(204,204,153)','rgb(204,204,102)','rgb(204,204,51)','rgb(204,204,0)','rgb(204,153,255)','rgb(204,153,204)','rgb(204,153,153)','rgb(204,153,102)','rgb(204,153,51)','rgb(204,153,0)','rgb(204,102,255)','rgb(204,102,204)','rgb(204,102,153)','rgb(204,102,102)','rgb(204,102,51)','rgb(204,102,0)','rgb(204,51,255)','rgb(204,51,204)','rgb(204,51,153)','rgb(204,51,102)','rgb(204,51,51)','rgb(204,51,0)','rgb(204,0,255)','rgb(204,0,204)','rgb(204,0,153)','rgb(204,0,102)','rgb(204,0,51)','rgb(204,0,0)','rgb(153,255,255)','rgb(153,255,204)','rgb(153,255,153)','rgb(153,255,102)','rgb(153,255,51)','rgb(153,255,0)','rgb(153,204,255)','rgb(153,204,204)','rgb(153,204,153)','rgb(153,204,102)','rgb(153,204,51)','rgb(153,204,0)','rgb(153,153,255)','rgb(153,153,204)','rgb(153,153,153)','rgb(153,153,102)','rgb(153,153,51)','rgb(153,153,0)','rgb(153,102,255)','rgb(153,102,204)','rgb(153,102,153)','rgb(153,102,102)','rgb(153,102,51)','rgb(153,102,0)','rgb(153,51,255)','rgb(153,51,204)','rgb(153,51,153)','rgb(153,51,102)','rgb(153,51,51)','rgb(153,51,0)','rgb(153,0,255)','rgb(153,0,204)','rgb(153,0,153)','rgb(153,0,102)','rgb(153,0,51)','rgb(153,0,0)','rgb(102,255,255)','rgb(102,255,204)','rgb(102,255,153)','rgb(102,255,102)','rgb(102,255,51)','rgb(102,255,0)','rgb(102,204,255)','rgb(102,204,204)','rgb(102,204,153)','rgb(102,204,102)','rgb(102,204,51)','rgb(102,204,0)','rgb(102,153,255)','rgb(102,153,204)','rgb(102,153,153)','rgb(102,153,102)','rgb(102,153,51)','rgb(102,153,0)','rgb(102,102,255)','rgb(102,102,204)','rgb(102,102,153)','rgb(102,102,102)','rgb(102,102,51)','rgb(102,102,0)','rgb(102,51,255)','rgb(102,51,204)','rgb(102,51,153)','rgb(102,51,102)','rgb(102,51,51)','rgb(102,51,0)','rgb(102,0,255)','rgb(102,0,204)','rgb(102,0,153)','rgb(102,0,102)','rgb(102,0,51)','rgb(102,0,0)','rgb(51,255,255)','rgb(51,255,204)','rgb(51,255,153)','rgb(51,255,102)','rgb(51,255,51)','rgb(51,255,0)','rgb(51,204,255)','rgb(51,204,204)','rgb(51,204,153)','rgb(51,204,102)','rgb(51,204,51)','rgb(51,204,0)','rgb(51,153,255)','rgb(51,153,204)','rgb(51,153,153)','rgb(51,153,102)','rgb(51,153,51)','rgb(51,153,0)','rgb(51,102,255)','rgb(51,102,204)','rgb(51,102,153)','rgb(51,102,102)','rgb(51,102,51)','rgb(51,102,0)','rgb(51,51,255)','rgb(51,51,204)','rgb(51,51,153)','rgb(51,51,102)','rgb(51,51,51)','rgb(51,51,0)','rgb(51,0,255)','rgb(51,0,204)','rgb(51,0,153)','rgb(51,0,102)','rgb(51,0,51)','rgb(51,0,0)','rgb(0,255,255)','rgb(0,255,204)','rgb(0,255,153)','rgb(0,255,102)','rgb(0,255,51)','rgb(0,255,0)','rgb(0,204,255)','rgb(0,204,204)','rgb(0,204,153)','rgb(0,204,102)','rgb(0,204,51)','rgb(0,204,0)','rgb(0,153,255)','rgb(0,153,204)','rgb(0,153,153)','rgb(0,153,102)','rgb(0,153,51)','rgb(0,153,0)','rgb(0,102,255)','rgb(0,102,204)','rgb(0,102,153)','rgb(0,102,102)','rgb(0,102,51)','rgb(0,102,0)','rgb(0,51,255)','rgb(0,51,204)','rgb(0,51,153)','rgb(0,51,102)','rgb(0,51,51)','rgb(0,51,0)','rgb(0,0,255)','rgb(0,0,204)','rgb(0,0,153)','rgb(0,0,102)','rgb(0,0,51)','rgb(0,0,0)']
	            		},
	            		{
	            			name:'not default',
	            			values:["#7BDED2","#6F76F7","#A3AF11","#DC35F5","#247C29","#A943F5","#0288C3","#17C956","#1F64F6","#6D9799","#F40022","#F47B12","#F8615C","#CDFD1E","#463767","#5F8C33","#E210F4","#3735E8","#5DA8F8","#6B151E","#063B3F","#AF6EB4","#9B607A","#D8DC14","#D40C0A","#DAC97F","#33B625","#961520","#FA0B1D","#3ADFC7","#354BBF","#C0EC0D","#625B41","#585981","#0FB030","#DA91E0","#8E966A","#137598","#90B77C","#B2C317","#4ABA74","#A217F9","#E4C2B2","#4909B3","#04BC36","#75BC29","#697A2F","#AF89C7","#6A9D8E","#5CC862","#921CC3","#1488A1","#2B8203","#B2A252","#A122B7","#59FD5C","#D5D45B","#58E877","#961A77","#1213C7","#5EE88D","#6002EC","#27D019","#D73FB9","#C24029","#7AC2F8","#E3A95A","#AE5A33","#E026BC","#9D14BC","#F1A254","#986F3D","#241896","#531703","#2E6C7E","#5AFD45","#BEFBEC","#4B879D","#DBC237","#482E5D","#4D631F","#1934D5","#B842F2","#48D830","#789857","#9C83AD","#459118","#675AC5","#EB3EE2","#EC1B2C","#7BCD1D","#BAC0EB","#687ABC","#87FB01","#027785","#457128","#AE7B73","#68E272","#CF07A8","#CA0940","#A6652D","#BA2920","#0FE6CC","#35B4B7","#6A7A69","#CEF1B2","#C8BA34","#105C60","#48695F","#D4B87E","#3903C7","#68BD2A","#66CB16","#8A1AE8","#443255","#B4923B","#2F3192","#04AFCD","#5AD1A5","#CCE8CE","#912172","#038470","#E547A0","#8F9C96","#4B1BD0","#0EEBFE","#E65129","#25F4D8","#8C27F6","#73699F","#9D01D7","#DC08AE","#45369B","#F74847","#F42481","#A00FC3","#0DDBE7","#2D8E60","#C7ACE8","#8AE39E","#59B7C5","#9CD5A7","#6D2323","#8C6AAA","#8E3F13","#95BE05","#295FD6","#FE9B52","#5A60BA","#1D8FBC...4DAFF","#9A0B1E","#48254E","#B360AA","#A3D26D","#51429D","#AE5BA6","#F12DBA","#345DFB","#62D591","#937BD4","#BC05CB","#CCE441","#A61549","#738EEF","#F070D0","#100617","#E9F317","#92EA01","#E59474","#A1AC14","#80EC9D","#0706A6","#2F639F","#8E7D9F","#05F385","#680365","#753276","#95444D","#D0F780","#355D2E","#4236F0","#0DE372","#3DE273","#A65EED","#F62876","#DDC552","#9C272F","#5FDADC","#648212","#CF284C","#A6B753","#23A81E","#B6094B","#C2DC83","#333CA3","#8C8B15","#8A0C42","#1B5CDC","#DD1449","#C79386","#921B54","#934F0B","#905173","#D2D1BA","#DF2BBF","#C0731B","#2B10DC","#F44572","#489F5F","#C7F9AF","#845537","#FA23D9","#A14A1F","#2C14B1","#7E8491","#155C9A","#FFC74A","#737B79","#3B1BF2","#36D303","#87CB8C","#9D9F30","#075AA4","#208807","#311878"]
	            		}
	            	]
	        }

			// this merges pased options with default values
			settings = ClicUiLib.getSettings(settings, options);
			var startState =  {
    			settings:settings,
       			state: {
					selectedColor: settings.startColor,
					paletteIndex:0,
					selectedSample:null
				},
				ui: {
					mainPanel:$(this),
					simplePicker:null,
					paletteLabel:null,
					colorTextBox:null
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
        	var app = ClicUiLib.getAppData(_controlName,this);
        	rv.push(app.state.selectedColor);
        });
        return rv[0];
	}

	/*
		Drawing functions
	*/


	function renderControl(element,app) {
		drawSimplePicker(app);

		// set events
		setInternalEvents(app);

		UpdateUI(app);
	}

	function drawButtonRow(app) {
		var buttonRow = $('<div class="buttonRow"></div>');
		var prev = $('<input type="button" class="button" value="&#x00AB;" />');				
		prev.click(function () {
			if (app.state.paletteIndex == 0) {
				app.state.paletteIndex  = app.settings.simplePalettes.length - 1;
			} else {
				app.state.paletteIndex -= 1;
			}

			UpdateUI(app);
		});

		prev.appendTo(buttonRow);

		app.ui.paletteLabel = $('<span class="paletteName"></span>');				
		app.ui.paletteLabel.appendTo(buttonRow);

		var next = $('<input type="button" class="button" value="&#x00BB;" />');				
		next.click(function () {
			if (app.state.paletteIndex == (app.settings.simplePalettes.length - 1)) {
				app.state.paletteIndex  = 0;
			} else {
				app.state.paletteIndex += 1;
			}

			UpdateUI(app);
		});

		next.appendTo(buttonRow);
		buttonRow.appendTo(app.ui.simplePicker);
	}

	function drawSampleAreas(app) {
		var sampleAreas = $('<div class="sampleAreas"></div>');
		for (var i=0;i < app.settings.simplePalettes.length;i++) {
			var palette = app.settings.simplePalettes[i];
			

			var sampleArea = $('<div class="sampleArea"></div>');
			for (var j=0;j < palette.values.length;j++) {
				var sample = $('<span class="sample"></span>');
				sample.data('color',palette.values[j]);
				sample.css('background-color',palette.values[j]);

				sample.click(function() {					
					app.ui.selectedSample = $(this)
					app.state.selectedColor = StringToObject($(this).data('color'));
					UpdateUI(app);
				});

				sample.appendTo(sampleArea);
			}

			sampleArea.appendTo(sampleAreas);
		}

		sampleAreas.appendTo(app.ui.simplePicker);
	}
		
	function drawTextInput(app) {
		var textRow = $('<div class="textRow"></div>');
		app.ui.colorTextBox = textRow.ColorTextBox({
			startColor:app.state.selectedColor,
			valueChanged: function (newval) {				
				app.state.selectedColor = newval;
				UpdateUI(app);				
			}
		});
 		textRow.appendTo(app.ui.simplePicker);
	}
	

	function drawSimplePicker(app) {
		app.ui.simplePicker = $('<div></div>');
		drawTextInput(app);
		drawSampleAreas(app);
		drawButtonRow(app);
		ClicUiLib.drawCommandRow(app, app.ui.simplePicker);
		app.ui.simplePicker.appendTo(app.ui.mainPanel);
	}

	

	function setInternalEvents(app)  {

	}
	
	//methods
	function UpdateUI(app) {
		// palette areas
		var areas = app.ui.simplePicker.find('.sampleArea');
		areas.hide();
		$(areas[app.state.paletteIndex]).show();
		app.ui.paletteLabel.text(app.settings.simplePalettes[app.state.paletteIndex].name);

		$('.sample.selected').removeClass('selected');
		$(app.ui.selectedSample ).addClass('selected');

		app.ui.colorTextBox.ColorTextBox('setValue',app.state.selectedColor);		
	}
})( jQuery );