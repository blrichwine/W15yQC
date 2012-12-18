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
if (!blr) { var blr = {}; }

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

    init: function(dialog) {
        var metaElements, i;
        blr.W15yQC.fnReadUserPrefs();
        blr.W15yQC.RemoveStylesWindow.FirebugO=dialog.arguments[1];
        blr.W15yQC.RemoveStylesWindow.srcDoc = dialog.arguments[2];
        var if1 = document.getElementById("HTMLReportIFrame");
        blr.W15yQC.RemoveStylesWindow.rd=if1.contentDocument;

        blr.W15yQC.RemoveStylesWindow.prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
        metaElements = blr.W15yQC.RemoveStylesWindow.srcDoc.head.getElementsByTagName('meta');
        if(metaElements != null && metaElements.length>0) {
          for(i=0;i<metaElements.length;i++) {
            blr.W15yQC.RemoveStylesWindow.rd.head.appendChild(blr.W15yQC.RemoveStylesWindow.rd.importNode(metaElements[i], false));
          }
        }
        blr.W15yQC.RemoveStylesWindow.rd.title = 'Removed Style View - '+blr.W15yQC.RemoveStylesWindow.srcDoc.title+' - W15yQC';
        blr.W15yQC.RemoveStylesWindow.fnBuildRemoveStylesView(blr.W15yQC.RemoveStylesWindow.rd, blr.W15yQC.RemoveStylesWindow.rd.body, blr.W15yQC.RemoveStylesWindow.srcDoc);
        blr.W15yQC.RemoveStylesWindow.fnLinearizeTables(blr.W15yQC.RemoveStylesWindow.rd);
    },
    
    cleanup: function() {
        blr.W15yQC.RemoveStylesWindow.aDocumentsList=null;
        blr.W15yQC.RemoveStylesWindow.aHeadingsList=null;
        blr.W15yQC.RemoveStylesWindow.aFormsList=null;
        blr.W15yQC.RemoveStylesWindow.aFormControlsList=null;
        blr.W15yQC.RemoveStylesWindow.prompts=null;
        blr.W15yQC.RemoveStylesWindow.rd=null;
        blr.W15yQC.RemoveStylesWindow.srcDoc=null;
    },
    
    windowOnKeyDown: function(win,evt) {
        switch(evt.keyCode) {
            case 224: blr.W15yQC.RemoveStylesWindow.bCmdIsPressed = true;
                break;
            case 27: win.close();
                break;
            case 87: if(blr.W15yQC.RemoveStylesWindow.bCmdIsPressed==true) win.close();
                break;
        }
    },
    
    windowOnKeyUp: function(evt) {
        switch(evt.keyCode) {
            case 224: blr.W15yQC.RemoveStylesWindow.bCmdIsPressed = false;
                break;
        }
    },

    fnBuildRemoveStylesView: function (rd, appendNode, doc, rootNode, oValues) {
      var node, c, frameDocument, div, p, thisFrameNumber, i, bInAriaBlock=false, sEnteringLabel, sExitingLabel, sRole;
      if(oValues == null) {
        oValues = {
          iNumberOfLinks: 0,
          iNumberOfFrames: 0,
          iNumberOfARIALandmarks: 0
        };
      }
      if (doc != null) {
        if (rootNode == null) { rootNode = doc.body; }
        if (appendNode == null) { appendNode = rd.body; }
        for (c = rootNode.firstChild; c != null; c = c.nextSibling) {
          if(c.nodeType == 1) { //alert(c.nodeType+' '+c.nodeName);
            if (c.nodeType == 1 && c.tagName && ((c.contentWindow && c.contentWindow.document !== null) ||
                              (c.contentDocument && c.contentDocument.body !== null))  && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              div = rd.createElement('div');
              div.setAttribute('style','border:thin solid black;margin: 2px');
              appendNode.appendChild(div);
              p=rd.createElement('p');
              p.setAttribute('style','background-color:#eee;margin:0px;padding:0px');
              oValues.iNumberOfFrames++;
              // TODO: Can frame titles come from aria-labels?
              p.appendChild(rd.createTextNode('Frame('+oValues.iNumberOfFrames+'): '+(c.hasAttribute('title') ? 'Title: '+c.getAttribute('title') : 'Missing Title')));
              thisFrameNumber = oValues.iNumberOfFrames;
              div.appendChild(p);
              blr.W15yQC.fnBuildRemoveStylesView(rd, div, frameDocument, frameDocument.body, oValues);
              p=rd.createElement('p');
              p.setAttribute('style','background-color:#eee;margin:0px;padding:0px');
              p.appendChild(rd.createTextNode('Frame('+thisFrameNumber+') Ends'));
              div.appendChild(p);
            } else { // keep looking through current document
              if (c.hasAttribute && c.tagName && c.tagName.toLowerCase() !== 'style' && c.tagName.toLowerCase() !== 'script' && blr.W15yQC.fnNodeIsHidden(c) == false) {
                if(c.hasAttribute('role')) {
                    sRole=c.getAttribute('role').toLowerCase()
                } else {
                    sRole='';
                }
                if(blr.W15yQC.fnIsARIALandmark(c) || sRole=="menubar" || sRole=="menu") {
                    bInAriaBlock=true;
                    if(sRole=="menubar") {
                        sEnteringLabel=blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c),'menu bar.',' ')+' To navigate use the left and right arrow keys.';
                        sExitingLabel=blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c),'menu bar.',' ');
                    } else if(sRole=="menu") {
                        sEnteringLabel=blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c),'menu.',' ')+' To navigate use the up and down arrow keys.';
                        sExitingLabel=blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c),'menu.',' ');
                    } else {
                        sEnteringLabel=blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c),c.getAttribute('role'),' ')+' landmark.';
                        sExitingLabel=blr.W15yQC.fnJoin(blr.W15yQC.fnGetARIALabelText(c),c.getAttribute('role'),' ')+' landmark.';
                    }
                    
                    div = rd.createElement('div');
                    div.setAttribute('style','border:thin solid black;margin: 2px');
                    appendNode.appendChild(div);
                    p=rd.createElement('p');
                    p.setAttribute('style','background-color:#eee;margin:0px;padding:0px 0px 0px 2px;border-bottom:thin solid #aaa');
                    oValues.iNumberOfFrames++;
                    // TODO: Can frame titles come from aria-labels?
                    p.appendChild(rd.createTextNode('Entering '+sEnteringLabel));
                    div.appendChild(p);
                    appendNode=div;
                } // TODO: Should the landmark role prevent the natural element role?
                if(c.hasAttribute('role') && c.getAttribute('role').toLowerCase()=='button') {
                    node=rd.createElement('button');
                    node.appendChild(rd.createTextNode(blr.W15yQC.fnGetARIALabelText(c,doc)));
                } else if(/^(b|big|center|em|font|i|link|small|strong|tt|u)$/i.test(c.tagName)) {
                  node = rd.createElement('span');
                } else {
                  node = rd.importNode(c, false);
                  if(/^(img|input)$/i.test(node.tagName) && node.hasAttribute('src')) {
                    node.setAttribute('src','dont-load-'+node.getAttribute('src'));
                  } else if(/^(a)$/i.test(node.tagName) && node.hasAttribute('href')) {
                    node.setAttribute('href','#dont-load-'+node.getAttribute('src'));
                  }
                }
                for(i=0;i<node.attributes.length;i++) {
                  if(/^(on[a-z]+|style|class|align|border)$/i.test(node.attributes[i].name)==true) {
                    node.removeAttribute(node.attributes[i].name);
                  } else if(/^javascript:/i.test(node.attributes[i].value)) {
                    node.setAttribute(node.attributes[i].name, 'javascript:return false;');
                  }
                }
                node.removeAttribute('style');
                appendNode.appendChild(node); //alert('appending:'+node.tagName+' to:'+appendNode.tagName);
                //alert('digging into:'+node.tagName);
                blr.W15yQC.RemoveStylesWindow.fnBuildRemoveStylesView(rd, node, doc, c, oValues);
                if(bInAriaBlock==true) {
                    p=rd.createElement('p');
                    p.setAttribute('style','background-color:#eee;margin:0px;padding:0px 0px 0px 2px;border-top:thin solid #999');
                    p.appendChild(rd.createTextNode('Leaving '+sExitingLabel));
                    div.appendChild(p);
                    appendNode=div.parentNode;
                    bInAriaBlock=false;
                }
              }
            }
          } else {
            node = rd.importNode(c, true);
            if(node.removeAttribute) { node.removeAttribute('style'); }
            appendNode.appendChild(node); //alert('appending:'+c.nodeName+' to:'+appendNode.tagName);
            blr.W15yQC.RemoveStylesWindow.fnBuildRemoveStylesView(rd, node, doc, c, oValues);
          }
        }
      }
      return appendNode.parentNode || appendNode;
    },
    
    fnLinearizeTables: function(doc, rootNode) {
      var c, i, j, firstMoved,div;
      if (doc != null && doc.body) {
        if (rootNode == null) { rootNode = doc.body; }
        for (c = rootNode.firstChild; c != null; c = c==null ? rootNode.firstChild : c.nextSibling) {
          if(c.nodeType == 1) {
            if (c.nodeType == 1 && c.tagName && ((c.contentWindow && c.contentWindow.document !== null) ||
                              (c.contentDocument && c.contentDocument.body !== null))  && blr.W15yQC.fnNodeIsHidden(c) == false) { // Found a frame
              frameDocument = c.contentWindow ? c.contentWindow.document : c.contentDocument;
              blr.W15yQC.fnBuildRemoveStylesView(frameDocument,frameDocument.body);
            } else { // keep looking through current document
              if (c.hasAttribute && c.tagName && c.tagName.toLowerCase() == 'table' && blr.W15yQC.fnNodeIsHidden(c) == false) {
                if(blr.W15yQC.fnAppearsToBeALayoutTable(c)==true) {
                    firstMoved=null;
                    if(c.rows && c.rows.length) {
                        for(i=0;i<c.rows.length;i++) {
                            if(c.rows[i].cells && c.rows[i].cells.length) {
                                for(j=0;j<c.rows[i].cells.length;j++) {
                                    while (c.rows[i].cells[j].firstChild) {
                                        div=doc.createElement('div');
                                        if(firstMoved==null) {firstMoved=div;}
                                        div.appendChild(c.rows[i].cells[j].firstChild);
                                        c.parentNode.insertBefore(div, c);
                                    }
                                }
                            }
                        }
                    }
                    c.parentNode.removeChild(c);
                    if(firstMoved!=null && firstMoved.previousSibling !=null) {
                        c=firstMoved.previousSibling;
                    } else {
                        c=null;
                    }
                }
              }
              blr.W15yQC.RemoveStylesWindow.fnLinearizeTables(doc,c);
            }
          }
          previous=c;
        }
      }        
    },
    
    toggleShowSemantics: function() {
        // Headings
        // Tables
        // Landmarks
        // ARIA Labels
        // Language markup
        if(blr.W15yQC.RemoveStylesWindow.aDocumentsList==null) {
            blr.W15yQC.RemoveStylesWindow.aDocumentsList = blr.W15yQC.fnGetDocuments(blr.W15yQC.RemoveStylesWindow.rd);
            blr.W15yQC.RemoveStylesWindow.aHeadingsList = blr.W15yQC.fnGetHeadings(blr.W15yQC.RemoveStylesWindow.rd);
        }
        blr.W15yQC.Highlighters.highlightHeadings(blr.W15yQC.RemoveStylesWindow.aDocumentsList, blr.W15yQC.RemoveStylesWindow.aHeadingsList);
        blr.W15yQC.Highlighters.highlightLists(blr.W15yQC.RemoveStylesWindow.aDocumentsList);
        blr.W15yQC.Highlighters.highlightTables(blr.W15yQC.RemoveStylesWindow.aDocumentsList);
    },
            
    forceMinSize: function(dialog) {
        if(dialog.outerWidth>10 && dialog.outerHeight>10 && (dialog.outerWidth<940 || dialog.outerHeight<610)) {
            dialog.resizeTo(Math.max(940,dialog.outerWidth),Math.max(610,dialog.outerHeight));
        }
    },
    
    printReport: function () {
        if(rd != null && rd.documentElement && rd.documentElement.innerHTML && rd.body && rd.body.children && rd.body.children.length &&
           rd.defaultView && rd.defaultView.print) {
            rd.defaultView.print();
        } else { 
            if(prompts.alert) prompts.alert(null, "W15yQC HTML Report Alert", "Nothing to print!");
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
        rd=blr.W15yQC.RemoveStylesWindow.rd;
        if(rd != null && rd.documentElement && rd.documentElement.innerHTML && rd.body && rd.body.children && rd.body.children.length) {
          nsIFilePicker = Components.interfaces.nsIFilePicker;
    
          fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
          fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
          fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterAll);
          rv = fp.show();
          if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
            
            file = fp.file;
            // work with returned nsILocalFile...
            if(/\.html?$/.test(file.path)==false) {
              file.initWithPath(file.path+'.html');
            }
    
            foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].  
                           createInstance(Components.interfaces.nsIFileOutputStream);  
    
            foStream.init(file, 0x2A, 438, 0);
            converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);  
            converter.init(foStream, "UTF-8", 0, 0);  
            converter.writeString('<html>'+rd.documentElement.innerHTML+'</html>');
            converter.close(); // this closes foStream            
          }
        } else { 
            if(prompts.alert) prompts.alert(null, "W15yQC HTML Report Alert", "Nothing to save!");
        }
    },

}