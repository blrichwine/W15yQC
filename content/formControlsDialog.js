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

 * File:        formControlsDialog.js
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

if (!blr) {
  var blr = {};
}

/*
 * Object:  QuickW15yFormControlsDialog
 * Returns:
 */
blr.W15yQC.FormControlsDialog = {
  aDocumentsList: null,
  aFormsList: null,
  aFormControlsList: null,
  oLastTreeviewToHaveFocus: null,
  aLastList: null,
  aDisplayOrder1: [],
  sortColumns1: [' Form Number (asc)'],
  aDisplayOrder2: [],
  sortColumns2: [' Form Control Number (asc)'],

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
      blr.W15yQC.FormControlsDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.FormControlsDialog.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.FormControlsDialog.updateControlStates();
  },

  updateDisplayOrderArray1: function() {
    if(blr.W15yQC.FormControlsDialog.aFormsList != null && blr.W15yQC.FormControlsDialog.aFormsList.length>0) {
      if(blr.W15yQC.FormControlsDialog.aDisplayOrder1==null) {
        blr.W15yQC.FormControlsDialog.aDisplayOrder1=[];
      }
      while(blr.W15yQC.FormControlsDialog.aDisplayOrder1.length<blr.W15yQC.FormControlsDialog.aFormsList.length) {
        blr.W15yQC.FormControlsDialog.aDisplayOrder1.push(blr.W15yQC.FormControlsDialog.aDisplayOrder1.length);
      }
    } else {
      blr.W15yQC.FormControlsDialog.aDisplayOrder1=[];
    }
  },

  updateDisplayOrderArray2: function() {
    if(blr.W15yQC.FormControlsDialog.aFormControlsList != null && blr.W15yQC.FormControlsDialog.aFormControlsList.length>0) {
      if(blr.W15yQC.FormControlsDialog.aDisplayOrder2==null) {
        blr.W15yQC.FormControlsDialog.aDisplayOrder2=[];
      }
      while(blr.W15yQC.FormControlsDialog.aDisplayOrder2.length<blr.W15yQC.FormControlsDialog.aFormControlsList.length) {
        blr.W15yQC.FormControlsDialog.aDisplayOrder2.push(blr.W15yQC.FormControlsDialog.aDisplayOrder2.length);
      }
    } else {
      blr.W15yQC.FormControlsDialog.aDisplayOrder2=[];
    }
  },

  fnPopulateTree1: function (aDocumentsList, aFormsList, bDontHideCols) {
    var bHasARIADescription, bHasARIALabel, bHasId, bHasLegend, bHasName, bHasRole, bHasStateDescription, bHasValue,
    i, tbc, ak, ch, treecell, treeitem, treerow, textbox, order1;

    blr.W15yQC.FormControlsDialog.updateDisplayOrderArray1();
    order1=blr.W15yQC.FormControlsDialog.aDisplayOrder1;

    if (aDocumentsList != null && aFormsList != null && aFormsList.length && aFormsList.length > 0) {

      tbc = document.getElementById('treeboxChildren1');
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            bHasId = false;
            bHasName = false;
            for (i = 0; i < aFormsList.length; i++) {
              if (aFormsList[i].node.getAttribute('id')) bHasId = true;
              if (aFormsList[i].name != null && aFormsList[i].name.length > 0) bHasName = true;
            }
            if (!bHasId) {
              ch = document.getElementById('col-header-id');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasName) {
              ch = document.getElementById('col-header-name');
              ch.setAttribute('hidden', 'true');
            }
        }

        for (i = 0; i < aFormsList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order1[i] + 1);
          treerow.appendChild(treecell);

          ak = aFormsList[order1[i]];

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
          treecell.setAttribute('label', ak.name);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.action);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.method);
          treerow.appendChild(treecell);

          if (ak.failed) {
            treerow.setAttribute('properties', 'failed');
          } else if (ak.warning) {
            treerow.setAttribute('properties', 'warning');
          }

          treeitem.appendChild(treerow);
          tbc.appendChild(treeitem);
        }
        if (bDontHideCols!=true) { blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox1')); }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No form elements were detected.";
    }
  },


  fnPopulateTree2: function (aDocumentsList, aFormControlsList, bDontHideCols) {
    var bHasARIADescription, bHasARIALabel, bHasId, bHasLegend, bHasName, bHasRole, bHasStateDescription, bHasValue,
    i, tbc, ak, ch, treecell, treeitem, treerow, textbox, order2;

    blr.W15yQC.FormControlsDialog.updateDisplayOrderArray2();
    order2=blr.W15yQC.FormControlsDialog.aDisplayOrder2;

    if (aDocumentsList != null && aFormControlsList != null && aFormControlsList.length && aFormControlsList.length > 0) {

      tbc = document.getElementById('treeboxChildren2');
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            bHasARIALabel = false;
            bHasLegend = false;
            bHasARIADescription = false;
            bHasRole = false;
            bHasValue = false;
            bHasStateDescription = false;
            for (i = 0; i < aFormControlsList.length; i++) {
              ak = aFormControlsList[i];
              if (ak.legendText != null && ak.legendText.length > 0) bHasLegend = true;
              if (ak.role != null && ak.role.length > 0) bHasRole = true;
              if (ak.value != null && ak.value.length > 0) bHasValue = true;
              if (ak.ARIALabelText != null && ak.ARIALabelText.length > 0) bHasARIALabel = true;
              if (ak.ARIADescriptionText != null && ak.ARIADescriptionText.length > 0) bHasARIADescription = true;
              if (ak.stateDescription != null && ak.stateDescription.length > 0) bHasStateDescription = true;
            }
            if (!bHasARIALabel) {
              ch = document.getElementById('col-header-ariaLabel2');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasLegend) {
              ch = document.getElementById('col-header-legend2');
              ch.setAttribute('flex', null);
              ch.setAttribute('fixed', 'true');
            }
            if (!bHasARIADescription) {
              ch = document.getElementById('col-header-ariaDescription2');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasRole) {
              ch = document.getElementById('col-header-role2');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasValue) {
              ch = document.getElementById('col-header-value2');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasStateDescription) {
              ch = document.getElementById('col-header-state2');
              ch.setAttribute('hidden', 'true');
            }
            if (aDocumentsList.length <= 1) {
              ch = document.getElementById('col-header-documentNumber2');
              ch.setAttribute('hidden', 'true');
            }
        }

        for (i = 0; i < aFormControlsList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order2[i] + 1);
          treerow.appendChild(treecell);

          ak = aFormControlsList[order2[i]];

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.ownerDocumentNumber);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.parentFormNumber);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.nodeDescription);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.controlType);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', blr.W15yQC.fnJoin(blr.W15yQC.fnStringHasContent(ak.effectiveLabel)?ak.effectiveLabel:'unlabeled', ak.announcedAs,' '));
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.effectiveLabelSource);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.legendText);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.labelTagText);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.ARIALabelText);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.ARIADescriptionText);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.title);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.name);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.id);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.value);
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
        if (bDontHideCols!=true) { blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox2')); }
        if (aFormControlsList.length == 1) {
          blr.W15yQC.FormControlsDialog.updateNotesField2([aDocumentsList, aFormControlsList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No form control elements were detected.";
    }
  },

  fnPopulateTree: function (aDocumentsList, aFormsList, aFormControlsList, bDontHideCols) {
    var textbox;
    if (aDocumentsList==null || aDocumentsList.length==0 || aFormsList==null || aFormsList.length==0 || aFormControlsList==null || aFormControlsList.length==0) {
      textbox = document.getElementById('note-text');
      textbox.value = "No form elements were detected.";
    } else {
      blr.W15yQC.FormControlsDialog.fnPopulateTree1(aDocumentsList, aFormsList, bDontHideCols);
      blr.W15yQC.FormControlsDialog.fnPopulateTree2(aDocumentsList, aFormControlsList, bDontHideCols);
    }
  },


  init: function (dialog) {
    var oW15yQCReport;
    blr.W15yQC.fnReadUserPrefs();
    document.getElementById('button-inspectElement').hidden = !Application.prefs.getValue("devtools.inspector.enabled",false);

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document, dialog);
    blr.W15yQC.FormControlsDialog.aDocumentsList = oW15yQCReport.aDocuments;
    //blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.FormControlsDialog.aDocumentsList);

    blr.W15yQC.FormControlsDialog.aFormsList = oW15yQCReport.aForms;
    blr.W15yQC.FormControlsDialog.aFormControlsList = oW15yQCReport.aFormControls;
    blr.W15yQC.fnAnalyzeFormControls(oW15yQCReport);

    blr.W15yQC.FormControlsDialog.fnPopulateTree(blr.W15yQC.FormControlsDialog.aDocumentsList, blr.W15yQC.FormControlsDialog.aFormsList, blr.W15yQC.FormControlsDialog.aFormControlsList);
    dialog.fnUpdateProgress('Ready',null);
  },

  updateControlStates: function() {

  },

  cleanup: function () {
    if (blr.W15yQC.FormControlsDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.FormControlsDialog.aDocumentsList);
    }
    blr.W15yQC.FormControlsDialog.aDocumentsList = null;
    blr.W15yQC.FormControlsDialog.aFormControlsList = null;
    blr.W15yQC.FormControlsDialog.aFormsList = null;
    blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus = null;
    blr.W15yQC.FormControlsDialog.aLastList = null;
    blr.W15yQC.FormControlsDialog.aDisplayOrder1 = null;
    blr.W15yQC.FormControlsDialog.sortColumns1 = null;
    blr.W15yQC.FormControlsDialog.aDisplayOrder2 = null;
    blr.W15yQC.FormControlsDialog.sortColumns2 = null;
  },

  updateNotesField1: function (bHighlightElement) {
    var treebox = document.getElementById('treebox1'),
      textbox = document.getElementById('note-text'),
      selectedRow, selectedIndex, sPrefix;

    blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus = treebox;
    blr.W15yQC.FormControlsDialog.aLastList = blr.W15yQC.FormControlsDialog.aFormsList;
    if (blr.W15yQC.FormControlsDialog.aFormsList != null && blr.W15yQC.FormControlsDialog.aFormsList.length > 0) {
      if (bHighlightElement === null) bHighlightElement = true;

      selectedRow = treebox.currentIndex;
      if (selectedRow == null || treebox.currentIndex < 0) {
        selectedRow = 0;
        bHighlightElement = false;
      }
      selectedIndex=blr.W15yQC.FormControlsDialog.aDisplayOrder1[selectedRow];

      if (blr.W15yQC.FormControlsDialog.aFormsList[selectedIndex].notes != null) {
        sPrefix = 'Notes';
        if (blr.W15yQC.FormControlsDialog.aFormsList[selectedIndex].failed) {
          sPrefix = 'Failed';
        } else if (blr.W15yQC.FormControlsDialog.aFormsList[selectedIndex].warning) {
          sPrefix = 'Warning';
        }
        textbox.value = sPrefix + ': ' + blr.W15yQC.FormControlsDialog.aFormsList[selectedRow].notes;
      } else {
        textbox.value = '';
      }
      textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.FormControlsDialog.aFormsList[selectedIndex].nodeDescription, "\n\n");
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + blr.W15yQC.FormControlsDialog.aFormsList[selectedIndex].xpath, "\n\n");
      blr.W15yQC.fnResetHighlights(blr.W15yQC.FormControlsDialog.aDocumentsList);
      if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
        try {
          blr.W15yQC.fnMoveToElement(blr.W15yQC.FormControlsDialog.aFormsList[selectedIndex].node);
        } catch (err) {}
      }
      if (bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.FormControlsDialog.aFormsList[selectedIndex].node);
    }
  },

  updateNotesField2: function (bHighlightElement) {
    var idCounter = null,
      aFC = null,
      el,
      nodeID,
      aLabels,
      aIDs,
      i,
      selectedRow, selectedIndex, box,
      treebox = document.getElementById('treebox2'),
      textbox = document.getElementById('note-text');
    blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus = treebox;
    blr.W15yQC.FormControlsDialog.aLastList = blr.W15yQC.FormControlsDialog.aFormControlsList;
    if (blr.W15yQC.FormControlsDialog.aFormControlsList != null && blr.W15yQC.FormControlsDialog.aFormControlsList.length > 0) {

      if (bHighlightElement === null) bHighlightElement = true;

      selectedRow = treebox.currentIndex;
      if (selectedRow == null || treebox.currentIndex < 0) {
        selectedRow = 0;
        bHighlightElement = false;
      }
      selectedIndex=blr.W15yQC.FormControlsDialog.aDisplayOrder2[selectedRow];

      aFC = blr.W15yQC.FormControlsDialog.aFormControlsList[selectedIndex];
      if (aFC.notes != null) {
        textbox.value = blr.W15yQC.fnMakeTextNotesList(aFC);
      } else {
        textbox.value = '';
      }

      textbox.value = blr.W15yQC.fnJoin(textbox.value, aFC.nodeDescription, "\n\n");

      if (aFC.node != null) {
        box = aFC.node.getBoundingClientRect();
        if (box != null) {
          textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
        }
      }
      textbox.value = blr.W15yQC.fnJoin(textbox.value, aFC.xpath, "\n");
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'BaseURI: ' + blr.W15yQC.FormControlsDialog.aDocumentsList[aFC.ownerDocumentNumber - 1].URL, "\n");

      blr.W15yQC.fnResetHighlights(blr.W15yQC.FormControlsDialog.aDocumentsList);
      if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
        try {
          blr.W15yQC.fnMoveToElement(aFC.node);
        } catch (err) {}
      }

      if (bHighlightElement != false) {
        idCounter = blr.W15yQC.highlightElement(aFC.node, 'yellow');
        if (blr.W15yQC.fnIsFormControlNode(aFC.node) == true) {
          if (aFC.node.hasAttribute('aria-labelledby')) {
            aIDs = aFC.node.getAttribute('aria-labelledby').split(' ');
            for (i = 0; i < aIDs.length; i++) {
              el = aFC.node.ownerDocument.getElementById(aIDs[i]);
              if (el != null) {
                idCounter = blr.W15yQC.highlightElement(aFC.node, 'yellow', idCounter);
              }
            }
          } else {
            el = aFC.node.parentNode;
            while (el != null && el.tagName.toLowerCase() != 'label' && el.tagName.toLowerCase() != 'body') {
              el = el.parentNode;
            }
            if (el != null && el.tagName.toLowerCase() == 'label') {
              idCounter = blr.W15yQC.highlightElement(el, '#FFAAAA', idCounter);
            }
            el = aFC.node.parentNode;
            while (el != null && el.tagName.toLowerCase() != 'fieldset' && el.tagName.toLowerCase() != 'body') {
              el = el.parentNode;
            }
            if (el != null && el.tagName.toLowerCase() == 'fieldset') {
              aLabels = el.getElementsByTagName('legend');
              if (aLabels != null && aLabels.length > 0) {
                idCounter = blr.W15yQC.highlightElement(aLabels[0], '#AAAAFF', idCounter);
              }
            }
            if (aFC.node.hasAttribute('id')) {
              nodeID = aFC.node.getAttribute('id');
              aLabels = aFC.node.ownerDocument.getElementsByTagName('label');
              if (aLabels != null && aLabels.length > 0) {
                for (i = 0; i < aLabels.length; i++) {
                  if (aLabels[i].getAttribute('for') == nodeID) {
                    idCounter = blr.W15yQC.highlightElement(aLabels[i], '#FFAAAA', idCounter);
                  }
                }
              }
            }
          }
          if (aFC.node.hasAttribute('aria-describedby')) {
            aIDs = aFC.node.getAttribute('aria-describedby').split(' ');
            for (i = 0; i < aIDs.length; i++) {
              el = aFC.node.ownerDocument.getElementById(aIDs[i]);
              if (el != null) {
                idCounter = blr.W15yQC.highlightElement(el, '#AAFFAA', idCounter);
              }
            }
          }
        }
      }

    }
  },

  addSortColumn1: function(index, ascending) {
    while(blr.W15yQC.FormControlsDialog.sortColumns1.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.FormControlsDialog.sortColumns1.splice(blr.W15yQC.FormControlsDialog.sortColumns1.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.FormControlsDialog.sortColumns1.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.FormControlsDialog.sortColumns1.splice(blr.W15yQC.FormControlsDialog.sortColumns1.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.FormControlsDialog.sortColumns1.length>3) { blr.W15yQC.FormControlsDialog.sortColumns1.pop(); }
    blr.W15yQC.FormControlsDialog.sortColumns1.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn1: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.FormControlsDialog.aFormsList, order=blr.W15yQC.FormControlsDialog.aDisplayOrder1;
    blr.W15yQC.FormControlsDialog.addSortColumn1(index, ascending);
    blr.W15yQC.FormControlsDialog.fnUpdateStatus('Sorting Forms List on:'+blr.W15yQC.FormControlsDialog.sortColumns1.toString());
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

  sortTreeAsStringOn1: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.FormControlsDialog.aFormsList, order=blr.W15yQC.FormControlsDialog.aDisplayOrder1;
    blr.W15yQC.FormControlsDialog.addSortColumn1(index, ascending);
    blr.W15yQC.FormControlsDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.FormControlsDialog.sortColumns1.toString());
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

  sortTree1: function(col) {
    var al, ad, sortDir=/^a/i.test(col.getAttribute('sortDirection')),
      colID=col.getAttribute('id'), i, tree=document.getElementById('treebox1');
    for(i=0;i<tree.columns.length;i++) {
      if(/^a/.test(tree.columns.getColumnAt(i).element.getAttribute('sortDirection'))) {
        tree.columns.getColumnAt(i).element.setAttribute('sortDirection','a');
      } else {
        tree.columns.getColumnAt(i).element.setAttribute('sortDirection','d');
      }
    }
    blr.W15yQC.FormControlsDialog.updateDisplayOrderArray1();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.FormControlsDialog.aDisplayOrder1=[];
        blr.W15yQC.FormControlsDialog.sortColumns1=[' Form Number (asc)'];
        blr.W15yQC.FormControlsDialog.updateDisplayOrderArray1();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.FormControlsDialog.sortTreeAsNumberOn1('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.FormControlsDialog.aFormsList;
        ad=blr.W15yQC.FormControlsDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn1('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn1('nodeDescription',sortDir);
        break;
      case 'col-header-id':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn1('id',sortDir);
        break;
      case 'col-header-name':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn1('name',sortDir);
        break;
      case 'col-header-action':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn1('action',sortDir);
        break;
      case 'col-header-method':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn1('method',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.FormControlsDialog.fnPopulateTree1(blr.W15yQC.FormControlsDialog.aDocumentsList, blr.W15yQC.FormControlsDialog.aFormsList, true);
    blr.W15yQC.FormControlsDialog.updateControlStates();
    blr.W15yQC.FormControlsDialog.fnUpdateStatus('Sorted Forms List on:'+blr.W15yQC.FormControlsDialog.sortColumns1.toString());
  },

  addSortColumn2: function(index, ascending) {
    while(blr.W15yQC.FormControlsDialog.sortColumns2.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.FormControlsDialog.sortColumns2.splice(blr.W15yQC.FormControlsDialog.sortColumns2.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.FormControlsDialog.sortColumns2.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.FormControlsDialog.sortColumns2.splice(blr.W15yQC.FormControlsDialog.sortColumns2.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.FormControlsDialog.sortColumns2.length>3) { blr.W15yQC.FormControlsDialog.sortColumns2.pop(); }
    blr.W15yQC.FormControlsDialog.sortColumns2.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn2: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.FormControlsDialog.aFormControlsList, order=blr.W15yQC.FormControlsDialog.aDisplayOrder2;
    blr.W15yQC.FormControlsDialog.addSortColumn2(index, ascending);
    blr.W15yQC.FormControlsDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.FormControlsDialog.sortColumns2.toString());
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

  sortTreeAsStringOn2: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.FormControlsDialog.aFormControlsList, order=blr.W15yQC.FormControlsDialog.aDisplayOrder2;
    blr.W15yQC.FormControlsDialog.addSortColumn2(index, ascending);
    blr.W15yQC.FormControlsDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.FormControlsDialog.sortColumns2.toString());
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


  sortTree2: function(col) {
    var al, ad, sortDir=/^a/i.test(col.getAttribute('sortDirection')),
      colID=col.getAttribute('id'), i, tree=document.getElementById('treebox2');
    for(i=0;i<tree.columns.length;i++) {
      if(/^a/.test(tree.columns.getColumnAt(i).element.getAttribute('sortDirection'))) {
        tree.columns.getColumnAt(i).element.setAttribute('sortDirection','a');
      } else {
        tree.columns.getColumnAt(i).element.setAttribute('sortDirection','d');
      }
    }
    blr.W15yQC.FormControlsDialog.updateDisplayOrderArray2();
    switch(colID) {
      case 'col-header-sourceOrder2':
        blr.W15yQC.FormControlsDialog.aDisplayOrder2=[];
        blr.W15yQC.FormControlsDialog.sortColumns2=[' Form Control Number (asc)'];
        blr.W15yQC.FormControlsDialog.updateDisplayOrderArray2();
        break;
      case 'col-header-documentNumber2':
        blr.W15yQC.FormControlsDialog.sortTreeAsNumberOn2('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-formNumber2':
        blr.W15yQC.FormControlsDialog.sortTreeAsNumberOn2('parentFormNumber',sortDir);
        break;
      case 'col-header-baseURI2':
        al=blr.W15yQC.FormControlsDialog.aFormControlsList;
        ad=blr.W15yQC.FormControlsDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('baseURI',sortDir);
        break;
      case 'col-header-elementDescription2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('nodeDescription',sortDir);
        break;
      case 'col-header-elementType2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('controlType',sortDir);
        break;
      case 'col-header-effectiveLabel2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('effectiveLabel',sortDir);
        break;
      case 'col-header-effectiveLabelSource2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('effectiveLabelSource',sortDir);
        break;
      case 'col-header-legend2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('legendText',sortDir);
        break;
      case 'col-header-labelTagText2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('labelTagText',sortDir);
        break;
      case 'col-header-ariaLabel2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('ARIALabelText',sortDir);
        break;
      case 'col-header-ariaDescription2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('ARIADescriptionText',sortDir);
        break;
      case 'col-header-title2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('title',sortDir);
        break;
      case 'col-header-id2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('id',sortDir);
        break;
      case 'col-header-name2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('name',sortDir);
        break;
      case 'col-header-value2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('value',sortDir);
        break;
      case 'col-header-role2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('role',sortDir);
        break;
      case 'col-header-state2':
        blr.W15yQC.FormControlsDialog.sortTreeAsStringOn2('stateDescription',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.FormControlsDialog.fnPopulateTree2(blr.W15yQC.FormControlsDialog.aDocumentsList, blr.W15yQC.FormControlsDialog.aFormControlsList, true);
    blr.W15yQC.FormControlsDialog.updateControlStates();
    blr.W15yQC.FormControlsDialog.fnUpdateStatus('Sorted Form Controls on:'+blr.W15yQC.FormControlsDialog.sortColumns2.toString());
  },


  inspectElement: function () {
    var treebox, aList, selectedRow, selectedIndex, order, node;
      try {
        if (blr.W15yQC.FormControlsDialog.aFormControlsList != null && blr.W15yQC.FormControlsDialog.aFormControlsList.length && blr.W15yQC.FormControlsDialog.aFormControlsList.length > 0) {
          if (blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus != null) {
            treebox = blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus;
            aList = blr.W15yQC.FormControlsDialog.aLastList;
            if (aList===blr.W15yQC.FormControlsDialog.aFormsList) {
                order=blr.W15yQC.FormControlsDialog.aDisplayOrder1;
            } else {
                order=blr.W15yQC.FormControlsDialog.aDisplayOrder2;
            }
          } else {
            treebox = document.getElementById('treebox2');
            aList = blr.W15yQC.FormControlsDialog.aFormControlsList;
            order=blr.W15yQC.FormControlsDialog.aDisplayOrder2;
          }
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=order[selectedRow];

          if (blr.W15yQC.FormControlsDialog.aDocumentsList != null) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.FormControlsDialog.aDocumentsList);
          }
          node=aList[selectedIndex].node;
          node.ownerDocument.defaultView.focus();
          blr.W15yQC.inspectNode(node);
        }
      } catch (ex) {}
  },

  moveToSelectedElement: function () {
    var treebox, aList, selectedRow, selectedIndex, order;
    if (blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus != null) {
      treebox = blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus;
      aList = blr.W15yQC.FormControlsDialog.aLastList;
      if (aList===blr.W15yQC.FormControlsDialog.aFormsList) {
        order=blr.W15yQC.FormControlsDialog.aDisplayOrder1;
      } else {
        order=blr.W15yQC.FormControlsDialog.aDisplayOrder2;
      }
    } else {
      treebox = document.getElementById('treebox2');
      aList = blr.W15yQC.FormControlsDialog.aFormControlsList;
      order=blr.W15yQC.FormControlsDialog.aDisplayOrder2;
    }
    selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=order[selectedRow];
      blr.W15yQC.fnMoveToElement(aList[selectedIndex].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox, aList, selectedRow, selectedIndex, order;
    if (blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus != null) {
      treebox = blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus;
      aList = blr.W15yQC.FormControlsDialog.aLastList;
      if (aList===blr.W15yQC.FormControlsDialog.aFormsList) {
        order=blr.W15yQC.FormControlsDialog.aDisplayOrder1;
      } else {
        order=blr.W15yQC.FormControlsDialog.aDisplayOrder2;
      }
    } else {
      treebox = document.getElementById('treebox2');
      aList = blr.W15yQC.FormControlsDialog.aFormControlsList;
      order=blr.W15yQC.FormControlsDialog.aDisplayOrder2;
    }
    selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=order[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.FormControlsDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(aList[selectedIndex].node);
    }
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(false,'forms');
  }

};
