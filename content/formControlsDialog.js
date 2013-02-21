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
if (!blr) {
  var blr = {};
}

/*
 * Object:  QuickW15yFormControlsDialog
 * Returns:
 */
blr.W15yQC.FormControlsDialog = {
  FirebugO: null,
  aDocumentsList: null,
  aFormsList: null,
  aFormControlsList: null,
  oLastTreeviewToHaveFocus: null,
  aLastList: null,
  fnPopulateTree: function (aDocumentsList, aFormsList, aFormControlsList) {
    var bHasARIADescription, bHasARIALabel, bHasId, bHasLegend, bHasName, bHasRole, bHasStateDescription, bHasValue,
    i, tbc, ak, ch, treecell, treeitem, treerow, textbox;
    if (aDocumentsList != null && aFormControlsList != null && aFormControlsList.length && aFormControlsList.length > 0) {
      bHasId = false;
      bHasName = false;
      for (i = 0; i < aFormsList.length; i++) {
        if (aFormsList[i].node.getAttribute('id')) bHasId = true;
        if (aFormsList[i].name != null && aFormsList[i].name.length > 0) bHasName = true;
      }

      tbc = document.getElementById('treeboxChildren1');
      if (tbc != null) {
        if (!bHasId) {
          ch = document.getElementById('col-header-id');
          ch.setAttribute('hidden', 'true');
        }
        if (!bHasName) {
          ch = document.getElementById('col-header-name');
          ch.setAttribute('hidden', 'true');
        }

        for (i = 0; i < aFormsList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', i + 1);
          treerow.appendChild(treecell);

          ak = aFormsList[i];

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
          treecell.setAttribute('label', ak.node.getAttribute('id'));
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
      }

      tbc = document.getElementById('treeboxChildren2');
      if (tbc != null) {
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

        for (i = 0; i < aFormControlsList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', i + 1);
          treerow.appendChild(treecell);

          ak = aFormControlsList[i];

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
          treecell.setAttribute('label', ak.effectiveLabelText);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.name);
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
        blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox2'));
        if (aFormControlsList.length == 1) {
          blr.W15yQC.FormControlsDialog.updateNotesField2([aDocumentsList, aFormControlsList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No form elements were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport;
    blr.W15yQC.fnReadUserPrefs();

    blr.W15yQC.FormControlsDialog.FirebugO = dialog.arguments[1];
    if (blr.W15yQC.FormControlsDialog.FirebugO == null || !blr.W15yQC.FormControlsDialog.FirebugO.Inspector) {
      document.getElementById('button-showInFirebug').hidden = true;
    }

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document);
    blr.W15yQC.FormControlsDialog.aDocumentsList = oW15yQCReport.aDocuments;
    //blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.FormControlsDialog.aDocumentsList);

    blr.W15yQC.FormControlsDialog.aFormsList = oW15yQCReport.aForms;
    blr.W15yQC.FormControlsDialog.aFormControlsList = oW15yQCReport.aFormControls;
    blr.W15yQC.fnAnalyzeFormControls(oW15yQCReport);

    blr.W15yQC.FormControlsDialog.fnPopulateTree(blr.W15yQC.FormControlsDialog.aDocumentsList, blr.W15yQC.FormControlsDialog.aFormsList, blr.W15yQC.FormControlsDialog.aFormControlsList);
  },

  cleanup: function () {
    if (blr.W15yQC.FormControlsDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.FormControlsDialog.aDocumentsList);
      blr.W15yQC.FormControlsDialog.aDocumentsList = null;
      blr.W15yQC.FormControlsDialog.aFormControlsList = null;
      blr.W15yQC.FormControlsDialog.aFormsList = null;
      blr.W15yQC.FormControlsDialog.FirebugO = null;
      blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus = null;
      blr.W15yQC.FormControlsDialog.aLastList = null;
    }
  },

  updateNotesField1: function (bHighlightElement) {
    var treebox = document.getElementById('treebox1'),
      textbox = document.getElementById('note-text'),
      selectedRow, sPrefix;

    blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus = treebox;
    blr.W15yQC.FormControlsDialog.aLastList = blr.W15yQC.FormControlsDialog.aFormsList;
    if (blr.W15yQC.FormControlsDialog.aFormsList != null && blr.W15yQC.FormControlsDialog.aFormsList.length > 0) {
      if (bHighlightElement === null) bHighlightElement = true;

      selectedRow = treebox.currentIndex;
      if (selectedRow == null || treebox.currentIndex < 0) {
        selectedRow = 0;
        bHighlightElement = false;
      }

      if (blr.W15yQC.FormControlsDialog.aFormsList[selectedRow].notes != null) {
        sPrefix = 'Notes';
        if (blr.W15yQC.FormControlsDialog.aFormsList[selectedRow].failed) {
          sPrefix = 'Failed';
        } else if (blr.W15yQC.FormControlsDialog.aFormsList[selectedRow].warning) {
          sPrefix = 'Warning';
        }
        textbox.value = sPrefix + ': ' + blr.W15yQC.FormControlsDialog.aFormsList[selectedRow].notes;
      } else {
        textbox.value = '';
      }
      textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.FormControlsDialog.aFormsList[selectedRow].nodeDescription, "\n\n");
      textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + blr.W15yQC.FormControlsDialog.aFormsList[selectedRow].xpath, "\n\n");
      blr.W15yQC.fnResetHighlights(blr.W15yQC.FormControlsDialog.aDocumentsList);
      if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
        try {
          blr.W15yQC.fnMoveToElement(blr.W15yQC.FormControlsDialog.aFormsList[selectedRow].node);
        } catch (err) {}
      }
      if (bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.FormControlsDialog.aFormsList[selectedRow].node, blr.W15yQC.FormControlsDialog.aFormsList[selectedRow].doc);
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
      selectedRow, box,
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
      aFC = blr.W15yQC.FormControlsDialog.aFormControlsList[selectedRow];
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

      blr.W15yQC.fnResetHighlights(blr.W15yQC.FormControlsDialog.aDocumentsList);
      if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
        try {
          blr.W15yQC.fnMoveToElement(aFC.node);
        } catch (err) {}
      }

      if (bHighlightElement != false) {
        idCounter = blr.W15yQC.highlightElement(aFC.node, aFC.doc, 'yellow');
        if (blr.W15yQC.fnIsFormControlNode(aFC.node) == true) {
          if (aFC.node.hasAttribute('aria-labelledby')) {
            aIDs = aFC.node.getAttribute('aria-labelledby').split(' ');
            for (i = 0; i < aIDs.length; i++) {
              el = aFC.node.ownerDocument.getElementById(aIDs[i]);
              if (el != null) {
                idCounter = blr.W15yQC.highlightElement(aFC.node, aFC.doc, 'yellow', idCounter);
              }
            }
          } else {
            el = aFC.node.parentNode;
            while (el != null && el.tagName.toLowerCase() != 'label' && el.tagName.toLowerCase() != 'body') {
              el = el.parentNode;
            }
            if (el != null && el.tagName.toLowerCase() == 'label') {
              idCounter = blr.W15yQC.highlightElement(el, el.ownerDocument, '#FFAAAA', idCounter);
            }
            el = aFC.node.parentNode;
            while (el != null && el.tagName.toLowerCase() != 'fieldset' && el.tagName.toLowerCase() != 'body') {
              el = el.parentNode;
            }
            if (el != null && el.tagName.toLowerCase() == 'fieldset') {
              aLabels = el.getElementsByTagName('legend');
              if (aLabels != null && aLabels.length > 0) {
                idCounter = blr.W15yQC.highlightElement(aLabels[0], aLabels[0].ownerDocument, '#AAAAFF', idCounter);
              }
            }
            if (aFC.node.hasAttribute('id')) {
              nodeID = aFC.node.getAttribute('id');
              aLabels = aFC.node.ownerDocument.getElementsByTagName('label');
              if (aLabels != null && aLabels.length > 0) {
                for (i = 0; i < aLabels.length; i++) {
                  if (aLabels[i].getAttribute('for') == nodeID) {
                    idCounter = blr.W15yQC.highlightElement(aLabels[i], aLabels[i].ownerDocument, '#FFAAAA', idCounter);
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
                idCounter = blr.W15yQC.highlightElement(el, el.ownerDocument, '#AAFFAA', idCounter);
              }
            }
          }
        }
      }
    }
  },

  showInFirebug: function () {
    var treebox, aList, selectedRow;
    if (blr.W15yQC.FormControlsDialog.FirebugO != null) {
      try {
        if (blr.W15yQC.FormControlsDialog.aFormControlsList != null && blr.W15yQC.FormControlsDialog.aFormControlsList.length && blr.W15yQC.FormControlsDialog.aFormControlsList.length > 0) {
          if (blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus != null) {
            treebox = blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus;
            aList = blr.W15yQC.FormControlsDialog.aLastList;
          } else {
            treebox = document.getElementById('treebox2');
            aList = blr.W15yQC.FormControlsDialog.aFormControlsList;
          }
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          if (blr.W15yQC.FormControlsDialog.aDocumentsList != null) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.FormControlsDialog.aDocumentsList);
          }
          aList[selectedRow].node.ownerDocument.defaultView.focus();
          void

          function (arg) {
            blr.W15yQC.FormControlsDialog.FirebugO.GlobalUI.startFirebug(function () {
              blr.W15yQC.FormControlsDialog.FirebugO.Inspector.inspectFromContextMenu(arg);
            });
          }(aList[selectedRow].node);
        }
      } catch (ex) {}
    }
  },

  moveToSelectedElement: function () {
    var treebox, aList, selectedRow;
    if (blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus != null) {
      treebox = blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus;
      aList = blr.W15yQC.FormControlsDialog.aLastList;
    } else {
      treebox = document.getElementById('treebox2');
      aList = blr.W15yQC.FormControlsDialog.aFormControlsList;
    }
    selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      blr.W15yQC.fnMoveToElement(aList[selectedRow].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox, aList, selectedRow;
    if (blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus != null) {
      treebox = blr.W15yQC.FormControlsDialog.oLastTreeviewToHaveFocus;
      aList = blr.W15yQC.FormControlsDialog.aLastList;
    } else {
      treebox = document.getElementById('treebox2');
      aList = blr.W15yQC.FormControlsDialog.aFormControlsList;
    }
    selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.FormControlsDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(aList[selectedRow].node);
    }
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(blr.W15yQC.FormControlsDialog.FirebugO, 'forms');
  }

};