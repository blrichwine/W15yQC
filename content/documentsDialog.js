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

 * File:        documentsDialog.js
 * Description: Handles displaying the Documents quick check dialog
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
 * Object:  QuickW15yDocumentsDialog
 * Returns:
 */
blr.W15yQC.DocumentsDialog = {
    fnPopulateTree: function(aDocumentsList) {
        if(aDocumentsList != null && aDocumentsList.length && aDocumentsList.length > 0) {
            var tbc = document.getElementById('treeboxChildren');
            if(tbc != null) {
                for(var i=0; i<aDocumentsList.length; i++) {
                    var treeitem = document.createElement('treeitem');
                    var treerow = document.createElement('treerow');
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    var ak = aDocumentsList[i];
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.title);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',ak.language);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.dir);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.URL);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.compatMode);
                    treerow.appendChild(treecell);
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.docType);
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
                if(aDocumentsList.length==1) {
                    blr.W15yQC.DocumentsDialog.updateNotesField([aDocumentsList], false);
                }
            }
        } else {
            var textbox = document.getElementById('note-text');
            textbox.value = "What? How can this be? No documents were detected.";
        }
    },
    
    init: function(dialog) {
        var aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(aDocumentsList);
        
        blr.W15yQC.DocumentsDialog.fnPopulateTree(aDocumentsList);
        
        return [aDocumentsList];
    },
    
    cleanup: function(aResults) {
        if(aResults != null) {
            for(var i=0;i<aResults[0].length;i++) blr.W15yQC.resetHighlightElement(aResults[0][i].doc);
            aResults[0]=null;
        }
    },
    
    updateNotesField: function(aResults, bHighlightElement) {
        var treebox = document.getElementById('treebox');
        var textbox = document.getElementById('note-text');
        
        if(aResults != null && aResults.length>0) {
        if(bHighlightElement === null) bHighlightElement = true;

        var selectedRow = treebox.currentIndex;
        if(selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
            bHighlightElement = false;
        }
        
        
        if(aResults[0][selectedRow].notes != null) {
            textbox.value = blr.W15yQC.fnMakeTextNotesList(aResults[0][selectedRow]);
        } else {
            textbox.value = '';
        }
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'URL: '+aResults[0][selectedRow].URL, "\n\n");
        textbox.value = blr.W15yQC.fnJoin(textbox.value, aResults[0][selectedRow].title, "\nTitle: ");
        textbox.value = blr.W15yQC.fnJoin(textbox.value, aResults[0][selectedRow].compatMode, "\nCompatibility Mode: ");
        textbox.value = blr.W15yQC.fnJoin(textbox.value, aResults[0][selectedRow].docType, "\nDocument Type: ");
        for(var i=0;i<aResults[0].length;i++) blr.W15yQC.resetHighlightElement(aResults[0][i].doc);
        if(bHighlightElement != false) blr.W15yQC.highlightElement(aResults[0][selectedRow].doc.body, aResults[0][selectedRow].doc);
        }        
    },
    
    generateReportHTML: function(aResults) {
        var reportDoc = blr.W15yQC.fnInitDisplayWindow(window.opener.parent._content.document);
        blr.W15yQC.fnDisplayDocumentsResults(reportDoc, aResults[0]);
        blr.W15yQC.fnDisplayFooter(reportDoc);        
    },
    
    validateDocumentContents: function(aResults) {

        var treebox = document.getElementById('treebox');
        var selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            var outputWindow=window.open('');
            var reportDoc = outputWindow.document;
            var form = reportDoc.createElement('form');
            form.setAttribute('method', 'post');
            form.setAttribute('action', 'http://validator.w3.org/check');
            form.setAttribute('enctype', 'multipart/form-data');
    
            var de = aResults[0][selectedRow].doc.documentElement;
            var ie = reportDoc.createElement('input');
            ie.setAttribute('id', 'direct_prefill_no');
            ie.setAttribute('name', 'prefill');
            ie.setAttribute('value', '0');
            ie.setAttribute('checked', 'checked');
            ie.setAttribute('type', 'radio');
            var he = reportDoc.createElement('input');
            he.setAttribute('type', 'hidden');
            he.setAttribute('name', 'fragment');
            he.setAttribute('id', 'fragment');
            he.setAttribute('value', '<'+de.nodeName+'>'+de.innerHTML+'</'+de.nodeName+'>');
            form.appendChild(he);
            reportDoc.body.appendChild(form);
            form.submit();
        }
    },

    validateDocumentURL: function(aResults) {
        var treebox = document.getElementById('treebox');
        var selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            var URL = aResults[0][selectedRow].doc.URL;
            if(URL != null) {
                window.open('http://validator.w3.org/check?uri='+encodeURI(URL)+'&charset=%28detect+automatically%29&doctype=Inline&group=0');
            }    
        }
    }
    
}