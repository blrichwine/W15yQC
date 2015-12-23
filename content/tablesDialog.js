/*
   This file is part of W15y Quick Check
   Copyright (C) 2011, 2012, 2013, 2014, 2015 Brian L. Richwine

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
"use strict";

var blr=this.arguments[0];

function fnUpdateStatus(sLabel) {
  document.getElementById('progressMeterLabel').value=sLabel;
  document.getElementById('progressMeter').setAttribute('hidden','true');
  blr.W15yQC.fnDoEvents();
}

function fnUpdatePercentage(fPercentage) {
  document.getElementById('progressMeter').value=fPercentage;
  document.getElementById('progressMeter').setAttribute('hidden','false');
  blr.W15yQC.fnDoEvents();
}

function fnUpdateProgress(sLabel, fPercentage) {
  document.getElementById('progressMeterLabel').value=(sLabel==null ? '' : sLabel);
  if(fPercentage != null) {
    document.getElementById('progressMeter').value=fPercentage;
    document.getElementById('progressMeter').setAttribute('hidden','false');
  } else {
    document.getElementById('progressMeter').setAttribute('hidden','true');
  }
  blr.W15yQC.fnDoEvents();
}

function fnDelayedInit() {
  window.setTimeout(function(){blr.W15yQC.TablesDialog.init(window);}, 0);
}

/*
 * Object:  QuickW15yTablesDialog
 * Returns:
 */
