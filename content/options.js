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

  prefs: [{n:'extensions.W15yQC.inspectElements.autoScrollToSelectedElements',t:'b'},
          {n:'extensions.W15yQC.userExpertLevel',t:'i'},
          {n:'extensions.W15yQC.HTMLReport.collapsedByDefault',t:'b'},
          {n:'extensions.W15yQC.HTMLReport.showOnlyIssuesByDefault',t:'b'},
          {n:'extensions.W15yQC.getElements.includeLabelElementsInFormControls',t:'b'},
          {n:'extensions.W15yQC.getElements.includeHiddenElements',t:'b'},
          {n:'extensions.W15yQC.getElements.firstHeadingMustBeLevel1',t:'b'},
          {n:'extensions.W15yQC.getElements.mustHaveLevel1Heading',t:'b'},
          {n:'extensions.W15yQC.getElements.onlyOneLevel1Heading',t:'b'},
          {n:'extensions.W15yQC.getElements.honorARIA',t:'b'},
          {n:'extensions.W15yQC.getElements.honorHTML5',t:'b'},
          {n:'extensions.W15yQC.DomainEquivalences',t:'s'},
          {n:'extensions.W15yQC.testContrast.suppressPassingCRNotes',t:'b'},
          {n:'extensions.W15yQC.DomainEquivalences.ignoreWWW',t:'b'},
          {n:'extensions.W15yQC.testContrast.MinSpec',t:'s'},
          {n:'extensions.W15yQC.mandates',t:'s'},
          {n:'extensions.W15yQC.mandatesEnabled',t:'b'},
          {n:'extensions.W15yQC.rulesToExcludeList',t:'s'}],
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
    Application.prefs.setValue("extensions.W15yQC.userExpertLevel", 1);

    Application.prefs.setValue("extensions.W15yQC.HTMLReport.collapsedByDefault", true);
    Application.prefs.setValue("extensions.W15yQC.HTMLReport.showOnlyIssuesByDefault", false);

    Application.prefs.setValue("extensions.W15yQC.getElements.includeLabelElementsInFormControls", true);
    Application.prefs.setValue("extensions.W15yQC.getElements.includeHiddenElements", false);
    Application.prefs.setValue("extensions.W15yQC.getElements.firstHeadingMustBeLevel1", false);
    Application.prefs.setValue("extensions.W15yQC.getElements.mustHaveLevel1Heading", true);
    Application.prefs.setValue("extensions.W15yQC.getElements.onlyOneLevel1Heading", false);
    Application.prefs.setValue("extensions.W15yQC.getElements.honorARIA", true);

    Application.prefs.setValue("extensions.W15yQC.inspectElements.autoScrollToSelectedElements", true);
    Application.prefs.setValue("extensions.W15yQC.testContrast.suppressPassingCRNotes", false);
    Application.prefs.setValue("extensions.W15yQC.getElements.honorHTML5", true);
    Application.prefs.setValue("extensions.W15yQC.DomainEquivalences.ignoreWWW", true);
    Application.prefs.setValue("extensions.W15yQC.mandatesEnabled", false);
    Application.prefs.setValue("extensions.W15yQC.testContrast.MinSpec", "WCAG2 AA");
    Application.prefs.setValue("extensions.W15yQC.rulesToExcludeList", "");
  },
  
  spaces: function(count) {
    count=(count==null) ? 0 : (count>20 ? 20 : count);
    return count>0 ? "                    ".slice(0,count-1) : "";
  },

  readDOMEncodedString: function(rootNode, tagName, defaultValue) {
    var e,s=null;
    if(rootNode!=null) {
      e=rootNode.getElementsByTagName(tagName);
      if(e!=null && e.length>0) {
        s=decodeURIComponent(e[0].textContent);
      } else if(defaultValue!==undefined) {
        s=defaultValue;
      }
    } else if(defaultValue!==undefined) {
      s=defaultValue;
    }
    return s;
  },

  readDOMInt: function(rootNode, tagName, defaultValue) {
    var e,i=null;
    if(rootNode!=null) {
      e=rootNode.getElementsByTagName(tagName);
      if(e!=null && e.length>0) {
        i=parseInt(decodeURIComponent(e[0].textContent),10);
      } else if(defaultValue!==undefined) {
          i=defaultValue;
      }
    } else if(defaultValue!==undefined) {
      i=defaultValue;
    }
    return i;
  },

  readDOMDate: function(rootNode, tagName, defaultValue) {
    var e,d=null;
    if(rootNode!=null) {
      e=rootNode.getElementsByTagName(tagName);
      if(e!=null && e.length>0) {
        d=new Date(decodeURIComponent(e[0].textContent));
      } else if(defaultValue!==undefined) {
        d=defaultValue;
      }
    } else if(defaultValue!==undefined) {
      d=defaultValue;
    }
    return d;
  },

  readDOMBool: function(rootNode, tagName, defaultValue) {
    var e, b=null;
    if(rootNode!=null) {
      e=rootNode.getElementsByTagName(tagName);
      if(e!=null && e.length>0) {
        b=((decodeURIComponent(e[0].textContent)).toLowerCase() == "true") ? true : false ;
      } else if(defaultValue!==undefined) {
        b=defaultValue;
      }
    } else if(defaultValue!==undefined) {
      b=defaultValue;
    }
    return b;
  },
  
  writeXMLEncodedString: function(value, tagName, converter, indent) {
    if(value!=null && converter!=null) {
      converter.writeString(blr.W15yQC.options.spaces(indent)+'<'+tagName+' type="string">'+encodeURIComponent(value)+'</'+tagName+'>\n');
    }
  },

  writeXMLInt: function(value, tagName, converter, indent) {
    if(value!=null && converter!=null) {
      converter.writeString(blr.W15yQC.options.spaces(indent)+'<'+tagName+' type="int">'+encodeURIComponent(value.toString())+'</'+tagName+'>\n');
    }
  },

  writeXMLBool: function(value, tagName, converter, indent) {
    if(value!=null && converter!=null) {
      converter.writeString(blr.W15yQC.options.spaces(indent)+'<'+tagName+' type="bool">'+(value ? "true":"false")+'</'+tagName+'>\n');
    }
  },

  writeXMLDate: function(value, tagName, converter, indent) {
    var d;
    if(value!=null && converter!=null) {
      if (value.toISOString) {
        converter.writeString(blr.W15yQC.options.spaces(indent)+'<'+tagName+'>'+value.toISOString()+'</'+tagName+'>\n');
      } else {
        d=new Date(value);
        if (d!=null && d.toISOString) {
          converter.writeString(blr.W15yQC.options.spaces(indent)+'<'+tagName+'>'+d.toISOString()+'</'+tagName+'>\n');
        } else {
          converter.writeString(blr.W15yQC.options.spaces(indent)+'<'+tagName+'>'+value+'</'+tagName+'>\n');
        }
      }
    }
  },

  openPrefs: function () {
    var fp, rv, file, sFileContents, fstream, cstream, str, read, i, j, bOpenedOK=false,
      preferences, nsIFilePicker = Components.interfaces.nsIFilePicker, xmlDoc, xmlParser, matchList, matches,
      prefs, name, value, v, bFoundInPrefs, sPrefType;

      fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
      //blr.W15yQC.options.fnUpdateStatus('Choose Project File to Open');
      fp.init(window, "Open Project", nsIFilePicker.modeOpen);
      fp.appendFilter("W15yQC Project","*.w15yqcini");
      rv = fp.show();
      if (rv == nsIFilePicker.returnOK) {
        file=fp.file;
      }

      if(file!=null && file.path && /.+\.w15yqcini$/.test(file.path) == true) {
        sFileContents = '';
        //blr.W15yQC.options.fnUpdateStatus('Opening project file.');
        fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
        cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);

        try {
          fstream.init(file, -1, 0, 0);
          cstream.init(fstream, "UTF-8", 0, 0);
          bOpenedOK=true;
          } catch(e) {
          //blr.W15yQC.options.fnUpdateStatus('Failed to open preferences file.');
          alert("Failed to open the file:\n"+e);
        }

        if (bOpenedOK==true) {
          //blr.W15yQC.options.fnUpdateStatus('Reading project file.');
          read = 0;
          str={};
          do {
            read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
            sFileContents += str.value;
          } while (read != 0);
          cstream.close(); // this closes fstream
          //blr.W15yQC.options.addFileToRecentList(file.path);
          file=null;
          rv=null;
          fp=null;

          xmlParser = new DOMParser(); // https://developer.mozilla.org/en-US/docs/DOM/DOMParser
          xmlDoc = xmlParser.parseFromString(sFileContents, "text/xml");
          sFileContents=null;
          if(xmlDoc && xmlDoc.getElementsByTagName) {
            // Read Project Properties
            //blr.W15yQC.options.fnUpdateStatus('Reading project properties.');
            preferences=xmlDoc.getElementsByTagName('preferences');
            if(preferences!=null && preferences.length>0) {
              // Read prefs
              prefs=xmlDoc.getElementsByTagName('pref');
              //blr.W15yQC.options.fnUpdateStatus('Reading '+prefs.length+' URLs.');
              for(i=0;i<prefs.length;i++) {
                name=blr.W15yQC.options.readDOMEncodedString(prefs[i],'name',null);
                for(j=0;j<blr.W15yQC.options.prefs.length;j++) {
                  if (blr.W15yQC.options.prefs[j].n===name) {
                    value=prefs[i].getElementsByTagName('value');
                    if (name.length>1 && value.length>=1) {
                      value=value[0];
                      if (value.hasAttribute('type')) {
                        switch(value.getAttribute('type').toLowerCase()) {
                          case 'bool':
                            if (blr.W15yQC.options.prefs[j].t==='b') {
                              v=blr.W15yQC.options.readDOMBool(prefs[i],'value',null);
                              if(v!=null) {
                                Application.prefs.setValue(name,v);
                                //alert(name+'='+v);
                              }
                            }
                            break;
                          case 'int':
                            if (blr.W15yQC.options.prefs[j].t==='i') {
                              v=blr.W15yQC.options.readDOMInt(prefs[i],'value',null);
                              if(v!==null) {
                                Application.prefs.setValue(name,v);
                                //alert(name+'='+v);
                              }
                            }
                            break;
                          case 'string':
                            if (blr.W15yQC.options.prefs[j].t==='s') {
                              v=blr.W15yQC.options.readDOMEncodedString(prefs[i],'value',null);
                              if(v!==null) {
                                Application.prefs.setValue(name,v);
                                //alert(name+'='+v);
                              }
                            }
                            break;
                        }
                      }
                    }
                    break; // leave prefs match for loop
                  }
                }
              }
            }
          }
        }
        blr.W15yQC.options.fnReadPrefs();
        xmlDoc = null;
      }
      if(prefs.length>0) {
        //blr.W15yQC.options.fnUpdateStatus('Preferences loaded.');
      } else {
        if (bOpenedOK) {
          //blr.W15yQC.options.fnUpdateStatus('Empty preferences file loaded.');
        } else {
          //blr.W15yQC.options.fnUpdateStatus('No preferences loaded.');
        }
      }
      //blr.W15yQC.options.updateControlStates();
  },

  savePrefs: function () { // TODO: Handle errors gracefully.
    var bCancel=false,
        nsIFilePicker, fp, rv, file, foStream, converter, i, value;

        nsIFilePicker = Components.interfaces.nsIFilePicker;
        fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
        fp.appendFilter("W15yQC Preferences","*.w15yqcini");
        rv = fp.show();
        if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
          file = fp.file;
          if (/\.w15yqcini/.test(file.path) == false) {
            file.initWithPath(file.path + '.w15yqcini');
          }
        } else {
          bCancel=true;
        }

        if(bCancel==false) {
          // blr.W15yQC.options.fnUpdateStatus('Saving preferences file.');
          foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
          createInstance(Components.interfaces.nsIFileOutputStream);

          foStream.init(file, 0x2A, 438, 0);
          //blr.W15yQC.options.addFileToRecentList(file.path);
          converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
          converter.init(foStream, "UTF-8", 0, 0);
          converter.writeString('<?xml version="1.0" encoding="UTF-8"?>\n');
          converter.writeString('<w15yqc>\n');
          converter.writeString('  <preferences>\n');

          //blr.W15yQC.options.writeXMLEncodedString(file.path,'file_name',converter,4);
          //blr.W15yQC.options.writeXMLDate(Date.now(),'creation_date',converter,4);

          for(i=0;i<blr.W15yQC.options.prefs.length;i++) {
            value=Application.prefs.getValue(blr.W15yQC.options.prefs[i].n,null);
            if (value!==null) {
              converter.writeString('    <pref>\n');
              blr.W15yQC.options.writeXMLEncodedString(blr.W15yQC.options.prefs[i].n,'name',converter,6);
              switch(typeof value) {
                case 'string':
                  blr.W15yQC.options.writeXMLEncodedString(value,'value',converter,6);
                  break;
                case 'number':
                  blr.W15yQC.options.writeXMLInt(value,'value',converter,6);
                  break;
                case 'boolean': 
                  blr.W15yQC.options.writeXMLBool(value,'value',converter,6);
                  break;
                default:
                  alert('Error: '+(typeof value)+' was not handled.');
                break;
              }
              converter.writeString('    </pref>\n');            
            }
          }
          converter.writeString('  </preferences>\n');
          converter.writeString('</w15yqc>\n');

          converter.close(); // this closes foStream
          //blr.W15yQC.options.fnUpdateStatus('Preferences file saved.');
        } else {
          //blr.W15yQC.options.fnUpdateStatus('Preferences file not saved.');
        }
  }
  
};

