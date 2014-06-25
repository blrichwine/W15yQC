"use strict";
var isIntRegex = /^\d+$/;
var hasContentRegex = /\S/;
var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var javaScriptRegex = /javascript/i;
var phoneRegex = /^[\s\dxX\(\)-]+$/;
var fourDigitsRegex = /\d{4,4}/;
var headingRegex = /^h\d$/i;
var divRegex = /^div$/i;
var sqlDateRegex = /^\d\d\d\d-\d+-\d+$/;
var userIDRegex = /^[\w\d_]{1,8}$/;
var userIDNumberRegex = /^\d{10,10}$/;

var affiliations=[{"code":"IPFW","text":"IPFW - IU Fort Wayne"}, {"code":"IUB","text":"IU Bloomington"}, {"code":"IUE","text":"IU East"}, {"code":"IUK","text":"IU Kokomo"}, {"code":"IUN","text":"IU Northwest"}, {"code":"IUPUI","text":"IUPUI - Indianapolis"}, {"code":"IUS","text":"IUS - IU Southeast"}, {"code":"IUSB","text":"IUSB - IU South Bend"}, {"code":"Non-IU","text":"Non-IU"}, {"code":"Unknown","text":"Unknown"}];
var telephoneTypes=['','Cell','Home','Work','Permanent'];
function stringHasContent(s) {
  return (s!=null && s.length && s.length>0 && hasContentRegex.test(s));
}

function cleanSpaces(str, bKeepNewLines) {
  if (str && str.replace) {
	if (bKeepNewLines) {
	  str = trim(str.replace(/[ \t]+/g, ' '));
	} else {
	  str = trim(str.replace(/\s+/g, ' '));
	}
  }
  return str;
}

function trim(str) {
  if(str != null && str.replace) { return str.replace(/^\s*|\s*$/g, ''); }
  return str;
}

