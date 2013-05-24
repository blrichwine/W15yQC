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

 * File:        linksDialog.js
 * Description: Handles displaying the accesskey quick check dialog
 * Author:	Brian Richwine
 * Created:	2011.12.19
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2011.12.19 - Created!
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
 * Object:  QuickW15yLinksDialog
 * Returns:
 */
blr.W15yQC.LinksDialog = {
  FirebugO: null,
  aDocumentsList: null,
  aLinksList: null,
  aDisplayOrder: [],
  sortColumns: [' Link Number (asc)'],
  nodeToInspect: null,

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
      blr.W15yQC.LinksDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.LinksDialog.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.LinksDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.LinksDialog.aLinksList != null && blr.W15yQC.LinksDialog.aLinksList.length>0) {
      if(blr.W15yQC.LinksDialog.aDisplayOrder==null) {
        blr.W15yQC.LinksDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.LinksDialog.aDisplayOrder.length<blr.W15yQC.LinksDialog.aLinksList.length) {
        blr.W15yQC.LinksDialog.aDisplayOrder.push(blr.W15yQC.LinksDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.LinksDialog.aDisplayOrder=[];
    }
  },

  fnPopulateTree: function (aDocumentsList, aLinksList, bDontHideCols) {
    var tbc, bHasRole, bHasStateDescription, bHasTarget, i, ak, ch, treecell, treeitem, treerow, textbox, order;
    blr.W15yQC.LinksDialog.updateDisplayOrderArray();
    order=blr.W15yQC.LinksDialog.aDisplayOrder;
    if (aDocumentsList != null && aLinksList != null && aLinksList.length && aLinksList.length > 0) {
      tbc = document.getElementById('treeboxChildren');
      bHasRole = false;
      bHasStateDescription = false;
      bHasTarget = false;
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            for (i = 0; i < aLinksList.length; i++) {
              ak = aLinksList[i];
              if (ak.role != null) bHasRole = true;
              if (ak.target != null) bHasTarget = true;
              if (ak.stateDescription != null) bHasStateDescription = true;
            }
            if (!bHasRole) {
              ch = document.getElementById('col-header-role');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasTarget) {
              ch = document.getElementById('col-header-target');
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
        for (i = 0; i < aLinksList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aLinksList[order[i]];

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
          treecell.setAttribute('label', ak.text);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.title);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.target);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.href);
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
        if (aLinksList.length == 1) {
          blr.W15yQC.LinksDialog.updateNotesField([aDocumentsList, aLinksList], false);
        }
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No links were detected.";
    }
  },

  init: function (dialog) {
    var oW15yQCReport, progressWindow;

    blr.W15yQC.fnReadUserPrefs();
    blr.W15yQC.LinksDialog.FirebugO = dialog.arguments[1];
    if (blr.W15yQC.LinksDialog.FirebugO == null || !blr.W15yQC.LinksDialog.FirebugO.Inspector) {
      document.getElementById('button-showInFirebug').hidden = true;
    }

    progressWindow = window.openDialog('chrome://W15yQC/content/progressDialog.xul', 'w15yQCProgressDialog', 'dialog=yes,alwaysRaised=yes,chrome,resizable=no,centerscreen');
    blr.W15yQC.fnDoEvents();
    //if(progressWindow != null) {
    //  progressWindow.document.getElementById('percent').value=0;
    //  progressWindow.document.getElementById('detailText').value='Getting Links...';
    //  progressWindow.focus();
    //  blr.W15yQC.fnDoEvents();
    //}

    oW15yQCReport = blr.W15yQC.fnGetElements(window.opener.parent._content.document);

    //blr.W15yQC.LinksDialog.aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
    blr.W15yQC.LinksDialog.aDocumentsList=oW15yQCReport.aDocuments;
    blr.W15yQC.LinksDialog.aLinksList=oW15yQCReport.aLinks;
    //blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.LinksDialog.aDocumentsList); // TODO: Does this need to run? Why?

    //blr.W15yQC.LinksDialog.aLinksList = blr.W15yQC.fnGetLinks(window.opener.parent._content.document);
    blr.W15yQC.fnAnalyzeLinks(oW15yQCReport, progressWindow);
    blr.W15yQC.LinksDialog.fnPopulateTree(blr.W15yQC.LinksDialog.aDocumentsList, blr.W15yQC.LinksDialog.aLinksList);

    progressWindow.close();
    progressWindow = null;
    dialog.focus();
  },


  updateControlStates: function() {

  },

  cleanup: function () {
    if (blr.W15yQC.LinksDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.LinksDialog.aDocumentsList);
      blr.W15yQC.LinksDialog.aDocumentsList = null;
      blr.W15yQC.LinksDialog.aLinksList = null;
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
    selectedIndex=blr.W15yQC.LinksDialog.aDisplayOrder[selectedRow];


    if (blr.W15yQC.LinksDialog.aLinksList[selectedIndex].notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.LinksDialog.aLinksList[selectedIndex]);
    } else {
      textbox.value = '';
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.LinksDialog.aLinksList[selectedIndex].nodeDescription, "\n\n");

    if (blr.W15yQC.LinksDialog.aLinksList[selectedIndex].node != null) {
      box = blr.W15yQC.LinksDialog.aLinksList[selectedIndex].node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n");
      }
    }
    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + blr.W15yQC.LinksDialog.aLinksList[selectedIndex].xpath, "\n");

    blr.W15yQC.fnResetHighlights(blr.W15yQC.LinksDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(blr.W15yQC.LinksDialog.aLinksList[selectedIndex].node);
      } catch (ex) {}
    }
    if (bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.LinksDialog.aLinksList[selectedIndex].node, blr.W15yQC.LinksDialog.aLinksList[treebox.currentIndex].doc);
  },

  objectToString: function (o, bDig) {
    var p, out = '';
    if (o != null) {
      for (p in o) {
        if (o[p].toString() == '[object Object]' && bDig != false) {
          out += 'STARTOBJ' + p + ': [' + blr.W15yQC.LinksDialog.objectToString(o[p], false) + ']\n';
        } else {
          out += p + ': ' + o[p] + '\n';
        }
      }
    }
    return out;
  },

  moveToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.LinksDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.LinksDialog.aDocumentsList);
      blr.W15yQC.fnMoveToElement(blr.W15yQC.LinksDialog.aLinksList[selectedIndex].node);
      blr.W15yQC.highlightElement(blr.W15yQC.LinksDialog.aLinksList[selectedIndex].node, blr.W15yQC.LinksDialog.aLinksList[selectedIndex].doc);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex, selectedIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.LinksDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.LinksDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.LinksDialog.aLinksList[selectedIndex].node);
    }
  },

  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.LinksDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.LinksDialog.sortColumns.splice(blr.W15yQC.LinksDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.LinksDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.LinksDialog.sortColumns.splice(blr.W15yQC.LinksDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.LinksDialog.sortColumns.length>3) { blr.W15yQC.LinksDialog.sortColumns.pop(); }
    blr.W15yQC.LinksDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.LinksDialog.aLinksList, order=blr.W15yQC.LinksDialog.aDisplayOrder;
    blr.W15yQC.LinksDialog.addSortColumn(index, ascending);
    blr.W15yQC.LinksDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.LinksDialog.sortColumns.toString());
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
    var i,j,temp,list=blr.W15yQC.LinksDialog.aLinksList, order=blr.W15yQC.LinksDialog.aDisplayOrder;
    blr.W15yQC.LinksDialog.addSortColumn(index, ascending);
    blr.W15yQC.LinksDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.LinksDialog.sortColumns.toString());
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
    blr.W15yQC.LinksDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.LinksDialog.aDisplayOrder=[];
        blr.W15yQC.LinksDialog.sortColumns=[' Link Number (asc)'];
        blr.W15yQC.LinksDialog.updateDisplayOrderArray();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.LinksDialog.sortTreeAsNumberOn('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.LinksDialog.aLinksList;
        ad=blr.W15yQC.LinksDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.LinksDialog.sortTreeAsStringOn('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
        blr.W15yQC.LinksDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-effectiveLabel':
        blr.W15yQC.LinksDialog.sortTreeAsStringOn('effectiveLabel',sortDir);
        break;
      case 'col-header-labelSource':
        blr.W15yQC.LinksDialog.sortTreeAsStringOn('effectiveLabelSource',sortDir);
        break;
      case 'col-header-linkText':
        blr.W15yQC.LinksDialog.sortTreeAsStringOn('text',sortDir);
        break;
      case 'col-header-title':
        blr.W15yQC.LinksDialog.sortTreeAsStringOn('title',sortDir);
        break;
      case 'col-header-target':
        blr.W15yQC.LinksDialog.sortTreeAsStringOn('target',sortDir);
        break;
      case 'col-header-href':
        blr.W15yQC.LinksDialog.sortTreeAsStringOn('href',sortDir);
        break;
      case 'col-header-role':
        blr.W15yQC.LinksDialog.sortTreeAsStringOn('role',sortDir);
        break;
      case 'col-header-state':
        blr.W15yQC.LinksDialog.sortTreeAsStringOn('stateDescription',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.LinksDialog.fnPopulateTree(blr.W15yQC.LinksDialog.aDocumentsList, blr.W15yQC.LinksDialog.aLinksList, true);
    blr.W15yQC.LinksDialog.updateControlStates();
    blr.W15yQC.LinksDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.LinksDialog.sortColumns.toString());
  },


  showInFirebug: function () {
    var treebox, selectedRow, selectedIndex;
    if (blr.W15yQC.LinksDialog.FirebugO != null) {
      try {
        if (blr.W15yQC.LinksDialog.aLinksList != null && blr.W15yQC.LinksDialog.aLinksList.length && blr.W15yQC.LinksDialog.aLinksList.length > 0) {
          treebox = document.getElementById('treebox');
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=blr.W15yQC.LinksDialog.aDisplayOrder[selectedRow];

          if (blr.W15yQC.LinksDialog.aDocumentsList != null) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.LinksDialog.aDocumentsList);
          }
          blr.W15yQC.LinksDialog.aLinksList[selectedIndex].node.ownerDocument.defaultView.focus();
          void
          function (arg) {
            blr.W15yQC.LinksDialog.FirebugO.GlobalUI.startFirebug(function () {
              blr.W15yQC.LinksDialog.FirebugO.Inspector.inspectFromContextMenu(arg);
            });
          }(blr.W15yQC.LinksDialog.aLinksList[selectedIndex].node);
        }
      } catch (ex) {}
    }
  },

  generateReportHTML: function () {
    blr.W15yQC.openHTMLReportWindow(blr.W15yQC.LinksDialog.FirebugO, 'links');
  }
};
