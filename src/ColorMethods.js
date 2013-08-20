var ClicColorLib = ClicColorLib || {};
ClicColorLib.ColorMethods = {};

/* 
//
// Regex functions
//
*/
ClicColorLib.ColorMethods._hexRegex = /^#([A-Fa-f0-9]{6})$/;

ClicColorLib.ColorMethods._rgbRegex = /^rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\)$/;
ClicColorLib.ColorMethods._rgbaRegex = /^rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d?\.?\d*)\)$/;

ClicColorLib.ColorMethods.isColor = function (str) {
	return (ClicColorLib.ColorMethods.isHex(str) || ClicColorLib.ColorMethods.isRGB(str) || ClicColorLib.ColorMethods.isRGBA(str));
};

ClicColorLib.ColorMethods.isHex = function (str) {	
	return str.match(ClicColorLib.ColorMethods._hexRegex);	
};

ClicColorLib.ColorMethods.isRGB = function (str) {
	return str.match(ClicColorLib.ColorMethods._rgbRegex);
};

ClicColorLib.ColorMethods.isRGBA = function (str) {
	return str.match(ClicColorLib.ColorMethods._rgbaRegex);
};



/* 
//
// Convert Strings to object
//
*/

ClicColorLib.ColorMethods.StringToObject = function (str) {	
	if (ClicColorLib.ColorMethods.isHex(str)) {
		return ClicColorLib.ColorMethods.ParseHex(str);	
	} else {
		return ClicColorLib.ColorMethods.ParseRGB(str);
	}	
};

ClicColorLib.ColorMethods.ParseHex = function (str) {
	try {
		var r,g,b;
		r = parseInt(str.substring(1,3),16);
		g = parseInt(str.substring(3,5),16);
		b = parseInt(str.substring(5,7),16);
		return {r:r,g:g,b:b,a:1}
	} catch (e) {
		console.log('Error parsing hex string: ' + str)
	}
};

ClicColorLib.ColorMethods.ParseRGB = function (str) {
	try {		
		var toParse = str.substring(4); // remove 'rgb('
		var index = 0;
		var rgb = ['','','',''];
		var buffer = "";
		while (toParse.length > 0) {
			if (toParse[0] == '.' || !isNaN(parseInt(toParse[0]))) {
				buffer += toParse[0].toString();
			} else if (toParse[0] == ',' || toParse[0] == ')') {
				rgb[index] = buffer;
				index++;
				buffer = "";
			}

			toParse = toParse.substring(1);
		}

		var rv = {
			r:parseFloat(rgb[0]),
			g:parseFloat(rgb[1]),
			b:parseFloat(rgb[2]),
			a:parseFloat(rgb[3])
		};

		if (isNaN(rv.a)) {
			rv.a = 1;
		}

		return rv;
	} catch (e) {
		console.log('Error parsing rgb:' + str);
	}
};

ClicColorLib.ColorMethods.CloneColor = function (obj) {
	return  {
		r:obj.r,
		g:obj.g,
		b:obj.b,
		a:obj.a
	};
};

/* 
//
//	Convert between rgba and hsl color types
//
*/



ClicColorLib.ColorMethods.HSLToRGB = function (h, s, l){
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

    return {r: Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255),a:1};
};

ClicColorLib.ColorMethods.RGBToHSL = function (rgb){
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

ClicColorLib.ColorMethods.ObjectToRGBAString = function (obj) {	
	var rv = "rgba(" + obj.r.toString(10);
	rv += ", " + obj.g.toString(10);
	rv += ", " + obj.b.toString(10);
	if (isNaN(parseInt(obj.a))) {
		rv += ", 1";	
	} else {		
		rv += ", " + obj.a.toString(10);	
	}
	rv += ")";
	
	return rv;	
};

ClicColorLib.ColorMethods.ObjectToRGBString = function (obj) {
	var rv = "rgb(" + obj.r.toString(10);
	rv += ", " + obj.g.toString(10);
	rv += ", " + obj.b.toString(10);	
	rv += ")";
	
	return rv;	
};

ClicColorLib.ColorMethods.ApproximateGradientPoint = function (existing, percent) {
	var rgb = {r:255,g:255,b:255,a:1};
	var clean = ClicColorLib.ColorMethods._cleanupColorStopArray(existing);
	for (var i = 0; i < clean.length;i++) {
		if (clean[i].percent > percent) {
			var prev = clean[i-1].color;
			var next = clean[i].color;
			var relativePercent = Math.abs(clean[i-1].percent - clean[i].percent) * percent/100;
			rgb.r = ClicColorLib.ColorMethods._colorDistance(prev.r, next.r, relativePercent);
			rgb.g = ClicColorLib.ColorMethods._colorDistance(prev.g, next.g, relativePercent);
			rgb.b = ClicColorLib.ColorMethods._colorDistance(prev.b, next.b, relativePercent);
			if (prev.a === undefined) {prev.a = 1;}
			if (next.a === undefined) {next.a = 1;}
			rgb.a = ClicColorLib.ColorMethods._colorDistance(prev.a, next.a, relativePercent);
			return rgb;
		}
	}
}

ClicColorLib.ColorMethods._colorDistance = function (a, b, percent) {
	if (a < b) {
		return a + ((b-a) * (percent/100));
	} else if (b < a) {
		return b + ((a-b) * (percent/100));
	} else {
		return a;
	}
}


/*
//
// CSS conversion
//
*/

// takes something like this: [{percent:12,color:{rgb}},{}...]
// and gives you something like this: ["-webkit-gradient(linear"],"...."]
ClicColorLib.ColorMethods.GetLinearGradientCss = function (angle,stops,isRadial) {
	if (stops.length == 0) {
		return [];
	}

	var rv = new Array(4);
	var list = "";
	var clean = ClicColorLib.ColorMethods._cleanupColorStopArray(stops);
	for (var i=0;i<clean.length;i++) {
		list += ","
		list += ClicColorLib.ColorMethods.ObjectToRGBAString(clean[i].color);
		list += " ";
		list += clean[i].percent.toString();
		list += "%";
	}

	if (isRadial) {
		rv[0] = "-moz-radial-gradient(center, ellipse cover " + list + ")";
		rv[1] = "-webkit-radial-gradient(center, ellipse cover " + list + ")";
		rv[2] = "-ms-radial-gradient(center, ellipse cover " + list + ")";
		rv[3] = "radial-gradient(ellipse at center " +list + ")";
	} else {
		rv[0] = "-moz-linear-gradient(" + (angle - 45).toString() + "deg " + list + ")";
		rv[1] = "-webkit-linear-gradient(" + (angle - 45).toString() + "deg " + list + ")";
		rv[2] = "-ms-linear-gradient(" + (angle-45).toString() + "deg " + list + ")";
		rv[3] = "linear-gradient(" + (angle).toString() + "deg " +list + ")";	
	}


	

	return rv;
};

ClicColorLib.ColorMethods.ApplyGradientBackground = function (obj,angle,stops,isRadial) {
	if (!angle) { angle = 0;}
	
	var clean = ClicColorLib.ColorMethods._cleanupColorStopArray(stops);
	var strs = ClicColorLib.ColorMethods.GetLinearGradientCss(angle,clean,isRadial);
	for (var i = 0; i < strs.length;i++) {
		obj.css("background",strs[i] + ", url('images/transparent.png') repeat");
	}

};


ClicColorLib.ColorMethods._cleanupColorStopArray = function (arr) {
	var clean = arr.slice();

	return clean.filter(function(val) {
		if (val) {return true;} else {return false;}
	}).sort(function (a,b) {
			return a.percent - b.percent	
	});
};
