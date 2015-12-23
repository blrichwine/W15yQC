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

var blr=this.arguments[0];

/*
 * Object:  addMandatesDialog
 * Returns:
 */
blr.W15yQC.addMandatesDialog = {
  m: null,
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
      treecell.setAttribute('label',d.matchType);
      row.appendChild(treecell);

      treeitem.appendChild(row);
      tbc.appendChild(treeitem);
      document.getElementById('tbLogic').value=blr.W15yQC.fnJoin(document.getElementById('tbLogic').value,rows+1,'|');
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
      d.matchType=treecells[3].getAttribute('label');
      window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,d);
      if (d!==null && d.xPath!==null) {
        treecells[1].setAttribute('label',d.xPath);
        treecells[2].setAttribute('label',d.text);
        treecells[3].setAttribute('label',d.matchType);
      }
    }
  },
  
  fnDeleteTest: function() {
    var i,num,num2,tbc, rows, row, d={},
        treebox, treeitem, treerow, treecell, selectedRow, treecells;

    treebox=document.getElementById('tRules');
    selectedRow = treebox!=null?treebox.currentIndex:null;
    if (selectedRow!=null) {
      row=document.getElementById('Test'+selectedRow);
      num=parseInt(row.getElementsByTagName('treecell')[0].getAttribute('label'));
      row.parentNode.parentNode.removeChild(row.parentNode);
      rows=treebox.getElementsByTagName('treerow');
      for(i=0;i<rows.length;i++) {
        rows[i].setAttribute('id','Test'+i);
        rows[i].getElementsByTagName('treecell')[0].setAttribute('label',i+1);
      }
    }
  },
  
  logicIsValid: function() {
    var sLogic=blr.W15yQC.fnCleanSpaces(document.getElementById('tbLogic').value), result, sMsg='', i, tbc, rows, re;
    
    document.getElementById('tbLogic').value=sLogic;
    sLogic=sLogic.replace(/\bnot\b/ig,'!');
    sLogic=sLogic.replace(/\band\b/ig,'&');
    sLogic=sLogic.replace(/\bor\b/ig,'|');
    if(/^[\d\s\(\)\&\|\!]+$/.test(sLogic)) {
      sLogic=sLogic.replace(/\b\d+\b/g,'true'); // Just for test purposes
      try {
        result=blr.W15yQC.evalLogicString(sLogic);
        if (/^(true|false)$/i.test(result)==false) {
          sMsg='Syntax error in logic string.';
        }        
      } catch(ex) {
        sMsg='Syntax error in logic string.';
      }
    } else {
        sMsg='Syntax error in logic string.';
    }
    sLogic=document.getElementById('tbLogic').value;
    sLogic=' '+blr.W15yQC.fnCleanSpaces(sLogic.replace(/[^\d]+/g,' '))+' ';
    tbc=document.getElementById('tMandatesChildren');
    if (tbc!=null) {
      rows=tbc.getElementsByTagName('treerow').length;
      for(i=rows;i>=1;i--) {
        re=new RegExp(" "+i+" ", 'g');
        if (re.test(sLogic)) {
          sLogic=sLogic.replace(re,' ');
        } else {
          sMsg=blr.W15yQC.fnJoin('Logic string missing test:'+i+'.',sMsg,' ');
        }
      }
      if (blr.W15yQC.fnStringHasContent(sLogic)) {
        sMsg=blr.W15yQC.fnJoin(sMsg,'Logic string has the following invalid numbers:'+blr.W15yQC.fnCleanSpaces(sLogic)+'.',' ');
      }
    }
    return sMsg;
  },
  
  checkFields: function(bAlert) {
    var sMsg='', i;

    document.getElementById('tbTitle').value=blr.W15yQC.fnCleanSpaces(document.getElementById('tbTitle').value);
    document.getElementById('tbLogic').value=blr.W15yQC.fnCleanSpaces(document.getElementById('tbLogic').value);
    document.getElementById('tbWeight').value=blr.W15yQC.fnCleanSpaces(document.getElementById('tbWeight').value);

    if (document.getElementById('Test0')==null) {
      sMsg=blr.W15yQC.fnJoin(sMsg,'You must enter at least one test condition.',' ');
    }
    if (!blr.W15yQC.fnStringHasContent(document.getElementById('tbTitle').value)) {
      sMsg=blr.W15yQC.fnJoin(sMsg,'You must provide a title for this rule.',' ');
    }
    
    
    sMsg=blr.W15yQC.fnJoin(sMsg,blr.W15yQC.addMandatesDialog.logicIsValid(),' ');
      
    i=parseInt(document.getElementById('tbWeight').value);
    if (!/^[\d]+$/.test(document.getElementById('tbWeight').value) || i<0 || i>100) {
      sMsg=blr.W15yQC.fnJoin(sMsg,'The weight value must be an integer between 0 and 100.',' ');
    }
    
    if(sMsg=='') {
      blr.W15yQC.addMandatesDialog.ok=true;
    } else {
      if(bAlert===true) { alert(sMsg); }
      blr.W15yQC.addMandatesDialog.ok=false;
    }
  },

  doOK: function() {
    var i, rows=document.getElementById('tMandatesChildren').getElementsByTagName('treerow'), treecells;
    blr.W15yQC.addMandatesDialog.checkFields(true);
    if(blr.W15yQC.addMandatesDialog.ok===true) {
      blr.W15yQC.addMandatesDialog.m.title=document.getElementById('tbTitle').value;
      blr.W15yQC.addMandatesDialog.m.logic=document.getElementById('tbLogic').value;
      blr.W15yQC.addMandatesDialog.m.weight=document.getElementById('tbWeight').value;
      blr.W15yQC.addMandatesDialog.m.enabled=document.getElementById('cbMandateEnabled').checked;
      blr.W15yQC.addMandatesDialog.m.showInReport=document.getElementById('cbShowInReport').checked;
      blr.W15yQC.addMandatesDialog.m.tests=[];
      for(i=0;i<rows.length;i++) {
        treecells=rows[i].getElementsByTagName('treecell');
        blr.W15yQC.addMandatesDialog.m.tests.push({});
        blr.W15yQC.addMandatesDialog.m.tests[i].xPath=treecells[1].getAttribute('label');
        blr.W15yQC.addMandatesDialog.m.tests[i].text=treecells[2].getAttribute('label');
        blr.W15yQC.addMandatesDialog.m.tests[i].matchType=treecells[3].getAttribute('label');
      }
      return true;
    }
    return false;
  },

  doCancel: function() {
    return true;
  }
};


