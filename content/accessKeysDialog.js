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

 * File:        accessKeysDialog.js
 * Description: Handles displaying the accesskey check dialog
 * Author:	Brian Richwine
 * Created:	2011.12.10
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2011.12.10 - Created! First Xul project!!
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
 * Object:  QuickW15yAccessKeyDialog
 * Returns:
 */
blr.W15yQC.AccessKeyDialog = {
  FirebugO: null,
  aDocumentsList: null,
  aAccessKeysList: null,
  fnPopulateTree: function (aDocumentsList, aAccessKeysList) {
    var tbc, bHasRole, bHasStateDescription, i, ak, ch, treecell, treeitem, treerow, textbox;
    if (aDocumentsList != null && aAccessKeysList != null && aAccessKeysList.length && aAccessKeysList.length > 0) {
      tbc = document.getElementById('treeboxChildren');
      bHasRole = false;
      bHasStateDescription = false;
      if (tbc != null) {
        for (i = 0; i < aAccessKeysList.length; i++) {
          ak = aAccessKeysList[i];
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
        for (i = 0; i < aAccessKeysList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', i + 1);
          treerow.appendChild(treecell);

          ak = aAccessKeysList[i];

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
          treecell.setAttribute('label', ak.accessKey);
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
        blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
        if (aAccessKeysList.length == 1) {
          blr.W15yQC.AccessKeyDialog.updateNotesField([aDocumentsList, aAccessKeysList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No access keys were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport;

    blr.W15yQC.fnReadUserPrefs();

    if (dialog != null && dialog.arguments != null && dialog.arguments.length > 1) {
      blr.W15yQC.AccessKeyDialog.FirebugO = dialog.arguments[1];
    }
    if (blr.W15yQC.AccessKeyDialog.FirebugO == null || !blr.W15yQC.AccessKeyDialog.FirebugO.Inspector) {
      document.getElementById('button-showInFirebug').hidden = true;
    }

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document);
    blr.W15yQC.AccessKeyDialog.aDocumentsList = oW15yQCReport.aDocuments;
    blr.W15yQC.AccessKeyDialog.aAccessKeysList = oW15yQCReport.aAccessKeys;

    blr.W15yQC.fnAnalyzeAccessKeys(oW15yQCReport);

    blr.W15yQC.AccessKeyDialog.fnPopulateTree(blr.W15yQC.AccessKeyDialog.aDocumentsList, blr.W15yQC.AccessKeyDialog.aAccessKeysList);
  },

  cleanup: function () {
    if (blr.W15yQC.AccessKeyDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.AccessKeyDialog.aDocumentsList);
      blr.W15yQC.AccessKeyDialog.aDocumentsList = null;
      blr.W15yQC.AccessKeyDialog.aAccessKeysList = null;
      blr.W15yQC.AccessKeyDialog.FirebugO = null;
    }
  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'),
      textbox = document.getElementById('note-text'),
      selectedRow, box;

    if (bHighlightElement === null) bHighlightElement = true;

    selectedRow = treebox.currentIndex;
    if (selectedRow == null || treebox.currentIndex < 0) {
      selectedRow = 0;
      bHighlightElement = false;
    }

    if (blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow]);
    } else {
      textbox.value = '';
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].nodeDescription, "\n\n");
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].xpath, "\n\n");

    if (blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node != null) {
      box = blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
      }
    }

    blr.W15yQC.fnResetHighlights(blr.W15yQC.AccessKeyDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node);
      } catch (err) {}
    }
    if (bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node, blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].doc);
  },

  showInFirebug: function () {
    var treebox, selectedRow;
    if (blr.W15yQC.AccessKeyDialog.FirebugO != null) {
      try {
        if (blr.W15yQC.AccessKeyDialog.aAccessKeysList != null && blr.W15yQC.AccessKeyDialog.aAccessKeysList.length && blr.W15yQC.AccessKeyDialog.aAccessKeysList.length > 0) {
          treebox = document.getElementById('treebox');
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          blr.W15yQC.fnResetHighlights(blr.W15yQC.AccessKeyDialog.aDocumentsList);
          blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node.ownerDocument.defaultView.focus();
          void
          function (arg) {
            blr.W15yQC.AccessKeyDialog.FirebugO.GlobalUI.startFirebug(function () {
              blr.W15yQC.AccessKeyDialog.FirebugO.Inspector.inspectFromContextMenu(arg);
            });
          }(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node);
        }
      } catch (ex) {}
    }
  },

  moveToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      blr.W15yQC.fnMoveToElement(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.AccessKeyDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.AccessKeyDialog.aAccessKeysList[selectedRow].node);
    }
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(blr.W15yQC.AccessKeyDialog.FirebugO, 'accesskeys');
  }

};
