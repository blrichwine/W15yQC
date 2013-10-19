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
"use strict";

if (!blr) {
  var blr = {};
}

/*
 * Object:  QuickW15yAccessKeyDialog
 * Returns:
 */
blr.W15yQC.AccessKeyDialog = {
  aDocumentsList: null,
  aAccessKeysList: null,
  aDisplayOrder: [],
  sortColumns: [' Access Key Number (asc)'],

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
      blr.W15yQC.AccessKeyDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.AccessKeyDialog.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.AccessKeyDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.AccessKeyDialog.aAccessKeysList != null && blr.W15yQC.AccessKeyDialog.aAccessKeysList.length>0) {
      if(blr.W15yQC.AccessKeyDialog.aDisplayOrder==null) {
        blr.W15yQC.AccessKeyDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.AccessKeyDialog.aDisplayOrder.length<blr.W15yQC.AccessKeyDialog.aAccessKeysList.length) {
        blr.W15yQC.AccessKeyDialog.aDisplayOrder.push(blr.W15yQC.AccessKeyDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.AccessKeyDialog.aDisplayOrder=[];
    }
  },


  fnPopulateTree: function (aDocumentsList, aAccessKeysList, bDontHideCols) {
    var tbc, bHasRole, bHasStateDescription, i, ak, ch, treecell, treeitem, treerow, textbox, order;
    blr.W15yQC.AccessKeyDialog.updateDisplayOrderArray();
    order=blr.W15yQC.AccessKeyDialog.aDisplayOrder;
    if (aDocumentsList != null && aAccessKeysList != null && aAccessKeysList.length && aAccessKeysList.length > 0) {
      tbc = document.getElementById('treeboxChildren');
      bHasRole = false;
      bHasStateDescription = false;
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            for (i = 0; i < aAccessKeysList.length; i++) {
              ak = aAccessKeysList[i];
              if (ak.role) bHasRole = true;
              if (ak.stateDescription) bHasStateDescription = true;
            }
            if (!bHasRole) {
              ch = document.getElementById('col-header-role');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasStateDescription) {
              ch = document.getElementById('col-header-state');
              ch.setAttribute('hidden', 'true');
            }
            if (aDocumentsList.length <= 1) {
              ch = document.getElementById('col-header-documentNumber');
              ch.setAttribute('hidden', 'true');
            }
        }
        for (i = 0; i < aAccessKeysList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aAccessKeysList[order[i]];

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.ownerDocumentNumber);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', aDocumentsList[ak.ownerDocumentNumber - 1].URL);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.nodeDescription);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.accessKey);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.effectiveLabel);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.effectiveLabelSource);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.role);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.stateDescription);
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
        if (aAccessKeysList.length == 1) {
          blr.W15yQC.AccessKeyDialog.updateNotesField([aDocumentsList, aAccessKeysList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No access keys were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport;

    blr.W15yQC.fnReadUserPrefs();

    document.getElementById('button-inspectElement').hidden = !Application.prefs.getValue("devtools.inspector.enabled",false);

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document, dialog);
    blr.W15yQC.AccessKeyDialog.aDocumentsList = oW15yQCReport.aDocuments;
    blr.W15yQC.AccessKeyDialog.aAccessKeysList = oW15yQCReport.aAccessKeys;

    blr.W15yQC.fnAnalyzeAccessKeys(oW15yQCReport);

    blr.W15yQC.AccessKeyDialog.fnPopulateTree(blr.W15yQC.AccessKeyDialog.aDocumentsList, blr.W15yQC.AccessKeyDialog.aAccessKeysList);
    dialog.fnUpdateProgress('Ready', null);
  },

  updateControlStates: function() {

  },

  cleanup: function () {
    if (blr.W15yQC.AccessKeyDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.AccessKeyDialog.aDocumentsList);
    }
    blr.W15yQC.AccessKeyDialog.aDocumentsList = null;
    blr.W15yQC.AccessKeyDialog.aAccessKeysList = null;
    blr.W15yQC.AccessKeyDialog.aDisplayOrder = null;
    blr.W15yQC.AccessKeyDialog.sortColumns = null;
  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'),
      textbox = document.getElementById('note-text'),
      selectedRow, box, ak;

    if (bHighlightElement === null) bHighlightElement = true;

    selectedRow = treebox.currentIndex;
    if (selectedRow == null || treebox.currentIndex < 0) {
      selectedRow = 0;
      bHighlightElement = false;
    }
    selectedIndex=blr.W15yQC.AccessKeyDialog.aDisplayOrder[selectedRow];
    ak=blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedIndex];

    if (ak.notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(ak);
    } else {
      textbox.value = '';
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, ak.nodeDescription, "\n\n");
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + ak.xpath, "\n");
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'BaseURI: ' + blr.W15yQC.AccessKeyDialog.aDocumentsList[ak.ownerDocumentNumber - 1].URL, "\n\n");

    if (ak.node != null) {
      box = ak.node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
      }
    }

    blr.W15yQC.fnResetHighlights(blr.W15yQC.AccessKeyDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(ak.node);
      } catch (err) {}
    }
    if (bHighlightElement != false) blr.W15yQC.highlightElement(ak.node);
  },



  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.AccessKeyDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.AccessKeyDialog.sortColumns.splice(blr.W15yQC.AccessKeyDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.AccessKeyDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.AccessKeyDialog.sortColumns.splice(blr.W15yQC.AccessKeyDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.AccessKeyDialog.sortColumns.length>3) { blr.W15yQC.AccessKeyDialog.sortColumns.pop(); }
    blr.W15yQC.AccessKeyDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.AccessKeyDialog.aAccessKeysList, order=blr.W15yQC.AccessKeyDialog.aDisplayOrder;
    blr.W15yQC.AccessKeyDialog.addSortColumn(index, ascending);
    blr.W15yQC.AccessKeyDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.AccessKeyDialog.sortColumns.toString());
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
    var i,j,temp,list=blr.W15yQC.AccessKeyDialog.aAccessKeysList, order=blr.W15yQC.AccessKeyDialog.aDisplayOrder;
    blr.W15yQC.AccessKeyDialog.addSortColumn(index, ascending);
    blr.W15yQC.AccessKeyDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.AccessKeyDialog.sortColumns.toString());
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
    blr.W15yQC.AccessKeyDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.AccessKeyDialog.aDisplayOrder=[];
        blr.W15yQC.AccessKeyDialog.sortColumns=[' Link Number (asc)'];
        blr.W15yQC.AccessKeyDialog.updateDisplayOrderArray();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.AccessKeyDialog.sortTreeAsNumberOn('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.AccessKeyDialog.aAccessKeysList;
        ad=blr.W15yQC.AccessKeyDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.AccessKeyDialog.sortTreeAsStringOn('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
        blr.W15yQC.AccessKeyDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-accessKey':
        blr.W15yQC.AccessKeyDialog.sortTreeAsStringOn('accessKey',sortDir);
        break;
      case 'col-header-effectiveLabel':
        blr.W15yQC.AccessKeyDialog.sortTreeAsStringOn('effectiveLabel',sortDir);
        break;
      case 'col-header-labelSource':
        blr.W15yQC.AccessKeyDialog.sortTreeAsStringOn('effectiveLabelSource',sortDir);
        break;
      case 'col-header-role':
        blr.W15yQC.AccessKeyDialog.sortTreeAsStringOn('role',sortDir);
        break;
      case 'col-header-state':
        blr.W15yQC.AccessKeyDialog.sortTreeAsStringOn('stateDescription',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.AccessKeyDialog.fnPopulateTree(blr.W15yQC.AccessKeyDialog.aDocumentsList, blr.W15yQC.AccessKeyDialog.aAccessKeysList, true);
    blr.W15yQC.AccessKeyDialog.updateControlStates();
    blr.W15yQC.AccessKeyDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.AccessKeyDialog.sortColumns.toString());
  },


  inspectElement: function () {
    var treebox, selectedRow, selectedIndex, node;
      try {
        if (blr.W15yQC.AccessKeyDialog.aAccessKeysList != null && blr.W15yQC.AccessKeyDialog.aAccessKeysList.length && blr.W15yQC.AccessKeyDialog.aAccessKeysList.length > 0) {
          treebox = document.getElementById('treebox');
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=blr.W15yQC.AccessKeyDialog.aDisplayOrder[selectedRow];
          blr.W15yQC.fnResetHighlights(blr.W15yQC.AccessKeyDialog.aDocumentsList);
          node=blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedIndex].node;
          node.ownerDocument.defaultView.focus();
          blr.W15yQC.inspectNode(node);
        }
      } catch (ex) {}
  },

  moveToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.AccessKeyDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.AccessKeyDialog.aDocumentsList);
      blr.W15yQC.fnMoveToElement(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedIndex].node);
      blr.W15yQC.highlightElement(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedIndex].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.AccessKeyDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.AccessKeyDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedIndex].node);
    }
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(false,'accesskeys');
  }

};
