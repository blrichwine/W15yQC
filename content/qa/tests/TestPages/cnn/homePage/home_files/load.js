/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(ab,aD){var aQ=ab.document,aL=aQ.documentElement,Y="sizcache"+(Math.random()+"").replace(".",""),aF=0,aR=Object.prototype.toString,ar=Array.prototype.concat,aq="undefined",aI=false,aN=true,ag=/^#([\w\-]+$)|^(\w+$)|^\.([\w\-]+$)/,ah=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,at=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,aa=/^[+~]$/,au=/\\(?!\\)/g,X=/\W/,aO=/^\w/,aA=/\D/,aP=/(-?)(\d*)(?:n([+\-]?\d*))?/,aw=/^\+|\s*/g,ax=/h\d/i,af=/input|select|textarea|button/i,aH=/[\t\n\f\r]/g,aB="(?:[-\\w]|[^\\x00-\\xa0]|\\\\.)",ak={ID:new RegExp("#("+aB+"+)"),CLASS:new RegExp("\\.("+aB+"+)"),NAME:new RegExp("\\[name=['\"]*("+aB+"+)['\"]*\\]"),TAG:new RegExp("^("+aB.replace("[-","[-\\*")+"+)"),ATTR:new RegExp("\\[\\s*("+aB+"+)\\s*(?:(\\S?=)\\s*(?:(['\"])(.*?)\\3|(#?"+aB+"*)|)|)\\s*\\]"),PSEUDO:new RegExp(":("+aB+"+)(?:\\((['\"]?)((?:\\([^\\)]+\\)|[^\\(\\)]*)+)\\2\\))?"),CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/},ae=ak.POS,ad=(function(){var b,a=function(d,e){return"\\"+(e-0+1)},c={};for(b in ak){ak[b]=new RegExp(ak[b].source+(/(?![^\[]*\])(?![^\(]*\))/.source));c[b]=new RegExp(/(^(?:.|\r|\n)*?)/.source+ak[b].source.replace(/\\(\d+)/g,a))}ak.globalPOS=ae;return c})(),aJ={},ao={},ap={},ai=function(d){var c=false,b=aQ.createElement("div");try{c=d(b)}catch(a){}b=null;return c},ay=ai(function(a){a.innerHTML="<select></select>";var b=typeof a.lastChild.getAttribute("multiple");return b!=="boolean"&&b!=="string"}),aM=ai(function(a){var c=true,b="script"+(new Date()).getTime();a.innerHTML="<a name ='"+b+"'/>";aL.insertBefore(a,aL.firstChild);if(aQ.getElementById(b)){c=false}aL.removeChild(a);return c}),aS=ai(function(a){a.appendChild(aQ.createComment(""));return a.getElementsByTagName("*").length===0}),al=ai(function(a){a.innerHTML="<a href='#'></a>";return a.firstChild&&typeof a.firstChild.getAttribute!==aq&&a.firstChild.getAttribute("href")==="#"}),am=ai(function(a){a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!a.getElementsByClassName||a.getElementsByClassName("e").length===0){return false}a.lastChild.className="e";return a.getElementsByClassName("e").length!==1});var ac=function(i,d,g,e){g=g||[];d=d||aQ;var f,c,a,b,h=d.nodeType;if(h!==1&&h!==9){return[]}if(!i||typeof i!=="string"){return g}a=az(d);if(!a&&!e){if((f=ag.exec(i))){if((b=f[1])){if(h===9){c=d.getElementById(b);if(c&&c.parentNode){if(c.id===b){return aC([c],g)}}else{return aC([],g)}}else{if(d.ownerDocument&&(c=d.ownerDocument.getElementById(b))&&an(d,c)&&c.id===b){return aC([c],g)}}}else{if(f[2]){return aC(d.getElementsByTagName(i),g)}else{if(am&&(b=f[3])&&d.getElementsByClassName){return aC(d.getElementsByClassName(b),g)}}}}}return Z(i,d,g,e,a)};var Z=function(k,v,o,t,s){var m,p,f,a,e,u,q,n,j,i,g,d,r,l,c=v,b=true,h=k;if((n=aJ[k])===aD){n=[];do{at.exec("");m=at.exec(h);if(m){h=m[3];n.push(m[1]);if(m[2]){a=m[3];break}}}while(m);aJ[k]=n&&n.slice(0);ao[k]=a}else{n=n.slice(0);a=ao[k]}if(n.length>1&&ae.exec(k)){if(n.length===2&&aj.relative[n[0]]){p=av(n[0]+n[1],v,t,s)}else{p=aj.relative[n[0]]?[v]:ac(n.shift(),v);while(n.length){k=n.shift();if(aj.relative[k]){k+=n.shift()}p=av(k,p,t,s)}}}else{if(!t&&n.length>1&&v.nodeType===9&&!s&&ak.ID.test(n[0])&&!ak.ID.test(n[n.length-1])){e=ac.find(n.shift(),v,s);v=e.expr?ac.filter(e.expr,e.set)[0]:e.set[0]}if(v){e=t?{expr:n.pop(),set:aC(t)}:ac.find(n.pop(),(n.length>=1&&aa.test(n[0])&&v.parentNode)||v,s);p=e.expr?ac.filter(e.expr,e.set):e.set;if(n.length>0){f=aC(p);j=0;i=f.length;r=[];for(;j<i;j++){r[j]=j}}else{b=false}while(n.length){u=n.pop();if(aj.relative[u]){q=n.pop()}else{q=u;u=""}if(q==null){q=v}aj.relative[u](f,r,q,s);f=ar.apply([],f);r=ar.apply([],r)}}else{f=n=[]}}if(!f){f=p}if(!f){ac.error(u||k)}if(aR.call(f)==="[object Array]"){if(!b){o.push.apply(o,f)}else{d=v&&v.nodeType===1;p=aC(p);for(j=0;(g=f[j])!=null;j++){if(g===true||(g.nodeType===1&&(!d||an(v,g)))){l=r?r[j]:j;if(p[l]){o.push(p[l]);p[l]=false}}}}}else{aC(f,o)}if(a){Z(a,c,o,t,s);aG(o)}return o};ac.matches=function(b,a){return ac(b,null,null,a)};ac.matchesSelector=function(b,a){return ac(a,null,null,[b]).length>0};ac.find=function(e,d,b){var f,a,h,i,g,c;if(!e){return[]}for(a=0,h=aj.order.length;a<h;a++){g=aj.order[a];if((i=ad[g].exec(e))){c=i[1];i.splice(1,1);if(c.substr(c.length-1)!=="\\"){i[1]=(i[1]||"").replace(au,"");f=aj.find[g](i,d,b);if(f!=null){e=e.replace(ak[g],"");break}}}}if(!f){f=aj.find.TAG([0,"*"],d)}return{set:f,expr:e}};ac.filter=function(j,k,g,q){var d,l,e,p,c,a,h,o,i,n=ap[j],b=j,f=[],m=k&&k[0]&&az(k[0]);if(!n){n=ah.exec(j);if(n){n[1]=(n[1]||"").toLowerCase();n[3]=n[3]&&(" "+n[3]+" ");ap[j]=n}}if(n&&!m){for(o=0;(p=k[o])!=null;o++){if(p){h=p.attributes||{};e=(!n[1]||(p.nodeName&&p.nodeName.toLowerCase()===n[1]))&&(!n[2]||(h.id||{}).value===n[2])&&(!n[3]||~(" "+((h["class"]||{}).value||"").replace(aH," ")+" ").indexOf(n[3]));i=q^e;if(g&&!i){k[o]=false}else{if(i){f.push(p)}}}}if(!g){k=f}return k}while(j&&k.length){for(l in aj.filter){if((n=ad[l].exec(j))&&n[2]){c=aj.filter[l];a=n[1];d=false;n.splice(1,1);if(a.substr(a.length-1)==="\\"){continue}if(k===f){f=[]}if(aj.preFilter[l]){n=aj.preFilter[l](n,k,g,f,q,m);if(!n){d=e=true}else{if(n===true){continue}}}if(n){for(o=0;(p=k[o])!=null;o++){if(p){e=c(p,n,o,k);i=q^e;if(g&&e!=null){if(i){d=true}else{k[o]=false}}else{if(i){f.push(p);d=true}}}}}if(e!==aD){if(!g){k=f}j=j.replace(ak[l],"");if(!d){return[]}break}}}if(j===b){if(d==null){ac.error(j)}else{break}}b=j}return k};ac.attr=function(a,b){if(aj.attrHandle[b]){return aj.attrHandle[b](a)}if(ay||az(a)){return a.getAttribute(b)}var c=(a.attributes||{})[b];return c&&c.specified?c.value:null};ac.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};if(aQ.querySelectorAll){(function(){var h,f=Z,d="__sizzle__",e=/[^\\],/g,j=/^\s*[+~]/,b=/'/g,i=/\=\s*([^'"\]]*)\s*\]/g,c=[],g=[],a=aL.matchesSelector||aL.mozMatchesSelector||aL.webkitMatchesSelector||aL.oMatchesSelector||aL.msMatchesSelector;ai(function(k){k.innerHTML="<select><option selected></option></select>";if(!k.querySelectorAll("[selected]").length){c.push("\\[[\\x20\\t\\n\\r\\f]*(?:checked|disabled|ismap|multiple|readonly|selected|value)")}if(!k.querySelectorAll(":checked").length){c.push(":checked")}});ai(function(k){k.innerHTML="<p class=''></p>";if(k.querySelectorAll("[class^='']").length){c.push("[*^$]=[\\x20\\t\\n\\r\\f]*(?:\"\"|'')")}k.innerHTML="<input type='hidden'>";if(!k.querySelectorAll(":enabled").length){c.push(":enabled",":disabled")}});c=c.length&&new RegExp(c.join("|"));Z=function(p,u,n,m,q){if(!m&&!q&&(!c||!c.test(p))){if(u.nodeType===9){try{return aC(u.querySelectorAll(p),n)}catch(r){}}else{if(u.nodeType===1&&u.nodeName.toLowerCase()!=="object"){var o,t=u,s=u.getAttribute("id"),v=s||d,k=u.parentNode,l=j.test(p);if(!s){u.setAttribute("id",v)}else{v=v.replace(b,"\\$&")}if(l&&k){u=k}try{if(!l||k){v="[id='"+v+"'] ";o=v+p.replace(e,"$&"+v);return aC(u.querySelectorAll(o),n)}}catch(r){}finally{if(!s){t.removeAttribute("id")}}}}}return f(p,u,n,m,q)};if(a){ai(function(k){h=a.call(k,"div");try{a.call(k,"[test!='']:sizzle");g.push(aj.match.PSEUDO)}catch(l){}});g=g.length&&new RegExp(g.join("|"));ac.matchesSelector=function(k,m){m=m.replace(i,"='$1']");if(!az(k)&&(!g||g.test(m))&&(!c||!c.test(m))){try{var l=a.call(k,m);if(l||!h||k.document&&k.document.nodeType!==11){return l}}catch(n){}}return ac(m,null,null,[k]).length>0}}})()}function aC(b,a){a=a||[];var c=0,d=b.length;if(typeof d==="number"){for(;c<d;c++){a.push(b[c])}}else{for(;b[c];c++){a.push(b[c])}}return a}var az=ac.isXML=function(b){var a=(b?b.ownerDocument||b:0).documentElement;return a?a.nodeName!=="HTML":false};var an=ac.contains=aL.compareDocumentPosition?function(a,b){return !!(a.compareDocumentPosition(b)&16)}:aL.contains?function(a,b){return a!==b&&(a.contains?a.contains(b):false)}:function(a,b){while((b=b.parentNode)){if(b===a){return true}}return false};var aU=ac.getText=function(a){var c,b,e=a.nodeType,d="";if(e){if(e===1||e===9||e===11){if(typeof a.textContent==="string"){return a.textContent}else{for(a=a.firstChild;a;a=a.nextSibling){d+=aU(a)}}}else{if(e===3||e===4){return a.nodeValue}}}else{for(c=0;(b=a[c]);c++){if(b.nodeType!==8){d+=aU(b)}}}return d};function aK(q,e,h,d,m){var a,f,g,n,b,c,p,j,o=0,k=e.length,l=typeof d==="string",i=++aF;if(l&&!X.test(d)){d=d.toLowerCase();f=true}for(;o<k;o++){if((a=e[o])){n=[];b=0;a=a[q];while(a){if(a[Y]===i&&a.sizLevelIndex===b){c=e[a.sizset];n=n.length?c.length?n.concat(c):n:c;break}g=a.nodeType===1;if(g&&!m){a[Y]=i;a.sizset=o;a.sizLevelIndex=b}if(f){if(a.nodeName.toLowerCase()===d){n.push(a)}}else{if(g){if(!l){if(a===d){n=true;break}}else{if(ac.filter(d,[a]).length>0){n.push(a)}}}}a=a[q];b++}if((j=n.length)){e[o]=n;if(j>1){h[o]=[];p=0;for(;p<j;p++){h[o].push(o)}}}else{e[o]=typeof n==="boolean"?n:false}}}}function av(b,d,h,c){var i,f=[],j="",e=d.nodeType?[d]:d,a=0,g=e.length;while((i=ak.PSEUDO.exec(b))){j+=i[0];b=b.replace(ak.PSEUDO,"")}if(aj.relative[b]){b+="*"}for(;a<g;a++){Z(b,e[a],f,h,c)}return ac.filter(j,f)}var aj=ac.selectors={match:ak,leftMatch:ad,order:["ID","NAME","TAG"],attrHandle:{},relative:{"+":function(f,g,d){var c,b=0,i=f.length,a=typeof d==="string",e=a&&!X.test(d),h=a&&!e;if(e){d=d.toLowerCase()}for(;b<i;b++){if((c=f[b])){while((c=c.previousSibling)&&c.nodeType!==1){}f[b]=h||c&&c.nodeName.toLowerCase()===d?c||false:c===d}}if(h){ac.filter(d,f,true)}},">":function(a,f,g){var b,e=0,h=a.length,c=typeof g==="string";if(c&&!X.test(g)){g=g.toLowerCase();for(;e<h;e++){if((b=a[e])){var d=b.parentNode;a[e]=d.nodeName.toLowerCase()===g?d:false}}}else{for(;e<h;e++){if((b=a[e])){a[e]=c?b.parentNode:b.parentNode===g}}if(c){ac.filter(g,a,true)}}},"":function(b,a,c,d){aK("parentNode",b,a,c,d)},"~":function(b,a,c,d){aK("previousSibling",b,a,c,d)}},find:{ID:aM?function(b,a,c){if(typeof a.getElementById!==aq&&!c){var d=a.getElementById(b[1]);return d&&d.parentNode?[d]:[]}}:function(b,a,c){if(typeof a.getElementById!==aq&&!c){var d=a.getElementById(b[1]);return d?d.id===b[1]||typeof d.getAttributeNode!==aq&&d.getAttributeNode("id").value===b[1]?[d]:aD:[]}},NAME:function(d,a){if(typeof a.getElementsByName!==aq){var e=[],b=a.getElementsByName(d[1]),c=0,f=b.length;for(;c<f;c++){if(b[c].getAttribute("name")===d[1]){e.push(b[c])}}return e.length===0?null:e}},TAG:aS?function(b,a){if(typeof a.getElementsByTagName!==aq){return a.getElementsByTagName(b[1])}}:function(e,a){var c=a.getElementsByTagName(e[1]);if(e[1]==="*"){var b=[],d=0;for(;c[d];d++){if(c[d].nodeType===1){b.push(c[d])}}c=b}return c}},preFilter:{CLASS:function(d,g,f,h,a,e){var b,c=0;d=" "+d[1].replace(au,"")+" ";if(e){return d}for(;(b=g[c])!=null;c++){if(b){if(a^(b.className&&~(" "+b.className+" ").replace(aH," ").indexOf(d))){if(!f){h.push(b)}}else{if(f){g[c]=false}}}}return false},ID:function(a){return a[1].replace(au,"")},TAG:function(a){return a[1].replace(au,"").toLowerCase()},CHILD:function(b){if(b[1]==="nth"){if(!b[2]){ac.error(b[0])}b[2]=b[2].replace(aw,"");var a=aP.exec(b[2]==="even"&&"2n"||b[2]==="odd"&&"2n+1"||!aA.test(b[2])&&"0n+"+b[2]||b[2]);b[2]=(a[1]+(a[2]||1))-0;b[3]=a[3]-0}else{if(b[2]){ac.error(b[0])}}b[0]=++aF;return b},ATTR:function(a){a[1]=a[1].replace(au,"");a[4]=(a[4]||a[5]||"").replace(au,"");if(a[2]==="~="){a[4]=" "+a[4]+" "}return a},PSEUDO:function(b,f,e,g,a,c){if(b[1]==="not"){if((at.exec(b[3])||"").length>1||aO.test(b[3])){b[3]=Z(b[3],aQ,[],f,c)}else{var d=ac.filter(b[3],f,e,!a);if(!e){g.push.apply(g,d)}return false}}else{if(ak.POS.test(b[0])||ak.CHILD.test(b[0])){return true}}return b},POS:function(a){a.unshift(true);return a}},filters:{enabled:function(a){return a.disabled===false},disabled:function(a){return a.disabled===true},checked:function(b){var a=b.nodeName.toLowerCase();return(a==="input"&&!!b.checked)||(a==="option"&&!!b.selected)},selected:function(a){if(a.parentNode){a.parentNode.selectedIndex}return a.selected===true},parent:function(a){return !!a.firstChild},empty:function(a){return !a.firstChild},has:function(a,b,c){return !!ac(c[3],a).length},header:function(a){return ax.test(a.nodeName)},text:function(a){var c=a.getAttribute("type"),b=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===b&&(c===null||c.toLowerCase()===b)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return af.test(a.nodeName)},focus:function(b){var a=b.ownerDocument;return b===a.activeElement&&(!a.hasFocus||a.hasFocus())&&!!(b.type||b.href)},active:function(a){return a===a.ownerDocument.activeElement},contains:function(a,b,c){return ~(a.textContent||a.innerText||aU(a)).indexOf(c[3])}},setFilters:{first:function(a,b){return b===0},last:function(b,c,d,a){return c===a.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(b,g,h,e){var d=g[1],c=aj.filters[d];if(c){return c(b,h,g,e)}else{if(d==="not"){var a=g[3],i=0,f=a.length;for(;i<f;i++){if(a[i]===b){return false}}return true}else{ac.error(d)}}},CHILD:function(c,a){var b,e,i,f,j,g,h=a[1],d=c;switch(h){case"only":case"first":while((d=d.previousSibling)){if(d.nodeType===1){return false}}if(h==="first"){return true}d=c;case"last":while((d=d.nextSibling)){if(d.nodeType===1){return false}}return true;case"nth":b=a[2];e=a[3];if(b===1&&e===0){return true}i=a[0];f=c.parentNode;if(f&&(f[Y]!==i||!c.sizset)){j=0;for(d=f.firstChild;d;d=d.nextSibling){if(d.nodeType===1){d.sizset=++j;if(d===c){break}}}f[Y]=i}g=c.sizset-e;if(b===0){return g===0}else{return(g%b===0&&g/b>=0)}}},ID:aM?function(a,b){return a.nodeType===1&&a.getAttribute("id")===b}:function(a,c){var b=typeof a.getAttributeNode!==aq&&a.getAttributeNode("id");return a.nodeType===1&&b&&b.value===c},TAG:function(a,b){return(b==="*"&&a.nodeType===1)||a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return ~(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)},ATTR:function(b,e){var d=e[1],g=ac.attr(b,d),a=g+"",c=e[2],f=e[4];return g==null?c==="!=":!c?g!=null:c==="="?a===f:c==="*="?~a.indexOf(f):c==="~="?~(" "+a+" ").indexOf(f):!f?a&&g!==false:c==="!="?a!==f:c==="^="?a.indexOf(f)===0:c==="$="?a.substr(a.length-f.length)===f:c==="|="?a===f||a.substr(0,f.length+1)===f+"-":false},POS:function(b,e,d,a){var f=e[2],c=aj.setFilters[f];if(c){return c(b,d,e,a)}}}};if(!al){aj.attrHandle={href:function(a){return a.getAttribute("href",2)},type:function(a){return a.getAttribute("type")}}}if(am){aj.order.splice(1,0,"CLASS");aj.find.CLASS=function(b,a,c){if(typeof a.getElementsByClassName!==aq&&!c){return a.getElementsByClassName(b[1])}}}[0,0].sort(function(){aN=false;return 0});var aE,aT;if(aL.compareDocumentPosition){aE=function(a,b){if(a===b){aI=true;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition){return a.compareDocumentPosition?-1:1}return a.compareDocumentPosition(b)&4?-1:1}}else{aE=function(f,g){if(f===g){aI=true;return 0}else{if(f.sourceIndex&&g.sourceIndex){return f.sourceIndex-g.sourceIndex}}var i,c,b=[],d=[],j=f.parentNode,h=g.parentNode,e=j;if(j===h){return aT(f,g)}else{if(!j){return -1}else{if(!h){return 1}}}while(e){b.unshift(e);e=e.parentNode}e=h;while(e){d.unshift(e);e=e.parentNode}i=b.length;c=d.length;for(var a=0;a<i&&a<c;a++){if(b[a]!==d[a]){return aT(b[a],d[a])}}return a===i?aT(f,d[a],-1):aT(b[a],g,1)};aT=function(c,d,b){if(c===d){return b}var a=c.nextSibling;while(a){if(a===d){return -1}a=a.nextSibling}return 1}}var aG=ac.uniqueSort=function(a){if(aE){aI=aN;a.sort(aE);if(aI){for(var b=1;b<a.length;b++){if(a[b]===a[b-1]){a.splice(b--,1)}}}}return a};ab.Sizzle=ac})(window);if(!document.querySelectorAll){document.querySelectorAll=function(a){return new Sizzle(a,this)}}if(!document.querySelector){document.querySelector=function(a){return(document.querySelectorAll.call(this,a)[0]||null)}}if(!document.getElementsByClassName){document.getElementsByClassName=function(a){var b;b=String(b).replace(/^|\s+/g,".");return document.querySelectorAll(b)}}(function(b,c){var a=(function(){var l=function(m){m=m||{}},g={},i,j={},h=b.XMLHttpRequest,k=b.localStorage;g.start=function(m){m=m||{};if(h===c){h=function(){try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(p){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(o){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(n){}throw new Error("This browser does not support XMLHttpRequest.")};h.UNSENT=0;h.OPENED=1;h.HEADERS_RECEIVED=2;h.LOADING=3;h.DONE=4}if(k===c){k=function(){this.setItem=function(p,q){n(p,q,3000)};this.getItem=function(p){return(o(p))};var n=function(r,s,t){var q,p="";if(t){q=new Date();q.setTime(q.getTime()+(t*24*60*60*1000));p="; expires="+q.toGMTString()}document.cookie=r+"="+s+p+"; path=/"};var o=function(r){var p="",t=r+"=",q=document.cookie.split(";"),s,u;for(s=0;s<q.length;s++){u=q[s];while(u.charAt(0)===" "){u=u.substring(1,u.length)}p=u.indexOf(t)===0?u.substring(t.length,u.length):""}return(p)}}}if(typeof(Element)!=="undefined"){if(!Element.hasClass){Element.prototype.hasClass=function(n){return new RegExp("(^| )"+n+"( |$)","g").test(this.className)}}if(!Element.addClass){Element.prototype.addClass=function(o){o=o.split(" ");for(var n=0;n<o.length;n++){if(!this.hasClass(o[n])){this.className=this.className!==""?(this.className+" "+o[n]):o[n]}}return this}}if(!Element.removeClass){Element.prototype.removeClass=function(o){o=o.split(" ");for(var n=0;n<o.length;n++){this.className=this.className.replace(new RegExp("\\b"+o[n]+"\\b( )?","g"),"")}return this}}if(!Element.toggleClass){Element.prototype.toggleClass=function(n){return !this.hasClass(n)?this.addClass(n):this.removeClass(n)}}}return a};function e(o,p,n){var m=document.createElement(o);Object.keys(p).forEach(function(q){m[q]=p[q]});m.onload=m.onreadystatechange=n;document.getElementsByTagName("body")[0].appendChild(m);return m}function d(n){var p=n,o=n.lastIndexOf("/")+1,m=n.lastIndexOf(".");p=n.substring(o,m).replace(/\W/,"_");return p}function f(m){return(/\.([^\.]+)$/.exec(m)[1].toLowerCase())}g.load=function(m){var n=f(m),o;if(m in j){log.log(m,"in cache");return j[m]}else{log.log(m,"NOT in cache");switch(n){case"js":o=this.js(m);break;case"css":o=this.css(m);break;case"html":o=this.tmpl(m);break;case"tmpl":o=this.tmpl(m);break;default:o=this.html(m);break}}j[m]=o;o.then(function(q,p){if(!q){log.warn("loaded",m)}});return o};g.js=function(n){var o=new Promise(),q=d(n),m=e("SCRIPT",{defer:true,async:true,src:n,id:q},function(){if(!(this.readyState&&this.readyState!=="complete"&&this.readyState!=="loaded")){o.done(null,n+" loaded")}});return o};g.css=function(n){var o=new Promise(),q=d(n);var m=e("LINK",{rel:"stylesheet",href:n,type:"text/css",media:"all",id:q},function(){});o.done(null,n+" loaded");return o};g.html=function(m){var n=new Promise(),o=a.createId(m);ajax.get(m).then(function(q,p){if(q){n.done(q,p)}else{document.body.innerHTML=p+document.body.innerHTML;n.done(null,m+" loaded")}});return n};g.tmpl=function(m){var n=new Promise(),o=d(m)+"-template";log.log(m," loading");this.ajax.get(m).then(function(r,q){log.log(m," response",r,q);if(r){n.done(r,q)}else{var p=e("SCRIPT",{type:"text/html",src:m,id:o},function(){log.log(m," ",this.readyState)});p.text=q;(function(){n.done(null,m+" loaded");log.log(m," loaded?")})()}});return n};g.ajax={_encode:function(o){var m="";if(typeof o==="string"){m=o}else{var p=encodeURIComponent;for(var n in o){if(o.hasOwnProperty(n)){m+="&"+p(n)+"="+p(o[n])}}}return m},_ajax:function(m,n,s,q){var o=new Promise(),w,v;try{s=s||{};q=q||{};try{w=new h()}catch(u){o.done(-1,"could not instantiate XMLHttpRequest");return o}v=this._encode(s);if(m==="GET"&&v){n+="?"+v;v=null}w.open(m,n);w.setRequestHeader("Content-type","application/x-www-form-urlencoded");for(var t in q){if(q.hasOwnProperty(t)){w.setRequestHeader(t,q[t])}}w.onreadystatechange=function(){if(w.readyState==4){if(w.status===200){o.done(null,w.responseText)}else{o.done(w.status,w.statusText)}}};w.send(v)}catch(r){alert(r)}return o},request:function(p,m,n,o){return this._ajax(p,m,n,o)},get:function(m,n,o){return this._ajax("GET",m,n,o)},post:function(m,n,o){return this._ajax("POST",m,n,o)},put:function(m,n,o){return this._ajax("PUT",m,n,o)},del:function(m,n,o){return this._ajax("DELETE",m,n,o)}};return g}());b.Loader=a.start()})(this);function Promise(){this.callbacks=[]}(function(a){function b(d,c){return function(){return d.apply(c,arguments)}}Promise.prototype.then=function(e,c){var d=b(e,c);if(this.complete){d(this.error,this.result)}else{this.callbacks.push(d)}};Promise.prototype.done=function(d,c){this.complete=true;this.error=d;this.result=c;for(var e=0;e<this.callbacks.length;e++){this.callbacks[e](d,c)}this.callbacks=[]};Promise.join=function(e){var h=e.length;var f=0;var j=new Promise();var k=[];var d=[];function g(l){return function(m,i){f+=1;k[l]=m;d[l]=i;if(f===h){j.done(k,d)}}}for(var c=0;c<h;c++){e[c]().then(g(c))}return j};Promise.chain=function(e,d,c){var f=new Promise();if(e.length===0){f.done(d,c)}else{e[0](d,c).then(function(g,h){e.splice(0,1);Promise.chain(e,g,h).then(function(i,j){f.done(i,j)})})}return f};a.Promise=Promise})(this);if(!Object.keys){Object.keys=function(f){if(f!==Object(f)){throw new TypeError("Object.keys called on non-object")}var e=[],d;for(d in f){if(Object.prototype.hasOwnProperty.call(f,d)){e.push(d)}}return e}}if(!Object.toArray){Object.toArray=function(c){var a=[],b;for(b=0;b<c.length;b+=1){a.push(c[b])}return a}}if(!Array.isArray){Array.isArray=function isArray(a){return(a&&typeof(a)==="object"&&"length" in a)}}if(!Array.prototype.indexOf){Array.prototype.indexOf=function indexOf(b){var a=this,d=a.length>>>0;if(!d){return -1}var c=0;if(arguments.length>1){c=toInteger(arguments[1])}c=c>=0?c:Math.max(0,d+c);for(;c<d;c++){if(c in a&&a[c]===b){return c}}return -1}}if(!Array.prototype.forEach){Array.prototype.forEach=function forEach(g){var f=this,i=arguments[1],j=-1,h=f.length>>>0;if(typeof(g)==="undefined"){throw new TypeError()}while(++j<h){if(j in f){g.call(i,f[j],j,f)}}}}if(!Array.prototype.reduce2||!Array.prototype.reduce){Array.prototype.reduce=Array.prototype.reduce2=function reduce(b){var c=this,e=c.length>>>0;if(!b){throw new TypeError(b+" is not a function")}if(!e&&arguments.length==1){throw new TypeError("reduce of empty array with no initial value")}var d=0;var a;if(arguments.length>=2){a=arguments[1]}else{do{if(d in c){a=c[d++];break}if(++d>=e){throw new TypeError("reduce of empty array with no initial value")}}while(true)}for(;d<e;d++){if(d in c){a=b.call(void 0,a,c[d],d,c)}}return a}}var Emitter=function(){};(function(a){Emitter.prototype.bind=function(g,f){var e=this.events=this.events||{},h=g.split(/\s+/),d=0,c=h.length,b;for(;d<c;d++){e[(b=h[d])]=e[b]||[];e[b].push(f)}};Emitter.prototype.one=function(c,b){this.bind(c,function d(){b.apply(this,Object.toArray(arguments));this.unbind(c,d)})};Emitter.prototype.unbind=function(f,e){var d=this.events,b,c,g;if(!d){return}g=f.split(/\s+/);for(c=0,num=g.length;c<num;c++){if((b=g[c]) in d!==false){d[b].splice(d[b].indexOf(e),1)}}};Emitter.prototype.trigger=function(e){var d=this.events,c,b;if(!d||e in d===false){return}b=Object.toArray(arguments,1);for(c=d[e].length-1;c>=0;c--){d[e][c].apply(this,b)}};Emitter.mixin=function(b){var d=["bind","one","unbind","trigger"];for(var c=0;c<d.length;c++){b[d[c]]=Emitter.prototype[d[c]]}}})(this);(function(g){var h,f=g.document,e=false,b=false,a=[];function d(i){i=i||g.event;if(i&&i.type&&(/DOMContentLoaded|load/).test(i.type)){c()}else{if(f.readyState){if((/loaded|complete/).test(f.readyState)){c()}else{if(f.documentElement.doScroll){try{e||f.documentElement.doScroll("left")}catch(i){return}c()}}}}}function c(){if(!e){e=true;for(var k=0,j=a.length;k<j;k++){a[k][0].call(a[k][1])}if(f.removeEventListener){f.removeEventListener("DOMContentLoaded",d,false)}clearInterval(h);f.onreadystatechange=g.onload=h=null}}g.onDOMReady=function(j,i){i=i||g;if(e){j.call(i);return}if(!b){b=true;if(f.addEventListener){f.addEventListener("DOMContentLoaded",d,false)}h=setInterval(d,5);f.onreadystatechange=g.onload=d}a.push([j,i])}})(this);window.log=(function createLogger(e){var f=/(dmt|cnn)debug\b/i,g=(f.test(location.search)||f.test(document.cookie)),c="log error warn info debug assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" "),b=window.console,d=c.length;while(--d>=0){var a=c[d];e[a]=function(){g&&b&&b[a]&&b[a](Object.toArray(arguments).join(" "))}}return e}(window.log||{}));var loadWidget=function(h,f,g,e){var a=document.querySelectorAll(".cnn_widget[type='"+h+"'][version='"+f+"']");var j=((a&&a.length>0)?a[0].getAttribute("templates"):"template"),d=j.split(/\s*,\s*/),b=baseURI+"/"+h+"/"+f,c=g;if(j.length>0){c=d.reduce2(function(k,m,l,n){k.push(b+"/templates/"+m+".css");k.push(b+"/templates/"+m+".html");return k},c)}if(a&&a.length>0){var i=c.reduce2(function(k,m,l,n){k.push(function(p,o){return Loader.load(m)});return k},[]);Promise.chain(i).then(function(l,k){for(var m=0,n=a.length;m<n;m++){(function(o){(e)&&e(o)})(a[m])}})}};var baseURI=window.cnnWidgetBaseURI||"/.element/widget";function initialize(e){var d=Object.toArray(document.querySelectorAll(".cnn_widget")),c=[];("JSON" in window)||(c.push(e+"/json2.js"));var b=d.reduce2(function(f,l,i,m){var j=l.getAttribute("type"),g=l.getAttribute("version"),h=e+"/"+j+"/"+g,k=h+"/main.js";if(j!==null&&g!==null&&h!==e&&f.indexOf(k)===-1){f.push(k)}return f},c);var a=b.reduce2(function(f,h,g,i){f.push(function(k,j){return Loader.load(h)});return f},[]);Promise.chain(a).then(function(g,f){log.info("all scripts loaded.",g,f)})}onDOMReady(function(){initialize(baseURI)});