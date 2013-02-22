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

 * File:        addScannerURLMatchSpecDialog.js
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

blr.W15yQC.addScannerURLMatchSpecDialog = {
   d: null,
   ok: false,
   
   init: function() {
    if(blr.W15yQC.addScannerURLMatchSpecDialog.d!=null) {
      document.getElementById('tbMatchSpec').value=blr.W15yQC.addScannerURLMatchSpecDialog.d.matchSpec;
      document.getElementById('cbIsRegEx').checked=blr.W15yQC.addScannerURLMatchSpecDialog.d.matchTypeIsRegEx;
    }
    blr.W15yQC.addScannerURLMatchSpecDialog.checkFields();
   },
   
   checkFields: function() {
    var tbTestString=document.getElementById('tbTestString'),
        sMatchSpec=blr.W15yQC.fnTrim(document.getElementById('tbMatchSpec').value),
        sTest=tbTestString.value,
        regEx=null, bMatch=false;

    if(sMatchSpec!=null && sMatchSpec.length>0) {
      if(document.getElementById('cbIsRegEx').checked==true) {
        try {
          regEx=new RegExp(sMatchSpec);
          blr.W15yQC.addScannerURLMatchSpecDialog.ok=true;
          if(regEx!=null) {
            if(sTest!=null && sTest.length>0) {
              if(regEx.test(sTest,"i")) {
                bMatch=true; 
              }
            }
          } else {
            blr.W15yQC.addScannerURLMatchSpecDialog.ok=false;
          }
        } catch(ex) {
          blr.W15yQC.addScannerURLMatchSpecDialog.ok=false;
        }
      } else {
        blr.W15yQC.addScannerURLMatchSpecDialog.ok=true;
        if(sTest!=null && sTest.length>0) {
          if((sTest.toLowerCase()).indexOf(sMatchSpec.toLowerCase())>=0) {
            bMatch=true; 
          }
        }
      }
    } else {
      blr.W15yQC.addScannerURLMatchSpecDialog.ok=false;
    }
    
    if(bMatch==true && blr.W15yQC.addScannerURLMatchSpecDialog.ok==true) {
      document.getElementById('testStringLabel').value="Test String (Matches):";
    } else {
      document.getElementById('testStringLabel').value="Test String (Does Not Match):";
    }

    if(document.getElementById('cbIsRegEx').checked==true) {
      if(blr.W15yQC.addScannerURLMatchSpecDialog.ok==true) {
        document.getElementById('matchSpecLabel').value="Match Spec (Valid Regular Expression):";
      } else {
        document.getElementById('matchSpecLabel').value="Match Spec (Invalid Regular Expression):";
      }
    } else {
      if(blr.W15yQC.addScannerURLMatchSpecDialog.ok==true) {
        document.getElementById('matchSpecLabel').value="Match Spec (Valid):";
      } else {
        document.getElementById('matchSpecLabel').value="Match Spec (Invalid):";
      }
    }
   },

   doOK: function() {
      blr.W15yQC.addScannerURLMatchSpecDialog.checkFields();
      if(blr.W15yQC.addScannerURLMatchSpecDialog.ok==true) {        
        blr.W15yQC.addScannerURLMatchSpecDialog.d.matchSpec=blr.W15yQC.fnTrim(document.getElementById('tbMatchSpec').value);
        blr.W15yQC.addScannerURLMatchSpecDialog.d.matchTypeIsRegEx=document.getElementById('cbIsRegEx').checked;
        return true;
      }
      return false;
   },

   doCancel: function() {
      blr.W15yQC.addScannerURLMatchSpecDialog.d.matchSpec=null;
      return true;
   }
};
