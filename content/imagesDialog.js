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

 * File:        imagesDialog.js
 * Description: Handles displaying the Images quick check dialog
 * Author:	Brian Richwine
 * Created:	2011.12.17
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2011.12.17 - Created! 
 *
 * TODO:
 *      
 *    - Internationalize?
 *    
 * 
 */
if (!blr) { var blr = {}; }

/*
 * Object:  QuickW15yImagesDialog
 * Returns:
 */
blr.W15yQC.ImagesDialog = {
    oFirebug: null,
    aDocumentsList: null,
    aImagesList: null,
    fnPopulateTree: function(aDocumentsList, aImagesList) {
        if(aDocumentsList != null && aImagesList != null && aImagesList.length && aImagesList.length > 0) {
            var tbc = document.getElementById('treeboxChildren');
            var bHasTitle = false;
            var bHasRole = false;
            var bHasAriaLabel = false;
            var bHasStateDescription = false;
            if(tbc != null) {
                for(var i=0; i<aImagesList.length; i++) {
                    var ak = aImagesList[i];
                    if(ak.title) bHasTitle = true;
                    if(ak.role) bHasRole = true;
                    if(ak.ariaLabel) bHasAriaLabel = true;
                    if(ak.stateDescription && ak.stateDescription.length>0) bHasStateDescription = true;
                }
                if(!bHasTitle) {
                    var ch = document.getElementById('col-header-title');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasRole) {
                    var ch = document.getElementById('col-header-role');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasAriaLabel) {
                    var ch = document.getElementById('col-header-ARIALabel');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasStateDescription) {
                    var ch = document.getElementById('col-header-State');
                    ch.setAttribute('hidden','true');
                }
                if(aDocumentsList.length<=1) {
                    var ch = document.getElementById('col-header-documentNumber');
                    ch.setAttribute('hidden','true');
                }
                for(var i=0; i<aImagesList.length; i++) {
                    var treeitem = document.createElement('treeitem');
                    var treerow = document.createElement('treerow');
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    var ak = aImagesList[i];
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.ownerDocumentNumber);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.doc.URL);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.nodeDescription);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.src);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', blr.W15yQC.fnMaxDecimalPlaces(ak.width,2));
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', blr.W15yQC.fnMaxDecimalPlaces(ak.height,2));
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.effectiveLabel);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.alt);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.title);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.ariaLabel);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.longdescText);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.role);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
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
            }
            blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
            if(aImagesList.length==1) {
                blr.W15yQC.ImagesDialog.updateNotesField([aDocumentsList,aImagesList], false);
            }
        } else {
            var textbox = document.getElementById('note-text');
            textbox.value = "No Image elements were detected.";
        }
    },
        
    init: function(dialog) {
        blr.W15yQC.fnReadUserPrefs();
        if(dialog!= null && dialog.arguments != null && dialog.arguments.length>1) { blr.W15yQC.ImagesDialog.FirebugO=dialog.arguments[1]; }
        blr.W15yQC.ImagesDialog.aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.ImagesDialog.aDocumentsList);
        
        blr.W15yQC.ImagesDialog.aImagesList = blr.W15yQC.fnGetImages(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeImages(blr.W15yQC.ImagesDialog.aImagesList, blr.W15yQC.ImagesDialog.aDocumentsList);
        blr.W15yQC.ImagesDialog.fnPopulateTree(blr.W15yQC.ImagesDialog.aDocumentsList, blr.W15yQC.ImagesDialog.aImagesList);
        if(blr.W15yQC.ImagesDialog.FirebugO == null || !blr.W15yQC.ImagesDialog.FirebugO.Inspector ) { document.getElementById('button-showInFirebug').hidden=true; }
    },
    
    cleanup: function() {
        if(blr.W15yQC.ImagesDialog.aDocumentsList != null) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.ImagesDialog.aDocumentsList);
            blr.W15yQC.ImagesDialog.aDocumentsList=null;
            blr.W15yQC.ImagesDialog.aImagesList=null;
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

        if(blr.W15yQC.ImagesDialog.aImagesList[selectedRow].notes != null) {
            textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.ImagesDialog.aImagesList[selectedRow]);
        } else {
            textbox.value = '';
        }
        
        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.ImagesDialog.aImagesList[selectedRow].nodeDescription, "\n\n");
        
        if(blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node != null) {
            var box = blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node.getBoundingClientRect();
            if(box != null) {
                textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:'+Math.floor(box.top)+', Left:'+Math.floor(box.left)+', Width:'+Math.floor(box.width)+', Height:'+Math.floor(box.height), "\n");                
            }
        }
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: '+blr.W15yQC.ImagesDialog.aImagesList[selectedRow].xpath, "\n");

        blr.W15yQC.fnResetHighlights(blr.W15yQC.ImagesDialog.aDocumentsList);
        if(blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
            try {
                blr.W15yQC.fnMoveToElement(blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node);
            } catch(err) {}
        }
        if(bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node, blr.W15yQC.ImagesDialog.aImagesList[selectedRow].doc);
    },
    
    moveToSelectedElement: function() {
        var treebox = document.getElementById('treebox'),
            selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.ImagesDialog.aDocumentsList);
            blr.W15yQC.highlightElement(blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node, blr.W15yQC.ImagesDialog.aImagesList[selectedRow].doc);
            blr.W15yQC.fnMoveToElement(blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node);
        }        
    },
    
    moveFocusToSelectedElement: function() {
        var treebox = document.getElementById('treebox'),
            selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.ImagesDialog.aDocumentsList);
            blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node);
        }        
    },
    
    showInFirebug: function() {
        if(blr.W15yQC.ImagesDialog.FirebugO!=null) {
            try{
                if(blr.W15yQC.ImagesDialog.aImagesList != null && blr.W15yQC.ImagesDialog.aImagesList.length && blr.W15yQC.ImagesDialog.aImagesList.length>0) {
                    var treebox = document.getElementById('treebox');
                    var selectedRow = treebox.currentIndex;
                    if(selectedRow == null || treebox.currentIndex < 0) {
                        selectedRow = 0;
                    }
                    //blr.W15yQC.ImagesDialog.nodeToInspect = blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node;
                    //blr.W15yQC.ImagesDialog.FirebugO.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(blr.W15yQC.ImagesDialog.nodeToInspect);});
                    //oncommand=void function(arg){Firebug.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(arg);})}(document.popupNode)
                    //blr.W15yQC.ImagesDialog.FirebugO.
                    blr.W15yQC.fnResetHighlights(blr.W15yQC.ImagesDialog.aDocumentsList);
                    blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node.ownerDocument.defaultView.focus();
                    void function(arg){blr.W15yQC.ImagesDialog.FirebugO.GlobalUI.startFirebug(function(){blr.W15yQC.ImagesDialog.FirebugO.Inspector.inspectFromContextMenu(arg);})}(blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node);
                    //blr.W15yQC.showInFirebug(blr.W15yQC.ImagesDialog.aImagesList[selectedRow].node,blr.W15yQC.ImagesDialog.firebugO);
                }
            } catch(ex) {}
        }
    },
    
    generateReportHTML: function() {
        var reportDoc = blr.W15yQC.fnInitDisplayWindow(window.opener.parent._content.document);
        blr.W15yQC.fnDisplayImagesResults(reportDoc, blr.W15yQC.ImagesDialog.aImagesList);
        blr.W15yQC.fnDisplayFooter(reportDoc);        
    }
    
}