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

 * File:        scannerWindow.js
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
 *  Support online sitemap.xml and XML Sitemap index files
 *  What URLs to gather from documents?
 *    'a' elements with href
 *    longdesc attributes
 *  What extensions to avoid?
 *   -- Too many, use whitelist instead
 *  What extensions to whitelist?
 *   - .html, .htm
 *   - .shtml, .shtm
 *   - .asp, .pl
 *   - 
 *    
 *  Consider whether to use OS routines: https://developer.mozilla.org/en-US/docs/JavaScript_OS.File/OS.File_for_the_main_thread
 * https://addons.mozilla.org/en-US/developers/docs/sdk/1.12/modules/sdk/core/promise.html
 *
 *  Uses:
 *    ARIA Widgits
 *    ARIA Landmarks
 *    Frames
 *    Headings
 *    Links
 *    Amount of Text
 *    Longdesc
 *    Table summaries
 *    Downloads (spider to determine the most popular download types. Make this a configuration option)
 *      - PDFs
 *      - Word Docs (doc, docx)
 *      - Archives (zip, tar, gz, rar, etc.)
 *      - PowerPoints
 *      - Spreadsheets
 *      - Audio
 *      - Video
 *      - ePub
 *      - eTexts (see what O'Reilly sales books as)
 *      - text files (txt, text)
 *    Forms
 *    Layout Tables
 *    Data Tables
 *    DocType
 *    HTML5 page structure elements
 *    Flash (spider for GUIDs for the objects)
 *    Access keys
 *    Skip Nav (Spider for the most common link texts for the first 4 links on a page)
 *    
 *
 * Project definition:
 *   File Name:
 *   Current Path:
 *   Title:
 *   Date Created:
 *   Description:
 *   URL List
 *   Auto Add Y/N
 *   Depth:
 *   Match List:
 *   Don't Match List:
 *
 * TODO:
 *      
 *    - Internationalize?
 *    
 * 
 */
Components.utils.import("resource://gre/modules/osfile.jsm");

if (!blr) {
  var blr = {};
}

/*
 * Object:  ScannerWindow
 * Returns:
 */
blr.W15yQC.ScannerWindow = {
  FirebugO: null,
  urlList: [],
  projectHasUnsavedChanges: false,
  iFrameOnLoadEventTimeOutTimerID: null,
  iFrameOnLoadEventFilterTimerID: null,
  stateScanning: false,
  stateScanningAllLinks: false,
  stateWaitingOnUrlToLoad: false,
  stateCheckingURL: false,
  stateStopScanningRequested: false,
  stateCurrentIndex: 0,
  
  fnUpdateStatus: function(sLabel) {
    document.getElementById('progressMeterLabel').value=sLabel;
  },
  
  fnUpdatePercentage: function(p) {
    document.getElementById('progressMeter').value=p;
  },
  
  fnPopulateTree: function (aDocumentsList, aLinksList) {
    var tbc, bHasRole, bHasStateDescription, bHasTarget, i, ak, ch, treecell, treeitem, treerow, textbox;
    if (aDocumentsList != null && aLinksList != null && aLinksList.length && aLinksList.length > 0) {
      tbc = document.getElementById('treeboxChildren');
      bHasRole = false;
      bHasStateDescription = false;
      bHasTarget = false;
      if (tbc != null) {
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
        for (i = 0; i < aLinksList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', i + 1);
          treerow.appendChild(treecell);

          ak = aLinksList[i];

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
    blr.W15yQC.ScannerWindow.updateProjectDisplay();
    blr.W15yQC.ScannerWindow.resetProjectToNew();
    blr.W15yQC.ScannerWindow.fnUpdateStatus('No Project');
  },

  cleanup: function (dialog) {
    if(!blr.W15yQC.ScannerWindow.resetProjectToNew()) {
      clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventTimeOutTimerID);
      clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventFilterTimerID);
    }
  },
  
  updateProjectDisplay: function() {
    var tbc, url, i,
        treeitem, treerow, treecell;
    
    tbc = document.getElementById('treeboxChildren');
  
    if (tbc != null) {
      while (tbc.firstChild) {
        tbc.removeChild(tbc.firstChild);
      }
      if(blr.W15yQC.ScannerWindow.urlList != null) {
        for (i = 0; i < blr.W15yQC.ScannerWindow.urlList.length; i++) {
          treeitem = document.createElement('treeitem');
          treerow = document.createElement('treerow');
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', i + 1);
          treerow.appendChild(treecell);
  
          url=blr.W15yQC.ScannerWindow.urlList[i];
          
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', url.loc);
          treerow.appendChild(treecell);
  
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', url.priority);
          treerow.appendChild(treecell);
  
          treecell = document.createElement('treecell');
          treecell.setAttribute('label', OS.Path.basename( url.source));
          treerow.appendChild(treecell);
          treeitem.appendChild(treerow);
          tbc.appendChild(treeitem);
        }
        blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
      }
    }
  },
  
  fnURLTypeIsWhiteListed: function (sURL) {
    return true;
  },

  fnUrlAppearsScannable: function (sURL) {
    return true;
  },
  
  fnUrlIsNotBlackListed: function (sURL) {
    if(/javascript:/.test(sURL) || /\.(exe|dmg)$/.test(sURL)) {
      return false;
    }
    return true;  
  },
  
  // http://regexlib.com/REDetails.aspx?regexp_id=96
  fnAppearsToBeURL: function (sURL) { // TODO: QA THIS!!!
    if (sURL != null && sURL.match(/(https?:\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/i)) {
      return true;
    }
    return false;
  },

  fnAppearsToBeFullyQualifiedURL: function (sURL) { // TODO: QA THIS!!!
    if (sURL != null && sURL.match(/https?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/i)) {
      return true;
    }
    return false;
  },

  fnRemoveWWWAndEndingSlash: function(sUrl) {
    sUrl = sUrl.replace(/:\/\/www\./i, '://');
    sUrl = sUrl.replace(/[\/\\]$/, '');
    return sUrl;
  },

  fnNormalizeURL: function(docURL, sUrl) {
    var firstPart;
    if(docURL != null && sUrl != null && sUrl.length>0) {
      docURL = blr.W15yQC.fnTrim(docURL);
      sUrl = blr.W15yQC.fnTrim(sUrl);
      if(sUrl.slice(0,2) == '//') { // TODO: This needs QA'd
        firstPart = docURL.match(/^([a-z-]+:)\/\//);
          if(firstPart != null) {
            sUrl=firstPart[1]+sUrl;
          }
      }
      if ( sUrl.match(/^[a-z-]+:\/\//) == null ) {
        firstPart = docURL.match(/^(file:\/\/)([^?]*[\/\\])?/);
        if(firstPart != null) {
          sUrl = firstPart[1]+firstPart[2]+sUrl;
        } else {
          firstPart = docURL.match(/^([a-z-]+:\/\/)([^\/\\]+[^\/\\])([^?]*[\/\\])?/);
          if(firstPart != null) {
            if(sUrl.match(/^[\/\\]/) != null) {
              sUrl = firstPart[1]+firstPart[2]+sUrl;
            } else {
              sUrl = firstPart[1]+firstPart[2]+firstPart[3]+sUrl;
            }
          }
        }
      }
    }
    if(sUrl != null) { sUrl = sUrl.replace(/\s/g,'%20'); }
    return sUrl;
  },

  fnURLsAreEqual: function (docURL1, url1, docURL2, url2) {
    if(url1 != null) { url1 = blr.W15yQC.fnRemoveWWWAndEndingSlash(blr.W15yQC.fnNormalizeURL(docURL1, url1)); }
    if(url2 != null) { url2 = blr.W15yQC.fnRemoveWWWAndEndingSlash(blr.W15yQC.fnNormalizeURL(docURL2, url2)); }
    return (url1 == url2);
  },
  
  resetProjectToNew: function(bAskBeforeResettingIfUnsavedChanges) {
    var bCancel=false;
    
    if(bAskBeforeResettingIfUnsavedChanges==true && blr.W15yQC.ScannerWindow.projectHasUnsavedChanges) {
      // present alert dialog with query to save changes and Yes, No, Cancel buttons
      // If saving, perform a quiet save (not a save as dialog)
    }
    if(!bCancel) {
      blr.W15yQC.ScannerWindow.projectHasUnsavedChanges = false;
      blr.W15yQC.ScannerWindow.urlList = [];
    }
    return bCancel;
  },
  
  urlAlreadInList: function(sURL, sDocURL) {
    return false;
  },
  
  addUrlToProject: function (sURL, sDocURL, source, priority) {
    var url;
    if(blr.W15yQC.ScannerWindow.urlList==null) {
      blr.W15yQC.ScannerWindow.urlList = [];
    }
    if(!blr.W15yQC.ScannerWindow.urlAlreadInList(sURL)) {
      url=new blr.W15yQC.ProjectURL(sURL, source, priority);
      blr.W15yQC.ScannerWindow.urlList.push(url);
    }
  },
  
  newProject: function() {
    blr.W15yQC.ScannerWindow.resetProjectToNew();
    blr.W15yQC.ScannerWindow.updateProjectDisplay();
  },
  
  openProject: function () {
  },
  
  importLinks: function () {
    var fp, rv, file, data, fstream, cstream, cancel=false,
        nsIFilePicker = Components.interfaces.nsIFilePicker,
        xmlParser, xmlDoc, urls, i, sURL, priority, sourceFileName;
    
    if(!blr.W15yQC.ScannerWindow.resetProjectToNew()) {      
      blr.W15yQC.ScannerWindow.fnUpdatePercentage(0);
      fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
      blr.W15yQC.ScannerWindow.fnUpdateStatus('Choose File to Import From');
      fp.init(window, "Open Project", nsIFilePicker.modeOpen);
      fp.appendFilters(nsIFilePicker.filterXML | nsIFilePicker.filterText | nsIFilePicker.filterAll);
      rv = fp.show();
      if (rv == nsIFilePicker.returnOK) {
        file = fp.file;
        if (/\.xml$/.test(file.path) == false) { // Assume text
          blr.W15yQC.ScannerWindow.fnUpdateStatus('Opening text file.');
          
        } else { //https://developer.mozilla.org/en-US/docs/Code_snippets/File_I_O
          // |file| is nsIFile
          sourceFileName = file.path;
          data = "";
          blr.W15yQC.ScannerWindow.fnUpdateStatus('Opening xml file.');
          fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
          cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
          fstream.init(file, -1, 0, 0);
          cstream.init(fstream, "UTF-8", 0, 0);
           
          blr.W15yQC.ScannerWindow.fnUpdateStatus('Processing sitemap.');
          let (str = {}) {
            let read = 0;
            do {
              read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
              data += str.value;
            } while (read != 0);
          }
          cstream.close(); // this closes fstream
          file=null;
          rv=null;
          fp=null;
          xmlParser = new DOMParser(); // https://developer.mozilla.org/en-US/docs/DOM/DOMParser
          xmlDoc = xmlParser.parseFromString(data, "text/xml");
          if(xmlDoc && xmlDoc.getElementsByTagName) {
            urls=xmlDoc.getElementsByTagName('url');
            blr.W15yQC.ScannerWindow.fnUpdateStatus('Processing '+urls.length+' URLs.');
            for(i=0;i<urls.length;i++) {
              blr.W15yQC.ScannerWindow.fnUpdatePercentage(100.0*i/urls.length);
              if(urls[i].getElementsByTagName('loc').length>0) {
                sURL=urls[i].getElementsByTagName('loc')[0].textContent;
                if(urls[i].getElementsByTagName('priority').length>0) {
                  priority=urls[i].getElementsByTagName('priority')[0].textContent;
                } else {
                  priority = 1.0;
                }
                blr.W15yQC.ScannerWindow.addUrlToProject(sURL, null, "Sitemap:"+sourceFileName, priority);
              }
            }
            blr.W15yQC.ScannerWindow.fnUpdateStatus('Finished processing sitemap.');
            blr.W15yQC.ScannerWindow.fnUpdatePercentage(100);
          }
          xmlDoc = null;
        }
      }
    }
    blr.W15yQC.ScannerWindow.updateProjectDisplay();
  },

  objectToString: function (o, bDig) {
    var p, out = '';
    if (o != null) {
      for (p in o) {
        if (o[p].toString() == '[object Object]' && bDig != false) {
          out += 'STARTOBJ' + p + ': [' + blr.W15yQC.ScannerWindow.objectToString(o[p], false) + ']\n';
        } else {
          out += p + ': ' + o[p] + '\n';
        }
      }
    }
    return out;
  },

  setStateAsScanning: function() {
    blr.W15yQC.ScannerWindow.stateScanning = true;
    document.getElementById('button-newProject').disabled = true;
    document.getElementById('button-openProject').disabled = true;
    document.getElementById('button-saveProject').disabled = true;
    document.getElementById('button-importLinks').disabled = true;
    document.getElementById('button-ScanNew').disabled = true;
    document.getElementById('button-ScanAll').disabled = true;
    document.getElementById('button-close').disabled = true;
  },
  
  setStateAsNotScanning: function() {
    blr.W15yQC.ScannerWindow.stateScanning = false;
    blr.W15yQC.ScannerWindow.stateScanningAllLinks=false;
    document.getElementById('button-newProject').disabled = false;
    document.getElementById('button-openProject').disabled = false;
    document.getElementById('button-saveProject').disabled = false;
    document.getElementById('button-importLinks').disabled = false;
    document.getElementById('button-ScanNew').disabled = false;
    document.getElementById('button-ScanAll').disabled = false;
    document.getElementById('button-close').disabled = false;
  },
  
  scanAllLinks: function() {
    if(blr.W15yQC.ScannerWindow.urlList!=null && blr.W15yQC.ScannerWindow.urlList.length>0) {
      blr.W15yQC.ScannerWindow.setStateAsScanning();
      blr.W15yQC.ScannerWindow.stateCurrentIndex=-1;
      blr.W15yQC.ScannerWindow.stateScanningAllLinks=true;
      blr.W15yQC.ScannerWindow.scanNextLink();
    }
  },
  
  scanNextLink: function() {
    blr.W15yQC.ScannerWindow.stateCurrentIndex++;
    if(blr.W15yQC.ScannerWindow.stateCurrentIndex<blr.W15yQC.ScannerWindow.urlList.length) {
      blr.W15yQC.ScannerWindow.scanURL(blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.stateCurrentIndex]);
    } else {
      blr.W15yQC.ScannerWindow.setStateAsNotScanning();
    }
  },
  
  scanURL: function(oURL) {
    stateWaitingOnUrlToLoad=true;
    blr.W15yQC.ScannerWindow.scanLoadUrlInIFrame(oURL.loc);
  },

  scanLoadUrlInIFrame: function(sURL) {
    var iFrameHolder, iFrame;
    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventTimeOutTimerID);

    if(sURL != null && blr.W15yQC.ScannerWindow.fnUrlIsNotBlackListed(sURL) && blr.W15yQC.ScannerWindow.fnUrlAppearsScannable(sURL)) {
      iFrameHolder = document.getElementById('iFrameHolder');
      iFrame = document.getElementById('pageBeingScannedIFrame');
      if(iFrame != null) {
        // remove iFrame
        iFrame.parentNode.removeChild(iFrame);
      }
      // create new iFrame so we can get onload event notification
      // research blocking pop-ups from iframe
      blr.W15yQC.ScannerWindow.iFrameOnLoadEventTimeOutTimerID=setTimeout(function () {
        blr.W15yQC.ScannerWindow.iFrameTimedOut(sURL);
      }, 20000);
      iFrame=document.createElement('iframe');
      iFrame.setAttribute('id','pageBeingScannedIFrame');
      iFrame.setAttribute('type','content');
      iFrame.setAttribute('flex','1');
      iFrame.setAttribute('style','overflow:auto');
      iFrame.setAttribute('src',sURL);
      iFrame.addEventListener("load", function(e) {
          blr.W15yQC.ScannerWindow.iFrameOnLoadEventFired();
        }, true);
      iFrameHolder.appendChild(iFrame);
    }
  },
    
  iFrameTimedOut: function(sURL) {
    blr.W15yQC.ScannerWindow.scanNextLink();
  },
  
  iFrameLoaded: function() {
    // Check iFrame Contents
    var oW15yQCResults, iFrame, iFrameDoc;
    iFrame=document.getElementById('pageBeingScannedIFrame');
    if(iFrame!=null) {
      iFrameDoc=iFrame.contentDocument;
      if(iFrameDoc!=null) {
        blr.W15yQC.ScannerWindow.fnUpdateStatus('Checking loaded URL.'+iFrameDoc.title);
        oW15yQCResults=blr.W15yQC.fnScannerInspect(iFrameDoc);
        blr.W15yQC.ScannerWindow.fnUpdateStatus('Results for:'+oW15yQCResults.sWindowTitle);
      } else alert('iFrameDoc is null');
    }
    blr.W15yQC.ScannerWindow.scanNextLink();
  },

  iFrameOnLoadEventFired: function() {
    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventTimeOutTimerID);
    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventFilterTimerID);
    blr.W15yQC.ScannerWindow.iFrameOnLoadEventFilterTimerID=setTimeout(function () {
          blr.W15yQC.ScannerWindow.iFrameLoaded();
        }, 500);
  },
  
  stopScanning: function() {
    
  },
  
  windowOnKeyDown: function() {
    
  },
  
  windowOnKeyUp: function() {
    
  },
  
  forceMinSize: function() {
    
  }
  
};


blr.W15yQC.ProjectURL = function (loc, source, priority) {
  this.loc = loc;
  this.source = source;
  if(priority != null && !isNaN(parseFloat(priority))) {
    this.priority = parseFloat(priority);
  } else {
    this.priority = 1.0;
  }
};

blr.W15yQC.ProjectURL.prototype = {
  loc: null,
  source: null,
  priority: 1.0
};
