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

 * File:        multimediaDialog.js
 * Description: Handles displaying the multimedia quick check dialog
 * Author:	Brian Richwine
 * Created:	2014.03.28 
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2014.03.28 - Created!
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
  window.setTimeout(function(){blr.W15yQC.MultimediaDialog.init(window);}, 0);
}

/*
 * Object:  QuickW15yMultimediaDialog
 * Returns:
 */

blr.W15yQC.MultimediaDialog = {
  aDocumentsList: null,
  aMultimedia: null,
  aDisplayOrder: [],
  sortColumns: [' Number (asc)'],
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
      blr.W15yQC.MultimediaDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.MultimediaDialog.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.MultimediaDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.MultimediaDialog.aMultimedia != null && blr.W15yQC.MultimediaDialog.aMultimedia.length>0) {
      if(blr.W15yQC.MultimediaDialog.aDisplayOrder==null) {
        blr.W15yQC.MultimediaDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.MultimediaDialog.aDisplayOrder.length<blr.W15yQC.MultimediaDialog.aMultimedia.length) {
        blr.W15yQC.MultimediaDialog.aDisplayOrder.push(blr.W15yQC.MultimediaDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.MultimediaDialog.aDisplayOrder=[];
    }
  },

  fnPopulateTree: function (aDocumentsList, aMultimedia, bDontHideCols) {
    var tbc, bHasAriaLabel, bHasRole, bHasStateDescription, bHasTitle, bHasMultipleTypes, i, ak, ch, textbox, treecell, treeitem, treerow, order;
    blr.W15yQC.MultimediaDialog.updateDisplayOrderArray();
    order=blr.W15yQC.MultimediaDialog.aDisplayOrder;
    if (aDocumentsList != null && aMultimedia != null && aMultimedia.length && aMultimedia.length > 0) {
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
            for (i = 0; i < aMultimedia.length; i++) {
              try {
                ak = aMultimedia[i];
                if (ak.title) bHasTitle = true;
                if (ak.role) bHasRole = true;
                if (ak.ariaLabel) bHasAriaLabel = true;
                if (ak.stateDescription && ak.stateDescription.length > 0) bHasStateDescription = true;
                if (!bHasMultipleTypes && i<aMultimedia.length-1 && ak.nodeType!==aMultimedia[i+1].nodeType) {
                  bHasMultipleTypes=true;
                }
              } catch(ex) {}
            }
            if (bHasMultipleTypes) {
              ch = document.getElementById('col-header-type');
              ch.setAttribute('hidden', 'false');
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

        for (i = 0; i < aMultimedia.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aMultimedia[order[i]];

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
          treecell.setAttribute('label', ak.nodeType);
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
          treecell.setAttribute('label', ak.title);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.ariaLabel);
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
      textbox.value = "No multimedia elements were detected.";
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
    document.getElementById('button-inspectElement').hidden = !blr.W15yQC.getBoolPref("devtools.inspector.enabled",false);

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document, dialog);
    blr.W15yQC.MultimediaDialog.aDocumentsList = oW15yQCReport.aDocuments;

    blr.W15yQC.MultimediaDialog.aMultimedia = oW15yQCReport.aMultiMedia;
    blr.W15yQC.fnAnalyzeMultimedia(oW15yQCReport);
    blr.W15yQC.MultimediaDialog.fnPopulateTree(blr.W15yQC.MultimediaDialog.aDocumentsList, blr.W15yQC.MultimediaDialog.aMultimedia);
    blr.W15yQC.MultimediaDialog.selectFirstRow();
    dialog.fnUpdateProgress('Ready',null);
  },

  cleanup: function () {
    if (blr.W15yQC.MultimediaDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.MultimediaDialog.aDocumentsList);
    }
    blr.W15yQC.MultimediaDialog.aDocumentsList = null;
    blr.W15yQC.MultimediaDialog.aMultimedia = null;
    blr.W15yQC.MultimediaDialog.aDisplayOrder = null;
    blr.W15yQC.MultimediaDialog.sortColumns = null;
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
    selectedIndex=blr.W15yQC.MultimediaDialog.aDisplayOrder[selectedRow];
    ak=blr.W15yQC.MultimediaDialog.aMultimedia[selectedIndex];

    if (ak.notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.MultimediaDialog.aMultimedia[selectedRow]);
    } else {
      textbox.value = '';
    }

    textbox.value = blr.W15yQC.fnJoinNoClean(textbox.value, ak.nodeDescription, "\n\n");
    textbox.value = blr.W15yQC.fnJoinNoClean(textbox.value, 'Effective Label: '+ak.effectiveLabel, "\n\n");
    if (ak.node != null) {
      box = ak.node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoinNoClean(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
      }
    }
    textbox.value = blr.W15yQC.fnJoinNoClean(textbox.value, 'xPath: ' + ak.xpath, "\n");
    textbox.value = blr.W15yQC.fnJoinNoClean(textbox.value, 'BaseURI: ' + blr.W15yQC.MultimediaDialog.aDocumentsList[ak.ownerDocumentNumber - 1].URL, "\n");

    blr.W15yQC.fnResetHighlights(blr.W15yQC.MultimediaDialog.aDocumentsList);
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
      selectedIndex=blr.W15yQC.MultimediaDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.MultimediaDialog.aDocumentsList);
      blr.W15yQC.fnMoveToElement(blr.W15yQC.MultimediaDialog.aMultimedia[selectedIndex].node);
      blr.W15yQC.highlightElement(blr.W15yQC.MultimediaDialog.aMultimedia[selectedIndex].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.MultimediaDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.MultimediaDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.MultimediaDialog.aMultimedia[selectedIndex].node);
    }
  },

  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.MultimediaDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.MultimediaDialog.sortColumns.splice(blr.W15yQC.MultimediaDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.MultimediaDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.MultimediaDialog.sortColumns.splice(blr.W15yQC.MultimediaDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.MultimediaDialog.sortColumns.length>3) { blr.W15yQC.MultimediaDialog.sortColumns.pop(); }
    blr.W15yQC.MultimediaDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.MultimediaDialog.aMultimedia, order=blr.W15yQC.MultimediaDialog.aDisplayOrder;
    blr.W15yQC.MultimediaDialog.addSortColumn(index, ascending);
    blr.W15yQC.MultimediaDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.MultimediaDialog.sortColumns.toString());
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
    var i,j,temp,list=blr.W15yQC.MultimediaDialog.aMultimedia, order=blr.W15yQC.MultimediaDialog.aDisplayOrder;
    blr.W15yQC.MultimediaDialog.addSortColumn(index, ascending);
    blr.W15yQC.MultimediaDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.MultimediaDialog.sortColumns.toString());
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
    blr.W15yQC.MultimediaDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.MultimediaDialog.aDisplayOrder=[];
        blr.W15yQC.MultimediaDialog.sortColumns=[' Link Number (asc)'];
        blr.W15yQC.MultimediaDialog.updateDisplayOrderArray();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.MultimediaDialog.sortTreeAsNumberOn('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.MultimediaDialog.aMultimedia;
        ad=blr.W15yQC.MultimediaDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
      case 'col-header-type':
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-src':
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('src',sortDir);
        break;
      case 'col-header-width':
        blr.W15yQC.MultimediaDialog.sortTreeAsNumberOn('width',sortDir);
        break;
      case 'col-header-height':
        blr.W15yQC.MultimediaDialog.sortTreeAsNumberOn('height',sortDir);
        break;
      case 'col-header-effectiveLabel':
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('effectiveLabel',sortDir);
        break;
      case 'col-header-effectiveLabelSource':
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('effectiveLabelSource',sortDir);
        break;
      case 'col-header-alt':
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('alt',sortDir);
        break;
      case 'col-header-title':
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('title',sortDir);
        break;
      case 'col-header-ARIALabel':
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('ariaLabel',sortDir);
        break;
      case 'col-header-LongDesc':
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('longdescText',sortDir);
        break;
      case 'col-header-role':
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('role',sortDir);
        break;
      case 'col-header-State':
        blr.W15yQC.MultimediaDialog.sortTreeAsStringOn('stateDescription',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.MultimediaDialog.fnPopulateTree(blr.W15yQC.MultimediaDialog.aDocumentsList, blr.W15yQC.MultimediaDialog.aMultimedia, true);
    blr.W15yQC.MultimediaDialog.updateControlStates();
    blr.W15yQC.MultimediaDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.MultimediaDialog.sortColumns.toString());
  },


  inspectElement: function () {
    var treebox, selectedRow, selectedIndex, node;
      try {
        if (blr.W15yQC.MultimediaDialog.aMultimedia != null && blr.W15yQC.MultimediaDialog.aMultimedia.length && blr.W15yQC.MultimediaDialog.aMultimedia.length > 0) {
          treebox = document.getElementById('treebox');
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=blr.W15yQC.MultimediaDialog.aDisplayOrder[selectedRow];
          blr.W15yQC.fnResetHighlights(blr.W15yQC.MultimediaDialog.aDocumentsList);
          node=blr.W15yQC.MultimediaDialog.aMultimedia[selectedIndex].node;
          node.ownerDocument.defaultView.focus();
          blr.W15yQC.inspectNode(node);
        }
      } catch (ex) {}
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(false,'multimedia');
  },
  
  windowOnKeyDown: function (dialog, evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.MultimediaDialog.bCmdIsPressed = true;
        break;
      case 27:
        dialog.close();
        break;
      case 87:
        if (blr.W15yQC.MultimediaDialog.bCmdIsPressed == true) {
            evt.stopPropagation();
            evt.preventDefault();
            blr.W15yQC.MultimediaDialog.cleanup();
            dialog.close();
        }
        break;
    }
  },

  windowOnKeyUp: function (evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.MultimediaDialog.bCmdIsPressed = false;
        break;
    }
  }

};
