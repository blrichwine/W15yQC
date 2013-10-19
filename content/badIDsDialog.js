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

 * File:        badIDsDialog.js
 * Description: Handles displaying the accesskey check dialog
 * Author:	Brian Richwine
 * Created:	2012.08.20
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
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
 * Object:  QuickW15yBadIDsDialog
 * Returns:
 */
blr.W15yQC.badIDsDialog = {
  aDocumentsList: null,
  aBadIDsList: null,
  aDisplayOrder: [],
  sortColumns: [' Bad ID Number (asc)'],

  fnUpdateStatus: function(sLabel) {
    document.getElementById('progressMeterLabel').value=sLabel;
    document.getElementById('progressMeter').setAttribute('hidden','true');
    blr.W15yQC.fnDoEvents();
  },

  fnUpdatePercentage: function(p) {
    document.getElementById('progressMeter').value=p;
    document.getElementById('progressMeter').setAttribute('hidden','false');
    blr.W15yQC.fnDoEvents();
  },

  fnUpdateProgress: function(sLabel, fPercentage) {
    if(sLabel != null) {
      blr.W15yQC.badIDsDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.badIDsDialog.fnUpdatePercentage(fPercentage);
      document.getElementById('progressMeter').setAttribute('hidden','false');
    } else {
      document.getElementById('progressMeter').setAttribute('hidden','true');
    }
    blr.W15yQC.badIDsDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.badIDsDialog.aBadIDsList != null && blr.W15yQC.badIDsDialog.aBadIDsList.length>0) {
      if(blr.W15yQC.badIDsDialog.aDisplayOrder==null) {
        blr.W15yQC.badIDsDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.badIDsDialog.aDisplayOrder.length<blr.W15yQC.badIDsDialog.aBadIDsList.length) {
        blr.W15yQC.badIDsDialog.aDisplayOrder.push(blr.W15yQC.badIDsDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.badIDsDialog.aDisplayOrder=[];
    }
  },

  fnPopulateTree: function (aDocumentsList, aBadIDsList, bDontHideCols) {
    var tbc, ch, treecell, treeitem, treerow, i, ak, textbox, order;
    blr.W15yQC.badIDsDialog.updateDisplayOrderArray();
    order=blr.W15yQC.badIDsDialog.aDisplayOrder;
    if (aDocumentsList != null && aBadIDsList != null && aBadIDsList.length && aBadIDsList.length > 0) {
      tbc = document.getElementById('treeboxChildren');
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            if (aDocumentsList.length <= 1) {
              ch = document.getElementById('col-header-documentNumber');
              ch.setAttribute('hidden', 'true');
            }
        }
        for (i = 0; i < aBadIDsList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aBadIDsList[order[i]];

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
          treecell.setAttribute('label', ak.id);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.txtNotes);
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
        if (aBadIDsList.length == 1) {
          blr.W15yQC.badIDsDialog.updateNotesField([aDocumentsList, aBadIDsList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No duplicate or invalid IDs were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport, i;

    blr.W15yQC.fnReadUserPrefs();
    document.getElementById('button-inspectElement').hidden = !Application.prefs.getValue("devtools.inspector.enabled",false);

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document, dialog);
    blr.W15yQC.badIDsDialog.aDocumentsList = oW15yQCReport.aDocuments;

    blr.W15yQC.badIDsDialog.aBadIDsList = blr.W15yQC.fnGetBadIDs(window.opener.parent._content.document, blr.W15yQC.badIDsDialog.aDocumentsList);
    //blr.W15yQC.badIDsDialog.aBadIDsList = oW15yQCReport.aBadIDs;
    if(blr.W15yQC.badIDsDialog.aBadIDsList!=null) {
        for(i=0;i<blr.W15yQC.badIDsDialog.aBadIDsList.length;i++) {
            blr.W15yQC.badIDsDialog.aBadIDsList[i].txtNotes=blr.W15yQC.fnJoin(blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.badIDsDialog.aBadIDsList[i]),blr.W15yQC.fnWhyInvalidID(blr.W15yQC.badIDsDialog.aBadIDsList[i].id),' ');
        }
    }
    blr.W15yQC.badIDsDialog.fnPopulateTree(blr.W15yQC.badIDsDialog.aDocumentsList, blr.W15yQC.badIDsDialog.aBadIDsList);
    dialog.fnUpdateProgress('Ready',null);
  },

  updateControlStates: function() {

  },

  cleanup: function () {
    if (blr.W15yQC.badIDsDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.badIDsDialog.aDocumentsList);
    }
    blr.W15yQC.badIDsDialog.aDocumentsList = null;
    blr.W15yQC.badIDsDialog.aBadIDsList = null;
    blr.W15yQC.badIDsDialog.aDisplayOrder = null;
    blr.W15yQC.badIDsDialog.sortColumns = null;
  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'),
      textbox = document.getElementById('note-text'),
      selectedRow, selectedIndex, box, ak, whyInvalid;

    if (bHighlightElement === null) bHighlightElement = true;

    selectedRow = treebox.currentIndex;
    if (selectedRow == null || treebox.currentIndex < 0) {
      selectedRow = 0;
      bHighlightElement = false;
    }
    selectedIndex=blr.W15yQC.badIDsDialog.aDisplayOrder[selectedRow];
    ak=blr.W15yQC.badIDsDialog.aBadIDsList[selectedIndex];

    if (ak.notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(ak);
    } else {
      textbox.value = '';
    }

    whyInvalid=blr.W15yQC.fnWhyInvalidID(ak.id);
    if(blr.W15yQC.fnStringHasContent(whyInvalid)) { textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Why Invalid: ' + whyInvalid, "\n"); }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, ak.nodeDescription, "\n\n");
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + ak.xpath, "\n\n");
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'BaseURI: ' + blr.W15yQC.badIDsDialog.aDocumentsList[ak.ownerDocumentNumber - 1].URL, "\n");

    if (ak.node != null) {
      box = ak.node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
      }
    }

    blr.W15yQC.fnResetHighlights(blr.W15yQC.badIDsDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(ak.node);
      } catch (err) {}
    }
    if (bHighlightElement != false) blr.W15yQC.highlightElement(ak.node);
  },


  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.badIDsDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.badIDsDialog.sortColumns.splice(blr.W15yQC.badIDsDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.badIDsDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.badIDsDialog.sortColumns.splice(blr.W15yQC.badIDsDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.badIDsDialog.sortColumns.length>3) { blr.W15yQC.badIDsDialog.sortColumns.pop(); }
    blr.W15yQC.badIDsDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.badIDsDialog.aBadIDsList, order=blr.W15yQC.badIDsDialog.aDisplayOrder;
    blr.W15yQC.badIDsDialog.addSortColumn(index, ascending);
    blr.W15yQC.badIDsDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.badIDsDialog.sortColumns.toString());
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
    var i,j,temp,list=blr.W15yQC.badIDsDialog.aBadIDsList, order=blr.W15yQC.badIDsDialog.aDisplayOrder;
    blr.W15yQC.badIDsDialog.addSortColumn(index, ascending);
    blr.W15yQC.badIDsDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.badIDsDialog.sortColumns.toString());
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
    blr.W15yQC.badIDsDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.badIDsDialog.aDisplayOrder=[];
        blr.W15yQC.badIDsDialog.sortColumns=[' Bad ID Number (asc)'];
        blr.W15yQC.badIDsDialog.updateDisplayOrderArray();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.badIDsDialog.sortTreeAsNumberOn('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.badIDsDialog.aBadIDsList;
        ad=blr.W15yQC.badIDsDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.badIDsDialog.sortTreeAsStringOn('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
        blr.W15yQC.badIDsDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-id':
        blr.W15yQC.badIDsDialog.sortTreeAsStringOn('id',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    if(colID!='col-header-sourceOrder') { col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending'); }
    blr.W15yQC.badIDsDialog.fnPopulateTree(blr.W15yQC.badIDsDialog.aDocumentsList, blr.W15yQC.badIDsDialog.aBadIDsList, true);
    blr.W15yQC.badIDsDialog.updateControlStates();
    blr.W15yQC.badIDsDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.badIDsDialog.sortColumns.toString());
  },


  inspectElement: function () {
    var treebox, selectedRow, selectedIndex, node;
      try {
        if (blr.W15yQC.badIDsDialog.aBadIDsList != null && blr.W15yQC.badIDsDialog.aBadIDsList.length && blr.W15yQC.badIDsDialog.aBadIDsList.length > 0) {
          treebox = document.getElementById('treebox');
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=blr.W15yQC.badIDsDialog.aDisplayOrder[selectedRow];
          blr.W15yQC.fnResetHighlights(blr.W15yQC.badIDsDialog.aDocumentsList);
          node=blr.W15yQC.badIDsDialog.aBadIDsList[selectedIndex].node;
          node.ownerDocument.defaultView.focus();
          blr.W15yQC.inspectNode(node);
        }
      } catch (ex) {}
  },

  moveToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.badIDsDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnMoveToElement(blr.W15yQC.badIDsDialog.aBadIDsList[selectedIndex].node);
      blr.W15yQC.highlightElement(blr.W15yQC.badIDsDialog.aBadIDsList[selectedIndex].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.badIDsDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.badIDsDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.badIDsDialog.aBadIDsList[selectedIndex].node);
    }
  }

};
