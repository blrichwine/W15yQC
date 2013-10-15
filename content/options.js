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

  init: function() {
    blr.W15yQC.options.fnReadPrefs();
  },

  fnReadPrefs: function() {
    var sDomains, aEquivDomains, aDomainPair,
        tbc, url, i,
        treeitem, treerow, treecell, row;

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
  }

};

