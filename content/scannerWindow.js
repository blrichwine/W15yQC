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
 *  Score:
 *    Documents (5%)
 *      All documents have titles
 *      All documents have default human language
 *
 *    Uses Headings (25%)
 *      Headings use proper hierarchy
 *      Has a H1
 *      If no ARIA Landmarks has more than 1 heading
 *      Has enough headings for the amount of content
 *      If has Main Landmark, Main Landmark contains a Heading
 *    Uses ARIA Landmarks 
 *      Has a MAIN Landmark
 *      All content contained in a landmark
 *      All landmarks+lables are unique
 *    Has Frames
 *      All Frames have titles
 *      
 *    Has Tables
 *      No layout tables that aren't marked as presentation
 *      All content in datatables are covered by headers
 *      Datatables are not complex
 *      Datatables larger than x columns have captions or summary attributes
 *      
 *    Form controls
 *      All form controls are labeled
 *      radio buttons have legends
 *      All form controls have meaningful labels
 *    Links
 *      All links have text
 *      All links have meaningful text
 *      All links are unique
 *      No links have different titles
 *    Uses Images
 *      All images have alt text or are labeled presentational
 *      
 *    Uses ARIA
 *      All Roles are valid
 *    IDs
 *      All are valid
 *      All are unique
 *    Accesskeys
 *      No Access keys
 *      Has Access keys
 *        All accesskeys are unique
 *        No accesskeys have conflicts
 *      
 *      
 *
 *
 *    
 *  Scanner: addURL
 *    URL
 *    Priority
 *    Don't scan for URLs
 *    
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


/*
 * Object:  ScannerWindow
 * Returns:
 */
