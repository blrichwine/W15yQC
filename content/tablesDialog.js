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

 * File:        tablesDialog.js
 * Description: Handles displaying the Tables quick check dialog
 * Author:	Brian Richwine
 * Created:	2012.04.08
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2012.04.08 - Created! 
 *
 * TODO:
 *      
 *    - Internationalize?
 *    
 * 
 */
if (!blr) { var blr = {}; }

/*
 * Object:  QuickW15yTablesDialog
 * Returns:
 */
blr.W15yQC.TablesDialog = {
    oFirebug: null,
    aDocumentsList: null,
    aTablesList: null,
    fnPopulateTree: function(aDocumentsList, aTablesList) {
        if(aDocumentsList != null && aTablesList != null && aTablesList.length && aTablesList.length > 0) {
            var tbc = document.getElementById('treeboxChildren');
            var bHasCaption = false;
            var bHasSummary = false;
            var bHasParentTable = false;
            if(tbc != null) {
                for(var i=0; i<aTablesList.length; i++) {
                    var ak = aTablesList[i];
                    if(ak.caption != null && ak.caption.length>0) bHasCaption = true;
                    if(ak.summary != null && ak.summary.length>0) bHasSummary = true;
                    if(ak.parentTable != null && ak.parentTable>0) bHasSummary = true;
                }
                if(!bHasCaption) {
                    var ch = document.getElementById('col-header-caption');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasSummary) {
                    var ch = document.getElementById('col-header-summary');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasParentTable) {
                    var ch = document.getElementById('col-header-parentTable');
                    ch.setAttribute('hidden','true');
                }
                if(aDocumentsList.length<=1) {
                    var ch = document.getElementById('col-header-documentNumber');
                    ch.setAttribute('hidden','true');
                }
                for(var i=0; i<aTablesList.length; i++) {
                    var treeitem = document.createElement('treeitem');
                    var treerow = document.createElement('treerow');
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    var ak = aTablesList[i];
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.ownerDocumentNumber);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.parentTable);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.nestingLevel);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.nodeDescription);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.summary);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.caption);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.maxCols);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.maxRows);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.title);
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
            if(aTablesList.length==1) {
                blr.W15yQC.TablesDialog.updateNotesField([aDocumentsList,aTablesList], false);
            }
        } else {
            var textbox = document.getElementById('note-text');
            textbox.value = "No Table elements were detected.";
        }
    },
        
    init: function(dialog) {
        blr.W15yQC.fnReadUserPrefs();
        if(dialog!= null && dialog.arguments != null && dialog.arguments.length>1) { blr.W15yQC.TablesDialog.FirebugO=dialog.arguments[1]; }
        blr.W15yQC.TablesDialog.aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.TablesDialog.aDocumentsList);
        
        blr.W15yQC.TablesDialog.aTablesList = blr.W15yQC.fnGetTables(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeTables(blr.W15yQC.TablesDialog.aTablesList, blr.W15yQC.TablesDialog.aDocumentsList);
        blr.W15yQC.TablesDialog.fnPopulateTree(blr.W15yQC.TablesDialog.aDocumentsList, blr.W15yQC.TablesDialog.aTablesList);
        if(blr.W15yQC.TablesDialog.FirebugO == null || !blr.W15yQC.TablesDialog.FirebugO.Inspector ) { document.getElementById('button-showInFirebug').hidden=true; }
    },
    
    cleanup: function() {
        if(blr.W15yQC.TablesDialog.aDocumentsList != null) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
            blr.W15yQC.TablesDialog.aDocumentsList=null;
            blr.W15yQC.TablesDialog.aTablesList=null;
        }
    },
    
    updateNotesField: function(bHighlightElement) {
        var treebox = document.getElementById('treebox');
        var textbox = document.getElementById('note-text');
        if(bHighlightElement === null) bHighlightElement = true;
        
        var selectedRow = treebox.currentIndex;
        blr.W15yQC.fnLog('selectedRow after init:'+selectedRow);
        if(selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
            bHighlightElement = false;
        }
        
        
        if(blr.W15yQC.TablesDialog.aTablesList[selectedRow].notes != null) {
            textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.TablesDialog.aTablesList[selectedRow]);
        } else {
            textbox.value = '';
        }
        
        
        if(blr.W15yQC.TablesDialog.aTablesList[selectedRow].summary != null) {
            textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Summary: '+blr.W15yQC.TablesDialog.aTablesList[selectedRow].summary, "\n\n");
        }
        
        if(blr.W15yQC.TablesDialog.aTablesList[selectedRow].caption != null) {
            textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Caption: '+blr.W15yQC.TablesDialog.aTablesList[selectedRow].caption, "\n\n");
        }

        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.TablesDialog.aTablesList[selectedRow].nodeDescription, "\n\n");
        
        if(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node != null) {
            var box = blr.W15yQC.TablesDialog.aTablesList[selectedRow].node.getBoundingClientRect();
            if(box != null) {
                textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:'+Math.floor(box.top)+', Left:'+Math.floor(box.left)+', Width:'+Math.floor(box.width)+', Height:'+Math.floor(box.height), "\n\n");                
            }
        }
        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.TablesDialog.aTablesList[selectedRow].xpath, "\n");

        blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
        if(bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node, blr.W15yQC.TablesDialog.aTablesList[selectedRow].doc);
    },
    
    highlightTables: function() {
        if(blr.W15yQC.TablesDialog.aDocumentsList != null && blr.W15yQC.TablesDialog.aDocumentsList.length>0) {
            for(var i=0; i<blr.W15yQC.TablesDialog.aDocumentsList.length; i++) {
                if(blr.W15yQC.TablesDialog.aDocumentsList[i].doc != null) {
                    var element = blr.W15yQC.TablesDialog.aDocumentsList[i].doc.createElement('style');
                    element.innerHTML = 'table {outline: 1px solid red !important; } th {outline: 1px solid blue !important; } td {outline: 1px dotted  blue !important; } ';
                    element.setAttribute('id', 'W15yQCTableHighlightStyle');
                    blr.W15yQC.TablesDialog.aDocumentsList[i].doc.head.appendChild(element);
                }
            }
        }
    },
    
    moveToSelectedElement: function() {
        var treebox = document.getElementById('treebox'),
            selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
            blr.W15yQC.highlightElement(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node, blr.W15yQC.TablesDialog.aTablesList[selectedRow].doc);
            blr.W15yQC.fnMoveToElement(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node);
        }        
    },
    
    moveFocusToSelectedElement: function() {
        var treebox = document.getElementById('treebox'),
            selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
            blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node);
        }        
    },
    
    showInFirebug: function() {
        if(blr.W15yQC.TablesDialog.FirebugO!=null) {
            try{
                if(blr.W15yQC.TablesDialog.aTablesList != null && blr.W15yQC.TablesDialog.aTablesList.length && blr.W15yQC.TablesDialog.aTablesList.length>0) {
                    var treebox = document.getElementById('treebox');
                    var selectedRow = treebox.currentIndex;
                    if(selectedRow == null || treebox.currentIndex < 0) {
                        selectedRow = 0;
                    }
                    //blr.W15yQC.TablesDialog.nodeToInspect = blr.W15yQC.TablesDialog.aTablesList[selectedRow].node;
                    //blr.W15yQC.TablesDialog.FirebugO.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(blr.W15yQC.TablesDialog.nodeToInspect);});
                    //oncommand=void function(arg){Firebug.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(arg);})}(document.popupNode)
                    //blr.W15yQC.TablesDialog.FirebugO.
                    blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
                    blr.W15yQC.TablesDialog.aTablesList[selectedRow].node.ownerDocument.defaultView.focus();
                    void function(arg){blr.W15yQC.TablesDialog.FirebugO.GlobalUI.startFirebug(function(){blr.W15yQC.TablesDialog.FirebugO.Inspector.inspectFromContextMenu(arg);})}(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node);
                    //blr.W15yQC.showInFirebug(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node,blr.W15yQC.TablesDialog.firebugO);
                }
            } catch(ex) {}
        }
    },
    
    generateReportHTML: function() {
        var reportDoc = blr.W15yQC.fnInitDisplayWindow(window.opener.parent._content.document);
        blr.W15yQC.fnDisplayTablesResults(reportDoc, blr.W15yQC.TablesDialog.aTablesList);
        blr.W15yQC.fnDisplayFooter(reportDoc);        
    }
    
}