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

 * File:        formControlsDialog.js
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
if (!blr.a11yTools) blr.a11yTools = {};

/*
 * Object:  QuickW15yFormControlsDialog
 * Returns:
 */
blr.W15yQC.FormControlsDialog = {
    
    fnPopulateTree: function(aDocumentsList, aFormsList, aFormControlsList) {
        if(aDocumentsList != null && aFormControlsList != null && aFormControlsList.length && aFormControlsList.length > 0) {
            var bHasId = false;
            var bHasName = false;
            for(var i=0; i<aFormsList.length; i++) {
                if(aFormsList[i].node.getAttribute('id')) bHasId=true;
                if(aFormsList[i].name != null && aFormsList[i].name.length>0) bHasName=true;
            }

            var tbc = document.getElementById('treeboxChildren1');
            if(tbc != null) {
                if(!bHasId) {
                    var ch = document.getElementById('col-header-id');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasName) {
                    var ch = document.getElementById('col-header-name');
                    ch.setAttribute('hidden','true');
                }
                
                for(var i=0; i<aFormsList.length; i++) {
                    var treeitem = document.createElement('treeitem');
                    var treerow = document.createElement('treerow');
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    var ak = aFormsList[i];
                    
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
                    treecell.setAttribute('label', ak.node.getAttribute('id'));
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.name);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.action);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.method);
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

            tbc = document.getElementById('treeboxChildren2');
            if(tbc != null) {
                var bHasARIALabel = false;
                var bHasLegend = false;
                var bHasARIADescription = false;
                var bHasRole = false;
                var bHasValue = false;
                var bHasStateDescription = false;
                for(var i=0; i<aFormControlsList.length; i++) {
                    var ak = aFormControlsList[i];
                    if(ak.legendText != null && ak.legendText.length>0) bHasLegend = true;
                    if(ak.role != null && ak.role.length>0) bHasRole = true;
                    if(ak.value != null && ak.value.length>0) bHasValue = true;
                    if(ak.ARIALabelText != null && ak.ARIALabelText.length>0) bHasARIALabel = true;
                    if(ak.ARIADescriptionText != null && ak.ARIADescriptionText.length>0) bHasARIADescription = true;
                    if(ak.stateDescription != null && ak.stateDescription.length>0) bHasStateDescription = true;
                }
                if(!bHasARIALabel) {
                    var ch = document.getElementById('col-header-ariaLabel2');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasLegend) {
                    var ch = document.getElementById('col-header-legend2');
                    ch.setAttribute('flex', null);
                    ch.setAttribute('fixed','true');
                }
                if(!bHasARIADescription) {
                    var ch = document.getElementById('col-header-ariaDescription2');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasRole) {
                    var ch = document.getElementById('col-header-role2');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasValue) {
                    var ch = document.getElementById('col-header-value2');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasStateDescription) {
                    var ch = document.getElementById('col-header-state2');
                    ch.setAttribute('hidden','true');
                }
                if(aDocumentsList.length<=1) {
                    var ch = document.getElementById('col-header-documentNumber2');
                    ch.setAttribute('hidden','true');
                }

                for(var i=0; i<aFormControlsList.length; i++) {
                    var treeitem = document.createElement('treeitem');
                    var treerow = document.createElement('treerow');
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    var ak = aFormControlsList[i];
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.ownerDocumentNumber);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.parentFormNumber);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.nodeDescription);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.legendText);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.labelTagText);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.ARIALabelText);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.ARIADescriptionText);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.title);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.effectiveLabelText);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.name);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.value);
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
                blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
                if(aFormControlsList.length==1) {
                    blr.W15yQC.FormControlsDialog.updateNotesField([aDocumentsList,aFormControlsList], false);
                }
            }
        } else {
            var textbox = document.getElementById('note-text');
            textbox.value = "No form elements were detected.";
        }
        return aFormsList;
    },
    
    init: function(dialog) {
        var aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(aDocumentsList);

        var aFormControlsLists = blr.W15yQC.fnGetFormControls(window.opener.parent._content.document, null, aDocumentsList);
        var aFormControlsList = aFormControlsLists[1];
        var aFormsList = aFormControlsLists[0];
        blr.W15yQC.fnAnalyzeFormControls(aFormsList, aFormControlsList, aDocumentsList);
        
        blr.W15yQC.FormControlsDialog.fnPopulateTree(aDocumentsList, aFormsList, aFormControlsList);
        
        return [aDocumentsList, aFormControlsList, aFormsList];
    },
    
    cleanup: function(aResults) {
        if(aResults != null) {
            for(var i=0;i<aResults[0].length;i++) blr.W15yQC.resetHighlightElement(aResults[0][i].doc);
            aResults[0]=null;
            aResults[1]=null;
            aResults[2]=null;
            aResults=null;
        }
    },
    
    updateNotesField1: function(aResults, bHighlightElement) {
        var treebox = document.getElementById('treebox1');
        var textbox = document.getElementById('note-text');

        if(bHighlightElement === null) bHighlightElement = true;

        var selectedRow = treebox.currentIndex;
        if(selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
            bHighlightElement = false;
        }
        
        if(aResults[2][selectedRow].notes != null) {
            var sPrefix = 'Notes';
            if(aResults[2][selectedRow].failed) {
                sPrefix = 'Failed';
            } else if(aResults[2][selectedRow].warning) {
                sPrefix = 'Warning';
            }
            textbox.value = sPrefix+': '+aResults[2][selectedRow].notes;
        } else {
            textbox.value = '';
        }
        textbox.value = blr.W15yQC.fnJoin(textbox.value, aResults[2][selectedRow].nodeDescription, "\n\n");
        textbox.value = blr.W15yQC.fnJoin(textbox.value, aResults[2][selectedRow].xpath, "\n\n");
        for(var i=0;i<aResults[0].length;i++) blr.W15yQC.resetHighlightElement(aResults[0][i].doc);
        if(bHighlightElement != false) blr.W15yQC.highlightElement(aResults[2][selectedRow].node, aResults[2][selectedRow].doc);
    },
    
    updateNotesField2: function(aResults, bHighlightElement) {
        var treebox = document.getElementById('treebox2');
        var textbox = document.getElementById('note-text');
        
        if(bHighlightElement === null) bHighlightElement = true;

        var selectedRow = treebox.currentIndex;
        if(selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
            bHighlightElement = false;
        }

        if(aResults[1][selectedRow].notes != null) {
            textbox.value = blr.W15yQC.fnMakeTextNotesList(aResults[1][selectedRow]);
        } else {
            textbox.value = '';
        }
        
        textbox.value = blr.W15yQC.fnJoin(textbox.value, aResults[1][selectedRow].nodeDescription, "\n\n");
        
        if(aResults[1][selectedRow].node != null) {
            var box = aResults[1][selectedRow].node.getBoundingClientRect();
            if(box != null) {
                textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:'+Math.floor(box.top)+', Left:'+Math.floor(box.left)+', Width:'+Math.floor(box.width)+', Height:'+Math.floor(box.height), "\n\n");
            }
        }
        textbox.value = blr.W15yQC.fnJoin(textbox.value, aResults[1][selectedRow].xpath, "\n");

        for(var i=0;i<aResults[0].length;i++) blr.W15yQC.resetHighlightElement(aResults[0][i].doc);
        if(bHighlightElement != false) blr.W15yQC.highlightElement(aResults[1][selectedRow].node, aResults[1][selectedRow].doc);
    },
    
    generateReportHTML: function(aResults) {
        var reportDoc = blr.W15yQC.fnInitDisplayWindow(window.opener.parent._content.document);
        blr.W15yQC.fnDisplayFormControlResults(reportDoc, aResults[1]);
        blr.W15yQC.fnDisplayFooter(reportDoc);        
    }
    
}