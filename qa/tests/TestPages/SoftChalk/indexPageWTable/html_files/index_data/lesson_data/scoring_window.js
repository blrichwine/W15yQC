/***********************************************
* Floating Top Bar script- © Dynamic Drive (www.dynamicdrive.com)
* Sliding routine by Roy Whittle (http://www.javascript-fx.com/)
* This notice must stay intact for legal use.
* Visit http://www.dynamicdrive.com/ for full source code
***********************************************/

/**
 * SoftChalk File date: May 10, 2011
 */

var startX = 40; //set x offset of bar in pixels
//var startY = 40; //set y offset of bar in pixels
var startY = 74; //set y offset of bar in pixels
var verticalpos = "frombottom"; //enter "fromtop" or "frombottom"

function iecompattest() {
	return (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
}

function closebar() {
	document.getElementById("floatingscore").style.visibility = "hidden";
}

function staticbar() {
	barheight = document.getElementById("floatingscore").offsetHeight;
	var ns = (navigator.appName.indexOf("Netscape") != -1) || window.opera;
	var d = document;

	function ml(id) {
		var el = d.getElementById(id);
		el.style.visibility = "hidden";
		if (d.layers)
			el.style = el;

		el.sP = function(x,y) {
			this.style.right = x + "px";
			this.style.top = y + "px";
			this.style.width = "60px";
		};

		el.x = startX;
		el.y = ns ? pageYOffset + innerHeight : iecompattest().scrollTop + iecompattest().clientHeight;
		el.y -= startY;
		return el;
	}

	window.stayTopLeft = function() {
		var pY = ns ? pageYOffset + innerHeight - barheight: iecompattest().scrollTop + iecompattest().clientHeight - barheight;
		ftlObj.y += (pY - startY - ftlObj.y) / 8;
		ftlObj.sP(ftlObj.x, ftlObj.y);
		setTimeout("stayTopLeft()", 10);
	}
	ftlObj = ml("floatingscore");
	//stayTopLeft();
}

if (window.addEventListener)
	window.addEventListener("load", staticbar, false);
else if (window.attachEvent)
	window.attachEvent("onload", staticbar);
else if (document.getElementById)
	window.onload = staticbar;
