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

 * File:        imagesDialog.js
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
"use strict";

if (!blr) {
  var blr = {};
}

/*
 * Object:  QuickW15yImagesDialog
 * Returns:
 */
blr.W15yQC.ImagesDialog = {
  aDocumentsList: null,
  aImagesList: null,
  aDisplayOrder: [],
  sortColumns: [' Image Number (asc)'],
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
      blr.W15yQC.ImagesDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.ImagesDialog.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.ImagesDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.ImagesDialog.aImagesList != null && blr.W15yQC.ImagesDialog.aImagesList.length>0) {
      if(blr.W15yQC.ImagesDialog.aDisplayOrder==null) {
        blr.W15yQC.ImagesDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.ImagesDialog.aDisplayOrder.length<blr.W15yQC.ImagesDialog.aImagesList.length) {
        blr.W15yQC.ImagesDialog.aDisplayOrder.push(blr.W15yQC.ImagesDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.ImagesDialog.aDisplayOrder=[];
    }
  },

  fnPopulateTree: function (aDocumentsList, aImagesList, bDontHideCols) {
    var tbc, bHasAriaLabel, bHasRole, bHasStateDescription, bHasTitle, i, ak, ch, textbox, treecell, treeitem, treerow, order;
    blr.W15yQC.ImagesDialog.updateDisplayOrderArray();
    order=blr.W15yQC.ImagesDialog.aDisplayOrder;
    if (aDocumentsList != null && aImagesList != null && aImagesList.length && aImagesList.length > 0) {
      tbc = document.getElementById('treeboxChildren');
      bHasTitle = false;
      bHasRole = false;
      bHasAriaLabel = false;
      bHasStateDescription = false;
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            for (i = 0; i < aImagesList.length; i++) {
              ak = aImagesList[i];
              if (ak.title) bHasTitle = true;
              if (ak.role) bHasRole = true;
              if (ak.ariaLabel) bHasAriaLabel = true;
              if (ak.stateDescription && ak.stateDescription.length > 0) bHasStateDescription = true;
            }
            if (!bHasTitle) {
              ch = document.getElementById('col-header-title');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasRole) {
              ch = document.getElementById('col-header-role');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasAriaLabel) {
              ch = document.getElementById('col-header-ARIALabel');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasStateDescription) {
              ch = document.getElementById('col-header-State');
              ch.setAttribute('hidden', 'true');
            }
            if (aDocumentsList.length <= 1) {
              ch = document.getElementById('col-header-documentNumber');
              ch.setAttribute('hidden', 'true');
            }
        }
        for (i = 0; i < aImagesList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aImagesList[order[i]];

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
          treecell.setAttribute('label', ak.src);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', blr.W15yQC.fnMaxDecimalPlaces(ak.width, 2));
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', blr.W15yQC.fnMaxDecimalPlaces(ak.height, 2));
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.effectiveLabel);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.effectiveLabelSource);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.alt);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.title);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.ariaLabel);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.longdescText);
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
      textbox.value = "No Image elements were detected.";
    }
  },

  updateControlStates: function() {

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
    document.getElementById('button-inspectElement').hidden = !Application.prefs.getValue("devtools.inspector.enabled",false);

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document, dialog);
    blr.W15yQC.ImagesDialog.aDocumentsList = oW15yQCReport.aDocuments;

    blr.W15yQC.ImagesDialog.aImagesList = oW15yQCReport.aImages;
    blr.W15yQC.fnAnalyzeImages(oW15yQCReport);
    blr.W15yQC.ImagesDialog.fnPopulateTree(blr.W15yQC.ImagesDialog.aDocumentsList, blr.W15yQC.ImagesDialog.aImagesList);
    blr.W15yQC.ImagesDialog.selectFirstRow();
    dialog.fnUpdateProgress('Ready',null);
  },

  cleanup: function () {
    if (blr.W15yQC.ImagesDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.ImagesDialog.aDocumentsList);
    }
    blr.W15yQC.ImagesDialog.aDocumentsList = null;
    blr.W15yQC.ImagesDialog.aImagesList = null;
    blr.W15yQC.ImagesDialog.aDisplayOrder = null;
    blr.W15yQC.ImagesDialog.sortColumns = null;
  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'),
      textbox = document.getElementById('note-text'),
      selectedRow, selectedIndex, ak, box;
    if (bHighlightElement === null) bHighlightElement = true;

    selectedRow = treebox.currentIndex;
    if (selectedRow == null || treebox.currentIndex < 0) {
      selectedRow = 0;
      bHighlightElement = false;
    }
    selectedIndex=blr.W15yQC.ImagesDialog.aDisplayOrder[selectedRow];
    ak=blr.W15yQC.ImagesDialog.aImagesList[selectedIndex];

    if (ak.notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.ImagesDialog.aImagesList[selectedRow]);
    } else {
      textbox.value = '';
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, ak.nodeDescription, "\n\n");

    if (ak.node != null) {
      box = ak.node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n");
      }
    }
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + ak.xpath, "\n");
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'BaseURI: ' + blr.W15yQC.ImagesDialog.aDocumentsList[ak.ownerDocumentNumber - 1].URL, "\n");

    blr.W15yQC.fnResetHighlights(blr.W15yQC.ImagesDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(ak.node);
      } catch (err) {}
    }
    if (bHighlightElement != false) blr.W15yQC.highlightElement(ak.node);
  },

  moveToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.ImagesDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.ImagesDialog.aDocumentsList);
      blr.W15yQC.fnMoveToElement(blr.W15yQC.ImagesDialog.aImagesList[selectedIndex].node);
      blr.W15yQC.highlightElement(blr.W15yQC.ImagesDialog.aImagesList[selectedIndex].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.ImagesDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.ImagesDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.ImagesDialog.aImagesList[selectedIndex].node);
    }
  },

  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.ImagesDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.ImagesDialog.sortColumns.splice(blr.W15yQC.ImagesDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.ImagesDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.ImagesDialog.sortColumns.splice(blr.W15yQC.ImagesDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.ImagesDialog.sortColumns.length>3) { blr.W15yQC.ImagesDialog.sortColumns.pop(); }
    blr.W15yQC.ImagesDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.ImagesDialog.aImagesList, order=blr.W15yQC.ImagesDialog.aDisplayOrder;
    blr.W15yQC.ImagesDialog.addSortColumn(index, ascending);
    blr.W15yQC.ImagesDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.ImagesDialog.sortColumns.toString());
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
    var i,j,temp,list=blr.W15yQC.ImagesDialog.aImagesList, order=blr.W15yQC.ImagesDialog.aDisplayOrder;
    blr.W15yQC.ImagesDialog.addSortColumn(index, ascending);
    blr.W15yQC.ImagesDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.ImagesDialog.sortColumns.toString());
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
    blr.W15yQC.ImagesDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.ImagesDialog.aDisplayOrder=[];
        blr.W15yQC.ImagesDialog.sortColumns=[' Link Number (asc)'];
        blr.W15yQC.ImagesDialog.updateDisplayOrderArray();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.ImagesDialog.sortTreeAsNumberOn('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.ImagesDialog.aImagesList;
        ad=blr.W15yQC.ImagesDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-src':
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('src',sortDir);
        break;
      case 'col-header-width':
        blr.W15yQC.ImagesDialog.sortTreeAsNumberOn('width',sortDir);
        break;
      case 'col-header-height':
        blr.W15yQC.ImagesDialog.sortTreeAsNumberOn('height',sortDir);
        break;
      case 'col-header-effectiveLabel':
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('effectiveLabel',sortDir);
        break;
      case 'col-header-effectiveLabelSource':
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('effectiveLabelSource',sortDir);
        break;
      case 'col-header-alt':
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('alt',sortDir);
        break;
      case 'col-header-title':
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('title',sortDir);
        break;
      case 'col-header-ARIALabel':
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('ariaLabel',sortDir);
        break;
      case 'col-header-LongDesc':
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('longdescText',sortDir);
        break;
      case 'col-header-role':
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('role',sortDir);
        break;
      case 'col-header-State':
        blr.W15yQC.ImagesDialog.sortTreeAsStringOn('stateDescription',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.ImagesDialog.fnPopulateTree(blr.W15yQC.ImagesDialog.aDocumentsList, blr.W15yQC.ImagesDialog.aImagesList, true);
    blr.W15yQC.ImagesDialog.updateControlStates();
    blr.W15yQC.ImagesDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.ImagesDialog.sortColumns.toString());
  },


  inspectElement: function () {
    var treebox, selectedRow, selectedIndex, node;
      try {
        if (blr.W15yQC.ImagesDialog.aImagesList != null && blr.W15yQC.ImagesDialog.aImagesList.length && blr.W15yQC.ImagesDialog.aImagesList.length > 0) {
          treebox = document.getElementById('treebox');
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=blr.W15yQC.ImagesDialog.aDisplayOrder[selectedRow];
          blr.W15yQC.fnResetHighlights(blr.W15yQC.ImagesDialog.aDocumentsList);
          node=blr.W15yQC.ImagesDialog.aImagesList[selectedIndex].node;
          node.ownerDocument.defaultView.focus();
          blr.W15yQC.inspectNode(node);
        }
      } catch (ex) {}
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(false,'images');
  },
  
  windowOnKeyDown: function (dialog, evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.ImagesDialog.bCmdIsPressed = true;
        break;
      case 27:
        dialog.close();
        break;
      case 87:
        if (blr.W15yQC.ImagesDialog.bCmdIsPressed == true) {
            evt.stopPropagation();
            evt.preventDefault();
            blr.W15yQC.ImagesDialog.cleanup();
            dialog.close();
        }
        break;
    }
  },

  windowOnKeyUp: function (evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.ImagesDialog.bCmdIsPressed = false;
        break;
    }
  }

};