function simpleText(str) {
	if(stringHasContent(str)) {
		str=str.replace(/>/g,')');
		str=str.replace(/</g,'(');
		str=str.replace(/`/g,"'");
		str=str.replace(/’/g,"'");
		str=str.replace(/“/g,'"');
		str=str.replace(/”/g,'"');
		str=str.replace(/—/g,'-');
		str=str.replace(/javascript/gi,'java_script');
		str=str.replace(/\bon(\w+\s*)=/gi,'on $1=');
		str=cleanSpaces(str.replace(/[^\w\s\(\)\-\/:;\,\.\!\*\~\@\#\$\%\^\&\=\+\[\]\{\}\?"']/g,'_'));
	} else {
		str='';
	}
	return str;
}

function join(s1, s2, sSeparator) {
  if (s1 == null) { return s2; }
  if (s2 == null) { return s1; }
  if (sSeparator == null) { sSeparator = ' '; }
  s1 = cleanSpaces(s1, true);
  s2 = cleanSpaces(s2, true);
  if (s1 == '') { return s2; }
  if (s2 == '') { return s1; }
  return s1 + sSeparator + s2;
}

function stringNotIn(s,a) {
	var i;
	if(s!=null) {
		if(a!=null && a.hasOwnProperty('length')) {
			for(i=0;i<a.length;i++) {
				if(a[i]===s) {
					return false;
				}
			}
		}
	}
	return true;
}

function isInt(value) {
  if(isIntRegex.test(value) && (parseFloat(value) == parseInt(value)) && !isNaN(value)){
      return true;
  }
  return false;
}

function isValidUserID(sUserID) {
    return userIDRegex.test(sUserID) && !javaScriptRegex.test(sUserID);
} 

function isValidUserIDNumber(sUserIDNumber) { 
    return userIDNumberRegex.test(sUserIDNumber) && !javaScriptRegex.test(sUserID);
} 

function isValidEmailAddress(sEmail) { 
    return emailRegex.test(sEmail) && !javaScriptRegex.test(sEmail);
} 

function isValidPhoneNumber(sPN) {
    return phoneRegex.test(sPN) && !javaScriptRegex.test(sPN) && fourDigitsRegex.test(sPN);
} 

function htmlDecode(s){
	var c,m,d = s,arr;
	
	if(stringHasContent(s)) {
		d=d.replace(/<BR>/ig,"\n");
		d=d.replace(/&lt;/ig,'<');
		d=d.replace(/&gt;/ig,'>');
		d=d.replace(/&quot;/ig,'"');
		d=d.replace(/&amp;/ig,'&');
		d=d.replace(/&nbsp;/ig,' ');		
		// look for numerical entities &#34;
		arr=d.match(/&#[0-9]{1,5};/g);
		
		// if no matches found in string then skip
		if(arr!=null){
			for(var x=0;x<arr.length;x++){
				m = arr[x];
				c = m.substring(2,m.length-1); //get numeric part which is reference to unicode character
				// if its a valid number we can decode
				if(c >= -32768 && c <= 65535){
					// decode every single match within string
					d = d.replace(m, String.fromCharCode(c));
				}else{
					d = d.replace(m, ""); //invalid so replace with nada
				}
			}			
		}
	}
	return d;
}
function renderTextWithLinks(sT) {
	var df=document.createDocumentFragment(), a, i, el;
	if(sT!=null) {
		a=sT.split(/\s/);
		for(i=0;i<a.length;i++) {
			if(i>0) {
				df.appendChild(document.createTextNode(' '));
			}
			if(javaScriptRegex.test(a[i])==false && /((ftp|https?):\/\/(www\.)?([-a-zA-Z0-9]{1,63}\.)+[a-zA-Z]{2,6}(:\d+)?(\/[-a-zA-Z0-9@%_\+\.~#?&//=]*)?|(www\.)?([-a-zA-Z0-9]{1,63}\.)+(edu|com|net|org|[a-zA-Z]{2,6}(:\d+)?\/)[-a-zA-Z0-9@%_\+\.~#?&//=]*)/.test(a[i])) {
				el=document.createElement('a');
				if(/^[a-zA-Z]+:\/\//.test(a[i])) {
					el.setAttribute('href',a[i]);
				} else {
					el.setAttribute('href','http://'+a[i]);
				}
				el.setAttribute('target','_blank');
				el.appendChild(document.createTextNode(a[i]));
				df.appendChild(el);
			} else {
				df.appendChild(document.createTextNode(a[i]));
			}
		}
	}
	return df;
}

function renderMarkDown(sMD) {
	var df=document.createDocumentFragment(), a, len, stack, i, j, balance, el, el2, lines;
	
	if(stringHasContent(sMD)) {
		stack=[df];
		len=1;
		a=sMD.split(/(\{\{|\}\}|\*{1,3})/);
		for(i=0;i<a.length;i++) {
			if(a[i]==='{{') {
				balance=1;
				for(j=i+1;j<a.length;j++) {
					if(a[j]==='{{') {
						balance++;
					} else if(a[j]==='}}') {
						balance--;
					}
					if(balance==0) {
						el=document.createElement('span');
						el.setAttribute('class','highlightYellow');
						stack[len-1].appendChild(el);
						stack.push(el);
						len++;
						break;
					}
				}
				if(balance!==0) {
					stack[len-1].appendChild(document.createTextNode('{{'));
				}
			} else if(a[i]==='}}') {
				balance=1;
				for(j=i-1;j>=0;j--) {
					if(a[j]==='}}') {
						balance++;
					} else if(a[j]==='{{') {
						balance--;
					}
					if(balance==0) {
						if(len>0) {
							stack.pop();
							len--;
						}
						break;
					}
				}
				if(balance!==0) {
					stack[len-1].appendChild(document.createTextNode('}}'));
				}
			} else if(a[i]=='***') {
				if(i+1<a.length && a[i+1]=='***') {
					stack[len-1].appendChild(document.createTextNode('******'));
					i++;
				} else if(i+2<a.length && (/^(\{\{|\}\})$/.test(a[i+1])==false) && a[i+2]=='***' && /^\S.*\S/.test(a[i+1])) {
					el=document.createElement('strong');
					lines=htmlDecode(a[i+1]).split("\n");
					for(j=0;j<lines.length;j++) {
						if(j>0) {
							el.appendChild(document.createElement('br'));
						}
						el.appendChild(document.createTextNode(lines[j]));
					}
					el2=document.createElement('em');
					el2.appendChild(el);
					stack[len-1].appendChild(el2);
					i=i+2;
				} else {
					stack[len-1].appendChild(document.createTextNode('***'));
				}
			} else if(a[i]=='**') {
				if(i+1<a.length && a[i+1]=='**') {
					stack[len-1].appendChild(document.createTextNode('****'));
					i++;
				} else if(i+2<a.length && (/^(\{\{|\}\})$/.test(a[i+1])==false) && a[i+2]=='**' && /^\S.*\S/.test(a[i+1])) {
					el=document.createElement('strong');
					lines=htmlDecode(a[i+1]).split("\n");
					for(j=0;j<lines.length;j++) {
						if(j>0) {
							el.appendChild(document.createElement('br'));
						}
						el.appendChild(document.createTextNode(lines[j]));
					}
					stack[len-1].appendChild(el);
					i=i+2;
				} else {
					stack[len-1].appendChild(document.createTextNode('**'));
				}
			} else if(a[i]=='*') {
				if(i+1<a.length && a[i+1]=='*') {
					stack[len-1].appendChild(document.createTextNode('**'));
					i++;
				} else if(i+2<a.length && (/^(\{\{|\}\})$/.test(a[i+1])==false) && a[i+2]=='*' && /^\S.*\S/.test(a[i+1])) {
					el=document.createElement('em');
					lines=htmlDecode(a[i+1]).split("\n");
					for(j=0;j<lines.length;j++) {
						if(j>0) {
							el.appendChild(document.createElement('br'));
						}
						el.appendChild(document.createTextNode(lines[j]));
					}
					stack[len-1].appendChild(el);
					i=i+2;
				} else {
					stack[len-1].appendChild(document.createTextNode('*'));
				}
			} else {
				lines=htmlDecode(a[i]).split("\n");
				for(j=0;j<lines.length;j++) {
					if(j>0) {
						stack[len-1].appendChild(document.createElement('br'));
					}
					stack[len-1].appendChild(renderTextWithLinks(lines[j]));
				}
			}
		}
	}
	
	return df;
}

function formatDateOnly(dateStr) {
  
  if(dateStr!=null) { dateStr = dateStr.replace(/\s*\d+:\d+:\d+(:\d+)*\s*/,''); }
  return dateStr;
}

function formatNormalDateOnly(dateStr) {
	if(stringHasContent(dateStr)) {
		dateStr = trim(dateStr.replace(/\d+:\d+:\d+(:\d+)*/,''));
		if(sqlDateRegex.test(dateStr)) {
			dateStr=dateStr.replace(/(\d+)-(\d+)-(\d+)/,'$2/$3/$1');
		}
	}
	return dateStr;
}

function formatSQLBoolAsYesNo(boolStr) {
  
  if(boolStr!=null) { 
   if(boolStr == '1' || boolStr>0) {
     boolStr="Yes";
   } else {
     boolStr="No";
   }
  }
  return boolStr;
}

function formatFullName(fn,mn,ln) {
  return trim(fn+' '+mn+' '+ln);
}

function formatFormalFullName(fn,mn,ln) {
  return join(ln,trim(fn+' '+mn),', ');
}

function formatFullPhoneNumber(p) {
  if(p!=null) {
	p=p.replace(/\D/g,'');
	p=p.replace(/^(\d\d\d)(\d\d\d)(\d\d\d\d)$/,"($1) $2-$3");
	p=p.replace(/^(\d)(\d\d\d\d)$/,"$1-$2");
  }
  return trim(p); // TODO: Complete this!
}

function makeMailToLink(sEmailAddress) {
	var a=null;
	if(isValidEmailAddress(sEmailAddress)) {
		a=document.createElement('a');
		a.setAttribute('href','mailto://'+sEmailAddress);
		a.appendChild(document.createTextNode(sEmailAddress));
	}
	return a;
}

function makeTelLink(sPN) {
	var a=null;
	if(isValidPhoneNumber(sPN)) {
		a=document.createElement('a');
		a.setAttribute('href','tel://'+sPN);
		a.appendChild(document.createTextNode(formatFullPhoneNumber(sPN)));
	}
	return a;
}

function getQueryObj() { // Usage: var myParamValue = queryObj()["myParamKey"];
    var result = {}, 
		queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return result;
}

function hideElementById(sID) {
	return hideElement(document.getElementById(sID));
}

function hideElement(el) {
	if(el!=null) {
		el.setAttribute('aria-hidden','true');
		el.setAttribute('hidden','true');
		el.style.display='none';
		el.style.visibility='hidden';
	}
	return el;
}

function displayElementById(sID) {
	return displayElement(document.getElementById(sID));
}

function displayElement(el) {
	if(el!=null) {
		el.setAttribute('aria-hidden','false');
		el.removeAttribute('hidden');
		el.style.display='';
		el.style.visibility='visible';
		return el;
	}
	return null;
}
 
function removeElementById(sID) {
  var el=document.getElementById(sID);
  if(el!==null && el.parentNode) {
    el.parentNode.removeChild(el);
  }
}  
function deleteAllChildren(el) {
  if(el!=null) { el.innerHTML=''; }
}

function setFocusToElementById(sID) {
	setFocusToElement(document.getElementById(sID));
}

function setFocusToElement(el) {
	if(el !==null) {
		if(divRegex.test(el.nodeName) && headingRegex.test(el.firstElementChild.nodeName)) {
			el=el.firstElementChild;
		}
		if(el.hasAttribute && el.hasAttribute('tabindex')==false) {
			el.setAttribute('tabindex','0');
		}
		el.focus();
	}
}

function getLabelForEl(el) {
	var labels,i,id;
	if(el!==null && el.hasAttribute('id')) {
		labels=document.getElementsByTagName('label');
		id=el.getAttribute('id');
		for (i = 0; i < labels.length; i++) { 
			if(labels[i].getAttribute('for')==id) { return labels[i]; }
		}
	}
	return null;
}

function returnEl(sID) {
	return document.getElementById(sID);
}

function getValue(sID) {
	var el=document.getElementById(sID), tn, elType;
	if(el!==null && el.tagName) {
		tn=el.tagName.toLowerCase();
		if(tn=='input') {
			elType=el.getAttribute('type');
			if(stringHasContent(elType)==false) {
				elType='text';
			} else {
				elType=elType.toLowerCase();
			}
			switch(elType) {
				case 'checkbox':
				case 'radio':
					return el.checked==true?'1':'0';
					break;
				default:
					return (el!=null && el.value)?el.value:'';
			}
		} else if(tn=='select') {
			return stringHasContent(el.value)==true?el.value:'';
		}
	}
	return (el!=null && el.value)?el.value:'';
}

function enableAndSetRequired(sID,bEnabled,bRequired,bBlankOnDisabled,bHideOnDisabled) {
	var el=document.getElementById(sID), elLabel=getLabelForEl(el);
	if(el!==null) {
		if(bEnabled==true) {
			el.disabled=false;
			el.readOnly=false;
			displayElement(el);
			displayElement(elLabel);
		} else {
			el.disabled=true;
			el.readOnly=true;
			if(bHideOnDisabled==true) {
				hideElement(el);
				hideElement(elLabel);
			}
		}
		if(bBlankOnDisabled==true && bEnabled==false) {
			el.value='';
		}
		if(bRequired==true && bEnabled==true) {
			el.setAttribute('required','true');
			el.setAttribute('aria-required','true');
		} else {
			el.removeAttribute('required');
			el.setAttribute('aria-required','false');
		}
	}
}

function createTableWithHeaders(headers) {
    var table=null, tr, th, thead, i;
	if(headers!=null && headers.length && headers.length>0) {
	  table=document.createElement('TABLE');
	  thead=document.createElement('THEAD');
	  table.appendChild(thead);
	  tr=document.createElement('TR');
	  for(i=0;i<headers.length;i++) {
	    th=document.createElement('TH');
		th.setAttribute('scope','col');
		th.appendChild(document.createTextNode(headers[i]));
		tr.appendChild(th);
	  }
	  thead.appendChild(tr);
	}
	return table;
  }
  
function createLink(href,title,childText,classStr) {
  var a=document.createElement('A');
  if(href!=null) { a.setAttribute('href',href); }
  if(title!=null) { a.setAttribute('title',title); }
  a.appendChild(document.createTextNode(childText));
  if(classStr!=null) { a.setAttribute('class',classStr); }
  
  return a;
}  

function formData(sID, sName) {
	if(stringHasContent(sName)==false) {
		sName=sID;
	}
	return sName+'='+encodeURIComponent(simpleText(getValue(sID)));
}

  function getNewRequestObject() { 
    var requestObject=null;
	if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      requestObject = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
      try {
        requestObject = new ActiveXObject("Msxml2.XMLHTTP");
      } 
      catch (e) {
        try {
          requestObject = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        catch (e) {}
      }
    }

    if (!requestObject) {
      alert('Giving up :( Cannot create an XMLHTTP instance');
      return null;
    }
	return requestObject;
  }

function makeSectionCollapsibleById(sID) {
	makeSectionCollapsibleByElement(document.getElementById(sID));
}

function toggleSectionDisplay(sID,headingEl) {
	var el=document.getElementById(sID);
	if(el!=null && headingEl!=null) {
		if(el.getAttribute('aria-hidden')=='true') {
			displayElement(el);
			headingEl.setAttribute('aria-label',headingEl.textContent+'. Click to hide.');
			headingEl.setAttribute('aria-expanded','true');
			headingEl.setAttribute('onmouseup','blur()');
		} else {
			hideElement(el);
			headingEl.setAttribute('aria-label',headingEl.textContent+'. Click to reveal.');
			headingEl.setAttribute('aria-expanded','false');
			headingEl.setAttribute('onmouseup','blur()');
		}
	}
}

function clearAllNotifications() {
	var l=(document.getElementById('notifications')).getElementsByTagName('ul')[0];
	l.innerHTML='';
	hideElementById('notificationsBorder');
}
 
function closeNotification(callingEl) {
	var l=document.getElementById('notificationsList');
	l.removeChild(callingEl.parentElement);
	if(l.childElementCount<1) { hideElementById('notificationsBorder'); }
}
 
function addNotification(sNotification)
{
	var b=document.getElementById('notificationsBorder'), n=document.getElementById('notifications'), l, li, a, span;
	if(stringHasContent(sNotification) && n!=null) {
		l=n.getElementsByTagName('ul')[0];
		if(b.getAttribute('aria-hidden')=='true') {
			displayElement(b);
		}
		li=document.createElement('li');
		span=document.createElement('span');
		span.appendChild(document.createTextNode(sNotification));
		li.appendChild(span);
		a=document.createElement('a');
		a.appendChild(document.createTextNode('Close'));
		a.setAttribute('aria-label','Close Preceeding Notification');
		a.setAttribute('onclick','closeNotification(this);');
		li.appendChild(a);
		l.appendChild(li);
	}
}

function logError(sMsg) {
	try {
		document.body.appendChild(document.createComment(sMsg));
	} catch(ex) {};
}

