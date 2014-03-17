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

 * File:        luminosityCheckDialog.js
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
 * Object:  LuminosityCheckDialog
 * Returns:
 */
blr.W15yQC.LuminosityCheckDialog = {
  aDocumentsList: null,
  aLumCheckList: null,
  iLastSelectedRow: 0,
  aDisplayOrder: [],
  sortColumns: [' Source Order Number (asc)'],
  bCmdIsPressed:false,
  
  fnUpdateStatus: function(sLabel) {
    document.getElementById('progressMeterLabel').value=sLabel;
    document.getElementById('progressMeter').setAttribute('hidden','true');
    blr.W15yQC.fnDoEvents();
  },

  fnUpdatePercentage: function(p) {
    document.getElementById('progressMeter').value=p;
    document.getElementById('progressMeter').setAttribute('hidden','false');
    blr.W15yQC.fnDoEvents();
  },

  fnUpdateProgress: function(sLabel, fPercentage) {
    if(sLabel != null) {
      blr.W15yQC.LuminosityCheckDialog.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.LuminosityCheckDialog.fnUpdatePercentage(fPercentage);
      document.getElementById('progressMeter').setAttribute('hidden','false');
    } else {
      document.getElementById('progressMeter').setAttribute('hidden','true');
    }
    blr.W15yQC.LuminosityCheckDialog.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.LuminosityCheckDialog.aLumCheckList != null && blr.W15yQC.LuminosityCheckDialog.aLumCheckList.length>0) {
      if(blr.W15yQC.LuminosityCheckDialog.aDisplayOrder==null) {
        blr.W15yQC.LuminosityCheckDialog.aDisplayOrder=[];
      }
      while(blr.W15yQC.LuminosityCheckDialog.aDisplayOrder.length<blr.W15yQC.LuminosityCheckDialog.aLumCheckList.length) {
        blr.W15yQC.LuminosityCheckDialog.aDisplayOrder.push(blr.W15yQC.LuminosityCheckDialog.aDisplayOrder.length);
      }
    } else {
      blr.W15yQC.LuminosityCheckDialog.aDisplayOrder=[];
    }
  },

  fnPopulateTree: function (aDocumentsList, aLumCheckList, bDontHideCols) {
    var tbc = document.getElementById('treeboxChildren'),
      bHasID = false,
      bHasClass = false,
      treeitem, treerow, treecell, textbox,
      ak, ch, i, order, lRatio;
    blr.W15yQC.LuminosityCheckDialog.updateDisplayOrderArray();
    order=blr.W15yQC.LuminosityCheckDialog.aDisplayOrder;

    if (aDocumentsList != null && aLumCheckList != null && aLumCheckList.length && aLumCheckList.length > 0) {
      if (tbc != null) {
        while (tbc.firstChild) {
          tbc.removeChild(tbc.firstChild);
        }
        if (bDontHideCols!=true) {
            for (i = 0; i < aLumCheckList.length; i++) {
              ak = aLumCheckList[i];
              if (ak.node.hasAttribute('id')) {
                bHasID = true;
              }
              if (ak.node.hasAttribute('class')) {
                bHasClass = true;
              }
            }
            if (!bHasID) {
              ch = document.getElementById('col-header-id');
              ch.setAttribute('hidden', 'true');
            }
            if (!bHasClass) {
              ch = document.getElementById('col-header-class');
              ch.setAttribute('hidden', 'true');
            }
            if (aDocumentsList.length <= 1) {
              ch = document.getElementById('col-header-documentNumber');
              ch.setAttribute('hidden', 'true');
            }
        }
        for (i = 0; i < aLumCheckList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', order[i] + 1);
          treerow.appendChild(treecell);

          ak = aLumCheckList[order[i]];

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.ownerDocumentNumber);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ak.nodeDescription);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', '  '+ak.node.tagName);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ' ' + ak.id);
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ' ' + ak.sClass + ' ');
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ' ' + ak.textSize + ' ');
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ' ' + ak.textWeight + ' ');
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ' ' + ak.fgC + ' ');
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ' ' + ak.bgC + ' ');
          treerow.appendChild(treecell);

          lRatio = parseFloat(ak.luminosityRatio).toFixed(2);
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ' ' + lRatio + (ak.hasBackgroundImage ? '?' : ' ') + ' ');
          treerow.appendChild(treecell);

          treecell = document.createElement('treecell');
          treecell.setAttribute('label', ' ' + ak.text);
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
      blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
      if (aLumCheckList.length == 1) {
        blr.W15yQC.LuminosityCheckDialog.updateNotesField([aDocumentsList, aLumCheckList], false);
      }
    } else {
      textbox = document.getElementById('note-text');
      textbox.value = "No Image elements were detected.";
    }
  },

  init: function (dialog) {

    dialog.fnUpdateProgress('Getting Elements...',null);
    blr.W15yQC.fnReadUserPrefs();
    document.getElementById('button-inspectElement').hidden = !Application.prefs.getValue("devtools.inspector.enabled",false);

    blr.W15yQC.LuminosityCheckDialog.aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
    //blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.LuminosityCheckDialog.aDocumentsList); //http://stackoverflow.com/questions/1030747/how-to-set-a-xulrunner-main-windows-minimum-size
    blr.W15yQC.LuminosityCheckDialog.aLumCheckList = blr.W15yQC.fnGetLuminosityCheckElements(window.opener.parent._content.document);
    blr.W15yQC.fnAnalyzeLuminosityCheckElements(blr.W15yQC.LuminosityCheckDialog.aLumCheckList, blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
    blr.W15yQC.LuminosityCheckDialog.fnPopulateTree(blr.W15yQC.LuminosityCheckDialog.aDocumentsList, blr.W15yQC.LuminosityCheckDialog.aLumCheckList);

    dialog.fnUpdateProgress('Ready',null);
    dialog.focus();
  },


  updateControlStates: function() {

  },

  forceMinSize: function (dialog) {
    if (dialog.outerWidth > 100 && dialog.outerHeight > 100 && (dialog.outerWidth < 800 || dialog.outerHeight < 470)) {
      dialog.resizeTo(Math.max(800, dialog.outerWidth), Math.max(470, dialog.outerHeight));
    }
  },

  cleanup: function () {
    if (blr.W15yQC.LuminosityCheckDialog.aDocumentsList != null) {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
      blr.W15yQC.LuminosityCheckDialog.aDocumentsList = null;
      blr.W15yQC.LuminosityCheckDialog.aLumCheckList = null;
    }
  },

  updateNotesField: function (bHighlightElement) {
    var treebox = document.getElementById('treebox'),
      textbox = document.getElementById('note-text'),
      selectedRow = treebox.currentIndex, selectedIndex,
      ak,
      box, textSize, textWeight, lRatio,
      AALimit, AAALimit, sTextDescription,
      sMeetsLimitText, sLimitMsg, sSpec,
      if1, fgC, bgC, el, highlightElementsCB;

    if (bHighlightElement == null) {
      bHighlightElement = true;
    }

    if (selectedRow == null || treebox.currentIndex < 0) {
      selectedRow = 0;
      bHighlightElement = false;
    }
    selectedIndex=blr.W15yQC.LuminosityCheckDialog.aDisplayOrder[selectedRow];

    ak = blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedIndex];
    if (ak.notes != null) {
      textbox.value = blr.W15yQC.fnMakeTextNotesList(ak);
    } else {
      textbox.value = '';
    }

    textSize = parseFloat(ak.textSize);
    textWeight = parseInt(ak.textWeight, 10);
    lRatio = parseFloat(ak.luminosityRatio);

    if (textSize >= 18) {
      AALimit = 3.0;
      AAALimit = 4.5;
      sTextDescription = '18pt or larger';
    } else if (textSize >= 14 && textWeight >= 700) {
      AALimit = 3.0;
      AAALimit = 4.5;
      sTextDescription = 'bold and 14pt or larger';
    } else if (textWeight < 700) {
      AALimit = 4.5;
      AAALimit = 7.0;
      sTextDescription = 'not bold and is smaller than 18pt';
    } else {
      AALimit = 4.5;
      AAALimit = 7.0;
      sTextDescription = 'bold and smaller than 14pt';
    }
    if (lRatio - AAALimit > 4) {
      sMeetsLimitText = 'handily meets AAA compliance.';
    } else if (lRatio - AAALimit > 0.2) {
      sMeetsLimitText = 'meets AAA compliance.';
    } else if (lRatio >= AAALimit) {
      sMeetsLimitText = 'just meets AAA compliance.';
    } else if (AAALimit - lRatio < 0.2) {
      sMeetsLimitText = 'meets AA compliance while just missing AAA compliance.';
    } else if (lRatio < AALimit) {
      sMeetsLimitText = 'fails to meet AA compliance.';
    } else if (lRatio - AALimit > 0.2) {
      sMeetsLimitText = 'meets AA compliance.';
    } else {
      sMeetsLimitText = 'just meets AA compliance.';
    }

    sSpec = Application.prefs.getValue('extensions.W15yQC.testContrast.MinSpec', 'WCAG2 AA');
    if (sSpec == 'WCAG2 AA') {
      if (lRatio < AALimit) {
        sLimitMsg = 'Failed to meet';
      } else {
        sLimitMsg = 'Meets';
      }
    } else {
      if (lRatio < AAALimit) {
        sLimitMsg = 'Failed to meet';
      } else {
        sLimitMsg = 'Meets';
      }
    }

    sLimitMsg += ' ' + sSpec + ': For text that is ' + sTextDescription + ', the minimum required contrast ratio to meet WCAG 2.0 AA compliance is: ' + AALimit +
      ":1, and to meet AAA compliance is: " + AAALimit + ':1. The contrast ratio of ' + lRatio + ':1 ' + sMeetsLimitText;

    if (ak.hasBackgroundImage == true) {
      textbox.value = blr.W15yQC.fnJoin(textbox.value, "NOTICE: Element appears to be over a background image. Contrast results may be invalid. Verify styling against sample on the right.", "\n\n");
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, sLimitMsg + "\n\n" + ak.nodeDescription, "\n\n");

    if (ak.node != null) {
      box = ak.node.getBoundingClientRect();
      if (box != null) {
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:' + Math.floor(box.top) + ', Left:' + Math.floor(box.left) + ', Width:' + Math.floor(box.width) + ', Height:' + Math.floor(box.height), "\n");
      }
    }

    textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: ' + ak.xpath, "\n");

    if1 = document.getElementById("iframeCSample");
    fgC = blr.W15yQC.fnGetColorString(parseInt(ak.fgColor[0], 10) * 65536 + parseInt(ak.fgColor[1], 10) * 256 + parseInt(ak.fgColor[2], 10));
    bgC = blr.W15yQC.fnGetColorString(parseInt(ak.bgColor[0], 10) * 65536 + parseInt(ak.bgColor[1], 10) * 256 + parseInt(ak.bgColor[2], 10));

    while (if1.contentDocument.body.firstChild) {
      if1.contentDocument.body.removeChild(if1.contentDocument.body.firstChild);
    }
    if1.contentDocument.body.style.color = fgC;
    if1.contentDocument.body.style.backgroundColor = bgC;
    if1.contentDocument.body.style.fontFamily = window.getComputedStyle(ak.node, null).getPropertyValue("font-family");
    if1.contentDocument.body.style.fontSize = (textSize * 0.80).toString() + 'pt';
    if1.contentDocument.body.style.margin = '0';
    if1.contentDocument.body.style.padding = '4px';

    if1.contentDocument.body.appendChild(if1.contentDocument.createTextNode('Example text at ' + textSize + ' points. '));
    el = if1.contentDocument.createElement('i');
    el.appendChild(if1.contentDocument.createTextNode('Example text in italic. '));
    if1.contentDocument.body.appendChild(el);
    el = if1.contentDocument.createElement('b');
    el.appendChild(if1.contentDocument.createTextNode('Example text in bold.'));
    if1.contentDocument.body.appendChild(el);

    blr.W15yQC.fnResetHighlights(blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
    if (blr.W15yQC.bAutoScrollToSelectedElementInInspectorDialogs) {
      try {
        blr.W15yQC.fnMoveToElement(ak.node);
      } catch (err) {}
    }
    highlightElementsCB = document.getElementById('chkbox-highlighton');
    if (highlightElementsCB.checked && bHighlightElement != false) {
      blr.W15yQC.highlightElement(ak.node);
    }
  },

  toggleHighlighting: function () {
    var treebox, selectedRow, highlightElementsCB = document.getElementById('chkbox-highlighton'), selectedIndex;
    if (highlightElementsCB.checked) {
      treebox = document.getElementById('treebox');
      selectedRow = treebox.currentIndex;
      if (selectedRow != null && treebox.currentIndex >= 0) {
        selectedIndex=blr.W15yQC.LuminosityCheckDialog.aDisplayOrder[selectedRow];
        blr.W15yQC.highlightElement(blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedIndex].node);
      }
    } else {
      blr.W15yQC.fnResetHighlights(blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
    }
  },

  moveToSelectedElement: function () {
    var treebox, selectedRow, selectedIndex;
    treebox = document.getElementById('treebox');
    selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.LuminosityCheckDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnMoveToElement(blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedIndex].node);
    }
  },

  moveFocusToSelectedElement: function () {
    var treebox, selectedRow, selectedIndex;
    treebox = document.getElementById('treebox');
    selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.LuminosityCheckDialog.aDisplayOrder[selectedRow];
      blr.W15yQC.fnResetHighlights(blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
      blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedIndex].node);
    }
  },

  openColorsInContrastTool: function () {
    var treebox, selectedRow, ak, fgC, bgC, newWin, selectedIndex;
    treebox = document.getElementById('treebox');
    selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      selectedIndex=blr.W15yQC.LuminosityCheckDialog.aDisplayOrder[selectedRow];
      ak = blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedIndex];
      fgC = blr.W15yQC.fnGetColorString(parseInt(ak.fgColor[0], 10) * 65536 + parseInt(ak.fgColor[1], 10) * 256 + parseInt(ak.fgColor[2], 10));
      bgC = blr.W15yQC.fnGetColorString(parseInt(ak.bgColor[0], 10) * 65536 + parseInt(ak.bgColor[1], 10) * 256 + parseInt(ak.bgColor[2], 10));
      newWin = window.openDialog('chrome://W15yQC/content/contrastDialog.xul', 'contrastToolDialog', 'chrome,resizable=yes,centerscreen', blr, fgC, bgC);
    }
  },

  addSortColumn: function(index, ascending) {
    while(blr.W15yQC.LuminosityCheckDialog.sortColumns.indexOf(' '+index+' (dsc)')>=0) {
      blr.W15yQC.LuminosityCheckDialog.sortColumns.splice(blr.W15yQC.LuminosityCheckDialog.sortColumns.indexOf(' '+index+' (dsc)'),1);
    }
    while(blr.W15yQC.LuminosityCheckDialog.sortColumns.indexOf(' '+index+' (asc)')>=0) {
      blr.W15yQC.LuminosityCheckDialog.sortColumns.splice(blr.W15yQC.LuminosityCheckDialog.sortColumns.indexOf(' '+index+' (asc)'),1);
    }
    while(blr.W15yQC.LuminosityCheckDialog.sortColumns.length>3) { blr.W15yQC.LuminosityCheckDialog.sortColumns.pop(); }
    blr.W15yQC.LuminosityCheckDialog.sortColumns.unshift(' '+index+(ascending?' (dsc)':' (asc)'));
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.LuminosityCheckDialog.aLumCheckList, order=blr.W15yQC.LuminosityCheckDialog.aDisplayOrder;
    blr.W15yQC.LuminosityCheckDialog.addSortColumn(index, ascending);
    blr.W15yQC.LuminosityCheckDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.LuminosityCheckDialog.sortColumns.toString());
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
    var i,j,temp,list=blr.W15yQC.LuminosityCheckDialog.aLumCheckList, order=blr.W15yQC.LuminosityCheckDialog.aDisplayOrder;
    blr.W15yQC.LuminosityCheckDialog.addSortColumn(index, ascending);
    blr.W15yQC.LuminosityCheckDialog.fnUpdateStatus('Sorting on:'+blr.W15yQC.LuminosityCheckDialog.sortColumns.toString());
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
    blr.W15yQC.LuminosityCheckDialog.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-sourceOrder':
        blr.W15yQC.LuminosityCheckDialog.aDisplayOrder=[];
        blr.W15yQC.LuminosityCheckDialog.sortColumns=[' Link Number (asc)'];
        blr.W15yQC.LuminosityCheckDialog.updateDisplayOrderArray();
        break;
      case 'col-header-documentNumber':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsNumberOn('ownerDocumentNumber',sortDir);
        break;
      case 'col-header-baseURI':
        al=blr.W15yQC.LuminosityCheckDialog.aLumCheckList;
        ad=blr.W15yQC.LuminosityCheckDialog.aDocumentsList;
        if (al != null && al != null && al.length>0 && !al[0].baseURI) {
            for (i=0;i<al.length;i++) {
                al[i].baseURI=ad[al[i].ownerDocumentNumber - 1].URL;
            }
        }
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsStringOn('baseURI',sortDir);
        break;
      case 'col-header-elementDescription':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-tag':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsStringOn('nodeDescription',sortDir);
        break;
      case 'col-header-id':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsStringOn('id',sortDir);
        break;
      case 'col-header-class':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsStringOn('sClass',sortDir);
        break;
      case 'col-header-textSize':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsNumberOn('textSize',sortDir);
        break;
      case 'col-header-textWeight':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsNumberOn('textWeight',sortDir);
        break;
      case 'col-header-fgColor':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsStringOn('fgC',sortDir);
        break;
      case 'col-header-bgcolor':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsStringOn('bgC',sortDir);
        break;
      case 'col-header-ratio':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsNumberOn('luminosityRatio',sortDir);
        break;
      case 'col-header-text':
        blr.W15yQC.LuminosityCheckDialog.sortTreeAsStringOn('text',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    if(colID!='col-header-sourceOrder') { col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending'); }
    blr.W15yQC.LuminosityCheckDialog.fnPopulateTree(blr.W15yQC.LuminosityCheckDialog.aDocumentsList, blr.W15yQC.LuminosityCheckDialog.aLumCheckList, true);
    blr.W15yQC.LuminosityCheckDialog.updateControlStates();
    blr.W15yQC.LuminosityCheckDialog.fnUpdateStatus('Sorted on:'+blr.W15yQC.LuminosityCheckDialog.sortColumns.toString());
  },


  inspectElement: function () {
    var treebox, selectedRow, selectedIndex, node;
      try {
        if (blr.W15yQC.LuminosityCheckDialog.aLumCheckList != null && blr.W15yQC.LuminosityCheckDialog.aLumCheckList.length && blr.W15yQC.LuminosityCheckDialog.aLumCheckList.length > 0) {
          treebox = document.getElementById('treebox');
          selectedRow = treebox.currentIndex;
          if (selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
          }
          selectedIndex=blr.W15yQC.LuminosityCheckDialog.aDisplayOrder[selectedRow];
          blr.W15yQC.fnResetHighlights(blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
          node=blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedIndex].node;
          node.ownerDocument.defaultView.focus();
          blr.W15yQC.inspectNode(node);
        }
      } catch (ex) {}
  },

  generateReportHTML: function () {
    // blr.W15yQC.openHTMLReportWindow(false,'luminosity');
  },
  
  windowOnKeyDown: function (dialog, evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.LuminosityCheckDialog.bCmdIsPressed = true;
        break;
      case 27:
        dialog.close();
        break;
      case 87:
        if (blr.W15yQC.LuminosityCheckDialog.bCmdIsPressed == true) {
            evt.stopPropagation();
            evt.preventDefault();
            blr.W15yQC.LuminosityCheckDialog.cleanup();
            dialog.close();
        }
        break;
    }
  },

  windowOnKeyUp: function (evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.LuminosityCheckDialog.bCmdIsPressed = false;
        break;
    }
  }

};
