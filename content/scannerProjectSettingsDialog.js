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

 * File:        scannerProjectSettingsDialog.js
 * Description: Handles the project scanner dialog
 * Author:	Brian Richwine
 * Created:	2013.01.21
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2013.01.21 - Created!
 *
 *
 * TODO:
 *
 *
 */
"use strict";

/*
 * Object:  scannerProjectSettingsDialog
 * Returns:
 */

blr.W15yQC.scannerProjectSettingsDialog = {
  bFieldsAreOK:false,
  bValuesHaveChanged:false,

  init: function (dialog) {
    var i, treeitem, treecell, row, tbc1=document.getElementById('tMustMatchListChildren'), tbc2=document.getElementById('tMustNotMatchListChildren');

    document.getElementById('tbTitle').value=blr.W15yQC.ScannerWindow.sProjectTitle;
    document.getElementById('cbParseForLinks').checked=blr.W15yQC.ScannerWindow.parseForLinks==true;
    document.getElementById('tbMaxLengthDepth').value=blr.W15yQC.ScannerWindow.maximumURLDepth;
    
    document.getElementById('tbMaxURLCount').value=blr.W15yQC.ScannerWindow.maximumURLCount;
    document.getElementById('tbPageLoadFilter').value=blr.W15yQC.ScannerWindow.pageLoadFilter;
    document.getElementById('tbPageLoadTimeLimit').value=blr.W15yQC.ScannerWindow.pageLoadTimeLimit;
    

    if(blr.W15yQC.ScannerWindow.urlMustMatchList != null) {
      for(i=0;i<blr.W15yQC.ScannerWindow.urlMustMatchList.length;i++) {
        treeitem=document.createElement('treeitem');
        row=document.createElement('treerow');
        treecell=document.createElement('treecell');
        treecell.setAttribute('label',blr.W15yQC.ScannerWindow.urlMustMatchList[i]);
        row.appendChild(treecell);
        treecell=document.createElement('treecell');
        treecell.setAttribute('label',blr.W15yQC.ScannerWindow.urlMustMatchListType[i] == 1 ? "RegEx" : "Match");
        row.appendChild(treecell);
        treeitem.appendChild(row);
        tbc1.appendChild(treeitem);
      }
    }

    if(blr.W15yQC.ScannerWindow.urlMustNotMatchList != null) {
      for(i=0;i<blr.W15yQC.ScannerWindow.urlMustNotMatchList.length;i++) {
        treeitem=document.createElement('treeitem');
        row=document.createElement('treerow');
        treecell=document.createElement('treecell');
        treecell.setAttribute('label',blr.W15yQC.ScannerWindow.urlMustNotMatchList[i]);
        row.appendChild(treecell);
        treecell=document.createElement('treecell');
        treecell.setAttribute('label',blr.W15yQC.ScannerWindow.urlMustNotMatchListType[i] == 1 ? "RegEx" : "Match");
        row.appendChild(treecell);
        treeitem.appendChild(row);
        tbc2.appendChild(treeitem);
      }
    }
    blr.W15yQC.scannerProjectSettingsDialog.updateControls();
  },

  updateControls: function() {

    if(document.getElementById('tMustMatchList').currentIndex>=0) {
      document.getElementById('button-editMustMatch').disabled=false;
      document.getElementById('button-deleteMustMatch').disabled=false;
    } else {
      document.getElementById('button-editMustMatch').disabled=true;
      document.getElementById('button-deleteMustMatch').disabled=true;
    }

    if(document.getElementById('tMustNotMatchList').currentIndex>=0) {
      document.getElementById('button-editMustNotMatch').disabled=false;
      document.getElementById('button-deleteMustNotMatch').disabled=false;
    } else {
      document.getElementById('button-editMustNotMatch').disabled=true;
      document.getElementById('button-deleteMustNotMatch').disabled=true;
    }

  },


  fnAddMustMatch: function() {
    var tbc, row, d={matchSpec:'', matchTypeIsRegEx:false},
        treeitem, treerow, treecell,
        dialogID = 'addScannerURLMatchSpecDialog',
        dialogPath = 'chrome://W15yQC/content/addScannerURLMatchSpecDialog.xul';

    window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,d);
    if(d!=null && d.matchSpec!=null && d.matchTypeIsRegEx!=null) {
      tbc = document.getElementById('tMustMatchListChildren');
      treeitem=document.createElement('treeitem');
      row=document.createElement('treerow');
      treecell=document.createElement('treecell');
      treecell.setAttribute('label',d.matchSpec);
      row.appendChild(treecell);
      treecell=document.createElement('treecell');
      treecell.setAttribute('label',d.matchTypeIsRegEx == true ? "RegExp" : "Match");
      row.appendChild(treecell);
      treeitem.appendChild(row);
      tbc.appendChild(treeitem);
    }
  },

  fnEditMustMatch: function() {
    var treebox=document.getElementById('tMustMatchList'),
        selectedRow = treebox.currentIndex,
        tbc, row, d={matchSpec:'', matchTypeIsRegEx:false},
        treeitem, treerow, treecell, treecells,
        dialogID = 'addScannerURLMatchSpecDialog',
        dialogPath = 'chrome://W15yQC/content/addScannerURLMatchSpecDialog.xul';

    row=treebox.getElementsByTagName('treeitem')[selectedRow];
    treecells=row.getElementsByTagName('treecell');
    d.matchSpec=treecells[0].getAttribute('label');
    d.matchTypeIsRegEx=treecells[1].getAttribute('label') == 'RegExp';
    window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,d);
    if(d!=null && d.matchSpec!=null && d.matchTypeIsRegEx!=null) {
      treecells[0].setAttribute('label',d.matchSpec);
      treecells[1].setAttribute('label',d.matchTypeIsRegEx == true ? "RegExp" : "Match");
    }
  },

  fnDeleteMustMatch: function() {
    var treebox=document.getElementById('tMustMatchList'),
      selectedRow = treebox.currentIndex,
      row;

    if(selectedRow>=0) {
      row=treebox.getElementsByTagName('treeitem')[selectedRow];
      if(row!=null) {
        row.parentNode.removeChild(row);
      }
    }
  },

  fnAddMustNotMatch: function() {
    var tbc, row, d={matchSpec:'', matchTypeIsRegEx:false},
        treeitem, treerow, treecell,
        dialogID = 'addScannerURLMatchSpecDialog',
        dialogPath = 'chrome://W15yQC/content/addScannerURLMatchSpecDialog.xul';

    window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,d);
    if(d!=null && d.matchSpec!=null && d.matchTypeIsRegEx!=null) {
      tbc = document.getElementById('tMustNotMatchListChildren');
      treeitem=document.createElement('treeitem');
      row=document.createElement('treerow');
      treecell=document.createElement('treecell');
      treecell.setAttribute('label',d.matchSpec);
      row.appendChild(treecell);
      treecell=document.createElement('treecell');
      treecell.setAttribute('label',d.matchTypeIsRegEx == true ? "RegExp" : "Match");
      row.appendChild(treecell);
      treeitem.appendChild(row);
      tbc.appendChild(treeitem);
    }
  },

  fnEditMustNotMatch: function() {
    var treebox=document.getElementById('tMustNotMatchList'),
        selectedRow = treebox.currentIndex,
        tbc, row, d={matchSpec:'', matchTypeIsRegEx:false},
        treeitem, treerow, treecell, treecells,
        dialogID = 'addScannerURLMatchSpecDialog',
        dialogPath = 'chrome://W15yQC/content/addScannerURLMatchSpecDialog.xul';

    row=treebox.getElementsByTagName('treeitem')[selectedRow];
    treecells=row.getElementsByTagName('treecell');
    d.matchSpec=treecells[0].getAttribute('label');
    d.matchTypeIsRegEx=treecells[1].getAttribute('label') == 'RegExp';
    window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,d);
    if(d!=null && d.matchSpec!=null && d.matchTypeIsRegEx!=null) {
      treecells[0].setAttribute('label',d.matchSpec);
      treecells[1].setAttribute('label',d.matchTypeIsRegEx == true ? "RegExp" : "Match");
    }
  },

  fnDeleteMustNotMatch: function() {
    var treebox=document.getElementById('tMustNotMatchList'),
      selectedRow = treebox.currentIndex,
      row;

    if(selectedRow>=0) {
      row=treebox.getElementsByTagName('treeitem')[selectedRow];
      if(row!=null) {
        row.parentNode.removeChild(row);
      }
    }
  },

  checkFields: function() {
    blr.W15yQC.scannerProjectSettingsDialog.updateControls();
    document.getElementById('tbMaxLengthDepth').value=blr.W15yQC.fnTrim(document.getElementById('tbMaxLengthDepth').value);
    if(/^\d+$/.test(document.getElementById('tbMaxLengthDepth').value)) {
      blr.W15yQC.scannerProjectSettingsDialog.bFieldsAreOK=true;
      return;
    }
    blr.W15yQC.scannerProjectSettingsDialog.bFieldsAreOK=false;
  },

  doOK: function() {
    var i, count, treebox, treecells,row;
    blr.W15yQC.scannerProjectSettingsDialog.checkFields();
    if(blr.W15yQC.scannerProjectSettingsDialog.bFieldsAreOK==true) {
      blr.W15yQC.ScannerWindow.projectSettingsHaveBeenSet=true;
      blr.W15yQC.ScannerWindow.sProjectTitle=blr.W15yQC.fnTrim(document.getElementById('tbTitle').value);
      blr.W15yQC.ScannerWindow.parseForLinks=document.getElementById('cbParseForLinks').checked;
      blr.W15yQC.ScannerWindow.maximumURLDepth=parseInt(document.getElementById('tbMaxLengthDepth').value);

      blr.W15yQC.ScannerWindow.maximumURLCount=parseInt(document.getElementById('tbMaxURLCount').value);
      blr.W15yQC.ScannerWindow.pageLoadFilter=parseInt(document.getElementById('tbPageLoadFilter').value);
      blr.W15yQC.ScannerWindow.pageLoadTimeLimit=parseInt(document.getElementById('tbPageLoadTimeLimit').value);

      blr.W15yQC.ScannerWindow.urlMustMatchList=[];
      blr.W15yQC.ScannerWindow.urlMustMatchListType=[];
      blr.W15yQC.ScannerWindow.urlMustNotMatchList=[];
      blr.W15yQC.ScannerWindow.urlMustNotMatchListType=[];

      treebox=document.getElementById('tMustMatchList');
      count=(treebox.getElementsByTagName('treeitem')).length;
      for(i=0;i<count;i++) {
        row=treebox.getElementsByTagName('treeitem')[i];
        treecells=row.getElementsByTagName('treecell');
        blr.W15yQC.ScannerWindow.urlMustMatchList[i]=treecells[0].getAttribute('label');
        blr.W15yQC.ScannerWindow.urlMustMatchListType[i]=treecells[1].getAttribute('label') == 'RegExp';
      }

      treebox=document.getElementById('tMustNotMatchList');
      count=(treebox.getElementsByTagName('treeitem')).length;
      for(i=0;i<count;i++) {
        row=treebox.getElementsByTagName('treeitem')[i];
        treecells=row.getElementsByTagName('treecell');
        blr.W15yQC.ScannerWindow.urlMustNotMatchList[i]=treecells[0].getAttribute('label');
        blr.W15yQC.ScannerWindow.urlMustNotMatchListType[i]=treecells[1].getAttribute('label') == 'RegExp';
      }

      return true;
    }
    return false;
  },

  doCancel: function() {
    return true;
  },

  cleanup: function (dialog) {
  },

  windowOnKeyDown: function() {

  },

  windowOnKeyUp: function() {

  },

  forceMinSize: function() {

  }

};

