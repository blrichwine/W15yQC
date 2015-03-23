// source: https://gist.github.com/887560
//
// jQuery patch for HTML5 elements using innerShiv by https://github.com/andy-clusta
(function ($) {
    var init = jQuery.fn.init; rootjQuery = jQuery(document);

    // http://jdbartlett.github.com/innershiv | WTFPL License
    var innerShiv = (function() {
	    var div, frag,
		    inaTable = /^<(tbody|tr|td|col|colgroup|thead|tfoot)/i,
		    remptyTag = /(<([\w:]+)[^>]*?)\/>/g,
		    rselfClosing = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i,
		    fcloseTag = function (all, front, tag) {
			    return rselfClosing.test(tag) ? all : front + '></' + tag + '>';
		    };

	    return function(html, returnFrag) {
		    if (!div) {
			    div = document.createElement('div');
			    frag = document.createDocumentFragment();
			    /*@cc_on div.style.display = 'none';@*/
		    }

		    html = html.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

		    var tabled = html.match(inaTable), myDiv = div.cloneNode(true);
		    if (tabled) html = '<table>' + html + '</table>';

		    /*@cc_on document.body.appendChild(myDiv);@*/
		    myDiv.innerHTML = html.replace(remptyTag, fcloseTag);
		    /*@cc_on document.body.removeChild(myDiv);@*/

		    if (tabled) myDiv = myDiv.getElementsByTagName(tabled[1])[0].parentNode;

		    if (returnFrag === false) return myDiv.childNodes;

		    var myFrag = frag.cloneNode(true), i = myDiv.childNodes.length;
		    while (i--) myFrag.appendChild(myDiv.firstChild);

		    return myFrag;
	    }
    }());

    // used by Jquery Templates
    // tests to see if html passed to constructor
    jQuery.fn.init = function (selector, context) {
        if ($.browser.msie && typeof selector == 'string' && selector.indexOf('>') != -1 && selector.indexOf('<') != -1) {
            return new init(innerShiv(selector, false), context, rootjQuery);
        }

        return new init(selector, context, rootjQuery)
    };

    // used by Jquery Unobtrusive Ajax in ASP.NET MVC
    // only matches <script></script> tags, without @src and @typeof
    /* UNCOMMENT IF NEEDED
    $.fn.html = function (value) {
        if ($.browser.msie && typeof value === 'string') {
            var scriptsRegex = new RegExp('<script>([\\w\\W]*)<\/script>', 'gim');
            var scripts = value.match(scriptsRegex);
            var el = html.apply(this, [innerShiv(value, false)]);

            for (var i in scripts) {
                var js = scriptsRegex.exec(scripts[i]);
                if (js != null)
                    $.globalEval(js[0]);
            }

            return el;
        }

        return html.apply(this, arguments);
    };
    */
}(jQuery));