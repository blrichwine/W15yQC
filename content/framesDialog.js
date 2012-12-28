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
   
 * File:        framesDialog.js
 * Description: Handles displaying the ARIA Landmarks quick check dialog
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
 * Object:  QuickW15yFramesDialog
 * Returns:
 */
blr.W15yQC.FramesDialog = {
    fnPopulateTree: function(aDocumentsList, aFramesList) {
        var tbc, bHasRole, bHasStateDescription, i, ak, ch, treecell, treeitem, treerow, textbox;
        if(aDocumentsList != null && aFramesList != null && aFramesList.length && aFramesList.length > 0) {
            tbc = document.getElementById('treeboxChildren');
            if(tbc != null) {
                bHasRole = false;
                bHasStateDescription = false;
                for(i=0; i<aFramesList.length; i++) {
                    ak = aFramesList[i];
                    if(ak.stateDescription) bHasStateDescription = true;
                }
                if(!bHasStateDescription) {
                    ch = document.getElementById('col-header-state');
                    ch.setAttribute('hidden','true');
                }
                if(aDocumentsList.length<=1) {
                    ch = document.getElementById('col-header-documentNumber');
                    ch.setAttribute('hidden','true');
                }

                for(i=0; i<aFramesList.length; i++) {
                    treeitem = document.createElement('treeitem');
                    treerow = document.createElement('treerow');
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    ak = aFramesList[i];
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.ownerDocumentNumber);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.containsDocumentNumber); 
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.doc.URL);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.nodeDescription);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.title);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.src);
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
                blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
                if(aFramesList.length==1) {
                    blr.W15yQC.FramesDialog.updateNotesField([aDocumentsList,aFramesList], false);
                }
            }
        } else {
            textbox = document.getElementById('note-text');
            textbox.value = "No frame elements were detected.";
        }
    },
    
    init: function(dialog) {
        blr.W15yQC.fnReadUserPrefs();
        if(dialog != null && dialog.arguments && dialog.arguments.length>1) { blr.W15yQC.FramesDialog.FirebugO=dialog.arguments[1]; }
        blr.W15yQC.FramesDialog.aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.FramesDialog.aDocumentsList);
        
        blr.W15yQC.FramesDialog.aFramesList = blr.W15yQC.fnGetFrameTitles(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeFrameTitles(blr.W15yQC.FramesDialog.aFramesList, blr.W15yQC.FramesDialog.aDocumentsList);
        blr.W15yQC.FramesDialog.fnPopulateTree(blr.W15yQC.FramesDialog.aDocumentsList, blr.W15yQC.FramesDialog.aFramesList);
        if(blr.W15yQC.FramesDialog.FirebugO == null || !blr.W15yQC.FramesDialog.FirebugO.Inspector ) { document.getElementById('button-showInFirebug').hidden=true; }
    },
    
    cleanup: function() {
        if(blr.W15yQC.FramesDialog.aDocumentsList != null) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.FramesDialog.aDocumentsList);
            blr.W15yQC.FramesDialog.aDocumentsList=null;
            blr.W15yQC.FramesDialog.aFramesList=null;
        }
    },
    
    updateNotesField: function(bHighlightElement) {
        var treebox = document.getElementById('treebox'),
            textbox = document.getElementById('note-text'),
            selectedRow, box;

        if(bHighlightElement === null) bHighlightElement = true;

        selectedRow = treebox.currentIndex;
        if(selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
            bHighlightElement = false;
        }
        
        if(blr.W15yQC.FramesDialog.aFramesList[selectedRow].notes != null) {
            textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.FramesDialog.aFramesList[selectedRow]);
        } else {
            textbox.value = '';
        }
        
        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.FramesDialog.aFramesList[selectedRow].nodeDescription, "\n\n");
        
        if(blr.W15yQC.FramesDialog.aFramesList[selectedRow].node != null) {
            box = blr.W15yQC.FramesDialog.aFramesList[selectedRow].node.getBoundingClientRect();
            if(box != null) {
                textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:'+Math.floor(box.top)+', Left:'+Math.floor(box.left)+', Width:'+Math.floor(box.width)+', Height:'+Math.floor(box.height), "\n\n");                
            }
        }
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: '+blr.W15yQC.FramesDialog.aFramesList[selectedRow].xpath, "\n");

        blr.W15yQC.fnResetHighlights(blr.W15yQC.FramesDialog.aDocumentsList);
        if(blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
            try {
                blr.W15yQC.fnMoveToElement(blr.W15yQC.FramesDialog.aFramesList[selectedRow].node);
            } catch(err) {}
        }
        if(bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.FramesDialog.aFramesList[selectedRow].node, blr.W15yQC.FramesDialog.aFramesList[selectedRow].doc);
    },
    
    showInFirebug: function() {
        var treebox, selectedRow;
        if(blr.W15yQC.FramesDialog.FirebugO!=null && blr.W15yQC.FramesDialog.FirebugO.GlobalUI != null) {
            try{
                if(blr.W15yQC.FramesDialog.aFramesList != null && blr.W15yQC.FramesDialog.aFramesList.length && blr.W15yQC.FramesDialog.aFramesList.length>0) {
                    treebox = document.getElementById('treebox');
                    selectedRow = treebox.currentIndex;
                    if(selectedRow == null || treebox.currentIndex < 0) {
                        selectedRow = 0;
                    }
                    blr.W15yQC.fnResetHighlights(blr.W15yQC.FramesDialog.aDocumentsList);
                    blr.W15yQC.FramesDialog.aFramesList[selectedRow].node.ownerDocument.defaultView.focus();
                    void function(arg){blr.W15yQC.FramesDialog.FirebugO.GlobalUI.startFirebug(function(){blr.W15yQC.FramesDialog.FirebugO.Inspector.inspectFromContextMenu(arg);});}(blr.W15yQC.FramesDialog.aFramesList[selectedRow].node);
                }
            } catch(ex) {}
        }
    },

    moveToSelectedElement: function() {
        var treebox = document.getElementById('treebox'),
            selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.FramesDialog.aDocumentsList);
            blr.W15yQC.highlightElement(blr.W15yQC.FramesDialog.aFramesList[selectedRow].node, blr.W15yQC.FramesDialog.aFramesList[selectedRow].doc);
            blr.W15yQC.fnMoveToElement(blr.W15yQC.FramesDialog.aFramesList[selectedRow].node);
        }        
    },
    
    moveFocusToSelectedElement: function() {
        var treebox = document.getElementById('treebox'),
            selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.FramesDialog.aDocumentsList);
            blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.FramesDialog.aFramesList[selectedRow].node);
        }        
    },
    
    generateReportHTML: function() {
        blr.W15yQC.openHTMLReportWindow(blr.W15yQC.FramesDialog.FirebugO, 'frames');
    }
    
};