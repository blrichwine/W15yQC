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

 * File:        ariaLandmarksDialog.js
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
"use strict";

if (typeof blr == "undefined" || !blr) {var blr = {}};

/*
 * Object:  QuickW15yLandmarksDialog
 * Returns:
 */

(function() {
blr.W15yQC.LandmarksDialog = {
  aDocumentsList: null,
  aARIALandmarksList: null,
  aDisplayOrder: [],
  sortColumns: [' Landmark Number (asc)'],

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
      blr.W15yQC.LandmarksDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.LandmarksDialog.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.LandmarksDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.LandmarksDialog.aARIALandmarksList != null && blr.W15yQC.LandmarksDialog.aARIALandmarksList.length>0) {
      if(blr.W15yQC.LandmarksDialog.aDisplayOrder==null) {
        blr.W15yQC.LandmarksDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.LandmarksDialog.aDisplayOrder.length<blr.W15yQC.LandmarksDialog.aARIALandmarksList.length) {
        blr.W15yQC.LandmarksDialog.aDisplayOrder.push(blr.W15yQC.LandmarksDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.LandmarksDialog.aDisplayOrder=[];
    }
  },

  fnPopulateTree: function (aDocumentsList, aARIALandmarksList, bDontHideCols) {
    var tbc, ak, ch, i, treecell, treeitem, treerow, textbox, bHasStateDescription, order;
    blr.W15yQC.LandmarksDialog.updateDisplayOrderArray();
    order=blr.W15yQC.LandmarksDialog.aDisplayOrder;

    if (aDocumentsList != null && aARIALandmarksList != null && aARIALandmarksList.length && aARIALandmarksList.length > 0) {
      tbc = document.getElementById('treeboxChildren');
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            bHasStateDescription = false;
            for (i = 0; i < aARIALandmarksList.length; i++) {
              ak = aARIALandmarksList[i];
              if (ak.stateDescription) bHasStateDescription = true;
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

        for (i = 0; i < aARIALandmarksList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aARIALandmarksList[order[i]];

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
        if (aARIALandmarksList.length == 1) {
          blr.W15yQC.LandmarksDialog.updateNotesField([aDocumentsList, aARIALandmarksList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No ARIA Landmarks were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport;

    blr.W15yQC.fnReadUserPrefs();
    document.getElementById('button-inspectElement').hidden = !Application.prefs.getValue("devtools.inspector.enabled",false);

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document, dialog);
    blr.W15yQC.LandmarksDialog.aDocumentsList = oW15yQCReport.aDocuments;
    blr.W15yQC.LandmarksDialog.aARIALandmarksList = oW15yQCReport.aARIALandmarks;
    blr.W15yQC.fnAnalyzeARIALandmarks(oW15yQCReport);

    blr.W15yQC.LandmarksDialog.fnPopulateTree(blr.W15yQC.LandmarksDialog.aDocumentsList, blr.W15yQC.LandmarksDialog.aARIALandmarksList);
  },

  cleanup: function () {
    if (blr.W15yQC.LandmarksDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.LandmarksDialog.aDocumentsList);
    }
    blr.W15yQC.LandmarksDialog.aDocumentsList = null;
    blr.W15yQC.LandmarksDialog.aARIALandmarksList = null;
    blr.W15yQC.LandmarksDialog.aDisplayOrder = null;
    blr.W15yQC.LandmarksDialog.sortColumns = null;
  },

  updateControlStates: function() {

  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'),
      textbox = document.getElementById('note-text'),
      selectedRow, selectedIndex, box, ak;

    if (bHighlightElement === null) bHighlightElement = true;

    selectedRow = treebox.currentIndex;
    if (selectedRow == null || treebox.currentIndex < 0) {
      selectedRow = 0;
      bHighlightElement = false;
    }
    selectedIndex=blr.W15yQC.LandmarksDialog.aDisplayOrder[selectedRow];
    ak=blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedIndex];

    if (ak.notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedRow]);
    } else {
      textbox.value = '';
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, ak.nodeDescription, "\n\n");
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + ak.xpath, "\n\n");
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'BaseURI: ' + blr.W15yQC.LandmarksDialog.aDocumentsList[ak.ownerDocumentNumber - 1].URL, "\n");

    if (ak.node != null) {
      box = ak.node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
      }
    }

    blr.W15yQC.fnResetHighlights(blr.W15yQC.LandmarksDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(ak.node);
      } catch (err) {}
    }
    if (bHighlightElement != false) {
      blr.W15yQC.highlightElement(ak.node);
    }
  },

  moveToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.LandmarksDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.LandmarksDialog.aDocumentsList);
      blr.W15yQC.fnMoveToElement(blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedIndex].node);
      blr.W15yQC.highlightElement(blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedIndex].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex, nodeWindow, tab;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.LandmarksDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.LandmarksDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedIndex].node);
    }
  },

  
  highlightARIALandmarks: function () {
    blr.W15yQC.fnResetHighlights(blr.W15yQC.LandmarksDialog.aDocumentsList);
    blr.W15yQC.Highlighters.highlightARIALandmarks(blr.W15yQC.LandmarksDialog.aDocumentsList, blr.W15yQC.LandmarksDialog.aARIALandmarksList);
  },


  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.LandmarksDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.LandmarksDialog.sortColumns.splice(blr.W15yQC.LandmarksDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.LandmarksDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.LandmarksDialog.sortColumns.splice(blr.W15yQC.LandmarksDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.LandmarksDialog.sortColumns.length>3) { blr.W15yQC.LandmarksDialog.sortColumns.pop(); }
    blr.W15yQC.LandmarksDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.LandmarksDialog.aARIALandmarksList, order=blr.W15yQC.LandmarksDialog.aDisplayOrder;
    blr.W15yQC.LandmarksDialog.addSortColumn(index, ascending);
    blr.W15yQC.LandmarksDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.LandmarksDialog.sortColumns.toString());
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
    var i,j,temp,list=blr.W15yQC.LandmarksDialog.aARIALandmarksList, order=blr.W15yQC.LandmarksDialog.aDisplayOrder;
    blr.W15yQC.LandmarksDialog.addSortColumn(index, ascending);
    blr.W15yQC.LandmarksDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.LandmarksDialog.sortColumns.toString());
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
    blr.W15yQC.LandmarksDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.LandmarksDialog.aDisplayOrder=[];
        blr.W15yQC.LandmarksDialog.sortColumns=[' Link Number (asc)'];
        blr.W15yQC.LandmarksDialog.updateDisplayOrderArray();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.LandmarksDialog.sortTreeAsNumberOn('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.LandmarksDialog.aARIALandmarksList;
        ad=blr.W15yQC.LandmarksDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.LandmarksDialog.sortTreeAsStringOn('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
        blr.W15yQC.LandmarksDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-effectiveLabel':
        blr.W15yQC.LandmarksDialog.sortTreeAsStringOn('effectiveLabel',sortDir);
        break;
      case 'col-header-labelSource':
        blr.W15yQC.LandmarksDialog.sortTreeAsStringOn('effectiveLabelSource',sortDir);
        break;
      case 'col-header-role':
        blr.W15yQC.LandmarksDialog.sortTreeAsStringOn('role',sortDir);
        break;
      case 'col-header-state':
        blr.W15yQC.LandmarksDialog.sortTreeAsStringOn('stateDescription',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.LandmarksDialog.fnPopulateTree(blr.W15yQC.LandmarksDialog.aDocumentsList, blr.W15yQC.LandmarksDialog.aARIALandmarksList, true);
    blr.W15yQC.LandmarksDialog.updateControlStates();
    blr.W15yQC.LandmarksDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.LandmarksDialog.sortColumns.toString());
  },


  inspectElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex, node;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.LandmarksDialog.aDisplayOrder[selectedRow];
      node=blr.W15yQC.LandmarksDialog.aARIALandmarksList[selectedIndex].node;
      if (node!=null) {
        blr.W15yQC.fnResetHighlights(blr.W15yQC.LandmarksDialog.aDocumentsList);
        blr.W15yQC.inspectNode(node);
      }
    }
  },

  generateReportHTML: function () {
    blr.W15yQC.fnResetHighlights(blr.W15yQC.LandmarksDialog.aDocumentsList);
    blr.W15yQC.openHTMLReportWindow(false,'landmarks');
  }

}
})();
