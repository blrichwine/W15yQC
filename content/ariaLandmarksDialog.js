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

 * File:        ariaLandmarksDialog.js
 * Description: Handles displaying the ARIA Landmarks quick check dialog
 * Author:	Brian Richwine
 * Created:	2011.12.10
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2011.12.10 - Created! 
 *
 * TODO:
 *      
 *    - Internationalize?
 *    
 * 
 */
if (!blr) var blr = {};

/*
 * Object:  QuickW15yLandmarksDialog
 * Returns:
 */
blr.W15yQC.LandmarksDialog = {
    FirebugO: null,
    aDocumentsList: null,
    aARIALandmarksList: null,
    fnPopulateTree: function(aDocumentsList, aARIALandmarksList) {
        if(aDocumentsList != null && aARIALandmarksList != null && aARIALandmarksList.length && aARIALandmarksList.length > 0) {
            var tbc = document.getElementById('treeboxChildren');
            if(tbc != null) {
                var bHasStateDescription = false;
                for(var i=0; i<aARIALandmarksList.length; i++) {
                    var ak = aARIALandmarksList[i];
                    if(ak.stateDescription) bHasStateDescription = true;
                }
                if(!bHasStateDescription) {
                    var ch = document.getElementById('col-header-state');
                    ch.setAttribute('hidden','true');
                }
                if(aDocumentsList.length<=1) {
                    var ch = document.getElementById('col-header-documentNumber');
                    ch.setAttribute('hidden','true');
                }

                for(var i=0; i<aARIALandmarksList.length; i++) {
                    var treeitem = document.createElement('treeitem');
                    var treerow = document.createElement('treerow');
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    var ak = aARIALandmarksList[i];
                    
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
                    treecell.setAttribute('label', ak.role);
                    treerow.appendChild(treecell);                    
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.label);
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
                if(aARIALandmarksList.length==1) {
                    blr.W15yQC.LandmarksDialog.updateNotesField([aDocumentsList,aARIALandmarksList], false);
                }
            }
        } else {
            var textbox = document.getElementById('note-text');
            textbox.value = "No ARIA Landmarks were detected.";
        }
    },
    
    init: function(dialog) {
        blr.W15yQC.LandmarksDialog.FirebugO=dialog.arguments[1];
        blr.W15yQC.LandmarksDialog.aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.LandmarksDialog.aDocumentsList);
        
        blr.W15yQC.LandmarksDialog.aARIALandmarksList = blr.W15yQC.fnGetARIALandmarks(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeARIALandmarks(blr.W15yQC.LandmarksDialog.aARIALandmarksList, blr.W15yQC.LandmarksDialog.aDocumentsList);
        
        blr.W15yQC.LandmarksDialog.fnPopulateTree(blr.W15yQC.LandmarksDialog.aDocumentsList, blr.W15yQC.LandmarksDialog.aARIALandmarksList);
    },
    
    cleanup: function() {
        if(blr.W15yQC.LandmarksDialog.aDocumentsList != null) {
            for(var i=0;i<blr.W15yQC.LandmarksDialog.aDocumentsList.length;i++) blr.W15yQC.resetHighlightElement(blr.W15yQC.LandmarksDialog.aDocumentsList[i].doc);
            blr.W15yQC.LandmarksDialog.aDocumentsList=null;
            blr.W15yQC.LandmarksDialog.aARIALandmarksList=null;
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

        if(blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].notes != null) {
            textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow]);
        } else {
            textbox.value = '';
        }
        
        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].nodeDescription, "\n\n");
        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].xpath, "\n\n");
        
        if(blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].node != null) {
            var box = blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].node.getBoundingClientRect();
            if(box != null) {
                textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:'+Math.floor(box.top)+', Left:'+Math.floor(box.left)+', Width:'+Math.floor(box.width)+', Height:'+Math.floor(box.height), "\n\n");                
            }
        }

        for(var i=0;i<blr.W15yQC.LandmarksDialog.aDocumentsList.length;i++) blr.W15yQC.resetHighlightElement(blr.W15yQC.LandmarksDialog.aDocumentsList[i].doc);
        if(bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].node, blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].doc);
    },
    
    showInFirebug: function() {
        if(blr.W15yQC.LandmarksDialog.FirebugO!=null) {
            try{
                if(blr.W15yQC.LandmarksDialog.aARIALandmarksList != null && blr.W15yQC.LandmarksDialog.aARIALandmarksList.length && blr.W15yQC.LandmarksDialog.aARIALandmarksList.length>0) {
                    var treebox = document.getElementById('treebox');
                    var selectedRow = treebox.currentIndex;
                    if(selectedRow == null || treebox.currentIndex < 0) {
                        selectedRow = 0;
                    }
                    //blr.W15yQC.LandmarksDialog.nodeToInspect = blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].node;
                    //blr.W15yQC.LandmarksDialog.FirebugO.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(blr.W15yQC.LandmarksDialog.nodeToInspect);});
                    //oncommand=void function(arg){Firebug.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(arg);})}(document.popupNode)
                    //blr.W15yQC.LandmarksDialog.FirebugO.
                    blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].node.ownerDocument.defaultView.focus();
                    void function(arg){blr.W15yQC.LandmarksDialog.FirebugO.GlobalUI.startFirebug(function(){blr.W15yQC.LandmarksDialog.FirebugO.Inspector.inspectFromContextMenu(arg);})}(blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].node);
                    //blr.W15yQC.showInFirebug(blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow].node,blr.W15yQC.LandmarksDialog.firebugO);
                }
            } catch(ex) {}
        }
    },
    
    generateReportHTML: function() {
        var reportDoc = blr.W15yQC.fnInitDisplayWindow(window.opener.parent._content.document);
        blr.W15yQC.fnDisplayARIALandmarksResults(reportDoc, blr.W15yQC.LandmarksDialog.aARIALandmarksList);
        blr.W15yQC.fnDisplayFooter(reportDoc);        
    }
    
}