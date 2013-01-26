/*
   This file is part of W15y Quick Check
   Copyright (C) 2011, 2012  Brian L. Richwine

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
 *      
 *    - Internationalize?
 *    
 * 
 */
if (!blr) {
  var blr = {};
}

/*
 * Object:  RemoveStylesWindow
 * Returns:
 */
blr.W15yQC.RemoveStylesWindow = {
  FirebugO: null,
  bCmdIsPressed: false,
  aDocumentsList: null,
  aHeadingsList: null,
  aFormsList: null,
  aFormControlsList: null,
  prompts: null,
  rd: null,
  srcDoc: null,

  init: function (dialog) {
    var metaElements, i, styleElement, rd, if1;

    blr.W15yQC.fnReadUserPrefs();
    blr.W15yQC.RemoveStylesWindow.FirebugO = dialog.arguments[1];
    blr.W15yQC.RemoveStylesWindow.srcDoc = dialog.arguments[2];
    if1 = document.getElementById("HTMLReportIFrame");
    blr.W15yQC.RemoveStylesWindow.rd = if1.contentDocument;
    rd = blr.W15yQC.RemoveStylesWindow.rd;

    blr.W15yQC.RemoveStylesWindow.prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    metaElements = blr.W15yQC.RemoveStylesWindow.srcDoc.head.getElementsByTagName('meta');
    if (metaElements != null && metaElements.length > 0) {
      for (i = 0; i < metaElements.length; i++) {
        rd.head.appendChild(rd.importNode(metaElements[i], false));
      }
    }
    rd.title = 'Removed Style View - ' + blr.W15yQC.RemoveStylesWindow.srcDoc.title + ' - W15yQC';

    styleElement = rd.createElement('style');
    styleElement.innerHTML = "*{font-family:'Open Sans Light',Arial,Helvetica,sans-serif;}button{min-height:20px;min-width:64.72px;cursor:pointer;box-shadow:inset 0 1px 0 0 #bee2f9;background:-moz-linear-gradient(center top,#e8f7ff 5%,#9ec8f2 100%);background-color:#e8f7ff;border-radius:11px;border:2px solid #2f5d99;display:inline-block;color:#14396a;font-size:15px;font-weight:700;padding:1px 8px;text-decoration:none;text-shadow:1px 1px 3px #e9edf2}button:hover{background:-moz-linear-gradient(center top,#9ec8f2 5%,#e8f7ff 100%);background-color:#9ec8f2}button:active{position:relative;top:1px}textarea:focus,input:focus,button:focus{box-shadow: 0 0 2px 4px rgba(73, 173, 227, 0.4) !important}textarea, input[type='email'], input[type='password'], input[type='text'] {background: none repeat scroll 0 0 #FFFFFF;border-color: #B2B2B2;border-radius: 3px 3px 3px 3px;border-style: solid;border-width: 1px;box-shadow: 0 1px rgba(255, 255, 255, 0.5)}";

    styleElement.setAttribute('id', 'W15yQCRemoveStylesWindowStyles');
    rd.head.insertBefore(styleElement, rd.head.firstChild);
    blr.W15yQC.RemoveStylesWindow.fnBuildRemoveStylesView(rd, rd.body, blr.W15yQC.RemoveStylesWindow.srcDoc);
    blr.W15yQC.RemoveStylesWindow.fnLinearizeTables(rd);
  },

  cleanup: function () {
    blr.W15yQC.RemoveStylesWindow.aDocumentsList = null;
    blr.W15yQC.RemoveStylesWindow.aHeadingsList = null;
    blr.W15yQC.RemoveStylesWindow.aFormsList = null;
    blr.W15yQC.RemoveStylesWindow.aFormControlsList = null;
    blr.W15yQC.RemoveStylesWindow.prompts = null;
    blr.W15yQC.RemoveStylesWindow.rd = null;
    blr.W15yQC.RemoveStylesWindow.srcDoc = null;
  },

  windowOnKeyDown: function (win, evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.RemoveStylesWindow.bCmdIsPressed = true;
        break;
      case 27:
        win.close();
        break;
      case 87:
        if (blr.W15yQC.RemoveStylesWindow.bCmdIsPressed == true) win.close();
        break;
    }
  },

  windowOnKeyUp: function (evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.RemoveStylesWindow.bCmdIsPressed = false;
        break;
    }
  },

  fnBuildRemoveStylesView: function (rd, appendNode, doc, rootNode, oValues) {
    var node, c, frameDocument, div, div2, p, thisFrameNumber, i, bInAriaBlock = false,
      sLabel, sEnteringLabel,
      sExitingLabel, sRole, sTagName, level, bKeepStyle = false,
      box, width, height, borderStyle, bSkipElement = false,
      c2;
    if (oValues == null) {
      oValues = {
        iNumberOfLinks: 0,
        iNumberOfFrames: 0,
        iNumberOfARIALandmarks: 0
      };
    }
    if (doc != null) {
      if (rootNode == null) {
        rootNode = doc.body;
      }
      if (appendNode == null) {
        appendNode = rd.body;
      }
      for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
        bKeepStyle = false;
        bSkipElement = false;
        if (c.nodeType == 1) { //alert(c.nodeType+' '+c.nodeName);
          if (c.nodeType == 1 && c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
            frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
            div = rd.createElement('div');
            div.setAttribute('style', 'border:thin solid black;margin: 3px 2px 3px 0px');
            appendNode.appendChild(div);
            p = rd.createElement('p');
            p.setAttribute('style', 'background-color:#eee;margin:0px;padding:0px');
            oValues.iNumberOfFrames++;
            // TODO: Can frame titles come from aria-labels?
            p.appendChild(rd.createTextNode('Frame(' + oValues.iNumberOfFrames + '): ' + (c.hasAttribute('title') ? 'Title: ' + c.getAttribute('title') : 'Missing Title')));
            thisFrameNumber = oValues.iNumberOfFrames;
            div.appendChild(p);
            div2 = rd.createElement('div');
            div2.setAttribute('style', 'padding:5px');
            div.appendChild(div2);
            blr.W15yQC.RemoveStylesWindow.fnBuildRemoveStylesView(rd, div2, frameDocument, frameDocument.body, oValues);
            p = rd.createElement('p');
            p.setAttribute('style', 'background-color:#eee;margin:0px;padding:0px');
            p.appendChild(rd.createTextNode('Frame(' + thisFrameNumber + ') Ends'));
            div.appendChild(p);
          } else { // keep looking through current document
            if (c.hasAttribute && c.tagName && c.tagName.toLowerCase() !== 'style' && c.tagName.toLowerCase() !== 'script' && blr.W15yQC.fnNodeIsHidden(c) == false) {
              node=null;
              bSkipElement = false;
              sTagName=c.tagName.toLowerCase();
              if (c.hasAttribute('role')) {
                sRole = c.getAttribute('role').toLowerCase();
              } else {
                sRole = '';
              }
            
              if (blr.W15yQC.fnIsARIALandmark(c) || sRole == "menubar" || sRole == "menu" || sRole == "tablist" ||
                        sRole == "tabpanel" || sRole == "toolbar" || sRole == "tree" ||
                        sRole == "treegrid" || sRole == "status" || sRole == "note" ||
                        sRole == "list" || sRole == "listitem" || sRole == "img" || sRole == "grid" || sRole == "document" ||
                        sRole == "directory" || sRole == "dialog" || sRole == "alert" || sRole == "alertdialog") {
                bInAriaBlock = true;  // TODO: Should the landmark role prevent the natural element role?
                if (sRole == "menubar") {
                  sEnteringLabel = blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c), 'menu bar.', ' ') + ' To navigate use the left and right arrow keys.';
                  sExitingLabel = blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c), 'menu bar.', ' ');
                } else if (sRole == "menu") {
                  sEnteringLabel = blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c), 'menu.', ' ') + ' To navigate use the up and down arrow keys.';
                  sExitingLabel = blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c), 'menu.', ' ');
                } else if (blr.W15yQC.fnIsARIALandmark(c)) {
                  sEnteringLabel = blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c), c.getAttribute('role'), ' ') + ' landmark.';
                  sExitingLabel = blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c), c.getAttribute('role'), ' ') + ' landmark.';
                } else {
                  sEnteringLabel = blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c), c.getAttribute('role'), ' ') + '.';
                  sExitingLabel = blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c), c.getAttribute('role'), ' ') + '.';
                }
                div = rd.createElement('div');
                div.setAttribute('style', 'border:thin solid black;margin: 3px 2px 3px 0px');
                appendNode.appendChild(div);
                p = rd.createElement('p');
                p.setAttribute('style', 'background-color:#eee;margin:0px;padding:0px 0px 0px 2px;border-bottom:thin solid #aaa');
                p.appendChild(rd.createTextNode('Entering ARIA ' + sEnteringLabel));
                div.appendChild(p);
                div2 = rd.createElement('div');
                div2.setAttribute('style', 'padding:5px');
                div.appendChild(div2);
                appendNode = div2;
              } else if(blr.W15yQC.fnStringsEffectivelyEqual(sRole, 'presentation') == true && sTagName != 'table') {
                bSkipElement = true;
                node=null;
              } 

            if (bSkipElement==false && c.tagName.toLowerCase() == 'object' || c.tagName.toLowerCase() == 'embed') {
              if ((c.hasAttribute('type') && c.getAttribute('type').toLowerCase() == "application/x-shockwave-flash") || (c.hasAttribute('classid') && c.getAttribute('classid').toLowerCase() == "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000")) {
                sLabel = 'Flash Object';
              } else {
                sLabel = c.tagName.toLowerCase();
              }
              box = c.getBoundingClientRect();
              if (box != null && box.width && box.height) {
                width = box.width;
                height = box.height;
              }
              if (width > 800) {
                width = 800;
              }
              if (height > 300) {
                height = 300;
              }
              if (width > 100) {
                if (height > 100) {
                  width = 'width:' + width.toString() + 'px;';
                } else {
                  width = 'min-width:' + width.toString() + 'px;';
                }
              } else {
                width = '';
              }
              if (height > 50) {
                height = 'height:' + height.toString() + 'px;';
              } else {
                height = '';
              }
              node = rd.createElement('span');
              bKeepStyle = true;
              node.setAttribute('style', 'display:table-cell;border:thin solid black;color:black;' + width + height + 'padding:1px;background-color:#e9e9e9 !important;text-decoration:none;color !important:black !important');
              if (blr.W15yQC.fnStringHasContent(sLabel)) {
                node.setAttribute('aria-label', sLabel);
              }
              node.appendChild(rd.createTextNode(sLabel));
            } else if (sRole == 'img' || c.tagName.toLowerCase() == 'img') {
              if (blr.W15yQC.fnStringsEffectivelyEqual(c.getAttribute('role'), 'presentation') == true || (c.hasAttribute('alt') == true && c.getAttribute('alt') == "")) { // Ignore if presentation role or alt=""
                bSkipElement = true;
                node = null;
              } else {
                bSkipElement = false;
                box = c.getBoundingClientRect();
                if (box != null && box.width && box.height) {
                  width = box.width;
                  height = box.height;
                }
                if (width > 700) {
                  width = 700;
                } else if (width < 30) {
                  width = 30;
                }
                if (height > 300) {
                  height = 300;
                }
                if (width > 5) {
                  width = 'width:' + width.toString() + 'px;';
                } else {
                  width = '';
                }
                if (height > 5) {
                  height = 'height:' + height.toString() + 'px;';
                } else {
                  height = '';
                }

                node = rd.createElement('span');
                bKeepStyle = true;
                if (blr.W15yQC.fnElementIsChildOf(c, 'a')) {
                  borderStyle = 'border:1px solid blue;';
                  sLabel = blr.W15yQC.fnJoin('Image-Link', blr.W15yQC.fnGetEffectiveLabelText(c, doc), ': ');
                  c2 = appendNode;
                  while (c2 != null && c2.tagName.toLowerCase() != 'a') c2 = c2.parentNode;
                  if (c2 != null) {
                    div = rd.createElement('div');
                    div.setAttribute('style', 'border:solid 1px blue;display:table-cell;margin:2px');
                    c2.parentNode.insertBefore(div, c2);
                    div.appendChild(c2);
                  }
                } else {
                  borderStyle = 'border:1px solid black;';
                  sLabel = blr.W15yQC.fnJoin('Image', blr.W15yQC.fnGetEffectiveLabelText(c, doc), ': ');
                }
                node.setAttribute('style', 'display:table-cell;' + borderStyle + 'color:black;' + width + height + 'padding:1px;background-color:#e9e9e9 !important;text-decoration:none;color black !important');
                node.setAttribute('role', 'img');
                if (blr.W15yQC.fnStringHasContent(sLabel)) {
                  node.setAttribute('aria-label', sLabel);
                }
                node.appendChild(rd.createTextNode(sLabel));
              }
            } else if (sRole == 'heading') {
              if (blr.W15yQC.fnIsValidPositiveInt(c.getAttribute('aria-level'))) {
                level = parseInt(blr.W15yQC.fnTrim(c.getAttribute('aria-level')), 10).toString();
              } else { // TODO: How is this calculated when it is left out?
                level = '2'; // TODO: What should this be when it was left out?
              }
              if (parseInt(level, 10) > 6) {
                level = '6';
              } else if (parseInt(level, 10) < 1) {
                level = '1';
              }
              node = rd.createElement('h' + level);
              node.appendChild(rd.createTextNode(blr.W15yQC.fnGetARIALabelText(c, doc)));
            } else if (sRole == 'button' || (c.tagName.toLowerCase() == 'input' && c.hasAttribute('type') && (c.getAttribute('type').toLowerCase() == 'image' || c.getAttribute('type').toLowerCase() == 'submit' || c.getAttribute('type').toLowerCase() == 'button'))) {
              node = rd.createElement('button');
              node.appendChild(rd.createTextNode(blr.W15yQC.fnGetEffectiveLabelText(c, doc)));
            } else if (/^(b|big|center|em|font|i|link|small|strong|tt|u)$/i.test(c.tagName)) {
              node = rd.createElement('span');
            } else if (/^(frameset)$/i.test(c.tagName)) {
              node = rd.createElement('div');
            } else {
              node = rd.importNode(c, false);
              if (/^(img|input)$/i.test(node.tagName) && node.hasAttribute('src')) {
                node.setAttribute('src', 'dont-load-' + node.getAttribute('src'));
              } else if (/^(a)$/i.test(node.tagName) && node.hasAttribute('href')) {
                node.setAttribute('href', '#dont-load-' + node.getAttribute('href'));
                if (blr.W15yQC.fnFirstChildElementIs(c, 'img') == false) {
                  node.insertBefore(rd.createTextNode('Link: '), node.firstChild);
                }
              }
            }

              if (node != null && bSkipElement == false) {
                for (i = 0; i < node.attributes.length; i++) {
                  if (/^(on[a-z]+|class|align|border)$/i.test(node.attributes[i].name) == true) {
                    node.removeAttribute(node.attributes[i].name);
                  } else if (/^javascript:/i.test(node.attributes[i].value)) {
                    node.setAttribute(node.attributes[i].name, 'javascript:return false;');
                  }
                }
                if (!bKeepStyle) {
                  node.removeAttribute('style');
                } else {
                  bKeepStyle = false;
                }
                appendNode.appendChild(node); //alert('appending:'+node.tagName+' to:'+appendNode.tagName);
              }
              //alert('digging into:'+node.tagName);
              if (c.tagName.toLowerCase() != 'object' && c.tagName.toLowerCase() != 'embed') { // TODO: Research alt material for object and embed... how does it work?
                blr.W15yQC.RemoveStylesWindow.fnBuildRemoveStylesView(rd, node, doc, c, oValues);
              }
              if (bInAriaBlock == true) {
                p = rd.createElement('p');
                p.setAttribute('style', 'background-color:#eee;margin:0px;padding:0px 0px 0px 2px;border-top:thin solid #999');
                p.appendChild(rd.createTextNode('Leaving ' + sExitingLabel));
                div.appendChild(p);
                appendNode = div.parentNode;
                bInAriaBlock = false;
              }
            }
          }
        } else {
          node = rd.importNode(c, true);
          if (node.removeAttribute) {
            node.removeAttribute('style');
          }
          appendNode.appendChild(node); //alert('appending:'+c.nodeName+' to:'+appendNode.tagName);
          blr.W15yQC.RemoveStylesWindow.fnBuildRemoveStylesView(rd, node, doc, c, oValues);
        }
      }
    }
    return appendNode.parentNode || appendNode;
  },

  fnLinearizeTables: function (doc, rootNode) {
    var c, i, j, firstMoved, div, frameDocument;
    if (doc != null && doc.body) {
      if (rootNode == null) {
        rootNode = doc.body;
      }
      for (c = rootNode.firstChild; c != null; c = c == null ? rootNode.firstChild : c.nextSibling) {
        if (c.nodeType == 1) {
          if (c.nodeType == 1 && c.tagName && ((c.contentWindow && c.contentWindow.document !== null) || (c.contentDocument && c.contentDocument.body !== null)) && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
            frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
            blr.W15yQC.fnBuildRemoveStylesView(frameDocument, frameDocument.body);
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
                c.parentNode.removeChild(c);
                if (firstMoved != null && firstMoved.previousSibling != null) {
                  c = firstMoved.previousSibling;
                } else {
                  c = null;
                }
              }
            }
            blr.W15yQC.RemoveStylesWindow.fnLinearizeTables(doc, c);
          }
        }
      }
    }
  },

  toggleShowSemantics: function () {
    // Headings
    // Tables
    // Landmarks
    // ARIA Labels
    // Language markup
    if (blr.W15yQC.RemoveStylesWindow.aDocumentsList == null) {
      blr.W15yQC.RemoveStylesWindow.aDocumentsList = blr.W15yQC.fnGetDocuments(blr.W15yQC.RemoveStylesWindow.rd);
      blr.W15yQC.RemoveStylesWindow.aHeadingsList = blr.W15yQC.fnGetHeadings(blr.W15yQC.RemoveStylesWindow.rd);
    }
    blr.W15yQC.Highlighters.highlightHeadings(blr.W15yQC.RemoveStylesWindow.aDocumentsList, blr.W15yQC.RemoveStylesWindow.aHeadingsList);
    blr.W15yQC.Highlighters.highlightLists(blr.W15yQC.RemoveStylesWindow.aDocumentsList);
    blr.W15yQC.Highlighters.highlightTables(blr.W15yQC.RemoveStylesWindow.aDocumentsList);
  },

  forceMinSize: function (dialog) {
    if (dialog.outerWidth > 10 && dialog.outerHeight > 10 && (dialog.outerWidth < 940 || dialog.outerHeight < 610)) {
      dialog.resizeTo(Math.max(940, dialog.outerWidth), Math.max(610, dialog.outerHeight));
    }
  },

  printReport: function () {
    var rd = blr.W15yQC.RemoveStylesWindow.rd;
    if (rd != null && rd.documentElement && rd.documentElement.innerHTML && rd.body && rd.body.children && rd.body.children.length && rd.defaultView && rd.defaultView.print) {
      rd.defaultView.print();
    } else {
      if (blr.W15yQC.RemoveStylesWindow.prompts.alert) blr.W15yQC.RemoveStylesWindow.prompts.alert(null, "W15yQC HTML Report Alert", "Nothing to print!");
    }
  },

  saveHTMLReport: function () {
    var converter,
    file,
    foStream,
    fp,
    nsIFilePicker,
    rd,
    rv;
    rd = blr.W15yQC.RemoveStylesWindow.rd;
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
      if (blr.W15yQC.RemoveStylesWindow.prompts.alert) blr.W15yQC.RemoveStylesWindow.prompts.alert(null, "W15yQC HTML Report Alert", "Nothing to save!");
    }
  }

};