blr.W15yQC.addMandatesDialog.m=this.arguments[1];
if(blr.W15yQC.addMandatesDialog.m!=null && blr.W15yQC.fnStringHasContent(blr.W15yQC.addMandatesDialog.m.title)) {
  document.getElementById('tbTitle').value=blr.W15yQC.addMandatesDialog.m.title;
  document.getElementById('tbLogic').value=blr.W15yQC.addMandatesDialog.m.logic;
  document.getElementById('tbWeight').value=blr.W15yQC.addMandatesDialog.m.weight;
  document.getElementById('cbMandateEnabled').checked=blr.W15yQC.addMandatesDialog.m.enabled;
  document.getElementById('cbShowInReport').checked=blr.W15yQC.addMandatesDialog.m.showInReport;
  (function () {
    var i,m=blr.W15yQC.addMandatesDialog.m, tbc,treeitem, row, treecell;
    tbc=document.getElementById('tMandatesChildren');
    for(i=0;i<m.tests.length;i++) {
      treeitem=document.createElement('treeitem');
      row=document.createElement('treerow');
      row.setAttribute('id','Test'+i);

      treecell=document.createElement('treecell');
      treecell.setAttribute('label',i+1);
      row.appendChild(treecell);

      treecell=document.createElement('treecell');
      treecell.setAttribute('label',m.tests[i].xPath);
      row.appendChild(treecell);

      treecell=document.createElement('treecell');
      treecell.setAttribute('label',m.tests[i].text);
      row.appendChild(treecell);

      treecell=document.createElement('treecell');
      treecell.setAttribute('label',m.tests[i].matchType);
      row.appendChild(treecell);

      treeitem.appendChild(row);
      tbc.appendChild(treeitem);
    }
  })();
}
