function isColor(e){return isHex(e)||isRGB(e)||isRGBA(e)}function isHex(e){return e.match(_hexRegex)}function isRGB(e){return e.match(_rgbRegex)}function isRGBA(e){return e.match(_rgbaRegex)}function StringToObject(e){if(isHex(e)){return ParseHex(e)}else{return ParseRGB(e)}}function ParseHex(e){try{var t,n,r;t=parseInt(e.substring(1,3),16);n=parseInt(e.substring(3,5),16);r=parseInt(e.substring(5,7),16);return{r:t,g:n,b:r,a:255}}catch(i){console.log("Error parsing hex string: "+e)}}function ParseRGB(e){try{var t=e.substring(4);var n=0;var r=["","","",""];var i="";while(t.length>0){if(!isNaN(parseInt(t[0]))){i+=t[0].toString()}else if(t[0]==","||t[0]==")"){r[n]=i;n++;i=""}t=t.substring(1)}var s={r:parseInt(r[0]),g:parseInt(r[1]),b:parseInt(r[2]),a:parseInt(r[3])};if(isNaN(s.a)){s.a=255}return s}catch(o){console.log("Error parsing rgb:"+e)}}function CloneColor(e){return{r:e.r,g:e.g,b:e.b,a:e.a}}function HSLToRGB(e,t,n){e=e/360;t=t/100;n=n/100;var r,i,s;if(t==0){r=i=s=n}else{function o(e,t,n){if(n<0)n+=1;if(n>1)n-=1;if(n<1/6)return e+(t-e)*6*n;if(n<1/2)return t;if(n<2/3)return e+(t-e)*(2/3-n)*6;return e}var u=n<.5?n*(1+t):n+t-n*t;var a=2*n-u;r=o(a,u,e+1/3);i=o(a,u,e);s=o(a,u,e-1/3)}return{r:Math.round(r*255),g:Math.round(i*255),b:Math.round(s*255),a:255}}function RGBToHSL(e){var t=e.r/255;var n=e.g/255;var r=e.b/255;var i=Math.max(t,n,r),s=Math.min(t,n,r);var o,u,a=(i+s)/2;if(i==s){o=u=0}else{var f=i-s;u=a>.5?f/(2-i-s):f/(i+s);switch(i){case t:o=(n-r)/f+(n<r?6:0);break;case n:o=(r-t)/f+2;break;case r:o=(t-n)/f+4;break}o/=6}return{h:o*360,s:u*100,l:a*100}}function ObjectToRGBAString(e){var t="rgba("+e.r.toString(10);t+=", "+e.g.toString(10);t+=", "+e.b.toString(10);if(isNaN(parseInt(e.a))){t+=", 255"}else{t+=", "+e.a.toString(10)}t+=")";return t}function ObjectToRGBString(e){var t="rgb("+e.r.toString(10);t+=", "+e.g.toString(10);t+=", "+e.b.toString(10);t+=")";return t}(function(e){e.fn.noUiSlider=function(t,n){function r(e,t,n){var r=t.data("setup"),i=r.handles;t=r.settings;r=r.pos;e=0>e?0:100<e?100:e;2==t.handles&&(n.is(":first-child")?(n=parseFloat(i[1][0].style[r])-t.margin,e=e>n?n:e):(n=parseFloat(i[0][0].style[r])+t.margin,e=e<n?n:e));t.step&&(n=o.from(t.range,t.step),e=Math.round(e/n)*n);return e}function i(e){try{return[e.clientX||e.originalEvent.clientX||e.originalEvent.touches[0].clientX,e.clientY||e.originalEvent.clientY||e.originalEvent.touches[0].clientY]}catch(t){return["x","y"]}}var s=window.navigator.msPointerEnabled?2:"ontouchend"in document?3:1;window.debug&&console&&console.log(s);var o={to:function(e,t){t=0>e[0]?t+Math.abs(e[0]):t-e[0];return 100*t/this._length(e)},from:function(e,t){return 100*t/this._length(e)},is:function(e,t){return t*this._length(e)/100+e[0]},_length:function(e){return e[0]>e[1]?e[0]-e[1]:e[1]-e[0]}},u={handles:2,serialization:{to:["",""],resolution:.01}};methods={create:function(){return this.each(function(){var n=e.extend(u,t),a=e(this).data("_isnS_",!0),l=[],c,h,p="",d=function(e){return!isNaN(parseFloat(e))&&isFinite(e)},v=(n.serialization.resolution=n.serialization.resolution||.01).toString().split("."),g=1==v[0]?0:v[1].length;n.start=d(n.start)?[n.start,0]:n.start;e.each(n,function(e,t){d(t)?n[e]=parseFloat(t):"object"==typeof t&&d(t[0])&&(t[0]=parseFloat(t[0]),d(t[1])&&(t[1]=parseFloat(t[1])));var r=!1;t="undefined"==typeof t?"x":t;switch(e){case"range":case"start":r=2!=t.length||!d(t[0])||!d(t[1]);break;case"handles":r=1>t||2<t||!d(t);break;case"connect":r="lower"!=t&&"upper"!=t&&"boolean"!=typeof t;break;case"orientation":r="vertical"!=t&&"horizontal"!=t;break;case"margin":case"step":r="undefined"!=typeof t&&!d(t);break;case"serialization":r="object"!=typeof t||!d(t.resolution)||"object"==typeof t.to&&t.to.length<n.handles;break;case"slide":r="function"!=typeof t}r&&console&&console.error("Bad input for "+e+" on slider:",a)});n.margin=n.margin?o.from(n.range,n.margin):0;if(n.serialization.to instanceof jQuery||"string"==typeof n.serialization.to||!1===n.serialization.to)n.serialization.to=[n.serialization.to];"vertical"==n.orientation?(p+="vertical",c="top",h=1):(p+="horizontal",c="left",h=0);p+=n.connect?"lower"==n.connect?" connect lower":" connect":"";a.addClass(p);for(p=0;p<n.handles;p++){l[p]=a.append("<a><div></div></a>").children(":last");v=o.to(n.range,n.start[p]);l[p].css(c,v+"%");100==v&&l[p].is(":first-child")&&l[p].css("z-index",2);var v=(1===s?"mousedown":2===s?"MSPointerDown":"touchstart")+".noUiSliderX",y=(1===s?"mousemove":2===s?"MSPointerMove":"touchmove")+".noUiSlider",b=(1===s?"mouseup":2===s?"MSPointerUp":"touchend")+".noUiSlider";l[p].find("div").on(v,function(t){e("body").bind("selectstart.noUiSlider",function(){return!1});if(!a.hasClass("disabled")){e("body").addClass("TOUCH");var s=e(this).addClass("active").parent(),u=s.add(e(document)).add("body"),p=parseFloat(s[0].style[c]),d=i(t),v=d,w=!1;e(document).on(y,function(e){e.preventDefault();e=i(e);if("x"!=e[0]){e[0]-=d[0];e[1]-=d[1];var t=[v[0]!=e[0],v[1]!=e[1]],u=p+100*e[h]/(h?a.height():a.width()),u=r(u,a,s);if(t[h]&&u!=w){s.css(c,u+"%").data("input").val(o.is(n.range,u).toFixed(g));var t=n.slide,f=a.data("_n",!0);"function"===typeof t&&t.call(f,void 0);w=u;s.css("z-index",2==l.length&&100==u&&s.is(":first-child")?2:1)}v=e}}).on(b,function(){u.off(".noUiSlider");e("body").removeClass("TOUCH");a.find(".active").removeClass("active").end().data("_n")&&a.data("_n",!1).change()})}}).on("click",function(e){e.stopPropagation()})}if(1==s)a.on("click",function(e){if(!a.hasClass("disabled")){var t=i(e);e=100*(t[h]-a.offset()[c])/(h?a.height():a.width());t=1<l.length?t[h]<(l[0].offset()[c]+l[1].offset()[c])/2?l[0]:l[1]:l[0];e=r(e,a,t);t.css(c,e+"%").data("input").val(o.is(n.range,e).toFixed(g));e=n.slide;"function"===typeof e&&e.call(a,void 0);a.change()}});for(p=0;p<l.length;p++)v=o.is(n.range,parseFloat(l[p][0].style[c])).toFixed(g),"string"==typeof n.serialization.to[p]?l[p].data("input",a.append('<input type="hidden" name="'+n.serialization.to[p]+'">').find("input:last").val(v).change(function(e){e.stopPropagation()})):!1==n.serialization.to[p]?l[p].data("input",{val:function(e){if("undefined"!=typeof e)this.handle.data("noUiVal",e);else return this.handle.data("noUiVal")},handle:l[p]}):l[p].data("input",n.serialization.to[p].data("handleNR",p).val(v).change(function(){var t=[null,null];t[e(this).data("handleNR")]=e(this).val();a.val(t)}));e(this).data("setup",{settings:n,handles:l,pos:c,res:g})})},val:function(t){if("undefined"!==typeof t){var n="number"==typeof t?[t]:t;return this.each(function(){for(var t=e(this).data("setup"),i=0;i<t.handles.length;i++)if(null!=n[i]){var s=r(o.to(t.settings.range,n[i]),e(this),t.handles[i]);t.handles[i].css(t.pos,s+"%").data("input").val(o.is(t.settings.range,s).toFixed(t.res))}})}t=e(this).data("setup").handles;for(var i=[],s=0;s<t.length;s++)i.push(parseFloat(t[s].data("input").val()));return 1==i.length?i[0]:i},disabled:function(){return n?e(this).addClass("disabled"):e(this).removeClass("disabled")}};var a=jQuery.fn.val;jQuery.fn.val=function(){return this.data("_isnS_")?methods.val.apply(this,arguments):a.apply(this,arguments)};return"disabled"==t?methods.disabled.apply(this):methods.create.apply(this)}})(jQuery);var _hexRegex=/^#([A-Fa-f0-9]{6})$/;var _rgbRegex=/^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\)$/;var _rgbaRegex=/^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/;(function(e){function t(e,t){n(t);i(t)}function n(t){var n=e("<div class='colorTBParent'></div>");t.ui.previewArea=e('<span class="colorTBPreview"></span>');t.ui.previewArea.appendTo(n);t.ui.textBox=e('<input type="text" class="colorTBInput" />');t.ui.textBox.blur(function(e){r(t)});t.ui.textBox.keyup(function(t){if(t.which==9||t.which==13){e(this).blur();t.preventDefault()}});t.ui.textBox.appendTo(n);n.appendTo(t.ui.container)}function r(e){var t=e.ui.textBox.val();if(isColor(t)){e.state.selectedColor=StringToObject(t);i(e);e.ui.textBox.removeClass("invalid");if(e.settings.valueChanged){e.settings.valueChanged(e.state.selectedColor)}}else{e.ui.textBox.addClass("invalid")}}function i(e){var t;if(e.settings.enableOpacity){t=ObjectToRGBAString(e.state.selectedColor)}else{t=ObjectToRGBString(e.state.selectedColor)}e.ui.previewArea.css("background",t);e.ui.textBox.val(t)}function s(t){return e.extend({startColor:StringToObject("#FFFFFF"),enableOpacity:false,valueChanged:null},t)}function o(t,n){var r=e(t).data("ColorTextBox");if(!r){var i=s(n);e(t).data("ColorTextBox",{settings:i,state:{selectedColor:i.startColor,selectedOpacity:null},ui:{container:e(t),previewArea:null,textBox:null}});r=e(t).data("ColorTextBox")}return r}var u={setValue:function(e){return this.each(function(){var t=o(this);if(e===e.toString()){t.state.selectedColor=StringToObject(e)}else{t.state.selectedColor=e}i(t)})},init:function(e){return this.each(function(){var n=o(this,e);t(this,n)})}};e.fn.ColorTextBox=function(t){if(u[t]){return u[t].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof t==="object"||!t){return u.init.apply(this,arguments)}else{e.error("Method "+t+" does not exist on ColorTextBox")}}})(jQuery);(function(e){function t(e,t){a(t);f(t)}function n(e){var t=HSLToRGB(e.state.selectedHue,e.state.selectedSaturation,e.state.selectedLightness);if(e.settings.enableOpacity){t.a=e.state.selectedOpacity}else{t.a=255}return t}function r(t){var n=e('<div class="commandRow"></div>');var r=e('<input class="button" type="button" />');r.val(t.settings.translations.apply);r.click(function(e){if(t.settings.applyClick){t.settings.applyClick(e)}});r.appendTo(n);var i=e('<input class="button" type="button" />');i.val(t.settings.translations.cancel);i.click(function(e){if(t.settings.cancelClick){t.settings.cancelClick(e)}});i.appendTo(n);n.appendTo(t.ui.fullPicker)}function i(t){var r=e('<div class="textRow"></div>');t.ui.colorTextBox=r.ColorTextBox({startColor:n(t),enableOpacity:t.settings.enableOpacity,valueChanged:function(e){t.state.selectedOpacity=e.a;var n=RGBToHSL(e);t.state.selectedHue=n.h;t.state.selectedSaturation=n.s;t.state.selectedLightness=n.l;f(t)}});r.appendTo(t.ui.fullPicker)}function s(t){var n=e('<div class="fullArea"></div>');var r=e('<div class="satAndLightnessArea"></div>');for(var i=0;i<100;i++){t.ui.lightnessLines[i]=e('<div class="lightnessLine"/>');t.ui.lightnessLines[i].data("lightness",100-i);t.ui.lightnessLines[i].appendTo(r);t.ui.lightnessLines[i].click(function(){t.state.selectedLightness=e(this).data("lightness")})}r.click(function(n){var r=e(this).offset().left;var i=n.pageX-r;var s=e(this).width();t.state.selectedSaturation=100-i/s*100;f(t)});r.appendTo(n);u(t,n);if(t.settings.enableOpacity){o(t,n)}n.appendTo(t.ui.fullPicker)}function o(t,n){t.ui.opacitySlider=e('<div class="noUiSlider"></div>').noUiSlider({range:[0,255],start:255,step:1,handles:1,slide:function(){t.state.selectedOpacity=e(this).val();f(t)}});var r=e("<div></div>");t.ui.opacitySlider.appendTo(r);r.appendTo(n)}function u(t,n){t.ui.hueSlider=e('<div class="noUiSlider"></div>').noUiSlider({range:[0,360],start:t.state.selectedHue,step:1,handles:1,slide:function(){t.state.selectedHue=e(this).val();f(t)}});t.ui.hueSlider.css("background","linear-gradient(90deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)");var r=e("<div></div>");t.ui.hueSlider.appendTo(r);r.appendTo(n)}function a(t){t.ui.fullPicker=e("<div></div>");i(t);s(t);r(t);t.ui.fullPicker.appendTo(t.ui.mainPanel)}function f(e){var t=n(e);e.ui.colorTextBox.ColorTextBox("setValue",t);e.ui.hueSlider.val(e.state.selectedHue);e.ui.opacitySlider.val(e.state.selectedOpacity);var r=CloneColor(t);r.a=255;var i=CloneColor(t);i.a=0;e.ui.opacitySlider.css("background","linear-gradient(90deg,"+ObjectToRGBAString(i)+","+ObjectToRGBAString(r)+") , url('images/transparent.png') repeat");var s;var o;var u;var a;for(var f=0;f<e.ui.lightnessLines.length;f++){s=e.ui.lightnessLines[f].data("lightness");o=HSLToRGB(e.state.selectedHue,0,s);u=HSLToRGB(e.state.selectedHue,50,s);a=HSLToRGB(e.state.selectedHue,100,s);e.ui.lightnessLines[f].css("background","linear-gradient(90deg,"+ObjectToRGBString(a)+"0%,"+ObjectToRGBString(u)+"50%,"+ObjectToRGBAString(o)+"100%) repeat")}}function l(t){return e.extend({startColor:"#FFFFFF",enableOpacity:false,opacity:255,mainPanelCssClass:"",applyClick:null,cancelClick:null,translations:{apply:"Apply",cancel:"Cancel"}},t)}function c(t,n){var r=e(t).data("ClicFullPicker");if(!r){var i=l(n);var s=RGBToHSL(i.startColor);e(t).data("ClicFullPicker",{settings:i,state:{selectedHue:s.h,selectedSaturation:s.s,selectedLightness:s.l,selectedOpacity:i.opacity},ui:{mainPanel:e(t),colorTextBox:null,fullPicker:null,lightnessLines:new Array(100),hueSlider:null}});r=e(t).data("ClicFullPicker")}return r}var h={getColor:function(e){var t=[];this.each(function(){var e=c(this);t.push(n(e))});return t[0]},init:function(e){return this.each(function(){var n=c(this,e);t(this,n)})}};e.fn.ClicFullPicker=function(t){if(h[t]){return h[t].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof t==="object"||!t){return h.init.apply(this,arguments)}else{e.error("Method "+t+" does not exist on ClicFullPicker")}}})(jQuery);(function(e){function t(e,t){o(t);u(t);a(t)}function n(t){var n=e('<div class="buttonRow"></div>');var r=e('<input type="button" class="button" value="&#x00AB;" />');r.click(function(){if(t.state.paletteIndex==0){t.state.paletteIndex=t.settings.simplePalettes.length-1}else{t.state.paletteIndex-=1}a(t)});r.appendTo(n);t.ui.paletteLabel=e('<span class="paletteName"></span>');t.ui.paletteLabel.appendTo(n);var i=e('<input type="button" class="button" value="&#x00BB;" />');i.click(function(){if(t.state.paletteIndex==t.settings.simplePalettes.length-1){t.state.paletteIndex=0}else{t.state.paletteIndex+=1}a(t)});i.appendTo(n);n.appendTo(t.ui.simplePicker)}function r(t){var n=e('<div class="sampleAreas"></div>');for(var r=0;r<t.settings.simplePalettes.length;r++){var i=t.settings.simplePalettes[r];var s=e('<div class="sampleArea"></div>');for(var o=0;o<i.values.length;o++){var u=e('<span class="sample"></span>');u.data("color",i.values[o]);u.css("background-color",i.values[o]);u.click(function(){t.ui.selectedSample=e(this);t.state.selectedColor=StringToObject(e(this).data("color"));a(t)});u.appendTo(s)}s.appendTo(n)}n.appendTo(t.ui.simplePicker)}function i(t){var n=e('<div class="commandRow"></div>');var r=e('<input class="button" type="button" />');r.val(t.settings.translations.apply);r.click(function(e){if(t.settings.applyClick){t.settings.applyClick(e)}});r.appendTo(n);var i=e('<input class="button" type="button" />');i.val(t.settings.translations.cancel);i.click(function(e){if(t.settings.cancelClick){t.settings.cancelClick(e)}});i.appendTo(n);n.appendTo(t.ui.simplePicker)}function s(t){var n=e('<div class="textRow"></div>');t.ui.colorTextBox=n.ColorTextBox({startColor:t.state.selectedColor,valueChanged:function(e){t.state.selectedColor=e;a(t)}});n.appendTo(t.ui.simplePicker)}function o(t){t.ui.simplePicker=e("<div></div>");s(t);r(t);n(t);i(t);t.ui.simplePicker.appendTo(t.ui.mainPanel)}function u(e){}function a(t){var n=t.ui.simplePicker.find(".sampleArea");n.hide();e(n[t.state.paletteIndex]).show();t.ui.paletteLabel.text(t.settings.simplePalettes[t.state.paletteIndex].name);e(".sample.selected").removeClass("selected");e(t.ui.selectedSample).addClass("selected");t.ui.colorTextBox.ColorTextBox("setValue",t.state.selectedColor)}function f(t){return e.extend({startColor:"#FFFFFF",defaultPalette:"websafe",mainPanelCssClass:"",applyClick:null,cancelClick:null,translations:{apply:"Apply",cancel:"Cancel"},simplePalettes:[{name:"Web Safe",values:["rgb(255,255,255)","rgb(255,255,204)","rgb(255,255,153)","rgb(255,255,102)","rgb(255,255,51)","rgb(255,255,0)","rgb(255,204,255)","rgb(255,204,204)","rgb(255,204,153)","rgb(255,204,102)","rgb(255,204,51)","rgb(255,204,0)","rgb(255,153,255)","rgb(255,153,204)","rgb(255,153,153)","rgb(255,153,102)","rgb(255,153,51)","rgb(255,153,0)","rgb(255,102,255)","rgb(255,102,204)","rgb(255,102,153)","rgb(255,102,102)","rgb(255,102,51)","rgb(255,102,0)","rgb(255,51,255)","rgb(255,51,204)","rgb(255,51,153)","rgb(255,51,102)","rgb(255,51,51)","rgb(255,51,0)","rgb(255,0,255)","rgb(255,0,204)","rgb(255,0,153)","rgb(255,0,102)","rgb(255,0,51)","rgb(255,0,0)","rgb(204,255,255)","rgb(204,255,204)","rgb(204,255,153)","rgb(204,255,102)","rgb(204,255,51)","rgb(204,255,0)","rgb(204,204,255)","rgb(204,204,204)","rgb(204,204,153)","rgb(204,204,102)","rgb(204,204,51)","rgb(204,204,0)","rgb(204,153,255)","rgb(204,153,204)","rgb(204,153,153)","rgb(204,153,102)","rgb(204,153,51)","rgb(204,153,0)","rgb(204,102,255)","rgb(204,102,204)","rgb(204,102,153)","rgb(204,102,102)","rgb(204,102,51)","rgb(204,102,0)","rgb(204,51,255)","rgb(204,51,204)","rgb(204,51,153)","rgb(204,51,102)","rgb(204,51,51)","rgb(204,51,0)","rgb(204,0,255)","rgb(204,0,204)","rgb(204,0,153)","rgb(204,0,102)","rgb(204,0,51)","rgb(204,0,0)","rgb(153,255,255)","rgb(153,255,204)","rgb(153,255,153)","rgb(153,255,102)","rgb(153,255,51)","rgb(153,255,0)","rgb(153,204,255)","rgb(153,204,204)","rgb(153,204,153)","rgb(153,204,102)","rgb(153,204,51)","rgb(153,204,0)","rgb(153,153,255)","rgb(153,153,204)","rgb(153,153,153)","rgb(153,153,102)","rgb(153,153,51)","rgb(153,153,0)","rgb(153,102,255)","rgb(153,102,204)","rgb(153,102,153)","rgb(153,102,102)","rgb(153,102,51)","rgb(153,102,0)","rgb(153,51,255)","rgb(153,51,204)","rgb(153,51,153)","rgb(153,51,102)","rgb(153,51,51)","rgb(153,51,0)","rgb(153,0,255)","rgb(153,0,204)","rgb(153,0,153)","rgb(153,0,102)","rgb(153,0,51)","rgb(153,0,0)","rgb(102,255,255)","rgb(102,255,204)","rgb(102,255,153)","rgb(102,255,102)","rgb(102,255,51)","rgb(102,255,0)","rgb(102,204,255)","rgb(102,204,204)","rgb(102,204,153)","rgb(102,204,102)","rgb(102,204,51)","rgb(102,204,0)","rgb(102,153,255)","rgb(102,153,204)","rgb(102,153,153)","rgb(102,153,102)","rgb(102,153,51)","rgb(102,153,0)","rgb(102,102,255)","rgb(102,102,204)","rgb(102,102,153)","rgb(102,102,102)","rgb(102,102,51)","rgb(102,102,0)","rgb(102,51,255)","rgb(102,51,204)","rgb(102,51,153)","rgb(102,51,102)","rgb(102,51,51)","rgb(102,51,0)","rgb(102,0,255)","rgb(102,0,204)","rgb(102,0,153)","rgb(102,0,102)","rgb(102,0,51)","rgb(102,0,0)","rgb(51,255,255)","rgb(51,255,204)","rgb(51,255,153)","rgb(51,255,102)","rgb(51,255,51)","rgb(51,255,0)","rgb(51,204,255)","rgb(51,204,204)","rgb(51,204,153)","rgb(51,204,102)","rgb(51,204,51)","rgb(51,204,0)","rgb(51,153,255)","rgb(51,153,204)","rgb(51,153,153)","rgb(51,153,102)","rgb(51,153,51)","rgb(51,153,0)","rgb(51,102,255)","rgb(51,102,204)","rgb(51,102,153)","rgb(51,102,102)","rgb(51,102,51)","rgb(51,102,0)","rgb(51,51,255)","rgb(51,51,204)","rgb(51,51,153)","rgb(51,51,102)","rgb(51,51,51)","rgb(51,51,0)","rgb(51,0,255)","rgb(51,0,204)","rgb(51,0,153)","rgb(51,0,102)","rgb(51,0,51)","rgb(51,0,0)","rgb(0,255,255)","rgb(0,255,204)","rgb(0,255,153)","rgb(0,255,102)","rgb(0,255,51)","rgb(0,255,0)","rgb(0,204,255)","rgb(0,204,204)","rgb(0,204,153)","rgb(0,204,102)","rgb(0,204,51)","rgb(0,204,0)","rgb(0,153,255)","rgb(0,153,204)","rgb(0,153,153)","rgb(0,153,102)","rgb(0,153,51)","rgb(0,153,0)","rgb(0,102,255)","rgb(0,102,204)","rgb(0,102,153)","rgb(0,102,102)","rgb(0,102,51)","rgb(0,102,0)","rgb(0,51,255)","rgb(0,51,204)","rgb(0,51,153)","rgb(0,51,102)","rgb(0,51,51)","rgb(0,51,0)","rgb(0,0,255)","rgb(0,0,204)","rgb(0,0,153)","rgb(0,0,102)","rgb(0,0,51)","rgb(0,0,0)"]},{name:"not default",values:["#7BDED2","#6F76F7","#A3AF11","#DC35F5","#247C29","#A943F5","#0288C3","#17C956","#1F64F6","#6D9799","#F40022","#F47B12","#F8615C","#CDFD1E","#463767","#5F8C33","#E210F4","#3735E8","#5DA8F8","#6B151E","#063B3F","#AF6EB4","#9B607A","#D8DC14","#D40C0A","#DAC97F","#33B625","#961520","#FA0B1D","#3ADFC7","#354BBF","#C0EC0D","#625B41","#585981","#0FB030","#DA91E0","#8E966A","#137598","#90B77C","#B2C317","#4ABA74","#A217F9","#E4C2B2","#4909B3","#04BC36","#75BC29","#697A2F","#AF89C7","#6A9D8E","#5CC862","#921CC3","#1488A1","#2B8203","#B2A252","#A122B7","#59FD5C","#D5D45B","#58E877","#961A77","#1213C7","#5EE88D","#6002EC","#27D019","#D73FB9","#C24029","#7AC2F8","#E3A95A","#AE5A33","#E026BC","#9D14BC","#F1A254","#986F3D","#241896","#531703","#2E6C7E","#5AFD45","#BEFBEC","#4B879D","#DBC237","#482E5D","#4D631F","#1934D5","#B842F2","#48D830","#789857","#9C83AD","#459118","#675AC5","#EB3EE2","#EC1B2C","#7BCD1D","#BAC0EB","#687ABC","#87FB01","#027785","#457128","#AE7B73","#68E272","#CF07A8","#CA0940","#A6652D","#BA2920","#0FE6CC","#35B4B7","#6A7A69","#CEF1B2","#C8BA34","#105C60","#48695F","#D4B87E","#3903C7","#68BD2A","#66CB16","#8A1AE8","#443255","#B4923B","#2F3192","#04AFCD","#5AD1A5","#CCE8CE","#912172","#038470","#E547A0","#8F9C96","#4B1BD0","#0EEBFE","#E65129","#25F4D8","#8C27F6","#73699F","#9D01D7","#DC08AE","#45369B","#F74847","#F42481","#A00FC3","#0DDBE7","#2D8E60","#C7ACE8","#8AE39E","#59B7C5","#9CD5A7","#6D2323","#8C6AAA","#8E3F13","#95BE05","#295FD6","#FE9B52","#5A60BA","#1D8FBC...4DAFF","#9A0B1E","#48254E","#B360AA","#A3D26D","#51429D","#AE5BA6","#F12DBA","#345DFB","#62D591","#937BD4","#BC05CB","#CCE441","#A61549","#738EEF","#F070D0","#100617","#E9F317","#92EA01","#E59474","#A1AC14","#80EC9D","#0706A6","#2F639F","#8E7D9F","#05F385","#680365","#753276","#95444D","#D0F780","#355D2E","#4236F0","#0DE372","#3DE273","#A65EED","#F62876","#DDC552","#9C272F","#5FDADC","#648212","#CF284C","#A6B753","#23A81E","#B6094B","#C2DC83","#333CA3","#8C8B15","#8A0C42","#1B5CDC","#DD1449","#C79386","#921B54","#934F0B","#905173","#D2D1BA","#DF2BBF","#C0731B","#2B10DC","#F44572","#489F5F","#C7F9AF","#845537","#FA23D9","#A14A1F","#2C14B1","#7E8491","#155C9A","#FFC74A","#737B79","#3B1BF2","#36D303","#87CB8C","#9D9F30","#075AA4","#208807","#311878"]}]},t)}function l(t,n){var r=e(t).data("ClicSimplePicker");if(!r){var i=f(n);e(t).data("ClicSimplePicker",{settings:i,state:{selectedColor:i.startColor,paletteIndex:0,selectedSample:null},ui:{mainPanel:e(t),simplePicker:null,paletteLabel:null,colorTextBox:null}});r=e(t).data("ClicSimplePicker")}return r}var c={getColor:function(e){var t=[];this.each(function(){var e=l(this);t.push(e.state.selectedColor)});return t[0]},init:function(e){return this.each(function(){var n=l(this,e);t(this,n)})}};e.fn.ClicSimplePicker=function(t){if(c[t]){return c[t].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof t==="object"||!t){return c.init.apply(this,arguments)}else{e.error("Method "+t+" does not exist on ClicSimplePicker")}}})(jQuery);(function(e){function t(e,t){n(e,t);r(t);s(t);u(t)}function n(t,n){n.ui.opener=e("<span class='unselectable opener'></span>");n.ui.opener.addClass(n.settings.openerCssClass);n.ui.previewArea=e("<span class='smallPreview'></span>");n.ui.previewArea.appendTo(n.ui.opener);n.ui.arrowArea=e("<span class='arrowArea'>&#x25BC;</span>");n.ui.arrowArea.appendTo(n.ui.opener);n.ui.opener.appendTo(e(t).parent());e(t).hide()}function r(t){t.ui.mainPanel=e('<div class="mainPanel"></div>');t.ui.mainPanel.addClass(t.settings.mainPanelCssClass);t.ui.mainPanel.appendTo(e("body"));t.ui.mainPanel.hide();if(t.settings.type=="simple"){t.ui.mainPanel.ClicSimplePicker({startColor:t.state.selectedColor,applyClick:function(){var e=t.ui.mainPanel.ClicSimplePicker("getColor");i(t,e)},cancelClick:function(){t.state.mainPanelVisible=false;u(t)}})}else if(t.settings.type=="full"){t.ui.mainPanel.ClicFullPicker({startColor:t.state.selectedColor,enableOpacity:t.settings.enableOpacity,applyClick:function(){var e=t.ui.mainPanel.ClicFullPicker("getColor");i(t,e)},cancelClick:function(){t.state.mainPanelVisible=false;u(t)}})}}function i(e,t){e.state.mainPanelVisible=false;e.state.selectedColor=t;u(e);if(e.settings.onChanged){var n={oldValue:e.state.oldColor,newValue:t};e.settings.onChanged(n);e.state.oldColor=t}}function s(t){e("body").click(function(){t.state.mainPanelVisible=false;u(t)});t.ui.opener.click(function(e){o(e,t)});t.ui.mainPanel.click(function(e){e.stopPropagation()})}function o(e,t){t.state.mainPanelVisible=!t.state.mainPanelVisible;u(t);e.stopPropagation()}function u(e){if(e.state.mainPanelVisible){a(e);e.ui.mainPanel.fadeIn("fast");e.ui.arrowArea.html("&#x25B2;")}else{e.ui.mainPanel.fadeOut("fast");e.ui.arrowArea.html("&#x25BC;")}e.ui.previewArea.css("background-color",ObjectToRGBAString(e.state.selectedColor))}function a(e){var t=e.ui.opener.offset();var n=t.top+e.ui.opener.outerHeight();var r=t.width+e.ui.opener.outerWidth();e.ui.mainPanel.css("top",n);e.ui.mainPanel.css("left",r)}var f={init:function(n){var r=e.extend({startColor:"#FFFFFF",type:"simple",enableOpacity:false,defaultPalette:"websafe",openerCssClass:"",mainPanelCssClass:"",onChanged:null},n);return this.each(function(){var n=e(this).data("ClicColorPicker");if(!n){e(this).data("ClicColorPicker",{settings:r,state:{mainPanelVisible:false,selectedColor:StringToObject(r.startColor),oldColor:StringToObject(r.startColor),simplePaletteIndex:0},ui:{opener:null,previewArea:null,arrowArea:null,mainPanel:null,simplePicker:null,fullPicker:null,gradientPicker:null}});n=e(this).data("ClicColorPicker");t(this,n)}})}};e.fn.ClicColorPicker=function(t){if(f[t]){return f[t].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof t==="object"||!t){return f.init.apply(this,arguments)}else{e.error("Method "+t+" does not exist on ClicColorPicker")}}})(jQuery)