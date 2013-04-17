/*
  $Header: //depot/Labs-JDN/Documents/UX/BetaAds/App_Images/jdn_script.js#5 $
  $DateTime: 2009/03/29 16:22:19 $
*/

var mImages = new Array;
var mIndex = 0;

function trackingcodefilter(trackingcode)
{
    if (trackingcode.indexOf("googlesyndication.com") >  0)
    {
	var i = trackingcode.indexOf("AdImageLog.aspx");
        if (i < 0) i = trackingcode.indexOf("adimagelog.aspx");
	if (i > 0)
	{
	    var p1 = trackingcode.substring(0,i);
            var p2 = trackingcode.substring(i);
            p2 = p2.replace(/&/g,"%26");
	    return(p1+p2);
	}
    }
    return(trackingcode);
}

function trackingurl(trackingcode)
{
    if (trackingcode === undefined) return;
    if (document.images) {
        mImages[mIndex]=new Image;
        mImages[mIndex].src=trackingcodefilter(trackingcode);
        mIndex++;
    }
}

function adonmouseover(elm)
{
    return(adonsomething(elm,"trackingcode"));
}

function adonmouseclick(elm)
{
    return(adonsomething(elm,"trackingonclick"));
}

function adonsomething(elm,akey)
{
    elm.onmouseover = null;
    var trackingattr = elm.attributes[akey];
    if (trackingattr === undefined) return;
    var trackingcode = trackingattr.nodeValue;
    if (trackingcode === undefined) return;
    if (trackingcode == "") return;
    var baseurl_list = trackingcode.split(" ");
    for(var j=0;j<baseurl_list.length;++j)
    {
	var baseurl = baseurl_list[j];
	if (baseurl != "none")
	{
	    if (j < 1) baseurl = baseurl + infoargs(elm);
	    trackingurl(baseurl);
	}
    }
    return(true);
}

function infoargs(elm)
{
    var infoattr = elm.attributes["info"];
    if (infoattr === undefined) return("");
    var infocode = infoattr.nodeValue;
    if (infocode === undefined) return("");
    return("&info=" + infocode);
}


