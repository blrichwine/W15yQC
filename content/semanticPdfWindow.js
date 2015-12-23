/*
   This file is part of W15y Quick Check
   Copyright (C) 2011, 2012, 2013, 2014, 2015 Brian L. Richwine

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 * File:        removeStylesWindow.js
 * Description: Handles displaying the ARIA Landmarks quick check dialog
 * Author:	Brian Richwine
 * Created:	2012.12.10
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2012.12.10 - Created!
 *
 * TODO:
 *    -- need to handle table column and row spans
 *    -- be nice to indicate th scope values if any are present
 *    -- need to handle form controls
 *    -- display language changes
 *    -- document summary at top; same as screen-readers provide
 *    -- collect common list lbl chars and try to translate into correct list types
 *    -- indent content based upon heading levels in screen-reader view
 *    -- in semantic view label heading levels
 *    -- in semantic view label list boundaries
 *
 */
"use strict";

if (typeof blr==='undefined') {
  var blr = {};
}

/*
 * Object:  SemanticPdfWindow
 * Returns:
 */

  var bCmdIsPressed=false,
      aDocumentsList=null,
      aHeadingsList=null,
      bScreenReaderView=false,
      aHeadingsList=null,
      prompts=null,
      rd=null,
      rm=null,
      win=null;

  function init(w) {
    win=w;

    if (w && w.arguments && w.arguments.length) {
      if (w.arguments.length > 2) { bScreenReaderView = w.arguments[2]; }
    }

    rm=(ds!==null)?(ds.RoleMap!==null?ds.RoleMap:null):null;
    rd = document.getElementById("HTMLReportIFrame").contentDocument;
    blr.W15yQC.fnReadUserPrefs();
    run();
  }

  function run() {
    var styleElement;
    try{
      prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
      document.title = 'PDF Semantic View - ' + (ds.title!=null?ds.title:'') + ' - W15yQC';

      styleElement = rd.createElement('style');
      styleElement.innerHTML = "*{font-family:'Open Sans Light',Arial,Helvetica,sans-serif;}a{}button{min-height:20px;min-width:64.72px;cursor:pointer;box-shadow:inset 0 1px 0 0 #bee2f9;background:-moz-linear-gradient(center top,#e8f7ff 5%,#9ec8f2 100%);background-color:#e8f7ff;border-radius:11px;border:2px solid #2f5d99;display:inline-block;color:#14396a;font-size:15px;font-weight:700;padding:1px 8px;text-decoration:none;text-shadow:1px 1px 3px #e9edf2}span.blockSection{margin:3px;padding:3px;border:thin solid black}span.blockSectionType{background-color:#eee;}div.blockSection{margin:5px;padding:3px;border:solid thin black}p.blockSectionType{margin:0px;padding:3px;border:solid thin black;background-color:#eee}}button:hover{background:-moz-linear-gradient(center top,#9ec8f2 5%,#e8f7ff 100%);background-color:#9ec8f2}button:active{position:relative;top:1px}textarea:focus,input:focus,button:focus{box-shadow: 0 0 2px 4px rgba(73, 173, 227, 0.4) !important}textarea, input[type='email'], input[type='password'], input[type='text'] {background: none repeat scroll 0 0 #FFFFFF;border-color: #B2B2B2;border-radius: 3px 3px 3px 3px;border-style: solid;border-width: 1px;box-shadow: 0 1px rgba(255, 255, 255, 0.5)}table{border-collapse:collapse;border:2px solid black}td,th{border:1px solid black}div.rawPdfPageNum{background-color:#ffc;margin:5px 0px 5px 0px;padding-left:5px}";

      styleElement.setAttribute('id', 'W15yQCSemanticPdfWindowStyles');
      rd.head.insertBefore(styleElement, rd.head.firstChild);
      fnBuildSemanticView();
      //blr.W15yQC.SemanticPdfWindow.fnLinearizeTables(rd);
      //blr.W15yQC.SemanticPdfWindow.fnInstallFocusHighlighter();
    }catch(ex){alert(blr.W15yQC.objectToString(ex));}
  }

  function fnBuildSemanticView() {
    var pgNum=-1, prevPg=-8482, lastPgNumDisplayed=-234;

    function getRecursiveText(o) {
      var rText='', oi;
      if (o===null) {
        return '';
      } else if (typeof o.MCID !== 'undefined') {
        rText=o.text;
      } else if (typeof o.ActualText!=='undefined') {
        rText=o.ActualText;
      } else if (typeof o.Alt!=='undefined') {
        rText=o.Alt;
      } else if (o.length || (typeof o.children!='undefined' && o.children.length)) {
        if (typeof o.children!='undefined') {
          o=o.children;
        }
        for(oi=0;oi<o.length;oi++) {
          if (typeof o[oi].MCID !== 'undefined') {
            rText+=o[oi].text;
          } else if (typeof o[oi].ActualText!=='undefined') {
            rText+=o[oi].ActualText;
          } else if (typeof o[oi].Alt!=='undefined') {
            rText+=o[oi].Alt;
          } else if (typeof o[oi].children !== 'undefined') {
            rText+=getRecursiveText(o[oi].children);
          }
        }
      }
      return rText;
    }

    // pass this function a children array, a string of the element type
    function getRecursiveTextFromFirstChildOfType(o,seType,bRecursed) {
      var oi, grText=null;
      if (o===null) {
        return '';
      } else if (typeof o.S!='undefined' && o.S.toLowerCase()==seType.toLowerCase()) {
        return getRecursiveText(o);
      } else if (o.length) {
        for(oi=0;oi<o.length;oi++) {
          if (typeof o[oi].S!='undefined' && o[oi].S.toLowerCase()==seType.toLowerCase()) {
            return getRecursiveText(o[oi]);
          } else if (typeof o[oi].children !== 'undefined') {
            grText=getRecursiveTextFromFirstChildOfType(o[oi].children,seType,true);
            if (grText!==null) {
              return grText;
            }
          }
        }
      }
      return bRecursed ? null : grText;
    }

    function renderDocStructureLevel(o,el,sPath,bRecursive) {
      var oi,ol,oli,k,s,keys=['T','Lang','Alt','E','ActualText'],
          div, newEl=null, p, bInLabeledBlock=false,bDontDig=false, childText, bAllowActualText=true, bAllowAlt=true;
      if (sPath==='null') {
        sPath='';
      }
      if (o!=null && o.length) {
        for(oi=0;oi<o.length;oi++) {
          if (typeof o[oi].S!=='undefined' && o[oi].S!==null) {
            s=ds.rm.hasOwnProperty(o[oi].S)?ds.rm[o[oi].S]:o[oi].S;
            if (s!==null && s.toLowerCase) {
              s=s.toLowerCase();
            }

            if (o[oi].Pg!=null && typeof o[oi].Pg.num!='undefined' && typeof o[oi].Pg.gen!='undefined') {
              pgNum=ds.pageIndexByRef[o[oi].Pg.num][o[oi].Pg.gen]+1;
            } else if (/^(art|div|form|part|sect)$/i.test(s) && o[oi].children!=null && o[oi].children.length>0 &&
                       typeof o[oi].children[0].Pg!='undefined' && typeof o[oi].children[0].Pg.gen!='undefined') {
              pgNum=ds.pageIndexByRef[o[oi].children[0].Pg.num][o[oi].children[0].Pg.gen]+1;
            }
            if (pgNum!=prevPg && /\b(l|table|thead|tbody|tr)$/.test(sPath)==false) {
              if(prevPg>0) {
                div=rd.createElement('div');
                div.appendChild(rd.createTextNode('End of Page: '+prevPg));
                div.setAttribute('class','rawPdfPageNum');
                el.appendChild(div);
                lastPgNumDisplayed=prevPg;
              }
              prevPg=pgNum;
            }
            newEl=null;
            bInLabeledBlock=false;
            bDontDig=false;
            bAllowActualText=true;
            bAllowAlt=true;
            switch(s) {
              case 'toci':
              case 'reference':
                newEl=rd.createElement('div'); // Don't announce these
                break;
              case 'document':
              case 'part':
              case 'art':
              case 'sect':
              case 'div':
              case 'toc':
                if (bScreenReaderView) {
                  newEl=rd.createElement('div'); // Don't announce these
                  break;
                }
              case 'blockquote':
              case 'form':
              case 'formula':
              case 'caption': // TODO If caption is in a table, move it ahead of the table...
                newEl=rd.createElement('div');
                newEl.setAttribute('class','blockSection');
                p=rd.createElement('p');
                p.appendChild(rd.createTextNode(s+(typeof o[oi].T!=='undefined' && blr.W15yQC.fnStringHasContent(o[oi].T)?': '+o[oi].T:'')));
                p.setAttribute('class','blockSectionType');
                newEl.appendChild(p);
                bInLabeledBlock=true;
                break;
              case 'figure':
                newEl=rd.createElement('span');
                newEl.setAttribute('class','blockSection');
                p=rd.createElement('span');
                p.appendChild(rd.createTextNode(' '+s+':'));
                p.setAttribute('class','blockSectionType');
                newEl.appendChild(p);
                newEl.appendChild(rd.createTextNode(typeof o[oi].Alt!='undefined'?' "'+o[oi].Alt+'"':''));
                bInLabeledBlock=false;
                bDontDig=true;
                bAllowActualText=false;
                bAllowAlt=false;
                break;
              case 'h1':
                newEl=rd.createElement('h1');
                break;
              case 'h2':
                newEl=rd.createElement('h2');
                break;
              case 'h3':
                newEl=rd.createElement('h3');
                break;
              case 'h4':
                newEl=rd.createElement('h4');
                break;
              case 'h5':
                newEl=rd.createElement('h5');
                break;
              case 'h6':
                newEl=rd.createElement('h6');
                break;
              case 'p':
                newEl=rd.createElement('p');
                break;
              case 'l':
                if (o[oi].children!=null && o[oi].children.length>0) {
                  childText=blr.W15yQC.fnTrim(getRecursiveTextFromFirstChildOfType(o[oi].children,'lbl'));
                  if (/i|v|x/.test(childText)) {
                    newEl=rd.createElement('ol');
                    newEl.setAttribute('type','i');
                  } else if (/I|V|X/.test(childText)) {
                    newEl=rd.createElement('ol');
                    newEl.setAttribute('type','I');
                  } else if (/[a-z]/.test(childText)) {
                    newEl=rd.createElement('ol');
                    newEl.setAttribute('type','a');
                  } else if (/[A-Z]/.test(childText)) {
                    newEl=rd.createElement('ol');
                    newEl.setAttribute('type','A');
                  } else if (/[0-9]/.test(childText)) {
                    newEl=rd.createElement('ol');
                    newEl.setAttribute('type','1');
                  } else {
                    newEl=rd.createElement('ul');
                  }
                } else {
                  newEl=rd.createElement('ul');
                }
                break;
              case 'li':
                newEl=rd.createElement('li');
                break;
              case 'lbl':
                if (el.hasAttribute('type')==false && el.parentNode.hasAttribute('type')==false) {
                  newEl=rd.createElement('span');
                  if (/\w/.test(getRecursiveText(o[oi]))==false) {
                    bDontDig=true;
                  }
                } else {
                  bDontDig=true;
                }
                break;
              case 'lbody':
                bDontDig=false;
                break;
              case 'link':
                newEl=rd.createElement('a');
                newEl.setAttribute('href','#');
                break;
              case 'table':
                newEl=rd.createElement('table');
                break;
              case 'thead':
              case 'tfoot':
              case 'tbody':
                newEl=null; // DONT RENDER Thead or Tfoot or Tbody
                break;
              case 'tr':
                newEl=rd.createElement('tr');
                break;
              case 'th':
                newEl=rd.createElement('th');
                break;
              case 'tr':
                newEl=rd.createElement('tr');
                break;
              case 'td':
                newEl=rd.createElement('td');
                break;
              case 'span':
                newEl=rd.createElement('span');
                break;
              default: // TODO If caption is in a table, move it ahead of the table...
                if (s!='') {
                  newEl=rd.createElement('div');
                  newEl.setAttribute('class','blockSection');
                  p=rd.createElement('p');
                  p.appendChild(rd.createTextNode('DEFAULT: '+s));
                  p.setAttribute('class','blockSectionType');
                  newEl.appendChild(p);
                  bInLabeledBlock=true;
                }
                break;
            }
            if (newEl!=null) {
              el.appendChild(newEl);
              if (pgNum!=prevPg && /^(l|table|thead|tbody|tr)$/.test(s)==false) {
                if(prevPg>0) {
                  div=rd.createElement('div');
                  div.appendChild(rd.createTextNode('End of Page: '+prevPg));
                  div.setAttribute('class','rawPdfPageNum');
                  newEl.insertBefore(div,newEl.firstChild);
                  lastPgNumDisplayed=prevPg;
                }
                prevPg=pgNum;
              }
            }
            if (bAllowActualText && typeof o[oi].ActualText!='undefined') {
              el.appendChild(rd.createTextNode(o[oi].ActualText));
            } else if (bAllowAlt && typeof o[oi].Alt!='undefined') {
              el.appendChild(rd.createTextNode(o[oi].Alt));
            } else if (o[oi].children!=null && o[oi].children.length>0 && !bDontDig) {
              renderDocStructureLevel(o[oi].children,newEl!==null?newEl:el,blr.W15yQC.fnJoin(sPath,s,'|'),true);
            }
            bAllowActualText=true;
            bAllowAlt=true;
            bDontDig=false;
            if (bInLabeledBlock==true) {
              p=rd.createElement('p');
              p.appendChild(rd.createTextNode('EXITING: '+s+(typeof o[oi].T!=='undefined' && blr.W15yQC.fnStringHasContent(o[oi].T)?': '+o[oi].T:'')));
              p.setAttribute('class','blockSectionType');
              newEl.appendChild(p);
              bInLabeledBlock=false;
            }
          } else if (typeof o[oi].MCID!=='undefined') {
            el.appendChild(rd.createTextNode(o[oi].text));
          }
        }
      }
      if(!bRecursive && lastPgNumDisplayed!==pgNum && pgNum!=-1) {
        div=rd.createElement('div');
        div.appendChild(rd.createTextNode('End of Page: '+pgNum));
        div.setAttribute('class','rawPdfPageNum');
        el.appendChild(div);
        lastPgNumDisplayed=pgNum;
      }
    }

    rd.title = 'PDF Semantic View - ' + (ds.title!=null?ds.title:'') + ' - W15yQC';
    renderDocStructureLevel(ds,rd.body);
  }

  function cleanup() {
  }

  function windowOnKeyDown(win, evt) {
    switch (evt.keyCode) {
      case 224:
        bCmdIsPressed = true;
        break;
      case 27:
        win.close();
        break;
      case 87:
        if (bCmdIsPressed == true) win.close();
        break;
    }
  }

  function windowOnKeyUp(evt) {
    switch (evt.keyCode) {
      case 224:
        bCmdIsPressed = false;
        break;
    }
  }

  function fnTagCanHoldText(sTagName) {
    return !(sTagName=='table' || sTagName=='iframe' || sTagName=='tbody' || sTagName=='tfoot' || sTagName=='html' || sTagName=='tr' || sTagName=='ol' || sTagName=='ul');
  }

  function fnElementIsChildOf(childNode, parentNode) {
      if(childNode != null && childNode.parentNode && childNode.parentNode != null && parentNode != null) {
        var node=childNode.parentNode;
        while(node!=null && node !== parentNode) { node=node.parentNode;}
         if (node != null && node===parentNode) {return true;}
      }
      return false;
  }

  function fnInstallFocusHighlighter() {
    var doc=rd, i;

      function w15yqcHighlightElementWithFocus(e) {
        if(e.target && e.target.tagName && e.target.tagName.toLowerCase() !='a') {
            try {
              if (typeof blr.W15yQC.w15yqcPrevElWithFocus != 'undefined' && blr.W15yQC.w15yqcPrevElWithFocus != null && blr.W15yQC.w15yqcPrevElWithFocus.style) {
                blr.W15yQC.w15yqcPrevElWithFocus.style.outline = blr.W15yQC.w15yqcOriginalItemStyle;
              }
            } catch(ex)
            {
            }

            blr.W15yQC.w15yqcPrevElWithFocus = e.target;

              var origNode = blr.W15yQC.w15yqcPrevElWithFocus, box = blr.W15yQC.w15yqcPrevElWithFocus.getBoundingClientRect();
              while(box != null && box.width == 0 && box.height==0 && blr.W15yQC.w15yqcPrevElWithFocus.firstChild && blr.W15yQC.w15yqcPrevElWithFocus.firstChild != null) {
                blr.W15yQC.w15yqcPrevElWithFocus = blr.W15yQC.w15yqcPrevElWithFocus.firstChild;
                if(blr.W15yQC.w15yqcPrevElWithFocus.getBoundingClientRect) {
                  box = blr.W15yQC.w15yqcPrevElWithFocus.getBoundingClientRect();
                }
              }
              if(box == null || box.width == 0 || box.height==0) {
                blr.W15yQC.w15yqcPrevElWithFocus=origNode;
              }

              if (blr.W15yQC.w15yqcPrevElWithFocus != null && blr.W15yQC.w15yqcPrevElWithFocus.style) {
                blr.W15yQC.w15yqcOriginalItemStyle = e.target.ownerDocument.defaultView.getComputedStyle(blr.W15yQC.w15yqcPrevElWithFocus,null).getPropertyValue("outline");
                //w15yqcPrevElWithFocus.style.outline = "solid 2px red";
                blr.W15yQC.w15yqcOriginalItemPosition=e.target.ownerDocument.defaultView.getComputedStyle(blr.W15yQC.w15yqcPrevElWithFocus,null).getPropertyValue("position");
                blr.W15yQC.w15yqcOriginalItemZIndex=e.target.ownerDocument.defaultView.getComputedStyle(blr.W15yQC.w15yqcPrevElWithFocus,null).getPropertyValue("z-index");
                if(blr.W15yQC.w15yqcOriginalItemPosition=="static") {
                  //w15yqcPrevElWithFocus.style.position = "relative";
                }
                //w15yqcPrevElWithFocus.style.zIndex = "199999";
                blr.W15yQC.fnHighlightFormElement(e.target, true);
              }
        }
      }

      function w15yqcRemoveFocusIndication(e) {
        if(e != null && e.target && e.target.ownerDocument) {
          blr.W15yQC.resetHighlightElement(e.target.ownerDocument);
        }
      }

      if (doc!=null && doc.addEventListener) {
        doc.addEventListener( 'focus', w15yqcHighlightElementWithFocus, true);
        doc.addEventListener( 'blur', w15yqcRemoveFocusIndication, true);
        for (i = 0; i < doc.defaultView.frames.length; i++) { // QA this on deeply nested frames
          doc.defaultView.frames[i].document.addEventListener( 'focus', w15yqcHighlightElementWithFocus, true);
          doc.defaultView.frames[i].document.addEventListener( 'blur', w15yqcRemoveFocusIndication, true);
        }
      }
  }

  function fnMoveTableContent(doc,t,el,fc) {
    var div, el2, sTagName;
    if (!fc) {
      fc=null;
    }
    if (el!=null && el.firstChild!=null) {

      for (el=el.firstChild; el != null; el = el==null ? null : el.nextSibling) {
        if (el.tagName!=null && el.tagName.toLowerCase) {
            sTagName=el.tagName.toLowerCase();
        } else {
            sTagName=null;
        }
        // alert('switch:'+sTagName);
        switch (sTagName) {
            case 'thead':
            case 'tbody':
            case 'tfoot':
            case 'tr':
                // alert('recurse');
                fc=fnMoveTableContent(doc,t,el,fc);
                break;
            case 'caption':
            case 'th':
            case 'td':
                // alert('move content');
                if (el.firstChild!=null) {
                    div=doc.createElement('div');
                    if (fc == null) {
                      fc = div;
                    }
                    while (el.firstChild) {
                      div.appendChild(el.firstChild);
                    }
                    t.parentNode.insertBefore(div, t);
                }
                break;
            case 'colgroup':
            case 'col':
                // ignore colgorups
                break;
            default:
                if (el!=null && el.nodeType==3 && blr.W15yQC.fnStringHasContent(el.textContent)) {
                    // alert('move type 3 content');
                    div=doc.createElement('div');
                    if (fc == null) {
                      fc = div;
                    }
                    div.appendChild(el.firstChild);
                    t.parentNode.insertBefore(div, t);
                } else if (el!=null && el.nodeType==1) {
                // alert('move default content:'+el.tagName);
                    el2=el;
                    el=el.nextSibling;
                    div=doc.createElement('div');
                    if (fc == null) {
                      fc = div;
                    }
                    div.appendChild(el2);
                    t.parentNode.insertBefore(div, t);
                }
        }
      }
    }
    return fc;
  }

  function fnLinearizeTables(doc, rootNode) {
    var c, i, j, firstMoved=null, div, frameDocument, pn;
    if (doc != null && doc.body) {
      if (rootNode == null) {
        rootNode = doc.body;
      }
      for (c = rootNode.firstChild; c != null; c = c == null ? null : c.nextSibling) {
        if (c.nodeType == 1) { // TODO: Is this frame checking up-to-date with the one in getElements?
          if (((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) &&
              blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
            frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
            blr.W15yQC.fnLinearizeTables(frameDocument, frameDocument.body);
          } else { // keep looking through current document
            if (c.tagName.toLowerCase() == 'table' && blr.W15yQC.fnNodeIsHidden(c) == false) {
              if (blr.W15yQC.fnAppearsToBeALayoutTable(c) == true) {
                firstMoved = fnMoveTableContent(doc,c,c);
                //alert(c.innerHTML.replace(/\s+/,' '));
                if (firstMoved !== null) {
                  pn=c.parentNode;
                  pn.removeChild(c);
                  if (firstMoved.previousSibling != null) {
                    c = firstMoved.previousSibling;
                  } else if(firstMoved != null) {
                    c = firstMoved;
                  } else {
                    c = pn;
                  }
                }
              }
            }
            fnLinearizeTables(doc, c);
          }
        }
      }
    }
  }

  function fnLinearizeTables_old(doc, rootNode) {
    var c, i, j, firstMoved, div, frameDocument, pn;
    if (doc != null && doc.body) {
      if (rootNode == null) {
        rootNode = doc.body;
      }
      for (c = rootNode.firstChild; c != null; c = c == null ? rootNode.firstChild : c.nextSibling) {
        if (c.nodeType == 1) {
          if (c.nodeType == 1 && c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
            frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
            blr.W15yQC.fnLinearizeTables(frameDocument, frameDocument.body);
          } else { // keep looking through current document
            if (c.hasAttribute && c.tagName && c.tagName.toLowerCase() == 'table' && blr.W15yQC.fnNodeIsHidden(c) == false) {
              if (blr.W15yQC.fnAppearsToBeALayoutTable(c) == true) {



                firstMoved = null;
                if (c.rows && c.rows.length) {
                  for (i = 0; i < c.rows.length; i++) {
                    if (c.rows[i].cells && c.rows[i].cells.length) {
                      for (j = 0; j < c.rows[i].cells.length; j++) {
                        while (c.rows[i].cells[j].firstChild) {
                          div = doc.createElement('div');
                          if (firstMoved == null) {
                            firstMoved = div;
                          }
                          div.appendChild(c.rows[i].cells[j].firstChild);
                          c.parentNode.insertBefore(div, c);
                        }
                      }
                    }
                  }
                }
                //alert(c.innerHTML.replace(/\s+/,' '));
                pn=c.parentNode;
                pn.removeChild(c);

                if (firstMoved != null && firstMoved.previousSibling != null) {
                  c = firstMoved.previousSibling;
                } else if(firstMoved != null) {
                  c = firstMoved;
                } else {
                  c = pn;
                }
              }
            }
            fnLinearizeTables(doc, c);
          }
        }
      }
    }
  }

  function toggleShowSemantics() {
    // Headings
    // Tables
    // Landmarks
    // ARIA Labels
    // Language markup
    if (aDocumentsList == null) {
      aDocumentsList = blr.W15yQC.fnGetDocuments(rd);
      aHeadingsList = blr.W15yQC.fnGetHeadings(rd);
    }
    blr.W15yQC.Highlighters.highlightHeadings(aDocumentsList, aHeadingsList);
    blr.W15yQC.Highlighters.highlightLists(aDocumentsList);
    blr.W15yQC.Highlighters.highlightTables(aDocumentsList);
    blr.W15yQC.Highlighters.highlightBasicElement('blockquote', aDocumentsList);
  }

  function forceMinSize(dialog) {
    if (dialog.outerWidth > 10 && dialog.outerHeight > 10 && (dialog.outerWidth < 940 || dialog.outerHeight < 610)) {
      dialog.resizeTo(Math.max(940, dialog.outerWidth), Math.max(610, dialog.outerHeight));
    }
  }

  function printReport() {
    if (rd != null && rd.documentElement && rd.documentElement.innerHTML && rd.body && rd.body.children && rd.body.children.length && rd.defaultView && rd.defaultView.print) {
      rd.defaultView.print();
    } else {
      if (prompts.alert) prompts.alert(null, "W15yQC Alert", "Nothing to print!");
    }
  }

  function saveHTMLReport() {
    var converter,
    file,
    foStream,
    fp,
    nsIFilePicker,
    rv;

    if (rd != null && rd.documentElement && rd.documentElement.innerHTML && rd.body && rd.body.children && rd.body.children.length) {
      nsIFilePicker = Components.interfaces.nsIFilePicker;

      fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
      fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
      fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterAll);
      rv = fp.show();
      if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {

        file = fp.file;
        if (/\.html?$/.test(file.path) == false) {
          file.initWithPath(file.path + '.html');
        }

        foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
        createInstance(Components.interfaces.nsIFileOutputStream);

        foStream.init(file, 0x2A, 438, 0);
        converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
        converter.init(foStream, "UTF-8", 0, 0);
        converter.writeString('<html>' + rd.documentElement.innerHTML + '</html>');
        converter.close(); // this closes foStream
      }
    } else {
      if (prompts.alert) prompts.alert(null, "W15yQC Alert", "Nothing to save!");
    }
  }
