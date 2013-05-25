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
if (!blr) {
  var blr = {};
}

/*
 * Object:  QuickW15yTablesDialog
 * Returns:
 */
blr.W15yQC.TablesDialog = {
  oFirebug: null,
  aDocumentsList: null,
  aTablesList: null,
  aDisplayOrder: [],
  sortColumns: [' Table Number (asc)'],

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
      if (aTablesList.length == 1) {
        blr.W15yQC.TablesDialog.updateNotesField([aDocumentsList, aTablesList], false);
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No Table elements were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport;

    blr.W15yQC.fnReadUserPrefs();
    if (dialog != null && dialog.arguments != null && dialog.arguments.length > 1) {
      blr.W15yQC.TablesDialog.FirebugO = dialog.arguments[1];
    }
    if (blr.W15yQC.TablesDialog.FirebugO == null || !blr.W15yQC.TablesDialog.FirebugO.Inspector) {
      document.getElementById('button-showInFirebug').hidden = true;
    }

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document, dialog);
    blr.W15yQC.TablesDialog.aDocumentsList = oW15yQCReport.aDocuments;

    blr.W15yQC.TablesDialog.aTablesList = oW15yQCReport.aTables;
    blr.W15yQC.fnAnalyzeTables(oW15yQCReport);
    blr.W15yQC.TablesDialog.fnPopulateTree(blr.W15yQC.TablesDialog.aDocumentsList, blr.W15yQC.TablesDialog.aTablesList);
    dialog.fnUpdateProgress('Ready',null);
  },

  updateControlStates: function() {

  },

  cleanup: function () {
    if (blr.W15yQC.TablesDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
      blr.W15yQC.TablesDialog.aDocumentsList = null;
      blr.W15yQC.TablesDialog.aTablesList = null;
    }
  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'), textbox = document.getElementById('note-text'),
        selectedIndex, selectedRow;
    if (bHighlightElement === null) bHighlightElement = true;

    selectedRow = treebox.currentIndex;
    blr.W15yQC.fnLog('selectedRow after init:' + selectedRow);
    if (selectedRow == null || treebox.currentIndex < 0) {
      selectedRow = 0;
      bHighlightElement = false;
    }
    selectedIndex=blr.W15yQC.TablesDialog.aDisplayOrder[selectedRow];


    if (blr.W15yQC.TablesDialog.aTablesList[selectedIndex].notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.TablesDialog.aTablesList[selectedIndex]);
    } else {
      textbox.value = '';
    }

    if (blr.W15yQC.TablesDialog.aTablesList[selectedIndex].summary != null) {
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Summary: ' + blr.W15yQC.TablesDialog.aTablesList[selectedIndex].summary, "\n\n");
    }

    if (blr.W15yQC.TablesDialog.aTablesList[selectedIndex].caption != null) {
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Caption: ' + blr.W15yQC.TablesDialog.aTablesList[selectedIndex].caption, "\n\n");
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.TablesDialog.aTablesList[selectedIndex].nodeDescription, "\n\n");

    if (blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node != null) {
      var box = blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
      }
    }
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + blr.W15yQC.TablesDialog.aTablesList[selectedIndex].xpath, "\n");

    blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node);
      } catch (err) {}
    }
    if (bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node, blr.W15yQC.TablesDialog.aTablesList[selectedIndex].doc);
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
      blr.W15yQC.highlightElement(blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node, blr.W15yQC.TablesDialog.aTablesList[selectedIndex].doc);
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

  showInFirebug: function () {
    if (blr.W15yQC.TablesDialog.FirebugO != null) {
      try {
        if (blr.W15yQC.TablesDialog.aTablesList != null && blr.W15yQC.TablesDialog.aTablesList.length && blr.W15yQC.TablesDialog.aTablesList.length > 0) {
          var treebox = document.getElementById('treebox');
          var selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=blr.W15yQC.TablesDialog.aDisplayOrder[selectedRow];
          //blr.W15yQC.TablesDialog.nodeToInspect = blr.W15yQC.TablesDialog.aTablesList[selectedRow].node;
          //blr.W15yQC.TablesDialog.FirebugO.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(blr.W15yQC.TablesDialog.nodeToInspect);});
          //oncommand=void function(arg){Firebug.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(arg);})}(document.popupNode)
          //blr.W15yQC.TablesDialog.FirebugO.
          blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
          blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node.ownerDocument.defaultView.focus();
          void
          function (arg) {
            blr.W15yQC.TablesDialog.FirebugO.GlobalUI.startFirebug(function () {
              blr.W15yQC.TablesDialog.FirebugO.Inspector.inspectFromContextMenu(arg);
            })
          }(blr.W15yQC.TablesDialog.aTablesList[selectedIndex].node);
          //blr.W15yQC.showInFirebug(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node,blr.W15yQC.TablesDialog.firebugO);
        }
      } catch (ex) {}
    }
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(blr.W15yQC.TablesDialog.FirebugO, 'tables');
  }

}