blr.W15yQC.ScannerWindow = {
  urlList: [],
  urlDisplayOrder: [],
  urlMustMatchList: [],
  urlMustMatchListType: [],
  urlMustNotMatchList: [],
  urlMustNotMatchListType: [],
  parseForLinks: true,
  sProjectTitle: '',
  projectHasUnsavedChanges: false,
  projectCreationDate: null,
  projectLastUpdate: null,
  projectFileName: null,
  projectSettingsHaveBeenSet: false,
  maximumURLCount: 5000,
  maximumURLDepth: 20,
  pageLoadTimeLimit: 20000,
  pageLoadFilter: 1000,
  iFrameOnLoadEventTimeOutTimerID: null,
  iFrameOnLoadEventFilterTimerID: null,
  stateScanning: false,
  stateScanningAllLinks: false,
  stateScanningOneLink: false,
  stateWaitingOnUrlToLoad: false,
  stateCheckingURL: false,
  stateStopScanningRequested: false,
  stateCurrentIndex: 0,
  bManualURLAdd: false,
  
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
      blr.W15yQC.ScannerWindow.fnUpdateStatus(sLabel);
    }
    if(fPercentage != null) {
      blr.W15yQC.ScannerWindow.fnUpdatePercentage(fPercentage);
    }
    blr.W15yQC.ScannerWindow.updateControlStates();
  },

  updateDisplayOrderArray: function() {
    if(blr.W15yQC.ScannerWindow.urlList != null && blr.W15yQC.ScannerWindow.urlList.length>0) {
      if(blr.W15yQC.ScannerWindow.urlDisplayOrder==null || !blr.W15yQC.ScannerWindow.urlDisplayOrder.length) {
        blr.W15yQC.ScannerWindow.urlDisplayOrder=[];
      }
      while(blr.W15yQC.ScannerWindow.urlDisplayOrder.length<blr.W15yQC.ScannerWindow.urlList.length) {
        blr.W15yQC.ScannerWindow.urlDisplayOrder.push(blr.W15yQC.ScannerWindow.urlDisplayOrder.length);
      }
    } else {
      blr.W15yQC.ScannerWindow.urlDisplayOrder=[];
    }
  },
  
  init: function (dialog) {
    var treebox = document.getElementById('treebox'),
      iframeHolder = document.getElementById('iFrameHolder'),
      textbox = document.getElementById('note-text'),
      scannerIFrame = document.getElementById('pageBeingScannedIFrame');
      
    if(blr.W15yQC.sb == null) { blr.W15yQC.fnInitStringBundles(); }
    blr.W15yQC.fnReadUserPrefs(); // TODO: Move this to the scanner window init
    blr.W15yQC.fnSetIsEnglishLocale(blr.W15yQC.fnGetUserLocale()); // TODO: This probably should be a user pref, or at least overrideable

    blr.W15yQC.ScannerWindow.resetProjectToNew();
    //blr.W15yQC.ScannerWindow.urlMustMatchList.push('iuadapts.+(/[a-z]*|\.(s?html?))$');
    //blr.W15yQC.ScannerWindow.urlMustMatchListType.push(true);
    //blr.W15yQC.ScannerWindow.urlMustMatchList.push('http://www.indiana.edu/~iuadapts.+(\.(s?html?))$');
    //blr.W15yQC.ScannerWindow.urlMustMatchListType.push(true);
    //blr.W15yQC.ScannerWindow.urlMustNotMatchList.push('people/index.shtml');
    //blr.W15yQC.ScannerWindow.urlMustNotMatchListType.push(false);
    //blr.W15yQC.ScannerWindow.addUrlToProject('http://iuadapts.indiana.edu/','http://iuadapts.indiana.edu/','origin',1.0);
    //blr.W15yQC.ScannerWindow.projectSettingsHaveBeenSet=true;
    blr.W15yQC.ScannerWindow.updateProjectDisplay();
    blr.W15yQC.ScannerWindow.fnUpdateStatus('No Project');
    blr.W15yQC.ScannerWindow.readRecentFileList();
    blr.W15yQC.ScannerWindow.updateControlStates();
  },

  cleanup: function (dialog) {
    if(!blr.W15yQC.ScannerWindow.resetProjectToNew()) {
      clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventTimeOutTimerID);
      clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventFilterTimerID);
    }
  },
  
  selectRow: function(row, override) {
    var treeview=document.getElementById('treebox');
    if(override==null) { override=false; }
    if(treeview != null && (treeview.currentIndex && treeview.currentIndex<0 || override==true)) {
      if(blr.W15yQC.ScannerWindow.urlList != null && row!=null && row<blr.W15yQC.ScannerWindow.urlList.length) {
        try {
          if(treeview.focus) treeview.focus();
          if(treeview.view) treeview.view.selection.select(row);
          if(treeview.boxObject && treeview.boxObject.ensureRowIsVisible) {treeview.boxObject.ensureRowIsVisible(row);}
        } catch(ex) {}
      }
    }
  },
  
  updateUrlInTree: function(urlIndex) {
    var tbc = document.getElementById('treeboxChildren'),
      treeitem, row, treecell, i, url, bNew=false, sPriority;
    
    row=document.getElementById('URL'+urlIndex);
    if(row==null) {
      treeitem=document.createElement('treeitem');
      row=document.createElement('treerow');
      row.setAttribute('id','URL'+urlIndex);
      bNew=true;
      for(i=0;i<41;i++) {
        row.appendChild(document.createElement('treecell'));
      }
    }
    url=blr.W15yQC.ScannerWindow.urlList[urlIndex];
    row.children[0].setAttribute('label',urlIndex+1);
    row.children[1].setAttribute('label',url.loc);
    if(url.priority && url.priority.toString) {
      sPriority=url.priority.toString();
      if(!/\./.test(sPriority)) { sPriority=sPriority+'.0'};
    } else {
      sPriority='';
    }
    row.children[2].setAttribute('label',sPriority);
    row.children[3].setAttribute('label',url.source);
    row.children[4].setAttribute('label',url.linkDepth);
    row.children[5].setAttribute('label',url.dateScanned ? (new Date(url.dateScanned)).toDateString() : null);
    row.children[6].setAttribute('label',url.contentType);
    row.children[7].setAttribute('label',url.windowTitle);
    row.children[8].setAttribute('label',url.itemsCount);
    row.children[9].setAttribute('label',url.warningsCount);
    row.children[10].setAttribute('label',url.failuresCount);
    row.children[11].setAttribute('label',url.score);
    row.children[12].setAttribute('label',url.textSize);
    row.children[13].setAttribute('label',url.downloadsCount);
    row.children[14].setAttribute('label',url.framesCount);
    row.children[15].setAttribute('label',url.framesWarnings);
    row.children[16].setAttribute('label',url.framesFailures);
    row.children[17].setAttribute('label',url.headingsCount);
    row.children[18].setAttribute('label',url.headingsWarnings);
    row.children[19].setAttribute('label',url.headingsFailures);
    row.children[20].setAttribute('label',url.ARIALandmarksCount);
    row.children[21].setAttribute('label',url.ARIALandmarksWarnings);
    row.children[22].setAttribute('label',url.ARIALandmarksFailures);
    row.children[23].setAttribute('label',url.ARIAElementsCount);
    row.children[24].setAttribute('label',url.ARIAElementsWarnings);
    row.children[25].setAttribute('label',url.ARIAElementsFailures);
    row.children[26].setAttribute('label',url.linksCount);
    row.children[27].setAttribute('label',url.linksWarnings);
    row.children[28].setAttribute('label',url.linksFailures);
    row.children[29].setAttribute('label',url.imagesCount);
    row.children[30].setAttribute('label',url.imagesWarnings);
    row.children[31].setAttribute('label',url.imagesFailures);
    row.children[32].setAttribute('label',url.formControlsCount);
    row.children[33].setAttribute('label',url.formControlsWarnings);
    row.children[34].setAttribute('label',url.formControlsFailures);
    row.children[35].setAttribute('label',url.accessKeysCount);
    row.children[36].setAttribute('label',url.accessKeysWarnings);
    row.children[37].setAttribute('label',url.accessKeysFailures);
    row.children[38].setAttribute('label',url.tablesCount);
    row.children[39].setAttribute('label',url.tablesWarnings);
    row.children[40].setAttribute('label',url.tablesFailures);

    if (url.windowTitleNotUnique==true) {
      treerow.setAttribute('properties', 'failed');
    }

    if(bNew) {
      treeitem.appendChild(row);
      tbc.appendChild(treeitem);
    }
  },
  
  updateProjectDisplay: function() {
    // blr.W15yQC.fnLog('scanner-updateProjectDisplay');
    var tbc, url, i,
        treeitem, treerow, treecell;

    document.title=blr.W15yQC.fnJoin(blr.W15yQC.ScannerWindow.sProjectTitle,'Scanner - W15yQC', ' - ');
    tbc = document.getElementById('treeboxChildren');
  
    if (tbc != null) {
      while (tbc.firstChild) {
        tbc.removeChild(tbc.firstChild);
      }
      if(blr.W15yQC.ScannerWindow.urlList != null) {
        blr.W15yQC.ScannerWindow.updateDisplayOrderArray();
        for (i = 0; i < blr.W15yQC.ScannerWindow.urlList.length; i++) {
          blr.W15yQC.ScannerWindow.updateUrlInTree(blr.W15yQC.ScannerWindow.urlDisplayOrder[i]);
        }
        blr.W15yQC.ScannerWindow.selectRow(0);
      }
    }
    blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
    blr.W15yQC.ScannerWindow.updateControlStates();
  },
  
  urlMatchesProjectMustMatchList: function (sURL) {
    var i,sMatchSpec,regex;
    if(blr.W15yQC.ScannerWindow.urlMustMatchList!=null && blr.W15yQC.ScannerWindow.urlMustMatchList.length>0) {
      if(sURL!=null) { 
        for(i=0;i<blr.W15yQC.ScannerWindow.urlMustMatchList.length;i++) {
          sMatchSpec=blr.W15yQC.ScannerWindow.urlMustMatchList[i];
          if(blr.W15yQC.ScannerWindow.urlMustMatchListType[i]==true) {
            regex=new RegExp(sMatchSpec,'i'); 
            if(regex.test(sURL)) {
              return true;
            }
          } else if((sURL.toLowerCase()).indexOf(sMatchSpec.toLowerCase())>=0) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  },

  urlIsBlackListed: function(sURL) {
    if(sURL!=null) {
      if(/javascript:/i.test(sURL) ||
         /\/\/.+\.[a-z]+\/.+\.(asx|avi|com|css|dmg|doc|docx|exe|gif|iso|jpg|jpeg|js|mov|mp3|mpg|pdf|ram|svg|tif|tiff|wmx)$/i.test(sURL)) {
        if(blr.W15yQC.ScannerWindow.bManualURLAdd==true) { alert('url is black listed'); }
        return true;
      }
      return false;
    }
    return true;
  },
  
  urlMatchesProjectMustNotMatchList: function (sURL) {
    var i,sMatchSpec,regex;
    if(blr.W15yQC.ScannerWindow.urlMustNotMatchList!=null && blr.W15yQC.ScannerWindow.urlMustNotMatchList.length>0) {
      if(sURL!=null) {
        for(i=0;i<blr.W15yQC.ScannerWindow.urlMustNotMatchList.length;i++) {
          sMatchSpec=blr.W15yQC.ScannerWindow.urlMustNotMatchList[i];
          if(blr.W15yQC.ScannerWindow.urlMustMatchListType[i]==true) {
            regex=new RegExp(sMatchSpec,'i'); 
            if(regex.test(sURL)) {
              return true;
            }
          } else if((sURL.toLowerCase()).indexOf(sMatchSpec.toLowerCase())>=0) {
            return true;
          }
        }
      }
      return false;
    }
    return false;
  },

  fnUrlAppearsScannable: function (sURL) {
    return blr.W15yQC.fnAppearsToBeFullyQualifiedURL(sURL);
  },
    
  // http://regexlib.com/REDetails.aspx?regexp_id=96
  fnAppearsToBeURL: function (sURL) { // TODO: QA THIS!!!
    if (sURL != null && sURL.match(/(https?:\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/i)) {
      return true;
    }
    return false;
  },

  fnAppearsToBeFullyQualifiedURL: function (sURL) { // TODO: QA THIS!!!
    if (sURL != null && sURL.match(/[a-z]+:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/i)) {
      return true;
    }
    return false;
  },

  fnRemoveWWWAndEndingSlash: function(sUrl) {
    sUrl = sUrl.replace(/:\/\/www\./i, '://');
    sUrl = sUrl.replace(/[\/\\]$/, '');
    return sUrl;
  },

  //normalizeURL: function(docURL, sUrl) {
  //  var firstPart;
  //  if(docURL != null && sUrl != null && sUrl.length>0) {
  //    docURL = blr.W15yQC.fnTrim(docURL);
  //    sUrl = blr.W15yQC.fnTrim(sUrl);
  //    if(sUrl.slice(0,2) == '//') { // TODO: This needs QA'd
  //      firstPart = docURL.match(/^([a-z-]+:)\/\//);
  //        if(firstPart != null) {
  //          sUrl=firstPart[1]+sUrl;
  //        }
  //    }
  //    if ( sUrl.match(/^[a-z-]+:\/\//) == null ) {
  //      firstPart = docURL.match(/^(file:\/\/)([^?]*[\/\\])?/);
  //      if(firstPart != null) {
  //        sUrl = firstPart[1]+firstPart[2]+sUrl;
  //      } else {
  //        firstPart = docURL.match(/^([a-z-]+:\/\/)([^\/\\]+[^\/\\])([^?]*[\/\\])?/);
  //        if(firstPart != null) {
  //          if(sUrl.match(/^[\/\\]/) != null) {
  //            sUrl = firstPart[1]+firstPart[2]+sUrl;
  //          } else {
  //            sUrl = firstPart[1]+firstPart[2]+firstPart[3]+sUrl;
  //          }
  //        }
  //      }
  //    }
  //  }
  //  if(sUrl != null) { sUrl = sUrl.replace(/\s/g,'%20'); }
  //
  //  sUrl = sUrl.replace(/\/[^\/]+\/\.\.\//, '/','g');
  //  sUrl = sUrl.replace(/\/\.\//, '/','g');
  //
  //  return sUrl;
  //},
  //
  fnRemoveNamedAnchor: function(sURL) {
    if(sURL !=null && sURL.replace) {
      sURL=sURL.replace(/#.+$/, '');
    }
    return sURL;
  },
  
  fnURLsAreEqual: function (docURL1, url1, docURL2, url2) {
    var i,r;
    if(url1 != null) {
      url1 = blr.W15yQC.fnRemoveWWWAndEndingSlash(blr.W15yQC.fnNormalizeURL(docURL1, url1));
      for(i=0;i<blr.W15yQC.domainEq1.length;i++) {
        r=new RegExp('\/\/'+blr.W15yQC.domainEq1[i],'i');
        url1 = url1.replace(r,'//'+blr.W15yQC.domainEq2[i]);
      }
      //url1 = url1.replace(/\/\/iuadapts.indiana.edu/i,'//www.indiana.edu/~iuadapts');
      //url1 = url1.replace(/\/\/iuadapts.iu.edu/i,'//www.indiana.edu/~iuadapts');
      //url1 = url1.replace(/\/\/iu.edu/i,'//www.indiana.edu');
    }
    if(url2 != null) {
      url2 = blr.W15yQC.fnRemoveWWWAndEndingSlash(blr.W15yQC.fnNormalizeURL(docURL2, url2));
      for(i=0;i<blr.W15yQC.domainEq1.length;i++) {
        r=new RegExp('\/\/'+blr.W15yQC.domainEq1[i],'i');
        url2 = url2.replace(r,'//'+blr.W15yQC.domainEq2[i]);
      }
      //url2 = url2.replace(/\/\/iuadapts.indiana.edu/i,'//www.indiana.edu/~iuadapts');
      //url2 = url2.replace(/\/\/iuadapts.iu.edu/i,'//www.indiana.edu/~iuadapts');
      //url2 = url2.replace(/\/\/iu.edu/i,'//www.indiana.edu');
    }
    
    if(url1!=url2 && url1!=null && url2!=null) {
      url1=blr.W15yQC.fnRemoveWWWAndEndingSlash(url1.replace(/(index|home)\.s?html?$/i,''));
      url2=blr.W15yQC.fnRemoveWWWAndEndingSlash(url2.replace(/(index|home)\.s?html?$/i,''));
    }
    return (url1 == url2);
  },
  
  resetProjectToNew: function(bAskBeforeResettingIfUnsavedChanges) {
    // blr.W15yQC.fnLog('scanner-resetProjectToNew');
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService), result,
        bCancel=false;
    if(bAskBeforeResettingIfUnsavedChanges==null) { bAskBeforeResettingIfUnsavedChanges=true; }
    if(blr.W15yQC.ScannerWindow.stateScanning==false) {
      if(bAskBeforeResettingIfUnsavedChanges==true && blr.W15yQC.ScannerWindow.projectHasUnsavedChanges==true) {
        // present alert dialog with query to save changes and Yes, No, Cancel buttons
        // If saving, perform a quiet save (not a save as dialog)
        result = prompts.confirm(null, "Scanner Project Has Unsaved Changes", "Reset project to new without saving?");
        if(!result) { bCancel=true; }
      }
      if(!bCancel) {
        blr.W15yQC.ScannerWindow.projectHasUnsavedChanges = false;
        blr.W15yQC.ScannerWindow.urlList = [];
        blr.W15yQC.ScannerWindow.urlMustMatchList = [];
        blr.W15yQC.ScannerWindow.urlMustNotMatchList = [];
        blr.W15yQC.ScannerWindow.urlMustMatchListType = [];
        blr.W15yQC.ScannerWindow.urlMustNotMatchListType = [];
        blr.W15yQC.ScannerWindow.parseForLinks = true;
        blr.W15yQC.ScannerWindow.projectSettingsHaveBeenSet=false;
        blr.W15yQC.ScannerWindow.maximumURLDepth=20;
      }
    } else {
      bCancel=true;
    }
    return bCancel;
  },
  
  urlAlreadInList: function(sURL) {
    var i;
    if(blr.W15yQC.ScannerWindow.urlList!=null) {
      for(i=0;i<blr.W15yQC.ScannerWindow.urlList.length;i++) {
        if(blr.W15yQC.ScannerWindow.fnURLsAreEqual('', blr.W15yQC.ScannerWindow.urlList[i].loc, '', sURL)) {
          if(blr.W15yQC.ScannerWindow.bManualURLAdd==true) { alert('URL already in list'); }
          return true;
        }
      }
    }
    return false;
  },
  
  addUrlToProject: function (sURL, sDocURL, source, priority, dontParseForLinks) {
    // blr.W15yQC.fnLog('scanner-addUrlToProject');
    var url;
    sURL=blr.W15yQC.ScannerWindow.fnRemoveNamedAnchor(sURL);
    if(sURL!=null && sURL.length && sURL.length>0) {
      if(blr.W15yQC.ScannerWindow.urlList==null) {
        blr.W15yQC.ScannerWindow.urlList = [];
      }
      if(blr.W15yQC.ScannerWindow.urlList.length <= blr.W15yQC.ScannerWindow.maximumURLCount) {
        sURL = blr.W15yQC.fnNormalizeURL(sDocURL,sURL);
        if(!blr.W15yQC.ScannerWindow.urlAlreadInList(sURL) &&
           (blr.W15yQC.ScannerWindow.bManualURLAdd==true ||
            (blr.W15yQC.ScannerWindow.urlMatchesProjectMustMatchList(sURL) && !blr.W15yQC.ScannerWindow.urlMatchesProjectMustNotMatchList(sURL))) &&
           !blr.W15yQC.ScannerWindow.urlIsBlackListed(sURL)) {
          
          url=new blr.W15yQC.ProjectURL(sURL, source, priority);
          if(blr.W15yQC.ScannerWindow.stateScanning==true) {
            url.linkDepth=blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.stateCurrentIndex].linkDepth + 1;
          }
          if(dontParseForLinks==null) {
            dontParseForLinks=false;
          }
          url.dontParseForLinks=dontParseForLinks;
          blr.W15yQC.ScannerWindow.urlList.push(url);
          blr.W15yQC.ScannerWindow.projectHasUnsavedChanges=true;
          
        }
      } else {
        blr.W15yQC.ScannerWindow.fnUpdateStatus('Maximum number of URLs reached.');
      }
    }
  },
  
  scanResultsForURLs: function(oW15yQCResults) {
    var i;
    if(oW15yQCResults != null) {
      if(oW15yQCResults.aLinks && oW15yQCResults.aLinks.length) {
        blr.W15yQC.ScannerWindow.fnUpdateStatus('Scanning page for URLs to add. '+oW15yQCResults.sWindowTitle);
        for(i=0;i<oW15yQCResults.aLinks.length;i++) {
          if(oW15yQCResults.aLinks[i].href!=null) {
            blr.W15yQC.ScannerWindow.addUrlToProject(oW15yQCResults.aLinks[i].href,oW15yQCResults.sWindowURL,oW15yQCResults.sWindowURL,1.0); 
            blr.W15yQC.ScannerWindow.updateUrlInTree(blr.W15yQC.ScannerWindow.urlList.length-1);
          }
        }
      }
    }
  },
  
  updateURL: function (urlIndex, oW15yQCResults) {
    var row, url;
    blr.W15yQC.ScannerWindow.fnUpdateStatus('');

    if(oW15yQCResults!=null && blr.W15yQC.ScannerWindow.urlList && blr.W15yQC.ScannerWindow.urlList.length>0 && urlIndex<blr.W15yQC.ScannerWindow.urlList.length) {

      blr.W15yQC.ScannerWindow.projectHasUnsavedChanges=true;
      url=blr.W15yQC.ScannerWindow.urlList[urlIndex];
      url.windowTitle=oW15yQCResults.sWindowTitle;
      url.dateScanned = oW15yQCResults.dDateChecked;
      url.score= oW15yQCResults.iScore;
      url.textSize= oW15yQCResults.iTextSize;
      url.downloadsCount= oW15yQCResults.iDocumentCount;

      if(oW15yQCResults.aFrames && oW15yQCResults.aFrames.length>0) {
        url.framesCount=oW15yQCResults.aFrames.length;
        url.framesFailures=oW15yQCResults.aFrames.failedCount;
        url.framesWarnings=oW15yQCResults.aFrames.warningCount;
      } else {
        url.framesCount=0;
        url.framesFailures=0;
        url.framesWarnings=0;
      }
      url.itemsCount=url.framesCount;
      url.failuresCount=url.framesFailures;
      url.warningsCount=url.framesWarnings;

      
      if(oW15yQCResults.aHeadings && oW15yQCResults.aHeadings.length>0) {
        url.headingsCount=oW15yQCResults.aHeadings.length;
        url.headingsFailures=oW15yQCResults.aHeadings.failedCount;
        url.headingsWarnings=oW15yQCResults.aHeadings.warningCount;
      } else {
        url.headingsCount=0;
        url.headingsFailures=0;
        url.headingsWarnings=0;
      }
      url.itemsCount=url.itemsCount+url.headingsCount;
      url.failuresCount=url.failuresCount+url.headingsFailures;
      url.warningsCount=url.warningsCount+url.headingsWarnings;

      if(oW15yQCResults.aARIALandmarks && oW15yQCResults.aARIALandmarks.length>0) {
        url.ARIALandmarksCount=oW15yQCResults.aARIALandmarks.length;
        url.ARIALandmarksFailures=oW15yQCResults.aARIALandmarks.failedCount;
        url.ARIALandmarksWarnings=oW15yQCResults.aARIALandmarks.warningCount;
      } else {
        url.ARIALandmarksCount=0;
        url.ARIALandmarksFailures=0;
        url.ARIALandmarksWarnings=0;
      }
      url.itemsCount=url.itemsCount+url.ARIALandmarksCount;
      url.failuresCount=url.failuresCount+url.ARIALandmarksFailures;
      url.warningsCount=url.warningsCount+url.ARIALandmarksWarnings;

      if(oW15yQCResults.aARIAElements && oW15yQCResults.aARIAElements.length>0) {
        url.ARIAElementsCount=oW15yQCResults.aARIAElements.length;
        url.ARIAElementsFailures=oW15yQCResults.aARIAElements.failedCount;
        url.ARIAElementsWarnings=oW15yQCResults.aARIAElements.warningCount;
      } else {
        url.ARIAElementsCount=0;
        url.ARIAElementsFailures=0;
        url.ARIAElementsWarnings=0;
      }
      url.itemsCount=url.itemsCount+url.ARIAElementsCount;
      url.failuresCount=url.failuresCount+url.ARIAElementsFailures;
      url.warningsCount=url.warningsCount+url.ARIAElementsWarnings;

      if(oW15yQCResults.aLinks && oW15yQCResults.aLinks.length>0) {
        url.linksCount=oW15yQCResults.aLinks.length;
        url.linksFailures=oW15yQCResults.aLinks.failedCount;
        url.linksWarnings=oW15yQCResults.aLinks.warningCount;
      } else {
        url.linksCount=0;
        url.linksFailures=0;
        url.linksWarnings=0;
      }
      url.itemsCount=url.itemsCount+url.linksCount;
      url.failuresCount=url.failuresCount+url.linksFailures;
      url.warningsCount=url.warningsCount+url.linksWarnings;

      if(oW15yQCResults.aImages && oW15yQCResults.aImages.length>0) {
        url.imagesCount=oW15yQCResults.aImages.length;
        url.imagesFailures=oW15yQCResults.aImages.failedCount;
        url.imagesWarnings=oW15yQCResults.aImages.warningCount;
      } else {
        url.imagesCount=0;
        url.imagesFailures=0;
        url.imagesWarnings=0;
      }
      url.itemsCount=url.itemsCount+url.imagesCount;
      url.failuresCount=url.failuresCount+url.imagesFailures;
      url.warningsCount=url.warningsCount+url.imagesWarnings;

      if(oW15yQCResults.aFormControls && oW15yQCResults.aFormControls.length>0) {
        url.formControlsCount=oW15yQCResults.aFormControls.length;
        url.formControlsFailures=oW15yQCResults.aFormControls.failedCount;
        url.formControlsWarnings=oW15yQCResults.aFormControls.warningCount;
      } else {
        url.formControlsCount=0;
        url.formControlsFailures=0;
        url.formControlsWarnings=0;
      }
      url.itemsCount=url.itemsCount+url.formControlsCount;
      url.failuresCount=url.failuresCount+url.formControlsFailures;
      url.warningsCount=url.warningsCount+url.formControlsWarnings;

      if(oW15yQCResults.aAccessKeys && oW15yQCResults.aAccessKeys.length>0) {
        url.accessKeysCount=oW15yQCResults.aAccessKeys.length;
        url.accessKeysFailures=oW15yQCResults.aAccessKeys.failedCount;
        url.accessKeysWarnings=oW15yQCResults.aAccessKeys.warningCount;
      } else {
        url.accessKeysCount=0;
        url.accessKeysFailures=0;
        url.accessKeysWarnings=0;
      }
      url.itemsCount=url.itemsCount+url.accessKeysCount;
      url.failuresCount=url.failuresCount+url.accessKeysFailures;
      url.warningsCount=url.warningsCount+url.accessKeysWarnings;

      if(oW15yQCResults.aTables && oW15yQCResults.aTables.length>0) {
        url.tablesCount=oW15yQCResults.aTables.length;
        url.tablesFailures=oW15yQCResults.aTables.failedCount;
        url.tablesWarnings=oW15yQCResults.aTables.warningCount;
      } else {
        url.tablesCount=0;
        url.tablesFailures=0;
        url.tablesWarnings=0;
      }
      url.itemsCount=url.itemsCount+url.tablesCount;
      url.failuresCount=url.failuresCount+url.tablesFailures;
      url.warningsCount=url.warningsCount+url.tablesWarnings;

      url.windowDescription=blr.W15yQC.fnJoin(oW15yQCResults.sWindowDescription, oW15yQCResults.PageScore.sDescription, "\n");
      row=document.getElementById('URL'+urlIndex);
      blr.W15yQC.ScannerWindow.updateUrlInTree(blr.W15yQC.ScannerWindow.stateCurrentIndex);
      blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
    }
    blr.W15yQC.ScannerWindow.updateControlStates();
  },
  
  spaces: function(count) {
    count=(count==null) ? 0 : (count>20 ? 20 : count);
    return count>0 ? "                    ".slice(0,count-1) : "";
  },
  
  newProject: function() {
    // blr.W15yQC.fnLog('scanner-newProject');
    blr.W15yQC.ScannerWindow.resetProjectToNew();
    blr.W15yQC.ScannerWindow.updateProjectDisplay();
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
        i=parseInt(decodeURIComponent(e[0].textContent));
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
      converter.writeString(blr.W15yQC.ScannerWindow.spaces(indent)+'<'+tagName+'>'+encodeURIComponent(value)+'</'+tagName+'>\n');
    }
  },
  
  writeXMLInt: function(value, tagName, converter, indent) {
    if(value!=null && converter!=null) {
      converter.writeString(blr.W15yQC.ScannerWindow.spaces(indent)+'<'+tagName+'>'+encodeURIComponent(value.toString())+'</'+tagName+'>\n');
    }
  },
  
  writeXMLDate: function(value, tagName, converter, indent) {
    if(value!=null && converter!=null && value.toISOString) {
      converter.writeString(blr.W15yQC.ScannerWindow.spaces(indent)+'<'+tagName+'>'+value.toISOString()+'</'+tagName+'>\n');
    }
  },
  
  writeXMLBool: function(value, tagName, converter, indent) {
    if(value!=null && converter!=null) {
      converter.writeString(blr.W15yQC.ScannerWindow.spaces(indent)+'<'+tagName+'>'+(value ? "true":"false")+'</'+tagName+'>\n');
    }
  },
  
  openProject: function (f) {
    var fp, rv, file, sFileContents, fstream, cstream, str, read, i,
      properties, nsIFilePicker = Components.interfaces.nsIFilePicker, xmlDoc, xmlParser, matchList, matches, urls;
    if(!blr.W15yQC.ScannerWindow.resetProjectToNew()) {
      blr.W15yQC.ScannerWindow.fnUpdatePercentage(0);
      if(/.+\.w15yqc$/.test(f) != true) {
        fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        blr.W15yQC.ScannerWindow.fnUpdateStatus('Choose Project File to Open');
        fp.init(window, "Open Project", nsIFilePicker.modeOpen);
        fp.appendFilter("W15yQC Project","*.w15yqc");
        rv = fp.show();
        if (rv == nsIFilePicker.returnOK) {
          file=fp.file;
        }
      } else {
        file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath(f);
      }
      if(file!=null && file.path && /.+\.w15yqc$/.test(file.path) == true) {
        blr.W15yQC.ScannerWindow.projectFileName = file.path;
        sFileContents = '';
        blr.W15yQC.ScannerWindow.fnUpdateStatus('Opening project file.');
        fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
        cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
        fstream.init(file, -1, 0, 0);
        cstream.init(fstream, "UTF-8", 0, 0);
         
        blr.W15yQC.ScannerWindow.fnUpdateStatus('Reading project file.');
        let (str = {}) {
          let read = 0;
          do {
            read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
            sFileContents += str.value;
          } while (read != 0);
        }
        cstream.close(); // this closes fstream
        blr.W15yQC.ScannerWindow.addFileToRecentList(file.path);
        file=null;
        rv=null;
        fp=null;
        
        xmlParser = new DOMParser(); // https://developer.mozilla.org/en-US/docs/DOM/DOMParser
        xmlDoc = xmlParser.parseFromString(sFileContents, "text/xml");
        sFileContents=null;
        if(xmlDoc && xmlDoc.getElementsByTagName) {
          // Read Project Properties
          blr.W15yQC.ScannerWindow.fnUpdateStatus('Reading project properties.');
          properties=xmlDoc.getElementsByTagName('properties');
          if(properties!=null && properties.length>0) {
            properties=properties[0];
            blr.W15yQC.ScannerWindow.sProjectTitle = blr.W15yQC.ScannerWindow.readDOMEncodedString(properties,'title');
            blr.W15yQC.ScannerWindow.projectCreationDate = blr.W15yQC.ScannerWindow.readDOMDate(properties,'creation_date');
            blr.W15yQC.ScannerWindow.projectLastUpdate = blr.W15yQC.ScannerWindow.readDOMDate(properties,'last_update');
            blr.W15yQC.ScannerWindow.parseForLinks = blr.W15yQC.ScannerWindow.readDOMBool(properties,'parse_for_links');
            blr.W15yQC.ScannerWindow.projectSettingsHaveBeenSet = blr.W15yQC.ScannerWindow.readDOMBool(properties,'project_settings_have_been_set');
            blr.W15yQC.ScannerWindow.maximumURLCount = blr.W15yQC.ScannerWindow.readDOMInt(properties,'maximum_url_count');
            blr.W15yQC.ScannerWindow.maximumURLDepth = blr.W15yQC.ScannerWindow.readDOMInt(properties,'maximum_url_depth');
            blr.W15yQC.ScannerWindow.pageLoadTimeLimit = blr.W15yQC.ScannerWindow.readDOMInt(properties,'page_load_time_limit');
            blr.W15yQC.ScannerWindow.pageLoadFilter = blr.W15yQC.ScannerWindow.readDOMInt(properties,'page_load_filter');
            
            blr.W15yQC.ScannerWindow.urlMustMatchList=[];
            blr.W15yQC.ScannerWindow.urlMustMatchListType=[];
            matchList=properties.getElementsByTagName('url_must_match_list');
            if(matchList!=null && matchList.length>0) {
              matches=matchList[0].getElementsByTagName('match');
              if(matches!=null && matches.length>0) {
                for(i=0;i<matches.length;i++) {
                  blr.W15yQC.ScannerWindow.urlMustMatchList.push(blr.W15yQC.ScannerWindow.readDOMEncodedString(matches[i],'match_spec'));
                  blr.W15yQC.ScannerWindow.urlMustMatchListType.push(blr.W15yQC.ScannerWindow.readDOMEncodedString(matches[i],'match_type') == "RegExp" ? true : false);
                }
              }
            }              
            
            blr.W15yQC.ScannerWindow.urlMustNotMatchList=[];
            blr.W15yQC.ScannerWindow.urlMustNotMatchListType=[];
            matchList=properties.getElementsByTagName('url_must_not_match_list');
            if(matchList!=null && matchList.length>0) {
              matches=matchList[0].getElementsByTagName('match');
              if(matches!=null && matches.length>0) {
                for(i=0;i<matches.length;i++) {
                  blr.W15yQC.ScannerWindow.urlMustNotMatchList.push(blr.W15yQC.ScannerWindow.readDOMEncodedString(matches[i],'match_spec'));
                  blr.W15yQC.ScannerWindow.urlMustNotMatchListType.push(blr.W15yQC.ScannerWindow.readDOMEncodedString(matches[i],'match_type') == "RegExp" ? true : false);
                }
              }
            }              

            // Read URLs
            urls=xmlDoc.getElementsByTagName('url');
            blr.W15yQC.ScannerWindow.urlList=[];
            blr.W15yQC.ScannerWindow.fnUpdateStatus('Reading '+urls.length+' URLs.');
            for(i=0;i<urls.length;i++) {
              blr.W15yQC.ScannerWindow.fnUpdatePercentage(100.0*i/urls.length);
              blr.W15yQC.ScannerWindow.urlList.push(new blr.W15yQC.ProjectURL());
              blr.W15yQC.ScannerWindow.urlList[i].loc = blr.W15yQC.ScannerWindow.readDOMEncodedString(urls[i],'loc');
              blr.W15yQC.ScannerWindow.urlList[i].windowDescription = blr.W15yQC.ScannerWindow.readDOMEncodedString(urls[i],'window_description');
              blr.W15yQC.ScannerWindow.urlList[i].priority = blr.W15yQC.ScannerWindow.readDOMEncodedString(urls[i],'priority');
              blr.W15yQC.ScannerWindow.urlList[i].source = blr.W15yQC.ScannerWindow.readDOMEncodedString(urls[i],'source');
              blr.W15yQC.ScannerWindow.urlList[i].linkDepth = blr.W15yQC.ScannerWindow.readDOMEncodedString(urls[i],'link_depth');
              blr.W15yQC.ScannerWindow.urlList[i].dateScanned = blr.W15yQC.ScannerWindow.readDOMDate(urls[i],'date_scanned');
              blr.W15yQC.ScannerWindow.urlList[i].contentType = blr.W15yQC.ScannerWindow.readDOMEncodedString(urls[i],'content_type');
              blr.W15yQC.ScannerWindow.urlList[i].windowTitle = blr.W15yQC.ScannerWindow.readDOMEncodedString(urls[i],'window_title');
              blr.W15yQC.ScannerWindow.urlList[i].itemsCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'items_count');
              blr.W15yQC.ScannerWindow.urlList[i].warningsCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'warnings_count');
              blr.W15yQC.ScannerWindow.urlList[i].failuresCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'failures_count');
              blr.W15yQC.ScannerWindow.urlList[i].score = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'score');
              blr.W15yQC.ScannerWindow.urlList[i].textSize = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'text_size');
              blr.W15yQC.ScannerWindow.urlList[i].downloadsCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'downloads_count');
              blr.W15yQC.ScannerWindow.urlList[i].framesCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'frames_count');
              blr.W15yQC.ScannerWindow.urlList[i].framesWarnings = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'frames_warnings');
              blr.W15yQC.ScannerWindow.urlList[i].framesFailures = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'frames_failures');
              blr.W15yQC.ScannerWindow.urlList[i].headingsCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'headings_count');
              blr.W15yQC.ScannerWindow.urlList[i].headingsWarnings = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'headings_warnings');
              blr.W15yQC.ScannerWindow.urlList[i].headingsFailures = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'headings_failures');
              blr.W15yQC.ScannerWindow.urlList[i].ARIALandmarksCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'aria_landmarks_count');
              blr.W15yQC.ScannerWindow.urlList[i].ARIALandmarksWarnings = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'aria_landmarks_warnings');
              blr.W15yQC.ScannerWindow.urlList[i].ARIALandmarksFailures = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'aria_landmarks_failures');
              blr.W15yQC.ScannerWindow.urlList[i].ARIAElementsCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'aria_elements_count');
              blr.W15yQC.ScannerWindow.urlList[i].ARIAElementsWarnings = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'aria_elements_warnings');
              blr.W15yQC.ScannerWindow.urlList[i].ARIAElementsFailures = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'aria_elements_failures');
              blr.W15yQC.ScannerWindow.urlList[i].linksCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'links_count');
              blr.W15yQC.ScannerWindow.urlList[i].linksWarnings = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'links_warnings');
              blr.W15yQC.ScannerWindow.urlList[i].linksFailures = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'links_failures');
              blr.W15yQC.ScannerWindow.urlList[i].imagesCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'images_count');
              blr.W15yQC.ScannerWindow.urlList[i].imagesWarnings = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'images_warnings');
              blr.W15yQC.ScannerWindow.urlList[i].imagesFailures = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'images_failures');
              blr.W15yQC.ScannerWindow.urlList[i].formControlsCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'form_controls_count');
              blr.W15yQC.ScannerWindow.urlList[i].formControlsWarnings = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'form_controls_warnings');
              blr.W15yQC.ScannerWindow.urlList[i].formControlsFailures = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'form_controls_failures');
              blr.W15yQC.ScannerWindow.urlList[i].accessKeysCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'access_keys_count');
              blr.W15yQC.ScannerWindow.urlList[i].accessKeysWarnings = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'access_keys_warnings');
              blr.W15yQC.ScannerWindow.urlList[i].accessKeysFailures = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'access_keys_failures');
              blr.W15yQC.ScannerWindow.urlList[i].tablesCount = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'tables_count');
              blr.W15yQC.ScannerWindow.urlList[i].tablesWarnings = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'tables_warnings');
              blr.W15yQC.ScannerWindow.urlList[i].tablesFailures = blr.W15yQC.ScannerWindow.readDOMInt(urls[i],'tables_failures');
            }
          }
          blr.W15yQC.ScannerWindow.fnUpdateStatus('Finished loading project.');
          blr.W15yQC.ScannerWindow.fnUpdatePercentage(100);
        }
        xmlDoc = null;
      }
      blr.W15yQC.ScannerWindow.updateProjectDisplay();
      if(blr.W15yQC.ScannerWindow.urlList!=null && blr.W15yQC.ScannerWindow.urlList.length>0 && blr.W15yQC.ScannerWindow.projectSettingsHaveBeenSet==true) {
        blr.W15yQC.ScannerWindow.fnUpdateStatus('Project loaded.');
      } else {
        blr.W15yQC.ScannerWindow.fnUpdateStatus('No project loaded.');
      }
  
      blr.W15yQC.ScannerWindow.updateControlStates();
    }
  },
  
  saveProjectAs: function() {
    blr.W15yQC.ScannerWindow.saveProject(true);
  },
  
  saveProject: function (saveAs) { // TODO: Handle errors gracefully. 
    var bCancel=false,
      nsIFilePicker, fp, rv, file, foStream, converter, i, url;
    
    if(blr.W15yQC.ScannerWindow.urlList!=null && blr.W15yQC.ScannerWindow.projectSettingsHaveBeenSet==true) {
      //try
        if(saveAs==null) { saveAs=false; }
      
        nsIFilePicker = Components.interfaces.nsIFilePicker;
        if(blr.W15yQC.fnStringHasContent(blr.W15yQC.ScannerWindow.projectFileName)!=true  || saveAs==true) {
          fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
          fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
          fp.appendFilter("W15yQC Project","*.w15yqc");
          rv = fp.show();
          if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
            file = fp.file;
            if (/\.w15yqc$/.test(file.path) == false) {
              file.initWithPath(file.path + '.w15yqc');
            }
          } else {
            bCancel=true;
          }
        } else {
          file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
          file.initWithPath(blr.W15yQC.ScannerWindow.projectFileName);
        }
  
        if(bCancel==false) {
          blr.W15yQC.ScannerWindow.fnUpdateStatus('Saving project file.');
          foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
          createInstance(Components.interfaces.nsIFileOutputStream);
  
          foStream.init(file, 0x2A, 438, 0);
          blr.W15yQC.ScannerWindow.addFileToRecentList(file.path);
          converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
          converter.init(foStream, "UTF-8", 0, 0);
          converter.writeString('<?xml version="1.0" encoding="UTF-8"?>\n');
          converter.writeString('<w15yqc>\n');
          converter.writeString('  <project>\n');
          converter.writeString('    <properties>\n');

          blr.W15yQC.ScannerWindow.writeXMLEncodedString(blr.W15yQC.ScannerWindow.sProjectTitle,'title',converter,6);

          blr.W15yQC.ScannerWindow.writeXMLDate(blr.W15yQC.ScannerWindow.projectCreationDate,'creation_date',converter,6);

          blr.W15yQC.ScannerWindow.writeXMLDate(blr.W15yQC.ScannerWindow.projectLastUpdate,'last_update',converter,6);
          
          blr.W15yQC.ScannerWindow.writeXMLBool((blr.W15yQC.ScannerWindow.parseForLinks==false) ? false : true,'parse_for_links',converter,6);
          
          blr.W15yQC.ScannerWindow.writeXMLBool(blr.W15yQC.ScannerWindow.projectSettingsHaveBeenSet ? true : false,'project_settings_have_been_set',converter,6);
          
          if(blr.W15yQC.ScannerWindow.maximumURLCount==null) {
            blr.W15yQC.ScannerWindow.maximumURLCount=5000;
          }
          blr.W15yQC.ScannerWindow.writeXMLInt(blr.W15yQC.ScannerWindow.maximumURLCount,'maximum_url_count',converter,6);
          
          if(blr.W15yQC.ScannerWindow.maximumURLDepth==null) {
            blr.W15yQC.ScannerWindow.maximumURLDepth=20;
          }
          blr.W15yQC.ScannerWindow.writeXMLInt(blr.W15yQC.ScannerWindow.maximumURLDepth,'maximum_url_depth',converter,6);
          
          if(blr.W15yQC.ScannerWindow.pageLoadTimeLimit==null) {
            blr.W15yQC.ScannerWindow.pageLoadTimeLimit=20000;
          }
          blr.W15yQC.ScannerWindow.writeXMLInt(blr.W15yQC.ScannerWindow.pageLoadTimeLimit,'page_load_time_limit',converter,6);
          
          if(blr.W15yQC.ScannerWindow.pageLoadFilter==null) {
            blr.W15yQC.ScannerWindow.pageLoadFilter=1000;
          }
          blr.W15yQC.ScannerWindow.writeXMLInt(blr.W15yQC.ScannerWindow.pageLoadFilter,'page_load_filter',converter,6);

          if(blr.W15yQC.ScannerWindow.urlMustMatchList != null && blr.W15yQC.ScannerWindow.urlMustMatchList.length>0) {
            converter.writeString('      <url_must_match_list>\n');
            for(i=0;i<blr.W15yQC.ScannerWindow.urlMustMatchList.length;i++) {
              converter.writeString('        <match>\n');
              blr.W15yQC.ScannerWindow.writeXMLEncodedString(blr.W15yQC.ScannerWindow.urlMustMatchList[i],'match_spec',converter,10);
              blr.W15yQC.ScannerWindow.writeXMLEncodedString(blr.W15yQC.ScannerWindow.urlMustMatchListType[i] ? "RegExp" : "Match",'match_type',converter,10);
              converter.writeString('        </match>\n');
            }
            converter.writeString('      </url_must_match_list>\n');
          }
          
          if(blr.W15yQC.ScannerWindow.urlMustNotMatchList != null && blr.W15yQC.ScannerWindow.urlMustNotMatchList.length>0) {
            converter.writeString('      <url_must_not_match_list>\n');
            for(i=0;i<blr.W15yQC.ScannerWindow.urlMustNotMatchList.length;i++) {
              converter.writeString('        <match>\n');
              blr.W15yQC.ScannerWindow.writeXMLEncodedString(blr.W15yQC.ScannerWindow.urlMustNotMatchList[i],'match_spec',converter,10);
              blr.W15yQC.ScannerWindow.writeXMLEncodedString(blr.W15yQC.ScannerWindow.urlMustNotMatchListType[i] ? "RegExp" : "Match",'match_type',converter,10);
              converter.writeString('        </match>\n');
            }
            converter.writeString('      </url_must_not_match_list>\n');
          }
          
          converter.writeString('    </properties>\n');
          
          if(blr.W15yQC.ScannerWindow.urlList!=null && blr.W15yQC.ScannerWindow.urlList.length>0) {
            converter.writeString('    <urls>\n');
            for(i=0;i<blr.W15yQC.ScannerWindow.urlList.length;i++) {
              url=blr.W15yQC.ScannerWindow.urlList[i];
              if(url!=null) {
                converter.writeString('      <url>\n');

                blr.W15yQC.ScannerWindow.writeXMLEncodedString(url.loc,'loc',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLEncodedString(url.windowDescription,'window_description',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLEncodedString(url.priority,'priority',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLEncodedString(url.source,'source',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLEncodedString(url.linkDepth,'link_depth',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLDate(url.dateScanned,'date_scanned',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLEncodedString(url.contentType,'content_type',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLEncodedString(url.windowTitle,'window_title',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.itemsCount,'items_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.warningsCount,'warnings_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.failuresCount,'failures_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.score,'score',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.textSize,'text_size',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.downloadsCount,'downloads_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.framesCount,'frames_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.framesWarnings,'frames_warnings',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.framesFailures,'frames_failures',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.headingsCount,'headings_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.headingsWarnings,'headings_warnings',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.headingsFailures,'headings_failures',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.ARIALandmarksCount,'aria_landmarks_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.ARIALandmarksWarnings,'aria_landmarks_warnings',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.ARIALandmarksFailures,'aria_landmarks_failures',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.ARIAElementsCount,'aria_elements_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.ARIAElementsWarnings,'aria_elements_warnings',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.ARIAElementsFailures,'aria_elements_failures',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.linksCount,'links_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.linksWarnings,'links_warnings',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.linksFailures,'links_failures',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.imagesCount,'images_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.imagesWarnings,'images_warnings',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.imagesFailures,'images_failures',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.formControlsCount,'form_controls_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.formControlsWarnings,'form_controls_warnings',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.formControlsFailures,'form_controls_failures',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.accessKeysCount,'access_keys_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.accessKeysWarnings,'access_keys_warnings',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.accessKeysFailures,'access_keys_failures',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.tablesCount,'tables_count',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.tablesWarnings,'tables_warnings',converter,8);
                blr.W15yQC.ScannerWindow.writeXMLInt(url.tablesFailures,'tables_failures',converter,8);
                converter.writeString('      </url>\n');
              }
            }
            converter.writeString('    </urls>\n');
          }

          converter.writeString('  </project>');
          converter.writeString('</w15yqc>');
          
          converter.close(); // this closes foStream            
          blr.W15yQC.ScannerWindow.fnUpdateStatus('Project file saved.');
        } else {
          blr.W15yQC.ScannerWindow.fnUpdateStatus('Project file not saved.');
        }
      
      blr.W15yQC.ScannerWindow.projectHasUnsavedChanges=false;
      //catch
    }
  },
  
  importLinks: function () {
    // blr.W15yQC.fnLog('scanner-importLinks');
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
          data=null;
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
                blr.W15yQC.ScannerWindow.addUrlToProject(sURL, null, "Sitemap:"+OS.Path.basename(sourceFileName), priority);
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
    blr.W15yQC.ScannerWindow.updateControlStates();
  },

  inspectPageTitle: function(pti) {
    var i, sPageTitle;
    if(pti && blr.W15yQC.ScannerWindow.urlList!=null && pti<blr.W15yQC.ScannerWindow.urlList.length) {
      sPageTitle=blr.W15yQC.ScannerWindow.urlList[pti].windowTitle;
      for(i=0;i<blr.W15yQC.ScannerWindow.urlList.length;i++) {
        if(i!=pti) {
          if(blr.W15yQC.fnStringsEffectivelyEqual(sPageTitle,blr.W15yQC.ScannerWindow.urlList[i].windowTitle)) {
            
          } 
        }
      }
    }
  },
  
  inspectPageTitles: function() {
    var i, j, sPageTitle;
    if(pti && blr.W15yQC.ScannerWindow.urlList!=null && pti<blr.W15yQC.ScannerWindow.urlList.length) {
      sPageTitle=blr.W15yQC.ScannerWindow.urlList[pti].windowTitle;
      for(i=0;i<blr.W15yQC.ScannerWindow.urlList.length;i++) {
        if(i!=pti) {
          if(blr.W15yQC.fnStringsEffectivelyEqual(sPageTitle,blr.W15yQC.ScannerWindow.urlList[i].windowTitle)) {
            
          } 
        }
      }
    }
  },
  
  setStateAsScanning: function() {
    // blr.W15yQC.fnLog('scanner-setStateAsScanning');
    blr.W15yQC.ScannerWindow.stateScanning = true;
    blr.W15yQC.ScannerWindow.stateWaitingOnUrlToLoad=false;
    blr.W15yQC.ScannerWindow.stateStopScanningRequested=false;
    blr.W15yQC.ScannerWindow.updateControlStates();
  },
  
  setStateAsNotScanning: function() {
    // blr.W15yQC.fnLog('scanner-setStateAsNotScanning');
    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventTimeOutTimerID);
    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventFilterTimerID);
    blr.W15yQC.ScannerWindow.stateScanning = false;
    blr.W15yQC.ScannerWindow.stateScanningAllLinks=false;
    blr.W15yQC.ScannerWindow.stateScanningOneLink=false;
    //blr.W15yQC.ScannerWindow.scan
    blr.W15yQC.ScannerWindow.stateWaitingOnUrlToLoad=false;
    blr.W15yQC.ScannerWindow.updateControlStates();
  },
  
  updateControlStates: function() {
    var treebox = document.getElementById('treebox'),
      selectedRow = treebox.currentIndex,
      iframeHolder = document.getElementById('iFrameHolder'),
      textbox = document.getElementById('note-text'),
      scannerIFrame = document.getElementById('pageBeingScannedIFrame'),
			buttonScanSelectedURL=document.getElementById('button-scanSelectedURL'),
      buttonStopScanning=document.getElementById('button-stopScanning'),
      buttonOpenSelectedURL=document.getElementById('button-openSelectedURL'),
      buttonEditSelectedURL=document.getElementById('button-editSelectedURL'),
      buttonAddNewURL=document.getElementById('button-addNewURL'),
      buttonDeleteSelectedURL=document.getElementById('button-deleteSelectedURL');      
    
    if(selectedRow==null) { selectedRow=-1;}
    
    if(blr.W15yQC.ScannerWindow.stateScanning==true) {
			buttonScanSelectedURL.disabled=true;
      buttonStopScanning.disabled=false;
      buttonOpenSelectedURL.disabled=true;
      buttonAddNewURL.disabled=true;
      buttonEditSelectedURL.disabled=true;
      buttonDeleteSelectedURL.disabled=true;
      if(textbox!=null) {
        iframeHolder.removeChild(textbox);
      }
    } else {
			buttonScanSelectedURL.disabled=selectedRow<0;
      buttonStopScanning.disabled=true;
      buttonAddNewURL.disabled=false;
      buttonOpenSelectedURL.disabled=selectedRow<0;
      buttonEditSelectedURL.disabled=selectedRow<0;
      buttonDeleteSelectedURL.disabled=selectedRow<0;
      if(textbox==null) {
        textbox=document.createElement('textbox');
        textbox.setAttribute('id','note-text');
        textbox.setAttribute('readonly','true');
        textbox.setAttribute('multiline','true');
        textbox.setAttribute('rows','8');
        textbox.setAttribute('flex','1');
        iframeHolder.insertBefore(textbox,scannerIFrame);
      }
      if(scannerIFrame!=null) {
        iframeHolder.removeChild(scannerIFrame);
      }
    }
  },
  
  scanAllLinks: function() {
    // blr.W15yQC.fnLog('scanner-scanAllLinks');
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService),
      result, bCancel=false;
    if(blr.W15yQC.ScannerWindow.stateScanning==false) {
      if(blr.W15yQC.ScannerWindow.projectSettingsHaveBeenSet!=true) {
        result = prompts.confirm(null, "Scanner Project Has Not Been Configured", "It's recommended to configure the URL 'Must Match' settings before continuing. Continue any way?");
        if(!result) { bCancel=true; }
      }
      if(!bCancel && blr.W15yQC.ScannerWindow.stateScanning!=true && blr.W15yQC.ScannerWindow.urlList!=null && blr.W15yQC.ScannerWindow.urlList.length>0) {
        blr.W15yQC.ScannerWindow.stateStopScanningRequested=false;
        blr.W15yQC.ScannerWindow.setStateAsScanning();
        blr.W15yQC.ScannerWindow.stateCurrentIndex=-1;
        blr.W15yQC.ScannerWindow.stateScanningAllLinks=true;
        blr.W15yQC.ScannerWindow.stateScanningOneLink=false;
        blr.W15yQC.ScannerWindow.scanNextLink();
      }
    }
  },
  
  scanNewLinks: function() {
    // blr.W15yQC.fnLog('scanner-scanNewLinks');
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService),
      result, bCancel=false;
    if(blr.W15yQC.ScannerWindow.stateScanning==false) {
      if(blr.W15yQC.ScannerWindow.projectSettingsHaveBeenSet!=true) {
        result = prompts.confirm(null, "Scanner Project Has Not Been Configured", "It's recommended to configure the URL 'Must Match' settings before continuing. Continue any way?");
        if(!result) { bCancel=true; }
      }
      if(!bCancel && blr.W15yQC.ScannerWindow.urlList!=null && blr.W15yQC.ScannerWindow.urlList.length>0) {
        blr.W15yQC.ScannerWindow.stateStopScanningRequested=false;
        blr.W15yQC.ScannerWindow.setStateAsScanning();
        blr.W15yQC.ScannerWindow.stateCurrentIndex=-1;
        blr.W15yQC.ScannerWindow.stateScanningAllLinks=false;
        blr.W15yQC.ScannerWindow.stateScanningOneLink=false;
        blr.W15yQC.ScannerWindow.scanNextLink();
      }
    }
  },
  
  scanNextLink: function() {
    // blr.W15yQC.fnLog('scanner-scanNextLink');
    var treeview=document.getElementById('treebox');
    
    if(blr.W15yQC.ScannerWindow.stateStopScanningRequested!=true) {
      blr.W15yQC.ScannerWindow.updateControlStates();
      
      blr.W15yQC.ScannerWindow.stateCurrentIndex++;
      
      if( blr.W15yQC.ScannerWindow.stateScanningAllLinks!=true) {
        while(blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.stateCurrentIndex].dateScanned!=null &&
           blr.W15yQC.ScannerWindow.stateCurrentIndex < blr.W15yQC.ScannerWindow.urlList.length) {
          blr.W15yQC.ScannerWindow.stateCurrentIndex++;
        }
      }
      
      if(blr.W15yQC.ScannerWindow.stateCurrentIndex<blr.W15yQC.ScannerWindow.urlList.length) {
        blr.W15yQC.ScannerWindow.selectRow(blr.W15yQC.ScannerWindow.stateCurrentIndex,true);
        blr.W15yQC.ScannerWindow.scanURL(blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.stateCurrentIndex]);
      } else {
        blr.W15yQC.ScannerWindow.setStateAsNotScanning();
      }
    } else {
      blr.W15yQC.ScannerWindow.setStateAsNotScanning();
      blr.W15yQC.ScannerWindow.fnUpdateStatus('Scanning stopped due to user request.');
      alert('Scanning stopped due to user request.');
    }
  },
  
  scanURL: function(oURL) {
    // blr.W15yQC.fnLog('scanner-scanURL');
    blr.W15yQC.ScannerWindow.scanLoadUrlInIFrame(oURL.loc);
  },

  scanLoadUrlInIFrame: function(sURL) {
    // blr.W15yQC.fnLog('scanner-scanLoadUrlInIFrame');
    var iFrameHolder, iFrame;

    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventTimeOutTimerID);
    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventFilterTimerID);

    if(sURL != null && !blr.W15yQC.ScannerWindow.urlIsBlackListed(sURL) && blr.W15yQC.ScannerWindow.fnUrlAppearsScannable(sURL)) {
      iFrameHolder = document.getElementById('iFrameHolder');
      iFrame = document.getElementById('pageBeingScannedIFrame');
      if(iFrame != null) {
        // remove iFrame
        iFrame.parentNode.removeChild(iFrame);
      }
      // create new iFrame so we can get onload event notification
      // research blocking pop-ups from iframe
      blr.W15yQC.ScannerWindow.fnUpdateStatus('Waiting for page to load: '+sURL);
      blr.W15yQC.ScannerWindow.stateWaitingOnUrlToLoad=true;
      blr.W15yQC.ScannerWindow.iFrameOnLoadEventTimeOutTimerID=setTimeout(function () {
        blr.W15yQC.ScannerWindow.iFrameTimedOut();
      }, blr.W15yQC.ScannerWindow.pageLoadTimeLimit);
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
    
  iFrameTimedOut: function() {
    // blr.W15yQC.fnLog('scanner-iFrameTimedOut');
    if(blr.W15yQC.ScannerWindow.stateWaitingOnUrlToLoad==true) {
      blr.W15yQC.ScannerWindow.stateWaitingOnUrlToLoad=false;
      
      blr.W15yQC.ScannerWindow.fnUpdateStatus('URL timed out.');
      if(blr.W15yQC.ScannerWindow.stateScanningOneLink==false) {
        blr.W15yQC.ScannerWindow.scanNextLink();
      } else {
        blr.W15yQC.ScannerWindow.setStateAsNotScanning();
      }
    }
  },
  
  iFrameLoaded: function() {
    // blr.W15yQC.fnLog('scanner-iFrameLoaded');
    // Check iFrame Contents
    var oW15yQCResults, iFrame, iFrameDoc, treerow;

    blr.W15yQC.ScannerWindow.stateWaitingOnUrlToLoad=false;
    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventTimeOutTimerID);
    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventFilterTimerID);

    iFrame=document.getElementById('pageBeingScannedIFrame');
    if(iFrame!=null) {
      iFrameDoc=iFrame.contentDocument;
      if(iFrameDoc!=null) {
        blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.stateCurrentIndex].contentType=iFrameDoc.contentType;
        blr.W15yQC.ScannerWindow.fnUpdateStatus('Checking loaded URL.'+iFrameDoc.title);
        try {
          oW15yQCResults=blr.W15yQC.fnScannerInspect(iFrameDoc, blr.W15yQC.ScannerWindow.fnUpdateProgress);
          blr.W15yQC.ScannerWindow.inspectPageTitle(blr.W15yQC.ScannerWindow.stateCurrentIndex);
          blr.W15yQC.ScannerWindow.updateURL(blr.W15yQC.ScannerWindow.stateCurrentIndex,oW15yQCResults);
          blr.W15yQC.ScannerWindow.fnUpdateStatus('Results for:'+oW15yQCResults.sWindowTitle);
          blr.W15yQC.ScannerWindow.projectHasUnsavedChanges = true;
          if(blr.W15yQC.ScannerWindow.parseForLinks==true &&
             blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.stateCurrentIndex].linkDepth <= blr.W15yQC.ScannerWindow.maximumURLDepth &&
             blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.stateCurrentIndex].dontParseForLinks==false) {
            blr.W15yQC.ScannerWindow.bManualURLAdd=false;
            blr.W15yQC.ScannerWindow.scanResultsForURLs(oW15yQCResults);
          }
          oW15yQCResults = null;
        } catch(ex) {
          blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.stateCurrentIndex].windowDescription="An error occurred while checking this URL:\n"+ex.toString()+
          "\nFile:"+ex.fileName+"\nLineNumber:"+ex.lineNumber+"\nStack:"+ex.stack;
        }
      } else alert('iFrameDoc is null');
    }

    if(blr.W15yQC.ScannerWindow.stateScanningOneLink==false) {
      blr.W15yQC.ScannerWindow.scanNextLink();
    } else {
      blr.W15yQC.ScannerWindow.setStateAsNotScanning();
    }
  },

  iFrameOnLoadEventFired: function(currentURLIndex) {
    // blr.W15yQC.fnLog('scanner-iFrameOnLoadEventFired');
    var iFrame=document.getElementById('pageBeingScannedIFrame');
    if(iFrame!=null) {
      iFrame.removeEventListener("load", function(e) {
          blr.W15yQC.ScannerWindow.iFrameOnLoadEventFired();
        }, true);
    }
    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventTimeOutTimerID);
    clearTimeout(blr.W15yQC.ScannerWindow.iFrameOnLoadEventFilterTimerID);

    if(blr.W15yQC.ScannerWindow.stateWaitingOnUrlToLoad==true) { 
      blr.W15yQC.ScannerWindow.stateWaitingOnUrlToLoad=false; 
      setTimeout(function(){blr.W15yQC.ScannerWindow.iFrameLoaded();}, 500);
    }
  },
  
  stopScanning: function() {
    blr.W15yQC.ScannerWindow.stateStopScanningRequested=true;
    blr.W15yQC.ScannerWindow.fnUpdateStatus('Stop scanning requested.');
    blr.W15yQC.ScannerWindow.updateControlStates();
  },
  
  parseRecentFiles: function() {
    var srf=Application.prefs.getValue("extensions.W15yQC.Scanner.RecentFiles",null);
    if(srf !=null && srf.length && srf.length>0) {
      return srf.split('|');
    }
    return null;
  },
  
  addFileToRecentList: function(fileName) {
    var rf=blr.W15yQC.ScannerWindow.parseRecentFiles(),i;
    if(rf==null) {
      Application.prefs.setValue("extensions.W15yQC.Scanner.RecentFiles",fileName);
    } else if(rf && rf.length && rf.length>0) {
      if(rf.length>10) {
        rf=rf.slice(1);
      }
      for(i=0;i<rf.length;i++) {
        if(rf[i]==fileName) { rf.splice(i,1); }
      }
      rf.push(fileName);
      Application.prefs.setValue("extensions.W15yQC.Scanner.RecentFiles",rf.join('|'));
    }
  },
  
  readRecentFileList: function() {
    var recentFilesMenu=document.getElementById('recentFiles-menupopup'),
      rf=blr.W15yQC.ScannerWindow.parseRecentFiles(), menuItem, i;
    if(recentFilesMenu) {
      while (recentFilesMenu.firstChild) {
        recentFilesMenu.removeChild(recentFilesMenu.firstChild);
      }
      if(rf && rf.length) {
        for(i=0;i<rf.length;i++) {
          menuItem=document.createElement('menuitem');
          menuItem.setAttribute('label',rf[i]);
          menuItem.setAttribute('oncommand','blr.W15yQC.ScannerWindow.openProject(\''+rf[i]+'\')');
          if(recentFilesMenu) recentFilesMenu.insertBefore(menuItem, recentFilesMenu.firstChild);
        }
      }
    }
  },
  
  openSelectedURL: function() {
    var treebox = document.getElementById('treebox'), selectedRow;
    
    blr.W15yQC.ScannerWindow.updateControlStates();
    selectedRow = treebox.currentIndex;
    if (selectedRow >= 0) {
      window.open(blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.urlDisplayOrder[selectedRow]].loc);
    }
  },
  
  updateNotesField: function () {
    var treebox = document.getElementById('treebox'),
      iframeHolder = document.getElementById('iFrameHolder'),
      textbox = document.getElementById('note-text'),
      scannerIFrame = document.getElementById('pageBeingScannedIFrame'),
      selectedRow, rows;

    blr.W15yQC.ScannerWindow.updateControlStates();
    if(blr.W15yQC.ScannerWindow.stateScanning==false) {
      if(textbox==null) {
        textbox=document.createElement('textbox');
        iframeHolder.insertBefore(textbox,scannerIFrame);
      }
      if(scannerIFrame!=null && scannerIFrame.parentNode) {
        scannerIFrame.parentNode.removeChild(scannerIFrame);
      }
      
      selectedRow = treebox.currentIndex;
      if (blr.W15yQC.ScannerWindow.urlList != null && iframeHolder != null &&
          (selectedRow != null && selectedRow >= 0 && selectedRow < blr.W15yQC.ScannerWindow.urlList.length)) {
        if (blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.urlDisplayOrder[selectedRow]].windowDescription != null) {
          textbox.value = blr.W15yQC.ScannerWindow.urlList[blr.W15yQC.ScannerWindow.urlDisplayOrder[selectedRow]].windowDescription;
        } else {
          textbox.value = '';
        }
      }
    }
  },
  
  setProjectSettings: function() {
    var newURL = new blr.W15yQC.ProjectURL(),
      dialogID = 'scannerProjectSettingsDialog',
      dialogPath = 'chrome://W15yQC/content/scannerProjectSettingsDialog.xul';
    if(blr.W15yQC.ScannerWindow.stateScanning==false) {
      blr.W15yQC.ScannerWindow.bManualURLAdd=true;
      window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr);
      document.title=blr.W15yQC.fnJoin(blr.W15yQC.ScannerWindow.sProjectTitle,'Scanner - W15yQC',' - ');
    }
    blr.W15yQC.ScannerWindow.updateControlStates();
  },
  
  addNewURL: function () {
    var newURL = new blr.W15yQC.ProjectURL(),
      dialogID = 'addScannerURLDialog',
      dialogPath = 'chrome://W15yQC/content/addScannerURLDialog.xul';
    if(blr.W15yQC.ScannerWindow.stateScanning==false) {
      blr.W15yQC.ScannerWindow.bManualURLAdd=true;
      window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr, newURL);
      if(newURL != null && newURL.loc !=null) {
        blr.W15yQC.ScannerWindow.addUrlToProject(newURL.loc,null,newURL.source,newURL.priority,newURL.dontParseForLinks);
        blr.W15yQC.ScannerWindow.updateUrlInTree(blr.W15yQC.ScannerWindow.urlList.length-1);
      }
    }
    blr.W15yQC.ScannerWindow.bManualURLAdd=false;
    blr.W15yQC.ScannerWindow.updateControlStates();
},

  scanSelectedURL: function() {
    var treebox = document.getElementById('treebox'),
      iframeHolder = document.getElementById('iFrameHolder'),
      textbox = document.getElementById('note-text'),
      scannerIFrame = document.getElementById('pageBeingScannedIFrame'),
      selectedRow, rows,
      editURL = new blr.W15yQC.ProjectURL(),
      dialogID = 'addScannerURLDialog',
      dialogPath = 'chrome://W15yQC/content/addScannerURLDialog.xul';

    if(blr.W15yQC.ScannerWindow.stateScanning==false) {
      selectedRow = treebox.currentIndex;
      if (blr.W15yQC.ScannerWindow.urlList != null && selectedRow != null && selectedRow >= 0 && selectedRow < blr.W15yQC.ScannerWindow.urlList.length) {
        blr.W15yQC.ScannerWindow.setStateAsScanning();
        blr.W15yQC.ScannerWindow.stateCurrentIndex=selectedRow-1;
        blr.W15yQC.ScannerWindow.stateScanningOneLink=true;
        blr.W15yQC.ScannerWindow.stateScanningAllLinks=true;
        blr.W15yQC.ScannerWindow.scanNextLink();
      }
    }
    
  },

  editSelectedURL: function() {
    var treebox = document.getElementById('treebox'),
      iframeHolder = document.getElementById('iFrameHolder'),
      textbox = document.getElementById('note-text'),
      scannerIFrame = document.getElementById('pageBeingScannedIFrame'),
      selectedRow, rows,
      editURL = new blr.W15yQC.ProjectURL(),
      dialogID = 'addScannerURLDialog',
      dialogPath = 'chrome://W15yQC/content/addScannerURLDialog.xul';

    if(blr.W15yQC.ScannerWindow.stateScanning==false) {
      blr.W15yQC.ScannerWindow.bManualURLAdd=true;
      if(textbox==null) {
        textbox=document.createElement('textbox');
        iframeHolder.insertBefore(textbox,scannerIFrame);
      }
      if(scannerIFrame!=null) {
        iframeHolder.removeChild(scannerIFrame);
      }
      
      selectedRow = treebox.currentIndex;
      if (blr.W15yQC.ScannerWindow.urlList != null && selectedRow != null && selectedRow >= 0 && selectedRow < blr.W15yQC.ScannerWindow.urlList.length) {
        editURL.loc=blr.W15yQC.ScannerWindow.urlList[selectedRow].loc;
        editURL.priority=blr.W15yQC.ScannerWindow.urlList[selectedRow].priority;
        editURL.dontParseForLinks=blr.W15yQC.ScannerWindow.urlList[selectedRow].dontParseForLinks;
        window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen,modal',blr, editURL);
        if(editURL != null && editURL.loc !=null) {
          blr.W15yQC.ScannerWindow.urlList[selectedRow].loc=editURL.loc;
          blr.W15yQC.ScannerWindow.urlList[selectedRow].priority=editURL.priority;
          blr.W15yQC.ScannerWindow.urlList[selectedRow].dontParseForLinks=editURL.dontParseForLinks;
          blr.W15yQC.ScannerWindow.urlList[selectedRow].source=editURL.source;
          blr.W15yQC.ScannerWindow.updateUrlInTree(selectedRow);
        }
      }
    }
    blr.W15yQC.ScannerWindow.bManualURLAdd=false;
    blr.W15yQC.ScannerWindow.updateControlStates();
  },
  
  deleteSelectedURL: function() {
    var treebox = document.getElementById('treebox'),
      iframeHolder = document.getElementById('iFrameHolder'),
      textbox = document.getElementById('note-text'),
      scannerIFrame = document.getElementById('pageBeingScannedIFrame'),
      selectedRow, rows;

    if(blr.W15yQC.ScannerWindow.stateScanning==false) {
      if(textbox==null) {
        textbox=document.createElement('textbox');
        iframeHolder.insertBefore(textbox,scannerIFrame);
      }
      if(scannerIFrame!=null) {
        iframeHolder.removeChild(scannerIFrame);
      }
      
      selectedRow = treebox.currentIndex;
      if (blr.W15yQC.ScannerWindow.urlList != null && selectedRow != null && selectedRow >= 0 && selectedRow < blr.W15yQC.ScannerWindow.urlList.length) {
        blr.W15yQC.ScannerWindow.urlList.splice(selectedRow,1);
        blr.W15yQC.ScannerWindow.updateProjectDisplay();
        blr.W15yQC.ScannerWindow.selectRow(selectedRow-1,true);
        blr.W15yQC.ScannerWindow.selectRow(selectedRow,true);
      }
    }
    blr.W15yQC.ScannerWindow.bManualURLAdd=false;
    blr.W15yQC.ScannerWindow.updateControlStates();
  },
  
  doClose: function() {
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService), result;
    if(blr.W15yQC.ScannerWindow.stateScanning==false) {
      if(blr.W15yQC.ScannerWindow.projectHasUnsavedChanges==true) {
        result = prompts.confirm(null, "Scanner Project Has Unsaved Changes", "Exit without saving?");
        return false;
      }
      window.close();
      return true;
    }
    return false;
  },

  sortTreeAsNumberOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.ScannerWindow.urlList, order=blr.W15yQC.ScannerWindow.urlDisplayOrder;
    if(ascending==true) {
      for(i=0;i<list.length;i++) {
        for(j=i+1;j<list.length;j++) {
          if(list[order[i]][index]>list[order[j]][index] || (list[order[i]][index]==list[order[j]][index] && order[i]>order[j])) {
            temp=order[i];
            order[i]=order[j];
            order[j]=temp;
          }
        }
      }
    } else {
      for(i=0;i<list.length;i++) {
        for(j=i+1;j<list.length;j++) {
          if(list[order[i]][index]<list[order[j]][index] || (list[order[i]][index]==list[order[j]][index] && order[i]>order[j])) {
            temp=order[i];
            order[i]=order[j];
            order[j]=temp;
          }
        }
      }
    }
  },

  sortTreeAsStringOn: function(index, ascending) {
    var i,j,temp,list=blr.W15yQC.ScannerWindow.urlList, order=blr.W15yQC.ScannerWindow.urlDisplayOrder;
    if(ascending!=true) {
      for(i=0;i<list.length;i++) {
        for(j=i+1;j<list.length;j++) {
          if((list[order[i]][index]==null ? '' : list[order[i]][index].toLowerCase()) > (list[order[j]][index]==null ? '' : list[order[j]][index].toLowerCase()) || ((list[order[i]][index]==null ? '' : list[order[i]][index].toLowerCase())==(list[order[j]][index]==null ? '' : list[order[j]][index].toLowerCase()) && order[i]>order[j])) {
            temp=order[i];
            order[i]=order[j];
            order[j]=temp;
          }
        }
      }
    } else {
      for(i=0;i<list.length;i++) {
        for(j=i+1;j<list.length;j++) {
          if((list[order[i]][index]==null ? '' : list[order[i]][index].toLowerCase()) < (list[order[j]][index]==null ? '' : list[order[j]][index].toLowerCase()) || ((list[order[i]][index]==null ? '' : list[order[i]][index].toLowerCase())==(list[order[j]][index]==null ? '' : list[order[j]][index].toLowerCase()) && order[i]>order[j])) {
            temp=order[i];
            order[i]=order[j];
            order[j]=temp;
          }
        }
      }
    }
  },
  
  sortTree: function(col) {
    var sortDir=/^a/i.test(col.getAttribute('sortDirection')),
      colID=col.getAttribute('id'), i, tree=document.getElementById('treebox');
    for(i=0;i<tree.columns.length;i++) {
      if(/^a/.test(tree.columns.getColumnAt(i).element.getAttribute('sortDirection'))) {
        tree.columns.getColumnAt(i).element.setAttribute('sortDirection','a');
      } else {
        tree.columns.getColumnAt(i).element.setAttribute('sortDirection','d');
      }
    }
    blr.W15yQC.ScannerWindow.updateDisplayOrderArray();
    switch(colID) {
      case 'col-header-number':
        blr.W15yQC.ScannerWindow.urlDisplayOrder=[];
        blr.W15yQC.ScannerWindow.updateDisplayOrderArray();
        break;
      case 'col-header-url':
        blr.W15yQC.ScannerWindow.sortTreeAsStringOn('loc',sortDir);
        break;
      case 'col-header-title':
        blr.W15yQC.ScannerWindow.sortTreeAsStringOn('windowTitle',sortDir);
        break;
      case 'col-header-priority':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('priority',sortDir);
        break;
      case 'col-header-source':
        blr.W15yQC.ScannerWindow.sortTreeAsStringOn('source',sortDir);
        break;
      case 'col-header-linkDepth':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('linkDepth',sortDir);
        break;
      case 'col-header-dateScanned':
        blr.W15yQC.ScannerWindow.sortTreeAsDateOn('dateScanned',sortDir);
        break;
      case 'col-header-MIMEtype':
        blr.W15yQC.ScannerWindow.sortTreeAsStringOn('contentType',sortDir);
        break;
      case 'col-header-results-items':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('itemsCount',sortDir);
        break;
      case 'col-header-results-warnings':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('warningsCount',sortDir);
        break;
      case 'col-header-results-failures':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('failuresCount',sortDir);
        break;
      case 'col-header-results-score':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('score',sortDir);
        break;
      case 'col-header-results-text':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('textSize',sortDir);
        break;
      case 'col-header-results-d':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('downloadsCount',sortDir);
        break;
      case 'col-header-results-F':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('framesCount',sortDir);
        break;
      case 'col-header-results-fw':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('framesWarnings',sortDir);
        break;
      case 'col-header-results-ff':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('framesFailures',sortDir);
        break;
      case 'col-header-results-h':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('headingsCount',sortDir);
        break;
      case 'col-header-results-hw':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('headingsWarnings',sortDir);
        break;
      case 'col-header-results-hf':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('headingsFailures',sortDir);
        break;
      case 'col-header-results-al':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('ARIALandmarksCount',sortDir);
        break;
      case 'col-header-results-alw':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('ARIALandmarksWarnings',sortDir);
        break;
      case 'col-header-results-alf':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('ARIALandmarksFailures',sortDir);
        break;
      case 'col-header-results-a':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('ARIAElementsCount',sortDir);
        break;
      case 'col-header-results-aw':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('ARIAElementsWarnings',sortDir);
        break;
      case 'col-header-results-af':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('ARIAElementsFailures',sortDir);
        break;
      case 'col-header-results-l':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('linksCount',sortDir);
        break;
      case 'col-header-results-lw':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('linksWarnings',sortDir);
        break;
      case 'col-header-results-lf':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('linksFailures',sortDir);
        break;
      case 'col-header-results-i':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('imagesCount',sortDir);
        break;
      case 'col-header-results-iw':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('imagesWarnings',sortDir);
        break;
      case 'col-header-results-if':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('imagesFailures',sortDir);
        break;
      case 'col-header-results-fc':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('formControlsCount',sortDir);
        break;
      case 'col-header-results-fcw':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('formControlsWarnings',sortDir);
        break;
      case 'col-header-results-fcf':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('formControlsFailures',sortDir);
        break;
      case 'col-header-results-ak':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('accessKeysCount',sortDir);
        break;
      case 'col-header-results-akw':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('accessKeysWarnings',sortDir);
        break;
      case 'col-header-results-akf':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('accessKeysFailures',sortDir);
        break;
      case 'col-header-results-t':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('tablesCount',sortDir);
        break;
      case 'col-header-results-tw':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('tablesWarnings',sortDir);
        break;
      case 'col-header-results-tf':
        blr.W15yQC.ScannerWindow.sortTreeAsNumberOn('tablesFailures',sortDir);
        break;
      default:
        alert('unhandled sort column');
    }
    col.setAttribute('sortDirection',sortDir ? 'descending' : 'ascending');
    blr.W15yQC.ScannerWindow.updateProjectDisplay();
    blr.W15yQC.ScannerWindow.updateControlStates();
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
  this.linkDepth = 0;
  if(priority != null && !isNaN(parseFloat(priority))) {
    this.priority = parseFloat(priority);
  } else {
    this.priority = 1.0;
  }
  this.dontParseForLinks=false;
  this.dateScanned=null;
  this.contentType=null;
  this.windowTitle=null;
  this.windowTitleNotUnique=false;
  this.itemsCount=null;
  this.warningsCount=null;
  this.failuresCount=null;
  this.score=null;
  this.textSize=null;
  this.downloadsCount=null;
  this.accessKeysCount=null;
  this.accessKeysWarnings=null;
  this.accessKeysFailures=null;
  this.ARIALandmarksCount=null;
  this.ARIALandmarksWarnings=null;
  this.ARIALandmarksFailures=null;
  this.ARIAElementsCount=null;
  this.ARIAElementsWarnings=null;
  this.ARIAElementsFailures=null;
  this.headingsCount=null;
  this.headingsWarnings=null;
  this.headingsFailures=null;
  this.framesCount=null;
  this.framesWarnings=null;
  this.framesFailures=null;
  this.linksCount=null;
  this.linksWarnings=null;
  this.linksFailures=null;
  this.imagesCount=null;
  this.imagesWarnings=null;
  this.imagesFailures=null;
  this.formControlsCount=null;
  this.formControlsWarnings=null;
  this.formControlsFailures=null;
  this.tablesCount=null;
  this.tablesWarnings=null;
  this.tablesFailures=null;
  this.windowDescription=null;
};

blr.W15yQC.ProjectURL.prototype = {
  loc: null,
  source: null,
  linkDepth: 0,
  priority: 1.0,
  dontParseForLinks: false,
  dateScanned: null,
  contentType: null,
  windowTitle: null,
  windowTitleNotUnique: null,
  itemsCount: null,
  warningsCount: null,
  failuresCount: null,
  score: null,
  textSize: null,
  downloadsCount: null,
  accessKeysCount: null,
  accessKeysWarnings: null,
  accessKeysFailures: null,
  ARIALandmarksCount: null,
  ARIALandmarksWarnings: null,
  ARIALandmarksFailures: null,
  ARIAElementsCount: null,
  ARIAElementsWarnings: null,
  ARIAElementsFailures: null,
  headingsCount: null,
  headingsWarnings: null,
  headingsFailures: null,
  framesCount: null,
  framesWarnings: null,
  framesFailures: null,
  linksCount: null,
  linksWarnings: null,
  linksFailures: null,
  imagesCount: null,
  imagesWarnings: null,
  imagesFailures: null,
  formControlsCount: null,
  formControlsWarnings: null,
  formControlsFailures: null,
  tablesCount: null,
  tablesWarnings: null,
  tablesFailures: null,
  windowDescription: null
};
