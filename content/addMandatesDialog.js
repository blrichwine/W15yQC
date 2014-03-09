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

 * File:        addMandatesDialog.js
 * Description: Handles displaying the add mandates dialog in the options panel
 * Author:	Brian Richwine
 * Created:	2014.03.08
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
"use strict";

if (!blr) {
  var blr = {};
}

/*
 * Object:  addMandatesDialog
 * Returns:
 */
blr.W15yQC.addMandatesDialog = {
  d: null,
  ok: false,

  fnAddTest: function() {
    var tbc, rows, row, d={},
        treeitem, treerow, treecell,
        dialogID = 'addEditMandateTestDialog',
        dialogPath = 'chrome://W15yQC/content/addEditMandateTestDialog.xul';

    window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,d);
    if (d!==null) {
      tbc=document.getElementById('tMandatesChildren');
      rows=tbc.getElementsByTagName('treerow').length;
      treeitem=document.createElement('treeitem');
      row=document.createElement('treerow');
      row.setAttribute('id','Test'+rows);

      treecell=document.createElement('treecell');
      treecell.setAttribute('label',rows+1);
      row.appendChild(treecell);

      treecell=document.createElement('treecell');
      treecell.setAttribute('label',d.xPath);
      row.appendChild(treecell);

      treecell=document.createElement('treecell');
      treecell.setAttribute('label',d.text);
      row.appendChild(treecell);

      treecell=document.createElement('treecell');
      treecell.setAttribute('label',d.bRegEx?'R':'S');
      row.appendChild(treecell);

      treeitem.appendChild(row);
      tbc.appendChild(treeitem);
    }
  },

  fnEditTest: function() {
    var tbc, rows, row, d={},
        treebox, treeitem, treerow, treecell, selectedRow, treecells,
        dialogID = 'addEditMandateTestDialog',
        dialogPath = 'chrome://W15yQC/content/addEditMandateTestDialog.xul';

    treebox=document.getElementById('tRules');
    selectedRow = treebox.currentIndex;
    if (selectedRow!=null) {
      row=document.getElementById('Test'+selectedRow);
      treecells=row.getElementsByTagName('treecell');
      d.xPath=treecells[1].getAttribute('label');
      d.text=treecells[2].getAttribute('label');
      d.bRegEx=treecells[3].getAttribute('label')==='R';
      window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,d);
      if (d!==null && d.xPath!==null) {
        treecells[1].setAttribute('label',d.xPath);
        treecells[2].setAttribute('label',d.text);
        treecells[3].setAttribute('label',d.bRegEx?'R':'S');
      }
    }
  },
  
  fnDeleteTest: function() {
    var tbc, rows, row, d={},
        treebox, treeitem, treerow, treecell, selectedRow, treecells,
        dialogID = 'addEditMandateTestDialog',
        dialogPath = 'chrome://W15yQC/content/addEditMandateTestDialog.xul';

    treebox=document.getElementById('tRules');
    selectedRow = treebox.currentIndex;
    if (selectedRow!=null) {
      row=document.getElementById('Test'+selectedRow);
      //TODO: Finish this
    }
  },
  
  checkFields: function() {
    blr.W15yQC.addMandatesDialog.ok=/^[\w\-_]+(\.[\w\-_]+)+(\/[~\w\-_]+)*$/i.test(document.getElementById('tbDomain1').value) &&
          /^[\w\-_]+(\.[\w\-_]+)+(\/[~\w\-_]+)*$/i.test(document.getElementById('tbDomain2').value);
  },

  doOK: function() {
    blr.W15yQC.addMandatesDialog.checkFields();
    if(blr.W15yQC.addMandatesDialog.ok) {
      blr.W15yQC.addMandatesDialog.d.d1=document.getElementById('tbDomain1').value;
      blr.W15yQC.addMandatesDialog.d.d2=document.getElementById('tbDomain2').value;
      return true;
    } else {
      alert('Values are not valid. Correct and try again, or cancel to exit.');
    }
    return false;
  },

  doCancel: function() {
    return true;
  }
};
