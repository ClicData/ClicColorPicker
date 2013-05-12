#ClicColorPicker

An HTML5 color picker with some awesome features

* Simple picking modes, for when a quick color selection will do.
* Full color mode, for situations which require more precision
* Opacity as an option
* Text entry of rgb(a) and hex values 
* Gradient picking is coming soon....


To get started, make sure your page has the required files.
```html
<link rel="stylesheet" type="text/css" href="ClicColorPicker.css"></link>  	
<script src="jquery-2.0.0.min.js"></script>  	
<script src="ClicColorPicker-min.js"></script>
```
Then create it like any other jquery control...
```html
<script>
  $(document).ready(function () {
	  $('#simple').ClicColorPicker();
  });
</script>
<input id="simple" type="button" />
```

Of course you'll probably want to do more. Pass in options like any other jquery control.
```html
<script>
  $(document).ready(function () {
    $('#full').ClicColorPicker({
      'startColor':"#c4c4c4",
      'onChanged': function (e) {		      
          // e.newValue is an object with properties r, g, b, and a
          // so is e.oldValue :P
        }
      });
  });
</script>
<input id="full" type="button" />
```
## Full list of options

Below you can see a list of all possible settings to pass to the color picker, along with the default value.

```javascript
$('#full').ClicColorPicker({
  'startColor':"#FFFFFF", // can also be of the form rgb(255,255,255) or rgba(...
  'onChanged': function (e) {}, // check out e.newValue and e.oldValue
  'type':"simple", // can be 'simple' or 'full', 'gradient' is on the way
  'enableOpacity':false, // only the full picker supports opacity  
  'openerCssClass':'', // a css class which is given to the opener (the box you click to open the color picker)
  'mainPanelCssClass':'' // a css class which is given to the main panel (the box the pops up when you click the opener)
});
```
