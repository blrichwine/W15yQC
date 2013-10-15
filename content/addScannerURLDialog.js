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

 * File:        addScannerURLDialog.js
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
 *
 *  Scanner: addURL
 *    URL
 *    Priority
 *    Don't scan for URLs
 *
 *
 * TODO:
 *
 *
 */
"use strict";

/*
 * Object:  AddScannerURLDialog
 * Returns:
 */

blr.W15yQC.AddScannerURLDialog = {
  tbURL: null,
  tbPriority: null,
  cbDontAdd: null,
  inURL: null,
  bFieldsAreOK:false,
  bUrlOK:false,
  bPriorityOK:false,
  bURLHasChanged:false,
  bValuesHaveChanged:false,

  init: function (dialog) {
    dialog.buttonlabelaccept="asdf";
    blr.W15yQC.AddScannerURLDialog.tbURL= document.getElementById('tbURL');
    blr.W15yQC.AddScannerURLDialog.tbPriority= document.getElementById('tbPriority');
    blr.W15yQC.AddScannerURLDialog.cbDontAdd= document.getElementById('cbDontAdd');
    if(blr.W15yQC.AddScannerURLDialog.inURL!=null) {
      if(blr.W15yQC.AddScannerURLDialog.inURL.dontParseForLinks==true) {
        blr.W15yQC.AddScannerURLDialog.cbDontAdd.checked=true;
      } else {
        blr.W15yQC.AddScannerURLDialog.cbDontAdd.checked=false;
      }
      if(blr.W15yQC.AddScannerURLDialog.inURL.loc) { blr.W15yQC.AddScannerURLDialog.tbURL.value=blr.W15yQC.AddScannerURLDialog.inURL.loc; }
      blr.W15yQC.AddScannerURLDialog.tbPriority.value=blr.W15yQC.AddScannerURLDialog.inURL.priority;
    }
    blr.W15yQC.AddScannerURLDialog.checkFields();
  },

  fnAppearsToBeFullyQualifiedURL: function (sURL) { alert('test'); // TODO: QA THIS!!!
    if (sURL != null && sURL.match(/[a-z]+:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/i)) {
      return true;
    }
    return false;
  },

  fnTrim: function (str) {
    if(str != null && str.replace) { return str.replace(/^\s*|\s*$/g, ''); }
    return str;
  },

  checkFields: function() {
    var sPriority;
    blr.W15yQC.AddScannerURLDialog.bUrlOK=/[a-z]+:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/i.test(blr.W15yQC.AddScannerURLDialog.tbURL.value);
    sPriority=blr.W15yQC.AddScannerURLDialog.fnTrim(blr.W15yQC.AddScannerURLDialog.tbPriority.value);

    if(/^[0-9\.]+$/.test(sPriority) && !isNaN(parseFloat(sPriority))) {
      sPriority=parseFloat(sPriority);
      if(!/\./.test(sPriority)) { sPriority=sPriority+'.0'};
      blr.W15yQC.AddScannerURLDialog.tbPriority.value=sPriority;
      blr.W15yQC.AddScannerURLDialog.bPriorityOK=true;
    } else {
      blr.W15yQC.AddScannerURLDialog.bPriorityOK=false;
    }
    if(blr.W15yQC.AddScannerURLDialog.inURL && blr.W15yQC.AddScannerURLDialog.fnTrim(blr.W15yQC.AddScannerURLDialog.tbURL.value)==
       blr.W15yQC.AddScannerURLDialog.fnTrim(blr.W15yQC.AddScannerURLDialog.inURL.loc)) {
      blr.W15yQC.AddScannerURLDialog.bURLHasChanged=false;
      blr.W15yQC.AddScannerURLDialog.bValuesHaveChanged=false;
    } else {
      blr.W15yQC.AddScannerURLDialog.bURLHasChanged=true;
      blr.W15yQC.AddScannerURLDialog.bValuesHaveChanged=true;
    }
    if(blr.W15yQC.AddScannerURLDialog.inURL!=null && (blr.W15yQC.AddScannerURLDialog.inURL.priority!=sPriority || blr.W15yQC.AddScannerURLDialog.inURL.dontParseForLinks!=blr.W15yQC.AddScannerURLDialog.cbDontAdd.checked)) {
      blr.W15yQC.AddScannerURLDialog.bValuesHaveChanged=true;
    }
    blr.W15yQC.AddScannerURLDialog.bFieldsAreOK=blr.W15yQC.AddScannerURLDialog.bPriorityOK && blr.W15yQC.AddScannerURLDialog.bUrlOK;
  },

  doOK: function() {
    blr.W15yQC.AddScannerURLDialog.checkFields();
    if(blr.W15yQC.AddScannerURLDialog.bFieldsAreOK==true) {
      if(blr.W15yQC.AddScannerURLDialog.bURLHasChanged==true) {
        blr.W15yQC.AddScannerURLDialog.inURL.loc=blr.W15yQC.AddScannerURLDialog.tbURL.value;
        blr.W15yQC.AddScannerURLDialog.inURL.source='Manual';
      }
      if(blr.W15yQC.AddScannerURLDialog.bValuesHaveChanged==true) {
        blr.W15yQC.AddScannerURLDialog.inURL.priority=parseFloat(blr.W15yQC.AddScannerURLDialog.tbPriority.value);
        blr.W15yQC.AddScannerURLDialog.inURL.dontParseForLinks=blr.W15yQC.AddScannerURLDialog.cbDontAdd.checked;
      } else {
        blr.W15yQC.AddScannerURLDialog.inURL=null;
      }
      return true;
    } else {
      if(blr.W15yQC.AddScannerURLDialog.bUrlOK!=true) {
        alert('URL appears to be invalid. Fix URL or select Cancel to exit.');
      } else if(blr.W15yQC.AddScannerURLDialog.bPriorityOK!=true) {
        alert('Priority value is not a valid floating point number. Fix priority value or select Cancel to exit.');
      } else {
        alert('What?');
      }
    }
    return false;
  },

  doCancel: function() {
    blr.W15yQC.AddScannerURLDialog.inURL=null;
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

