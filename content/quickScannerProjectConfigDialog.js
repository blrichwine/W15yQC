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

 * File:        quickScannerProjectConfigDialog.js
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

blr.W15yQC.quickScannerProjectConfigDialog = {
   projectQuickSettings: null,
   ok: false,

   init: function() {
      var sMatch='';
      if(blr.W15yQC.quickScannerProjectConfigDialog.projectQuickSettings!=null) {
        if (blr.W15yQC.quickScannerProjectConfigDialog.projectQuickSettings.sURL!=null) {
          document.getElementById('tbRootURL').value=blr.W15yQC.quickScannerProjectConfigDialog.projectQuickSettings.sURL;
        } else {
          document.getElementById('tbRootURL').value='';
        }

        if (blr.W15yQC.quickScannerProjectConfigDialog.projectQuickSettings.sURL!=null) {
           sMatch=blr.W15yQC.quickScannerProjectConfigDialog.projectQuickSettings.sURL.replace(/^\w+:\/\//,'').replace(/[#\?].+$/,'').replace(/\/([\w %_-]+\.)+\w+$/,'/');
           document.getElementById('tbMatchSpec').value=sMatch;
        } else {
          document.getElementById('tbMatchSpec').value='';
        }

      }
      blr.W15yQC.quickScannerProjectConfigDialog.checkFields();
   },

   checkFields: function() {
      var sRootURL=document.getElementById('tbRootURL').value;

      blr.W15yQC.quickScannerProjectConfigDialog.ok=blr.W15yQC.fnAppearsToBeFullyQualifiedURL(sRootURL);
   },

   doOK: function() {
      blr.W15yQC.quickScannerProjectConfigDialog.checkFields();
      if(blr.W15yQC.quickScannerProjectConfigDialog.ok==true) {
        blr.W15yQC.quickScannerProjectConfigDialog.projectQuickSettings.sURL=blr.W15yQC.fnTrim(document.getElementById('tbRootURL').value);
        blr.W15yQC.quickScannerProjectConfigDialog.projectQuickSettings.matchSpec=blr.W15yQC.fnTrim(document.getElementById('tbMatchSpec').value);
        blr.W15yQC.quickScannerProjectConfigDialog.projectQuickSettings.matchTypeIsRegEx=false;
        return true;
      }
      alert('Does not appear to be a valid fully qualified URL');
      return false;
   },

   doCancel: function() {
      blr.W15yQC.quickScannerProjectConfigDialog.projectQuickSettings.sURL=null;
      return true;
   }
};