blr.W15yQC.TablesDialog = {
  aDocumentsList: null,
  aTablesList: null,
  aDisplayOrder: [],
  sortColumns: [' Table Number (asc)'],
  bCmdIsPressed:false,

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
      blr.W15yQC.TablesDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.TablesDialog.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.TablesDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.TablesDialog.aTablesList != null && blr.W15yQC.TablesDialog.aTablesList.length>0) {
      if(blr.W15yQC.TablesDialog.aDisplayOrder==null) {
        blr.W15yQC.TablesDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.TablesDialog.aDisplayOrder.length<blr.W15yQC.TablesDialog.aTablesList.length) {
        blr.W15yQC.TablesDialog.aDisplayOrder.push(blr.W15yQC.TablesDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.TablesDialog.aDisplayOrder=[];
    }
  },

  fnPopulateTree: function (aDocumentsList, aTablesList, bDontHideCols) {
    var i, ak, ch, tbc = document.getElementById('treeboxChildren'), order, bHasCaption=false, bHasParentTable=false, bHasSummary=false,
        treecell, treeitem, treerow, textbox;
    blr.W15yQC.TablesDialog.updateDisplayOrderArray();
    order=blr.W15yQC.TablesDialog.aDisplayOrder;
    if (aDocumentsList != null && aTablesList != null && aTablesList.length && aTablesList.length > 0) {
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            for (i = 0; i < aTablesList.length; i++) {
              ak = aTablesList[i];
              if (ak.caption != null && ak.caption.length > 0) bHasCaption = true;
              if (ak.summary != null && ak.summary.length > 0) bHasSummary = true;
              if (ak.parentTable != null && ak.parentTable > 0) bHasSummary = true;
            }
            if (!bHasCaption) {
              ch = document.getElementById('col-header-caption');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasSummary) {
              ch = document.getElementById('col-header-summary');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasParentTable) {
              ch = document.getElementById('col-header-parentTable');
              ch.setAttribute('hidden', 'true');
            }
            if (aDocumentsList.length <= 1) {
              ch = document.getElementById('col-header-documentNumber');
              ch.setAttribute('hidden', 'true');
            }
        }
        for (i = 0; i < aTablesList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aTablesList[order[i]];

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

          if (ak.failed) {
            treerow.setAttribute('properties', 'failed');
          } else if (ak.warning) {
            treerow.setAttribute('properties', 'warning');
          }

          treeitem.appendChild(treerow);
          tbc.appendChild(treeitem);
        }
      }
      if (bDontHideCols!=true) { blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox')); }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No Table elements were detected.";
    }
  },

  selectFirstRow: function() {
    var treebox = document.getElementById('treebox');
    try{
      if (treebox!=null) {
        treebox.view.selection.select(0);
        treebox.getElementsByTagName('treerow')[0].focus();
      }
    } catch(ex) {}
  },
  
  init: function (dialog) {
    var oW15yQCReport;

    blr.W15yQC.fnReadUserPrefs();
    document.getElementById('button-inspectElement').hidden = !blr.W15yQC.getBoolPref("devtools.inspector.enabled",false);

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document, dialog);
    blr.W15yQC.TablesDialog.aDocumentsList = oW15yQCReport.aDocuments;

    blr.W15yQC.TablesDialog.aTablesList = oW15yQCReport.aTables;
    blr.W15yQC.fnAnalyzeTables(oW15yQCReport);
    blr.W15yQC.TablesDialog.fnPopulateTree(blr.W15yQC.TablesDialog.aDocumentsList, blr.W15yQC.TablesDialog.aTablesList);
    blr.W15yQC.TablesDialog.selectFirstRow();
    dialog.fnUpdateProgress('Ready',null);
  },

  updateControlStates: function() {

  },

  cleanup: function () {
    if (blr.W15yQC.TablesDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
    }
    blr.W15yQC.TablesDialog.aDocumentsList = null;
    blr.W15yQC.TablesDialog.aTablesList = null;
    blr.W15yQC.TablesDialog.aDisplayOrder = null;
    blr.W15yQC.TablesDialog.sortColumns = null;
  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'), textbox = document.getElementById('note-text'),
        selectedIndex, selectedRow, ak;
    if (bHighlightElement === null) bHighlightElement = true;

    selectedRow = treebox.currentIndex;
    blr.W15yQC.fnLog('selectedRow after init:' + selectedRow);
    if (selectedRow == null || treebox.currentIndex < 0) {
      selectedRow = 0;
      bHighlightElement = false;
    }
    selectedIndex=blr.W15yQC.TablesDialog.aDisplayOrder[selectedRow];
    ak=blr.W15yQC.TablesDialog.aTablesList[selectedIndex];

    if (ak.notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(ak);
    } else {
      textbox.value = '';
    }

    if (ak.summary != null) {
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Summary: ' + ak.summary, "\n\n");
    }

    if (ak.caption != null) {
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Caption: ' + ak.caption, "\n\n");
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, ak.nodeDescription, "\n\n");

    if (ak.node != null) {
      var box = ak.node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
      }
    }
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + ak.xpath, "\n");

    blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(ak.node);
      } catch (err) {}
    }
    if (bHighlightElement != false) blr.W15yQC.highlightElement(ak.node);
  },

  highlightTables: function () {
    //try {
    if (blr.W15yQC.TablesDialog.aDocumentsList != null && blr.W15yQC.TablesDialog.aDocumentsList.length > 0) {
      blr.W15yQC.Highlighters.highlightTables(blr.W15yQC.TablesDialog.aDocumentsList);
    }
    //} catch (err) { }
  },

  moveToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.TablesDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
      blr.W15yQC.fnMoveToElement(blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node);
      blr.W15yQC.highlightElement(blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.TablesDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node);
    }
  },

  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.TablesDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.TablesDialog.sortColumns.splice(blr.W15yQC.TablesDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.TablesDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.TablesDialog.sortColumns.splice(blr.W15yQC.TablesDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.TablesDialog.sortColumns.length>3) { blr.W15yQC.TablesDialog.sortColumns.pop(); }
    blr.W15yQC.TablesDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.TablesDialog.aTablesList, order=blr.W15yQC.TablesDialog.aDisplayOrder;
    blr.W15yQC.TablesDialog.addSortColumn(index, ascending);
    blr.W15yQC.TablesDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.TablesDialog.sortColumns.toString());
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
    var i,j,temp,list=blr.W15yQC.TablesDialog.aTablesList, order=blr.W15yQC.TablesDialog.aDisplayOrder;
    blr.W15yQC.TablesDialog.addSortColumn(index, ascending);
    blr.W15yQC.TablesDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.TablesDialog.sortColumns.toString());
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
    blr.W15yQC.TablesDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.TablesDialog.aDisplayOrder=[];
        blr.W15yQC.TablesDialog.sortColumns=[' Table Number (asc)'];
        blr.W15yQC.TablesDialog.updateDisplayOrderArray();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.TablesDialog.sortTreeAsNumberOn('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-parentTable':
        blr.W15yQC.TablesDialog.sortTreeAsNumberOn('parentTable',sortDir);
        break;
      case 'col-header-nestingLevel':
        blr.W15yQC.TablesDialog.sortTreeAsNumberOn('nestingLevel',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.TablesDialog.aTablesList;
        ad=blr.W15yQC.TablesDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.TablesDialog.sortTreeAsStringOn('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
        blr.W15yQC.TablesDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-summary':
        blr.W15yQC.TablesDialog.sortTreeAsStringOn('summary',sortDir);
        break;
      case 'col-header-caption':
        blr.W15yQC.TablesDialog.sortTreeAsStringOn('caption',sortDir);
        break;
      case 'col-header-maxColumns':
        blr.W15yQC.TablesDialog.sortTreeAsNumberOn('maxCols',sortDir);
        break;
      case 'col-header-rows':
        blr.W15yQC.TablesDialog.sortTreeAsNumberOn('maxRows',sortDir);
        break;
      case 'col-header-title':
        blr.W15yQC.TablesDialog.sortTreeAsStringOn('title',sortDir);
        break;
      case 'col-header-role':
        blr.W15yQC.TablesDialog.sortTreeAsStringOn('role',sortDir);
        break;
      case 'col-header-state':
        blr.W15yQC.TablesDialog.sortTreeAsStringOn('stateDescription',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.TablesDialog.fnPopulateTree(blr.W15yQC.TablesDialog.aDocumentsList, blr.W15yQC.TablesDialog.aTablesList, true);
    blr.W15yQC.TablesDialog.updateControlStates();
    blr.W15yQC.TablesDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.TablesDialog.sortColumns.toString());
  },

  inspectElement: function () {
    var treebox, selectedRow, selectedIndex, node;
      try {
        if (blr.W15yQC.TablesDialog.aTablesList != null && blr.W15yQC.TablesDialog.aTablesList.length && blr.W15yQC.TablesDialog.aTablesList.length > 0) {
          var treebox = document.getElementById('treebox');
          var selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=blr.W15yQC.TablesDialog.aDisplayOrder[selectedRow];
          blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
          node=blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node;
          node.ownerDocument.defaultView.focus();
          blr.W15yQC.inspectNode(node);
        }
      } catch (ex) {}
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(false,'tables');
  },
  
  windowOnKeyDown: function (dialog, evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.TablesDialog.bCmdIsPressed = true;
        break;
      case 27:
        dialog.close();
        break;
      case 87:
        if (blr.W15yQC.TablesDialog.bCmdIsPressed == true) {
            evt.stopPropagation();
            evt.preventDefault();
            blr.W15yQC.TablesDialog.cleanup();
            dialog.close();
        }
        break;
    }
  },

  windowOnKeyUp: function (evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.TablesDialog.bCmdIsPressed = false;
        break;
    }
  }

}
