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

 * File:        linksDialog.js
 * Description: Handles displaying the accesskey quick check dialog
 * Author:	Brian Richwine
 * Created:	2011.12.19
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2011.12.19 - Created! 
 *
 * TODO:
 *      
 *    - Internationalize?
 *    
 * 
 */
if (!blr) var blr = {};

/*
 * Object:  QuickW15yLinksDialog
 * Returns:
 */
blr.W15yQC.LinksDialog = {
    FirebugO: null,
    aDocumentsList: null,
    aLinksList: null,
    nodeToInspect: null,
    fnPopulateTree: function(aDocumentsList, aLinksList) {
        if(aDocumentsList != null && aLinksList != null && aLinksList.length && aLinksList.length > 0) {
            var tbc = document.getElementById('treeboxChildren');
            var bHasRole = false;
            var bHasStateDescription = false;
            var bHasTarget = false;
            if(tbc != null) {
                for(var i=0; i<aLinksList.length; i++) {
                    var ak = aLinksList[i];
                    if(ak.role != null) bHasRole = true;
                    if(ak.target != null) bHasTarget = true;
                    if(ak.stateDescription != null) bHasStateDescription = true;
                }
                if(!bHasRole) {
                    var ch = document.getElementById('col-header-role');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasTarget) {
                    var ch = document.getElementById('col-header-target');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasStateDescription) {
                    var ch = document.getElementById('col-header-state');
                    ch.setAttribute('hidden','true');
                }
                if(aDocumentsList.length<=1) {
                    var ch = document.getElementById('col-header-documentNumber');
                    ch.setAttribute('hidden','true');
                }
                for(var i=0; i<aLinksList.length; i++) {
                    var treeitem = document.createElement('treeitem');
                    var treerow = document.createElement('treerow');
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    var ak = aLinksList[i];
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.ownerDocumentNumber);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',aDocumentsList[ak.ownerDocumentNumber-1].URL);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.nodeDescription);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.text);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.title);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.target);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.href);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.role);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.stateDescription);
                    treerow.appendChild(treecell);

                    if(ak.failed) {
                      treerow.setAttribute('properties', 'failed');
                    } else if(ak.warning) {
                      treerow.setAttribute('properties', 'warning');
                    }

                    treeitem.appendChild(treerow);
                    tbc.appendChild(treeitem);
                }
                blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
                if(aLinksList.length==1) {
                    blr.W15yQC.LinksDialog.updateNotesField([aDocumentsList,aLinksList], false);
                }
            }
        } else {
            var textbox = document.getElementById('note-text');
            textbox.value = "No links were detected.";
        }
    },
    
    init: function(dialog) {
        blr.W15yQC.LinksDialog.FirebugO=dialog.arguments[1];
        blr.W15yQC.LinksDialog.aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.LinksDialog.aDocumentsList);
        
        blr.W15yQC.LinksDialog.aLinksList = blr.W15yQC.fnGetLinks(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeLinks(blr.W15yQC.LinksDialog.aLinksList, blr.W15yQC.LinksDialog.aDocumentsList);
        
        blr.W15yQC.LinksDialog.fnPopulateTree(blr.W15yQC.LinksDialog.aDocumentsList, blr.W15yQC.LinksDialog.aLinksList);
        if(blr.W15yQC.LinksDialog.FirebugO == null || !blr.W15yQC.LinksDialog.FirebugO.Inspector ) { document.getElementById('button-showInFirebug').hidden=true; }
    },
    
    cleanup: function() {
        if(aDocumentsList != null) {
            for(var i=0;i<blr.W15yQC.LinksDialog.aDocumentsList.length;i++) blr.W15yQC.resetHighlightElement(blr.W15yQC.LinksDialog.aDocumentsList[i].doc);
            blr.W15yQC.LinksDialog.aDocumentsList=null;
            blr.W15yQC.LinksDialog.aLinksList=null;
        }
    },
    
    updateNotesField: function(bHighlightElement) {
        var treebox = document.getElementById('treebox');
        var textbox = document.getElementById('note-text');

        if(bHighlightElement === null) bHighlightElement = true;

        var selectedRow = treebox.currentIndex;
        if(selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
            bHighlightElement = false;
        }
        
        
        if(blr.W15yQC.LinksDialog.aLinksList[selectedRow].notes != null) {
            textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.LinksDialog.aLinksList[selectedRow]);
        } else {
            textbox.value = '';
        }
        
        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.LinksDialog.aLinksList[selectedRow].nodeDescription, "\n\n");
        
        if(blr.W15yQC.LinksDialog.aLinksList[selectedRow].node != null) {
            var box = blr.W15yQC.LinksDialog.aLinksList[selectedRow].node.getBoundingClientRect();
            if(box != null) {
                textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:'+Math.floor(box.top)+', Left:'+Math.floor(box.left)+', Width:'+Math.floor(box.width)+', Height:'+Math.floor(box.height), "\n");
            }
        }
        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.LinksDialog.aLinksList[selectedRow].xpath, "\n");

        for(var i=0;i<blr.W15yQC.LinksDialog.aDocumentsList.length;i++) blr.W15yQC.resetHighlightElement(blr.W15yQC.LinksDialog.aDocumentsList[i].doc);
        if(bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.LinksDialog.aLinksList[selectedRow].node, blr.W15yQC.LinksDialog.aLinksList[treebox.currentIndex].doc);
    },
    
    objectToString: function(o,bDig) {
        var out = '';
        if(o!=null) {
          for (var p in o) {
            if(o[p].toString()=='[object Object]' && bDig!=false) {
                out += 'STARTOBJ'+p + ': [' + blr.W15yQC.LinksDialog.objectToString(o[p],false) + ']\n';
            } else {
                out += p + ': ' + o[p] + '\n';
            }
          }
        }
        return out;
    },
    
    showInFirebug: function() {
        if(blr.W15yQC.LinksDialog.FirebugO!=null) {
            try{
                if(blr.W15yQC.LinksDialog.aLinksList != null && blr.W15yQC.LinksDialog.aLinksList.length && blr.W15yQC.LinksDialog.aLinksList.length>0) {
                    var treebox = document.getElementById('treebox');
                    var selectedRow = treebox.currentIndex;
                    if(selectedRow == null || treebox.currentIndex < 0) {
                        selectedRow = 0;
                    }
                    //blr.W15yQC.LinksDialog.nodeToInspect = blr.W15yQC.LinksDialog.aLinksList[selectedRow].node;
                    //blr.W15yQC.LinksDialog.FirebugO.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(blr.W15yQC.LinksDialog.nodeToInspect);});
                    //oncommand=void function(arg){Firebug.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(arg);})}(document.popupNode)
                    //blr.W15yQC.LinksDialog.FirebugO.
                    if(blr.W15yQC.LinksDialog.aDocumentsList != null) {
                        for(var i=0;i<blr.W15yQC.LinksDialog.aDocumentsList.length;i++) blr.W15yQC.resetHighlightElement(blr.W15yQC.LinksDialog.aDocumentsList[i].doc);
                    }
                    blr.W15yQC.LinksDialog.aLinksList[selectedRow].node.ownerDocument.defaultView.focus();
                    void function(arg){blr.W15yQC.LinksDialog.FirebugO.GlobalUI.startFirebug(function(){blr.W15yQC.LinksDialog.FirebugO.Inspector.inspectFromContextMenu(arg);})}(blr.W15yQC.LinksDialog.aLinksList[selectedRow].node);
                    //blr.W15yQC.showInFirebug(blr.W15yQC.LinksDialog.aLinksList[selectedRow].node,blr.W15yQC.LinksDialog.firebugO);
                }
            } catch(ex) {}
        }
    },
    
    generateReportHTML: function() {
        var reportDoc = blr.W15yQC.fnInitDisplayWindow(window.opener.parent._content.document);
        blr.W15yQC.fnDisplayLinkResults(reportDoc, blr.W15yQC.LinksDialog.aLinksList);
        blr.W15yQC.fnDisplayFooter(reportDoc);        
    }
    
}