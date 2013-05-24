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

 * File:        headingsDialog.js
 * Description: Handles displaying the Images quick check dialog
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
 * Object:  QuickW15yHeadingsDialog
 * Returns:
 */
blr.W15yQC.HeadingsDialog = {
  oFirebug: null,
  aDocumentsList: null,
  aHeadingsList: null,
  aDisplayOrder: [],
  sortColumns: [' Heading Number (asc)'],

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
      blr.W15yQC.HeadingsDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.HeadingsDialog.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.HeadingsDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.HeadingsDialog.aHeadingsList != null && blr.W15yQC.HeadingsDialog.aHeadingsList.length>0) {
      if(blr.W15yQC.HeadingsDialog.aDisplayOrder==null) {
        blr.W15yQC.HeadingsDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.HeadingsDialog.aDisplayOrder.length<blr.W15yQC.HeadingsDialog.aHeadingsList.length) {
        blr.W15yQC.HeadingsDialog.aDisplayOrder.push(blr.W15yQC.HeadingsDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.HeadingsDialog.aDisplayOrder=[];
    }
  },

  fnPopulateTree: function (aDocumentsList, aHeadingsList, bDontHideCols) {
    var tbc, bHasRole, bHasStateDescription, i, ak, ch, treecell, treeitem, treerow, sIndent, j, textbox, order;
    if (aDocumentsList != null && aHeadingsList != null && aHeadingsList.length && aHeadingsList.length > 0) {
        blr.W15yQC.HeadingsDialog.updateDisplayOrderArray();
        order=blr.W15yQC.HeadingsDialog.aDisplayOrder;

      tbc = document.getElementById('treeboxChildren');
      bHasRole = false;
      bHasStateDescription = false;
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            for (i = 0; i < aHeadingsList.length; i++) {
              ak = aHeadingsList[i];
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
        for (i = 0; i < aHeadingsList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aHeadingsList[order[i]];

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
          treecell.setAttribute('label', ak.level);
          treerow.appendChild(treecell);

          sIndent = '';
          for (j = 0; j < ak.level - 1; j++) sIndent += '   ';

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', sIndent + ak.effectiveLabel);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.effectiveLabelSource);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', sIndent + ak.text);
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
        blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
        if (aHeadingsList.length == 1) {
          blr.W15yQC.HeadingsDialog.updateNotesField([aDocumentsList, aHeadingsList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No Heading elements were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport;

    blr.W15yQC.fnReadUserPrefs();
    if (dialog != null && dialog.arguments && dialog.arguments.length > 1) {
      blr.W15yQC.HeadingsDialog.FirebugO = dialog.arguments[1];
    }
    if (blr.W15yQC.HeadingsDialog.FirebugO == null || !blr.W15yQC.HeadingsDialog.FirebugO.Inspector) {
      document.getElementById('button-showInFirebug').hidden = true;
    }

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document);
    blr.W15yQC.HeadingsDialog.aDocumentsList = oW15yQCReport.aDocuments;
    //blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.HeadingsDialog.aDocumentsList);

    blr.W15yQC.HeadingsDialog.aHeadingsList = oW15yQCReport.aHeadings;
    blr.W15yQC.fnAnalyzeHeadings(oW15yQCReport);
    blr.W15yQC.HeadingsDialog.fnPopulateTree(blr.W15yQC.HeadingsDialog.aDocumentsList, blr.W15yQC.HeadingsDialog.aHeadingsList);
  },

  updateControlStates: function() {

  },

  cleanup: function () {
    if (blr.W15yQC.HeadingsDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.HeadingsDialog.aDocumentsList);
      blr.W15yQC.HeadingsDialog.aDocumentsList = null;
      blr.W15yQC.HeadingsDialog.aHeadingsList = null;
    }
  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'),
      textbox = document.getElementById('note-text'),
      selectedRow, selectedIndex, box;

    if (bHighlightElement == null) bHighlightElement = true;

    selectedRow = treebox.currentIndex;
    if (selectedRow == null || treebox.currentIndex < 0) {
      selectedRow = 0;
      bHighlightElement = false;
    }
    selectedIndex=blr.W15yQC.HeadingsDialog.aDisplayOrder[selectedRow];

    if (blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.HeadingsDialog.aHeadingsList[selectedRow]);
    } else {
      textbox.value = '';
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].nodeDescription, "\n\n");

    if (blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].node != null) {
      box = blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
      }
    }
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].xpath, "\n");

    blr.W15yQC.fnResetHighlights(blr.W15yQC.HeadingsDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].node);
      } catch (ex) {}
    }
    if (bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].node, blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].doc);
  },

  moveToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.HeadingsDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.HeadingsDialog.aDocumentsList);
      blr.W15yQC.fnMoveToElement(blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].node);
      blr.W15yQC.highlightElement(blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].node, blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].doc);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.HeadingsDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.HeadingsDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].node);
    }
  },

  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.HeadingsDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.HeadingsDialog.sortColumns.splice(blr.W15yQC.HeadingsDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.HeadingsDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.HeadingsDialog.sortColumns.splice(blr.W15yQC.HeadingsDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.HeadingsDialog.sortColumns.length>3) { blr.W15yQC.HeadingsDialog.sortColumns.pop(); }
    blr.W15yQC.HeadingsDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.HeadingsDialog.aHeadingsList, order=blr.W15yQC.HeadingsDialog.aDisplayOrder;
    blr.W15yQC.HeadingsDialog.addSortColumn(index, ascending);
    blr.W15yQC.HeadingsDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.HeadingsDialog.sortColumns.toString());
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
    var i,j,temp,list=blr.W15yQC.HeadingsDialog.aHeadingsList, order=blr.W15yQC.HeadingsDialog.aDisplayOrder;
    blr.W15yQC.HeadingsDialog.addSortColumn(index, ascending);
    blr.W15yQC.HeadingsDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.HeadingsDialog.sortColumns.toString());
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
    blr.W15yQC.HeadingsDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.HeadingsDialog.aDisplayOrder=[];
        blr.W15yQC.HeadingsDialog.sortColumns=[' Heading Number (asc)'];
        blr.W15yQC.HeadingsDialog.updateDisplayOrderArray();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.HeadingsDialog.sortTreeAsNumberOn('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.HeadingsDialog.aHeadingsList;
        ad=blr.W15yQC.HeadingsDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.HeadingsDialog.sortTreeAsStringOn('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
        blr.W15yQC.HeadingsDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-level':
        blr.W15yQC.HeadingsDialog.sortTreeAsNumberOn('level',sortDir);
        break;
      case 'col-header-effectiveLabel':
        blr.W15yQC.HeadingsDialog.sortTreeAsStringOn('effectiveLabel',sortDir);
        break;
      case 'col-header-labelSource':
        blr.W15yQC.HeadingsDialog.sortTreeAsStringOn('effectiveLabelSource',sortDir);
        break;
      case 'col-header-text':
        blr.W15yQC.HeadingsDialog.sortTreeAsStringOn('text',sortDir);
        break;
      case 'col-header-role':
        blr.W15yQC.HeadingsDialog.sortTreeAsStringOn('role',sortDir);
        break;
      case 'col-header-state':
        blr.W15yQC.HeadingsDialog.sortTreeAsStringOn('stateDescription',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.HeadingsDialog.fnPopulateTree(blr.W15yQC.HeadingsDialog.aDocumentsList, blr.W15yQC.HeadingsDialog.aHeadingsList, true);
    blr.W15yQC.HeadingsDialog.updateControlStates();
    blr.W15yQC.HeadingsDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.HeadingsDialog.sortColumns.toString());
  },

  showInFirebug: function () {
    var treebox, selectedRow;
    if (blr.W15yQC.HeadingsDialog.FirebugO != null && blr.W15yQC.HeadingsDialog.FirebugO.GlobalUI != null) {
      try {
        if (blr.W15yQC.HeadingsDialog.aHeadingsList != null && blr.W15yQC.HeadingsDialog.aHeadingsList.length && blr.W15yQC.HeadingsDialog.aHeadingsList.length > 0) {
          treebox = document.getElementById('treebox');
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=blr.W15yQC.HeadingsDialog.aDisplayOrder[selectedRow];
          //blr.W15yQC.HeadingsDialog.nodeToInspect = blr.W15yQC.HeadingsDialog.aHeadingsList[selectedRow].node;
          //blr.W15yQC.HeadingsDialog.FirebugO.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(blr.W15yQC.HeadingsDialog.nodeToInspect);});
          //oncommand=void function(arg){Firebug.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(arg);})}(document.popupNode)
          //blr.W15yQC.HeadingsDialog.FirebugO.
          blr.W15yQC.fnResetHighlights(blr.W15yQC.HeadingsDialog.aDocumentsList);
          blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].node.ownerDocument.defaultView.focus();
          void
          function (arg) {
            blr.W15yQC.HeadingsDialog.FirebugO.GlobalUI.startFirebug(function () {
              blr.W15yQC.HeadingsDialog.FirebugO.Inspector.inspectFromContextMenu(arg);
            });
          }(blr.W15yQC.HeadingsDialog.aHeadingsList[selectedIndex].node);
          //blr.W15yQC.showInFirebug(blr.W15yQC.HeadingsDialog.aHeadingsList[selectedRow].node,blr.W15yQC.HeadingsDialog.firebugO);
        }
      } catch (ex) {}
    }
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(blr.W15yQC.HeadingsDialog.FirebugO, 'headings');
  }

};
