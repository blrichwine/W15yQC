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

 * File:        badIDsDialog.js
 * Description: Handles displaying the accesskey check dialog
 * Author:	Brian Richwine
 * Created:	2012.08.20
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
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
 * Object:  QuickW15yBadIDsDialog
 * Returns:
 */
blr.W15yQC.badIDsDialog = {
  FirebugO: null,
  aDocumentsList: null,
  aBadIDsList: null,
  fnPopulateTree: function (aDocumentsList, aBadIDsList) {
    var tbc, ch, treecell, treeitem, treerow, i, ak, textbox;
    if (aDocumentsList != null && aBadIDsList != null && aBadIDsList.length && aBadIDsList.length > 0) {
      tbc = document.getElementById('treeboxChildren');
      if (tbc != null) {
        if (aDocumentsList.length <= 1) {
          ch = document.getElementById('col-header-documentNumber');
          ch.setAttribute('hidden', 'true');
        }
        for (i = 0; i < aBadIDsList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', i + 1);
          treerow.appendChild(treecell);

          ak = aBadIDsList[i];

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

          if (ak.failed) {
            treerow.setAttribute('properties', 'failed');
          } else if (ak.warning) {
            treerow.setAttribute('properties', 'warning');
          }

          treeitem.appendChild(treerow);
          tbc.appendChild(treeitem);
        }
        blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
        if (aBadIDsList.length == 1) {
          blr.W15yQC.badIDsDialog.updateNotesField([aDocumentsList, aBadIDsList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No duplicate or invalid IDs were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport;

    blr.W15yQC.fnReadUserPrefs();
    if (dialog != null && dialog.arguments != null && dialog.arguments.length > 1) {
      blr.W15yQC.badIDsDialog.FirebugO = dialog.arguments[1];
    }
    if (blr.W15yQC.badIDsDialog.FirebugO == null || !blr.W15yQC.badIDsDialog.FirebugO.Inspector) {
      document.getElementById('button-showInFirebug').hidden = true;
    }

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document);
    blr.W15yQC.badIDsDialog.aDocumentsList = oW15yQCReport.aDocuments;

    blr.W15yQC.badIDsDialog.aBadIDsList = blr.W15yQC.fnGetBadIDs(window.opener.parent._content.document, blr.W15yQC.badIDsDialog.aDocumentsList);
    blr.W15yQC.badIDsDialog.aBadIDsList = oW15yQCReport.aBadIDs;
    blr.W15yQC.badIDsDialog.fnPopulateTree(blr.W15yQC.badIDsDialog.aDocumentsList, blr.W15yQC.badIDsDialog.aBadIDsList);
  },

  cleanup: function () {
    if (blr.W15yQC.badIDsDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.badIDsDialog.aDocumentsList);
      blr.W15yQC.badIDsDialog.aDocumentsList = null;
      blr.W15yQC.badIDsDialog.aBadIDsList = null;
      blr.W15yQC.badIDsDialog.FirebugO = null;
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

    if (blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow]);
    } else {
      textbox.value = '';
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].nodeDescription, "\n\n");
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].xpath, "\n\n");

    if (blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].node != null) {
      box = blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n\n");
      }
    }

    blr.W15yQC.fnResetHighlights(blr.W15yQC.badIDsDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].node);
      } catch (err) {}
    }
    if (bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].node, blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].doc);
  },

  showInFirebug: function () {
    var treebox, selectedRow;
    if (blr.W15yQC.badIDsDialog.FirebugO != null) {
      try {
        if (blr.W15yQC.badIDsDialog.aBadIDsList != null && blr.W15yQC.badIDsDialog.aBadIDsList.length && blr.W15yQC.badIDsDialog.aBadIDsList.length > 0) {
          treebox = document.getElementById('treebox');
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          blr.W15yQC.fnResetHighlights(blr.W15yQC.badIDsDialog.aDocumentsList);
          blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].node.ownerDocument.defaultView.focus();
          void
          function (arg) {
            blr.W15yQC.badIDsDialog.FirebugO.GlobalUI.startFirebug(function () {
              blr.W15yQC.badIDsDialog.FirebugO.Inspector.inspectFromContextMenu(arg);
            });
          }(blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].node);
        }
      } catch (ex) {}
    }
  },

  moveToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      blr.W15yQC.fnMoveToElement(blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.badIDsDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.badIDsDialog.aBadIDsList[selectedRow].node);
    }
  }

};