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

 * File:        addEditMandateTestDialog.js
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
 * Object:  addEditMandateTestDialog
 * Returns:
 */
blr.W15yQC.addEditMandateTestDialog = {
  d: {},
  ok: false,

  checkFields: function() {
    blr.W15yQC.addEditMandateTestDialog.ok=blr.W15yQC.fnStringHasContent(document.getElementById('tbXPath').value)||blr.W15yQC.fnStringHasContent(document.getElementById('tbText').value);
  },

  doOK: function() {
    blr.W15yQC.addEditMandateTestDialog.checkFields();
    if(blr.W15yQC.addEditMandateTestDialog.ok==true) { 
      blr.W15yQC.addEditMandateTestDialog.d.xPath=document.getElementById('tbXPath').value;
      blr.W15yQC.addEditMandateTestDialog.d.text=document.getElementById('tbText').value;
      blr.W15yQC.addEditMandateTestDialog.d.bRegEx=document.getElementById('cbTreatAsRegex').checked;
      return true;
    } else {
      alert('You must supply at least a valid xPath value, text to match, or both. Correct and try again, or cancel to exit.');
    }
    return false;
  },

  doCancel: function() {
    blr.W15yQC.addEditMandateTestDialog.d=null;
    blr.W15yQC.addEditMandateTestDialog.ok=false;
    return true;
  }
};
