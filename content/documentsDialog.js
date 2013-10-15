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
"use strict";

if (!blr) {
  var blr = {};
}

/*
 * Object:  QuickW15yDocumentsDialog
 * Returns:
 */
blr.W15yQC.DocumentsDialog = {
  aDocumentsList: null,
  aDisplayOrder: [],
  sortColumns: [' Document Number (asc)'],

  fnUpdateStatus: function(sLabel) {
    document.getElementById('progressMeterLabel').value=sLabel;
    blr.W15yQC.fnDoEvents();
  },

  fnUpdatePercentage: function(p) {
    document.getElementById('progressMeter').value=p;
    blr.W15yQC.fnDoEvents();
  },

  fnUpdateProgress: function(sLabel, fPercentage) {
    if(sLabel != null) {
      blr.W15yQC.DocumentsDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.DocumentsDialog.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.DocumentsDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.DocumentsDialog.aDocumentsList != null && blr.W15yQC.DocumentsDialog.aDocumentsList.length>0) {
      if(blr.W15yQC.DocumentsDialog.aDisplayOrder==null) {
        blr.W15yQC.DocumentsDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.DocumentsDialog.aDisplayOrder.length<blr.W15yQC.DocumentsDialog.aDocumentsList.length) {
        blr.W15yQC.DocumentsDialog.aDisplayOrder.push(blr.W15yQC.DocumentsDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.DocumentsDialog.aDisplayOrder=[];
    }
  },

  fnPopulateTree: function (aDocumentsList, bDontHideCols) {
    var tbc, i, treecell, treeitem, treerow, ak, textbox, order;
    blr.W15yQC.DocumentsDialog.updateDisplayOrderArray();
    order=blr.W15yQC.DocumentsDialog.aDisplayOrder;
    if (aDocumentsList != null && aDocumentsList.length && aDocumentsList.length > 0) {
      tbc = document.getElementById('treeboxChildren');
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        for (i = 0; i < aDocumentsList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aDocumentsList[order[i]];

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.title);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.language);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.dir);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.URL);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.compatMode);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.docType);
          treerow.appendChild(treecell);

          if (ak.failed) {
            treerow.setAttribute('properties', 'failed');
          } else if (ak.warning) {
            treerow.setAttribute('properties', 'warning');
          }

          treeitem.appendChild(treerow);
          tbc.appendChild(treeitem);
        }

        if (bDontHideCols!=true) { blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox')); }
        if (aDocumentsList.length == 1) {
          blr.W15yQC.DocumentsDialog.updateNotesField([aDocumentsList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "What? How can this be? No documents were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport;

    blr.W15yQC.fnReadUserPrefs();

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document, dialog);
    blr.W15yQC.DocumentsDialog.aDocumentsList = oW15yQCReport.aDocuments;
    blr.W15yQC.fnAnalyzeDocuments(oW15yQCReport);
    blr.W15yQC.DocumentsDialog.fnPopulateTree(blr.W15yQC.DocumentsDialog.aDocumentsList);
    dialog.fnUpdateProgress('Ready',null);
  },

  updateControlStates: function() {

  },

  cleanup: function () {
    if (blr.W15yQC.DocumentsDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.DocumentsDialog.aDocumentsList);
    }
    blr.W15yQC.DocumentsDialog.aDocumentsList = null;
    blr.W15yQC.DocumentsDialog.aDisplayOrder = null;
    blr.W15yQC.DocumentsDialog.sortColumns = null;
  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'),
      textbox = document.getElementById('note-text'),
      selectedRow, selectedIndex, ak;

    if (blr.W15yQC.DocumentsDialog.aDocumentsList != null && blr.W15yQC.DocumentsDialog.aDocumentsList.length > 0) {
      if (bHighlightElement === null) bHighlightElement = true;

      selectedRow = treebox.currentIndex;
      if (selectedRow == null || treebox.currentIndex < 0) {
        selectedRow = 0;
        bHighlightElement = false;
      }
      selectedIndex=blr.W15yQC.DocumentsDialog.aDisplayOrder[selectedRow];
      ak=blr.W15yQC.DocumentsDialog.aDocumentsList[selectedIndex];

      if (ak.notes != null) {
        textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.DocumentsDialog.aDocumentsList[selectedRow]);
      } else {
        textbox.value = '';
      }
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Title: ' + ak.title, "\n\n");
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Compatibility Mode: ' + ak.compatMode, "\n\n");
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Document Type: ' + ak.docType, "\n\n");
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'URL: ' + ak.URL, "\n\n");
      blr.W15yQC.fnResetHighlights(blr.W15yQC.DocumentsDialog.aDocumentsList);
      if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
        try {
          blr.W15yQC.fnMoveToElement(ak.doc.body);
        } catch (ex) {}
      }
      if (bHighlightElement != false) blr.W15yQC.highlightElement(ak.doc.body);
    }
  },

  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.DocumentsDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.DocumentsDialog.sortColumns.splice(blr.W15yQC.DocumentsDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.DocumentsDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.DocumentsDialog.sortColumns.splice(blr.W15yQC.DocumentsDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.DocumentsDialog.sortColumns.length>3) { blr.W15yQC.DocumentsDialog.sortColumns.pop(); }
    blr.W15yQC.DocumentsDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.DocumentsDialog.aDocumentsList, order=blr.W15yQC.DocumentsDialog.aDisplayOrder;
    blr.W15yQC.DocumentsDialog.addSortColumn(index, ascending);
    blr.W15yQC.DocumentsDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.DocumentsDialog.sortColumns.toString());
    for(i=0;i<list.length;i++) {
        list[order[i]].origOrder=i;
    }
    if(ascending==false) {
      for(i=0;i<list.length;i++) {
        for(j=i+1;j<list.length;j++) {
          if(list[order[i]][index]>list[order[j]][index] || ((list[order[i]][index]==list[order[j]][index]) && list[order[i]].origOrder>list[order[j]].origOrder)) {
            temp=order[i];
            order[i]=order[j];
            order[j]=temp;
          }
        }
      }
    } else {
      for(i=0;i<list.length;i++) {
        for(j=i+1;j<list.length;j++) {
          if(list[order[i]][index]<list[order[j]][index] || ((list[order[i]][index]==list[order[j]][index]) && list[order[i]].origOrder>list[order[j]].origOrder)) {
            temp=order[i];
            order[i]=order[j];
            order[j]=temp;
          }
        }
      }
    }
  },

  sortTreeAsStringOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.DocumentsDialog.aDocumentsList, order=blr.W15yQC.DocumentsDialog.aDisplayOrder;
    blr.W15yQC.DocumentsDialog.addSortColumn(index, ascending);
    blr.W15yQC.DocumentsDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.DocumentsDialog.sortColumns.toString());
    for(i=0;i<list.length;i++) {
        list[order[i]].origOrder=i;
    }
    if(ascending!=true) {
      for(i=0;i<list.length;i++) {
        for(j=i+1;j<list.length;j++) {
          if((list[order[i]][index]==null ? '' : list[order[i]][index].toLowerCase()) > (list[order[j]][index]==null ? '' : list[order[j]][index].toLowerCase()) || (((list[order[i]][index]==null ? '' : list[order[i]][index].toLowerCase())==(list[order[j]][index]==null ? '' : list[order[j]][index].toLowerCase())) && list[order[i]].origOrder>list[order[j]].origOrder)) {
            temp=order[i];
            order[i]=order[j];
            order[j]=temp;
          }
        }
      }
    } else {
      for(i=0;i<list.length;i++) {
        for(j=i+1;j<list.length;j++) {
          if((list[order[i]][index]==null ? '' : list[order[i]][index].toLowerCase()) < (list[order[j]][index]==null ? '' : list[order[j]][index].toLowerCase()) || (((list[order[i]][index]==null ? '' : list[order[i]][index].toLowerCase())==(list[order[j]][index]==null ? '' : list[order[j]][index].toLowerCase())) && list[order[i]].origOrder>list[order[j]].origOrder)) {
            temp=order[i];
            order[i]=order[j];
            order[j]=temp;
          }
        }
      }
    }
  },

  sortTree: function(col) {
    var al, ad, sortDir=/^a/i.test(col.getAttribute('sortDirection')),
      colID=col.getAttribute('id'), i, tree=document.getElementById('treebox');
    for(i=0;i<tree.columns.length;i++) {
      if(/^a/.test(tree.columns.getColumnAt(i).element.getAttribute('sortDirection'))) {
        tree.columns.getColumnAt(i).element.setAttribute('sortDirection','a');
      } else {
        tree.columns.getColumnAt(i).element.setAttribute('sortDirection','d');
      }
    }
    blr.W15yQC.DocumentsDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.DocumentsDialog.aDisplayOrder=[];
        blr.W15yQC.DocumentsDialog.sortColumns=[' Link Number (asc)'];
        blr.W15yQC.DocumentsDialog.updateDisplayOrderArray();
        break;
      case 'col-header-title':
        blr.W15yQC.DocumentsDialog.sortTreeAsStringOn('title',sortDir);
        break;
      case 'col-header-lang':
        blr.W15yQC.DocumentsDialog.sortTreeAsStringOn('language',sortDir);
        break;
      case 'col-header-dir':
        blr.W15yQC.DocumentsDialog.sortTreeAsStringOn('dir',sortDir);
        break;
      case 'col-header-url':
        blr.W15yQC.DocumentsDialog.sortTreeAsStringOn('URL',sortDir);
        break;
      case 'col-header-cmode':
        blr.W15yQC.DocumentsDialog.sortTreeAsStringOn('compatMode',sortDir);
        break;
      case 'col-header-doctype':
        blr.W15yQC.DocumentsDialog.sortTreeAsStringOn('docType',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.DocumentsDialog.fnPopulateTree(blr.W15yQC.DocumentsDialog.aDocumentsList, blr.W15yQC.DocumentsDialog.aDocumentsList, true);
    blr.W15yQC.DocumentsDialog.updateControlStates();
    blr.W15yQC.DocumentsDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.DocumentsDialog.sortColumns.toString());
  },


  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(blr.W15yQC.DocumentsDialog.FirebugO, 'documents');
  },

  validateDocumentContents: function () {

    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex,
      outerHeight, outerWidth, outputWindow, reportDoc, form, de, ie, he;

    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.DocumentsDialog.aDisplayOrder[selectedRow];

      outputWindow = window.open('');
      reportDoc = outputWindow.document;
      form = reportDoc.createElement('form');
      form.setAttribute('method', 'post');
      form.setAttribute('action', 'http://validator.w3.org/check');
      form.setAttribute('enctype', 'multipart/form-data');

      de = blr.W15yQC.DocumentsDialog.aDocumentsList[selectedIndex].doc.documentElement;
      ie = reportDoc.createElement('input');
      ie.setAttribute('id', 'direct_prefill_no');
      ie.setAttribute('name', 'prefill');
      ie.setAttribute('value', '0');
      ie.setAttribute('checked', 'checked');
      ie.setAttribute('type', 'radio');
      he = reportDoc.createElement('input');
      he.setAttribute('type', 'hidden');
      he.setAttribute('name', 'fragment');
      he.setAttribute('id', 'fragment');
      he.setAttribute('value', '<' + de.nodeName + '>' + de.innerHTML + '</' + de.nodeName + '>');
      form.appendChild(he);
      reportDoc.body.appendChild(form);
      form.submit();
    }
  },

  validateDocumentURL: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex,
      URL;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.DocumentsDialog.aDisplayOrder[selectedRow];
      URL = blr.W15yQC.DocumentsDialog.aDocumentsList[selectedIndex].doc.URL;
      if (URL != null) {
        window.open('http://validator.w3.org/check?uri=' + encodeURI(URL) + '&charset=%28detect+automatically%29&doctype=Inline&group=0');
      }
    }
  }

};
