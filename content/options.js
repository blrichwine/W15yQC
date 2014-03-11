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

 * File:        options.js
 * Description: Handles the project scanner dialog
 * Author:	Brian Richwine
 * Created:	2013.02.10
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2013.02.10 - Created!
 *
 *
 */
"use strict";
Components.utils.import("resource://gre/modules/osfile.jsm");

/*
 * Object:  Options
 * Returns:
 */
blr.W15yQC.options = {

  mandates: [],
  
  init: function() {
    blr.W15yQC.options.fnReadPrefs();
  },

  fnReadPrefs: function() {
    var sDomains, aEquivDomains, aDomainPair,
        tbc, url, i, m,
        treeitem, treerow, treecell, row;

    blr.W15yQC.options.mandates=JSON.parse(Application.prefs.getValue("extensions.W15yQC.mandates","[]"));
    tbc = document.getElementById('tEquivDomainsChildren');

    if (tbc != null) {
      while (tbc.firstChild) {
        tbc.removeChild(tbc.firstChild);
      }
    }

    sDomains=Application.prefs.getValue("extensions.W15yQC.DomainEquivalences","");
    if(sDomains!=null && sDomains.length>3) {
      aEquivDomains=sDomains.split("|");
      if(aEquivDomains != null && aEquivDomains.length>0) {
        for(i=0;i<aEquivDomains.length;i++) {
          if(/=/.test(aEquivDomains[i])==true) {
            aDomainPair=aEquivDomains[i].split("=");
            if(aDomainPair!=null && aDomainPair.length==2) {
              treeitem=document.createElement('treeitem');
              row=document.createElement('treerow');
              row.setAttribute('id','Domains'+i);
              treecell=document.createElement('treecell');
              treecell.setAttribute('label',aDomainPair[0]);
              row.appendChild(treecell);
              treecell=document.createElement('treecell');
              treecell.setAttribute('label',aDomainPair[1]);
              row.appendChild(treecell);
              treeitem.appendChild(row);
              tbc.appendChild(treeitem);
            }
          }
        }
      }
    }


    tbc = document.getElementById('tMandatesChildren');

    if (tbc != null) {
      while (tbc.firstChild) {
        tbc.removeChild(tbc.firstChild);
      }
    }
    if (blr.W15yQC.options.mandates!==null) {
      for(i=0;i<blr.W15yQC.options.mandates.length;i++) {
        m=blr.W15yQC.options.mandates[i];
        treeitem=document.createElement('treeitem');
        row=document.createElement('treerow');
        row.setAttribute('id','Mandate'+i);
        treecell=document.createElement('treecell');
        treecell.setAttribute('label',m.title);
        row.appendChild(treecell);
        treecell=document.createElement('treecell');
        treecell.setAttribute('label',m.enabled);
        row.appendChild(treecell);
        treecell=document.createElement('treecell');
        treecell.setAttribute('label',m.weight);
        row.appendChild(treecell);
        treeitem.appendChild(row);
        tbc.appendChild(treeitem);      
      }
    }
  },

  fnUpdatesPrefs: function() {
    var sDomains='', tbc, i, treerows, treecells;

    tbc = document.getElementById('tEquivDomainsChildren');
    treerows = tbc.getElementsByTagName('treerow');
    if(treerows!=null) {
      for(i=0;i<treerows.length;i++) {
        treecells=treerows[i].getElementsByTagName('treecell');
        if(treecells!=null && treecells.length==2) {
          if(sDomains.length>0) { sDomains=sDomains+"|"; }
          sDomains=sDomains+treecells[0].getAttribute('label')+'='+treecells[1].getAttribute('label');
        }
      }
    }
    Application.prefs.setValue("extensions.W15yQC.DomainEquivalences",sDomains);
  },

  fnAddDomainEquiv: function() {
    var sDomains, aEquivDomains, aDomainPair,
        tbc, url, i, rows, row, d={d1:null,d2:null},
        treeitem, treerow, treecell,
        dialogID = 'addEquivDomainsDialog',
        dialogPath = 'chrome://W15yQC/content/addEquivDomainsDialog.xul',
        win;

    window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,d);
    if(d!=null && d.d1!=null && d.d2!=null) {
      tbc = document.getElementById('tEquivDomainsChildren');
      rows=tbc.getElementsByTagName('treerow').length;
      treeitem=document.createElement('treeitem');
      row=document.createElement('treerow');
      row.setAttribute('id','Domains'+rows);
      treecell=document.createElement('treecell');
      treecell.setAttribute('label',d.d1);
      row.appendChild(treecell);
      treecell=document.createElement('treecell');
      treecell.setAttribute('label',d.d2);
      row.appendChild(treecell);
      treeitem.appendChild(row);
      tbc.appendChild(treeitem);
    }
    blr.W15yQC.options.fnUpdatesPrefs();
  },

  fnDeleteSelectedDomains: function() {
    var treebox=document.getElementById('tEquivalentDomains'),
      selectedRow = treebox.currentIndex,
      row;

    if(selectedRow>=0) {
      row=treebox.getElementsByTagName('treeitem')[selectedRow];
      if(row!=null) {
        row.parentNode.removeChild(row);
      }
      blr.W15yQC.options.fnUpdatesPrefs();
      blr.W15yQC.options.fnReadPrefs();
    }
  },

  fnAddMandate: function() {
    var sDomains, aEquivDomains, aDomainPair,
        tbc, url, i, rows, row, m={title:null,enabled:true,weight:null,showInReport:true},
        treeitem, treerow, treecell,
        dialogID = 'addMandatesDialog',
        dialogPath = 'chrome://W15yQC/content/addMandatesDialog.xul';

    window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,m);
    if(m!=null && m.title!=null && m.weight!=null) {
      tbc = document.getElementById('tMandatesChildren');
      rows=tbc.getElementsByTagName('treerow').length;
      treeitem=document.createElement('treeitem');
      row=document.createElement('treerow');
      row.setAttribute('id','Mandate'+rows);
      treecell=document.createElement('treecell');
      treecell.setAttribute('label',m.title);
      row.appendChild(treecell);
      treecell=document.createElement('treecell');
      treecell.setAttribute('label',m.enabled);
      row.appendChild(treecell);
      treecell=document.createElement('treecell');
      treecell.setAttribute('label',m.weight);
      row.appendChild(treecell);
      treeitem.appendChild(row);
      tbc.appendChild(treeitem);
      blr.W15yQC.options.mandates.push(m);
    }
    Application.prefs.setValue("extensions.W15yQC.mandates",JSON.stringify(blr.W15yQC.options.mandates));
  },
  
  fnEditMandate: function() {
    var i,num,num2,tbc, rows, row, m={},
        treebox, treeitem, treerow, treecell, selectedRow, treecells,
        dialogID = 'addMandatesDialog',
        dialogPath = 'chrome://W15yQC/content/addMandatesDialog.xul';

    treebox=document.getElementById('tMandates');
    selectedRow = treebox!=null?treebox.currentIndex:null;
    if (selectedRow!=null) {
      m=blr.W15yQC.options.mandates[selectedRow];
      window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr,m);
      if(m!=null && m.title!=null && m.weight!=null) {
        row=document.getElementById('Mandate'+selectedRow);
        treecells=row.getElementsByTagName('treecell');
        treecells[0].setAttribute('label',m.title);
        treecells[1].setAttribute('label',m.enabled);
        treecells[2].setAttribute('label',m.weight);
        blr.W15yQC.options.mandates[selectedRow]=m;
      }
    }
    Application.prefs.setValue("extensions.W15yQC.mandates",JSON.stringify(blr.W15yQC.options.mandates));
  },
  
  fnDeleteMandate: function() {
    var treebox, selectedRow, row;

    treebox=document.getElementById('tMandates');
    selectedRow = treebox!=null?treebox.currentIndex:null;
    if (selectedRow!=null) {
      row=document.getElementById('Mandate'+selectedRow);
      row.parentNode.parentNode.removeChild(row.parentNode);
      blr.W15yQC.options.mandates.splice(selectedRow,1);
    }
    Application.prefs.setValue("extensions.W15yQC.mandates",JSON.stringify(blr.W15yQC.options.mandates));
  },
  
  fnResetDefaults: function() {
    // Application.prefs.setValue("extensions.W15yQC.DomainEquivalences", "");
    Application.prefs.setValue("extensions.W15yQC.inspectElements.autoScrollToSelectedElements", true);
    Application.prefs.setValue("extensions.W15yQC.userExpertLevel", 1);
    Application.prefs.setValue("extensions.W15yQC.HTMLReport.collapsedByDefault", true);
    Application.prefs.setValue("extensions.W15yQC.HTMLReport.showOnlyIssuesByDefault", false);
    Application.prefs.setValue("extensions.W15yQC.getElements.includeLabelElementsInFormControls", true);
    Application.prefs.setValue("extensions.W15yQC.getElements.includeHiddenElements", false);
    Application.prefs.setValue("extensions.W15yQC.getElements.firstHeadingMustBeLevel1", false);
    Application.prefs.setValue("extensions.W15yQC.getElements.mustHaveLevel1Heading", true);
    Application.prefs.setValue("extensions.W15yQC.getElements.onlyOneLevel1Heading", false);
    Application.prefs.setValue("extensions.W15yQC.getElements.honorARIA", true);
    Application.prefs.setValue("extensions.W15yQC.getElements.honorHTML5", true);
    Application.prefs.setValue("extensions.W15yQC.extensions.W15yQC.DomainEquivalences.ignoreWWW", true);
    Application.prefs.setValue("extensions.W15yQC.extensions.W15yQC.mandatesEnabled", false);
    Application.prefs.setValue("extensions.W15yQC.testContrast.MinSpec", "WCAG2 AA");
    Application.prefs.setValue("extensions.W15yQC.rulesToExcludeList", "");
  }

};

