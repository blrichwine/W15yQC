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

 * File:        framesDialog.js
 * Description: Handles displaying the ARIA Landmarks quick check dialog
 * Author:	Brian Richwine
 * Created:	2011.12.17
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2011.12.17 - Created!
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
 * Object:  QuickW15yFramesDialog
 * Returns:
 */
blr.W15yQC.FramesDialog = {
  aFramesList: null,
  aDocumentsList: null,
  aDisplayOrder: [],
  sortColumns: [' Frame Number (asc)'],


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
      blr.W15yQC.FramesDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.FramesDialog.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.FramesDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.FramesDialog.aFramesList != null && blr.W15yQC.FramesDialog.aFramesList.length>0) {
      if(blr.W15yQC.FramesDialog.aDisplayOrder==null) {
        blr.W15yQC.FramesDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.FramesDialog.aDisplayOrder.length<blr.W15yQC.FramesDialog.aFramesList.length) {
        blr.W15yQC.FramesDialog.aDisplayOrder.push(blr.W15yQC.FramesDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.FramesDialog.aDisplayOrder=[];
    }
  },


  fnPopulateTree: function (aDocumentsList, aFramesList, bDontHideCols) {
    var tbc, bHasRole, bHasStateDescription, i, ak, ch, treecell, treeitem, treerow, textbox, order;
    blr.W15yQC.FramesDialog.updateDisplayOrderArray();
    order=blr.W15yQC.FramesDialog.aDisplayOrder;
    if (aDocumentsList != null && aFramesList != null && aFramesList.length && aFramesList.length > 0) {
      tbc = document.getElementById('treeboxChildren');
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            bHasRole = false;
            bHasStateDescription = false;
            for (i = 0; i < aFramesList.length; i++) {
              ak = aFramesList[i];
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

        for (i = 0; i < aFramesList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aFramesList[order[i]];

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.ownerDocumentNumber);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.containsDocumentNumber);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.doc.URL);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.nodeDescription);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.title);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.src);
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
        blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
        if (aFramesList.length == 1) {
          blr.W15yQC.FramesDialog.updateNotesField([aDocumentsList, aFramesList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No frame elements were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport;

    blr.W15yQC.fnReadUserPrefs();
    if (dialog != null && dialog.arguments && dialog.arguments.length > 1) {
      blr.W15yQC.FramesDialog.FirebugO = dialog.arguments[1];
    }
    if (blr.W15yQC.FramesDialog.FirebugO == null || !blr.W15yQC.FramesDialog.FirebugO.Inspector) {
      document.getElementById('button-showInFirebug').hidden = true;
    }

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document);

    blr.W15yQC.FramesDialog.aDocumentsList = oW15yQCReport.aDocuments;
    blr.W15yQC.fnAnalyzeDocuments(oW15yQCReport);

    blr.W15yQC.FramesDialog.aFramesList = oW15yQCReport.aFrames;
    blr.W15yQC.fnAnalyzeFrameTitles(oW15yQCReport);
    blr.W15yQC.FramesDialog.fnPopulateTree(blr.W15yQC.FramesDialog.aDocumentsList, blr.W15yQC.FramesDialog.aFramesList);
  },

  cleanup: function () {
    if (blr.W15yQC.FramesDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.FramesDialog.aDocumentsList);
      blr.W15yQC.FramesDialog.aDocumentsList = null;
      blr.W15yQC.FramesDialog.aFramesList = null;
    }
  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'),
      textbox = document.getElementById('note-text'),
      selectedRow, selectedIndex, box;

    if (bHighlightElement === null) bHighlightElement = true;

    selectedRow = treebox.currentIndex;
    if (selectedRow == null || treebox.currentIndex < 0) {
      selectedRow = 0;
      bHighlightElement = false;
    }

    selectedIndex=blr.W15yQC.FramesDialog.aDisplayOrder[selectedRow];

    if (blr.W15yQC.FramesDialog.aFramesList[selectedIndex].notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.FramesDialog.aFramesList[selectedIndex]);
    } else {
      textbox.value = '';
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.FramesDialog.aFramesList[selectedIndex].nodeDescription, "\n\n");

    if (blr.W15yQC.FramesDialog.aFramesList[selectedIndex].node != null) {
      box = blr.W15yQC.FramesDialog.aFramesList[selectedIndex].node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
      }
    }
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + blr.W15yQC.FramesDialog.aFramesList[selectedIndex].xpath, "\n");

    blr.W15yQC.fnResetHighlights(blr.W15yQC.FramesDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(blr.W15yQC.FramesDialog.aFramesList[selectedIndex].node);
      } catch (err) {}
    }
    if (bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.FramesDialog.aFramesList[selectedIndex].node, blr.W15yQC.FramesDialog.aFramesList[selectedIndex].doc);
  },

  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.FramesDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.FramesDialog.sortColumns.splice(blr.W15yQC.FramesDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.FramesDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.FramesDialog.sortColumns.splice(blr.W15yQC.FramesDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.FramesDialog.sortColumns.length>3) { blr.W15yQC.FramesDialog.sortColumns.pop(); }
    blr.W15yQC.FramesDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.FramesDialog.aFramesList, order=blr.W15yQC.FramesDialog.aDisplayOrder;
    blr.W15yQC.FramesDialog.addSortColumn(index, ascending);
    blr.W15yQC.FramesDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.FramesDialog.sortColumns.toString());
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
    var i,j,temp,list=blr.W15yQC.FramesDialog.aFramesList, order=blr.W15yQC.FramesDialog.aDisplayOrder;
    blr.W15yQC.FramesDialog.addSortColumn(index, ascending);
    blr.W15yQC.FramesDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.FramesDialog.sortColumns.toString());
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
    blr.W15yQC.FramesDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.FramesDialog.aDisplayOrder=[];
        blr.W15yQC.FramesDialog.sortColumns=[' Link Number (asc)'];
        blr.W15yQC.FramesDialog.updateDisplayOrderArray();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.FramesDialog.sortTreeAsNumberOn('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-containsDocumentNumber':
        blr.W15yQC.FramesDialog.sortTreeAsNumberOn('containsDocumentNumber',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.FramesDialog.aFramesList;
        ad=blr.W15yQC.FramesDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.FramesDialog.sortTreeAsStringOn('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
        blr.W15yQC.FramesDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-title':
        blr.W15yQC.FramesDialog.sortTreeAsStringOn('title',sortDir);
        break;
      case 'col-header-src':
        blr.W15yQC.FramesDialog.sortTreeAsStringOn('src',sortDir);
        break;
      case 'col-header-state':
        blr.W15yQC.FramesDialog.sortTreeAsStringOn('stateDescription',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.FramesDialog.fnPopulateTree(blr.W15yQC.FramesDialog.aDocumentsList, blr.W15yQC.FramesDialog.aFramesList, true);
    blr.W15yQC.FramesDialog.updateControlStates();
    blr.W15yQC.FramesDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.FramesDialog.sortColumns.toString());
  },



  showInFirebug: function () {
    var treebox, selectedRow, selectedIndex;
    if (blr.W15yQC.FramesDialog.FirebugO != null && blr.W15yQC.FramesDialog.FirebugO.GlobalUI != null) {
      try {
        if (blr.W15yQC.FramesDialog.aFramesList != null && blr.W15yQC.FramesDialog.aFramesList.length && blr.W15yQC.FramesDialog.aFramesList.length > 0) {
          treebox = document.getElementById('treebox');
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=blr.W15yQC.FramesDialog.aDisplayOrder[selectedRow];
          blr.W15yQC.fnResetHighlights(blr.W15yQC.FramesDialog.aDocumentsList);
          blr.W15yQC.FramesDialog.aFramesList[selectedIndex].node.ownerDocument.defaultView.focus();
          void
          function (arg) {
            blr.W15yQC.FramesDialog.FirebugO.GlobalUI.startFirebug(function () {
              blr.W15yQC.FramesDialog.FirebugO.Inspector.inspectFromContextMenu(arg);
            });
          }(blr.W15yQC.FramesDialog.aFramesList[selectedIndex].node);
        }
      } catch (ex) {}
    }
  },

  moveToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.FramesDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.FramesDialog.aDocumentsList);
      blr.W15yQC.fnMoveToElement(blr.W15yQC.FramesDialog.aFramesList[selectedIndex].node);
      blr.W15yQC.highlightElement(blr.W15yQC.FramesDialog.aFramesList[selectedIndex].node, blr.W15yQC.FramesDialog.aFramesList[selectedIndex].doc);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.FramesDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.FramesDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.FramesDialog.aFramesList[selectedIndex].node);
    }
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(blr.W15yQC.FramesDialog.FirebugO, 'frames');
  }

};
