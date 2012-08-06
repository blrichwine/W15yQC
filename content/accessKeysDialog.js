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

 * File:        accessKeysDialog.js
 * Description: Handles displaying the accesskey check dialog
 * Author:	Brian Richwine
 * Created:	2011.12.10
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2011.12.10 - Created! First Xul project!!
 *
 * TODO:
 *      
 *    - Internationalize?
 *    
 * 
 */
if (!blr) var blr = {};

/*
 * Object:  QuickW15yAccessKeyDialog
 * Returns:
 */
blr.W15yQC.AccessKeyDialog = {
    FirebugO: null,
    aDocumentsList: null,
    aAccessKeysList: null,
    fnPopulateTree: function(aDocumentsList, aAccessKeysList) {
        if(aDocumentsList != null && aAccessKeysList != null && aAccessKeysList.length && aAccessKeysList.length > 0) {
            var tbc = document.getElementById('treeboxChildren');
            var bHasRole = false;
            var bHasStateDescription = false;
            if(tbc != null) {
                for(var i=0; i<aAccessKeysList.length; i++) {
                    var ak = aAccessKeysList[i];
                    if(ak.role) bHasRole = true;
                    if(ak.stateDescription) bHasStateDescription = true;
                }
                if(!bHasRole) {
                    var ch = document.getElementById('col-header-role');
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
                for(var i=0; i<aAccessKeysList.length; i++) {
                    var treeitem = document.createElement('treeitem');
                    var treerow = document.createElement('treerow');
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    var ak = aAccessKeysList[i];
                    
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
                    treecell.setAttribute('label', ak.accessKey);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.effectiveLabel);
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
                if(aAccessKeysList.length==1) {
                    blr.W15yQC.AccessKeyDialog.updateNotesField([aDocumentsList,aAccessKeysList], false);
                }
            }
        } else {
            var textbox = document.getElementById('note-text');
            textbox.value = "No access keys were detected.";
        }
    },
    
    init: function(dialog) {
        blr.W15yQC.AccessKeyDialog.FirebugO=dialog.arguments[1];
        blr.W15yQC.AccessKeyDialog.aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.AccessKeyDialog.aDocumentsList);
        
        blr.W15yQC.AccessKeyDialog.aAccessKeysList = blr.W15yQC.fnGetAccessKeys(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeAccessKeys(blr.W15yQC.AccessKeyDialog.aAccessKeysList, blr.W15yQC.AccessKeyDialog.aDocumentsList);
        
        blr.W15yQC.AccessKeyDialog.fnPopulateTree(blr.W15yQC.AccessKeyDialog.aDocumentsList, blr.W15yQC.AccessKeyDialog.aAccessKeysList);
        if(blr.W15yQC.AccessKeyDialog.FirebugO == null || !blr.W15yQC.AccessKeyDialog.FirebugO.Inspector ) { document.getElementById('button-showInFirebug').hidden=true; }
    },
    
    cleanup: function() {
        if(blr.W15yQC.AccessKeyDialog.aDocumentsList != null) {
            for(var i=0;i<blr.W15yQC.AccessKeyDialog.aDocumentsList.length;i++) blr.W15yQC.resetHighlightElement(blr.W15yQC.AccessKeyDialog.aDocumentsList[i].doc);
            blr.W15yQC.AccessKeyDialog.aDocumentsList=null;
            blr.W15yQC.AccessKeyDialog.aAccessKeysList=null;
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

        if(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].notes != null) {
            textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow]);
        } else {
            textbox.value = '';
        }
                
        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].nodeDescription, "\n\n");
        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].xpath, "\n\n");
        
        if(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node != null) {
            var box = blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node.getBoundingClientRect();
            if(box != null) {
                textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:'+Math.floor(box.top)+', Left:'+Math.floor(box.left)+', Width:'+Math.floor(box.width)+', Height:'+Math.floor(box.height), "\n\n");                
            }
        }

        for(var i=0;i<blr.W15yQC.AccessKeyDialog.aDocumentsList.length;i++) blr.W15yQC.resetHighlightElement(blr.W15yQC.AccessKeyDialog.aDocumentsList[i].doc);
        if(bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node, blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].doc);
    },
    
    showInFirebug: function() {
        if(blr.W15yQC.AccessKeyDialog.FirebugO!=null) {
            try{
                if(blr.W15yQC.AccessKeyDialog.aAccessKeysList != null && blr.W15yQC.AccessKeyDialog.aAccessKeysList.length && blr.W15yQC.AccessKeyDialog.aAccessKeysList.length>0) {
                    var treebox = document.getElementById('treebox');
                    var selectedRow = treebox.currentIndex;
                    if(selectedRow == null || treebox.currentIndex < 0) {
                        selectedRow = 0;
                    }
                    //blr.W15yQC.AccessKeyDialog.nodeToInspect = blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node;
                    //blr.W15yQC.AccessKeyDialog.FirebugO.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(blr.W15yQC.AccessKeyDialog.nodeToInspect);});
                    //oncommand=void function(arg){Firebug.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(arg);})}(document.popupNode)
                    //blr.W15yQC.AccessKeyDialog.FirebugO.
                    for(var i=0;i<blr.W15yQC.AccessKeyDialog.aDocumentsList.length;i++) blr.W15yQC.resetHighlightElement(blr.W15yQC.AccessKeyDialog.aDocumentsList[i].doc);
                    blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node.ownerDocument.defaultView.focus();
                    void function(arg){blr.W15yQC.AccessKeyDialog.FirebugO.GlobalUI.startFirebug(function(){blr.W15yQC.AccessKeyDialog.FirebugO.Inspector.inspectFromContextMenu(arg);})}(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node);
                    //blr.W15yQC.showInFirebug(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node,blr.W15yQC.AccessKeyDialog.firebugO);
                }
            } catch(ex) {}
        }
    },
    
    generateReportHTML: function() {
        var reportDoc = blr.W15yQC.fnInitDisplayWindow(window.opener.parent._content.document);
        blr.W15yQC.fnDisplayAccessKeysResults(reportDoc, blr.W15yQC.AccessKeyDialog.aAccessKeysList);
        blr.W15yQC.fnDisplayFooter(reportDoc);        
    }
    
}