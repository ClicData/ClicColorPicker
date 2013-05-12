

/* 
//
// Regex functions
//
*/
var _hexRegex = /^#([A-Fa-f0-9]{6})$/;

var _rgbRegex = /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\)$/;
var _rgbaRegex = /^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/;

function isColor(str) {
	return (isHex(str) || isRGB(str) || isRGBA(str));
}

function isHex(str) {	
	return str.match(_hexRegex);	
}

function isRGB(str) {
	return str.match(_rgbRegex);
}

function isRGBA(str) {
	return str.match(_rgbaRegex);
}



/* 
//
// Convert Strings to object
//
*/

function StringToObject(str) {	
	if (isHex(str)) {
		return ParseHex(str);	
	} else {
		return ParseRGB(str);
	}	
}

function ParseHex(str) {
	try {
		var r,g,b;
		r = parseInt(str.substring(1,3),16);
		g = parseInt(str.substring(3,5),16);
		b = parseInt(str.substring(5,7),16);
		return {r:r,g:g,b:b,a:255}
	} catch (e) {
		console.log('Error parsing hex string: ' + str)
	}
}

function ParseRGB(str) {
	try {		
		var toParse = str.substring(4); // remove 'rgb('
		var index = 0;
		var rgb = ['','','',''];
		var buffer = "";
		while (toParse.length > 0) {
			if (!isNaN(parseInt(toParse[0]))) {
				buffer += toParse[0].toString();
			} else if (toParse[0] == ',' || toParse[0] == ')') {
				rgb[index] = buffer;
				index++;
				buffer = "";
			}

			toParse = toParse.substring(1);
		}

		var rv = {
			r:parseInt(rgb[0]),
			g:parseInt(rgb[1]),
			b:parseInt(rgb[2]),
			a:parseInt(rgb[3])
		};

		if (isNaN(rv.a)) {
			rv.a = 255;
		}

		return rv;
	} catch (e) {
		console.log('Error parsing rgb:' + str);
	}
}

function CloneColor(obj) {
	return  {
		r:obj.r,
		g:obj.g,
		b:obj.b,
		a:obj.a,
	};
}

/* 
//
//	Convert between rgba and hsl color types
//
*/



function HSLToRGB(h, s, l){
	h = h /360;
	s = s/100;
	l = l/100;
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {r: Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255),a:255};
}

function RGBToHSL(rgb){
    var r = rgb.r / 255;
    var g = rgb.g / 255;
    var b = rgb.b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

     return {
    	h: h * 360, 
    	s: s * 100, 
    	l: l * 100
    };
}




/* 
//
// Convert objects to strings
//
*/

function ObjectToRGBAString(obj) {	
	var rv = "rgba(" + obj.r.toString(10);
	rv += ", " + obj.g.toString(10);
	rv += ", " + obj.b.toString(10);
	if (isNaN(parseInt(obj.a))) {
		rv += ", 255";	
	} else {		
		rv += ", " + obj.a.toString(10);	
	}
	rv += ")";
	
	return rv;	
}

function ObjectToRGBString(obj) {
	var rv = "rgb(" + obj.r.toString(10);
	rv += ", " + obj.g.toString(10);
	rv += ", " + obj.b.toString(10);	
	rv += ")";
	
	return rv;	
}




