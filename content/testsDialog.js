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

 * File:        testsDialog.js
 * Description: Handles initiating and displaying unit tests
 * Author:	Brian Richwine
 * Created:	2015.02.21
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
 * Object:  QuickW15yBadIDsDialog
 * Returns:
 */
blr.W15yQC.testsDialog = {

  iFrameLoaded:false,
  iFrameTimedOut:false,

  iFrameOnLoadEventFired: function() {
    blr.W15yQC.testsDialog.iFrameLoaded=true;
  },

  init: function (dialog) {
    blr.W15yQC.fnReadUserPrefs();
    dialog.fnUpdateProgress('Ready',null);
  },


  runTests: function() {
    var iFrame=document.getElementById('pageBeingScannedIFrame');

    function assert(message, expr) {
      if (!expr) {
        throw new Error('Assert failure: '+message);
      }
      assert.count++;
      return true;
    }
    assert.count=0;

    function output(text, color) {
      var rd=document.getElementById('outputIFrame').contentDocument;
      var p=rd.createElement('p');
      p.appendChild(rd.createTextNode(text));
      p.style.color=color?color:'#0c0';
      rd.body.appendChild(p);
    }

    function outputHR() {
      var rd=document.getElementById('outputIFrame').contentDocument;
      var hr=rd.createElement('hr');
      rd.body.appendChild(hr);
    }

    function loadURLInIFrame(sURL) {
      var iFrameHolder = document.getElementById('iFrameHolder');
      iFrame = document.getElementById('pageBeingScannedIFrame');
      if(iFrame != null) {
        // remove iFrame
        if(iFrame.contentDocument && iFrame.contentDocument.documentElement) {
          iFrame.contentDocument.removeChild(iFrame.contentDocument.documentElement);
          Components.utils.forceShrinkingGC();
        }
        iFrame.parentNode.removeChild(iFrame);
        Components.utils.forceShrinkingGC();
      }
      blr.W15yQC.testsDialog.iFrameLoaded=false;
      blr.W15yQC.testsDialog.iFrameTimedOut=false;
      iFrame=document.createElement('iframe');
      iFrame.setAttribute('id','pageBeingScannedIFrame');
      iFrame.setAttribute('type','content');
      iFrame.setAttribute('flex','1');
      iFrame.setAttribute('style','overflow:auto');
      iFrame.setAttribute('src',sURL);
      iFrame.addEventListener("load", function(e) {
          blr.W15yQC.testsDialog.iFrameOnLoadEventFired();
        }, true);
      iFrameHolder.appendChild(iFrame);
      setTimeout(function(){blr.W15yQC.testsDialog.iFrameTimedOut=true;},5000);
      blr.W15yQC.fnDoEvents();
      while(!blr.W15yQC.testsDialog.iFrameLoaded) {
        blr.W15yQC.fnDoEvents();
        blr.W15yQC.fnDoEvents();
        blr.W15yQC.fnDoEvents();
        if (blr.W15yQC.testsDialog.iFrameTimedOut) {
          throw new Error('loadURLInIFrame('+sURL+') failed to load');
        }
        blr.W15yQC.fnDoEvents();
        blr.W15yQC.fnDoEvents();
        blr.W15yQC.fnDoEvents();
      }
    }

    function testCase(name, tests) {
      var successful=0;
      var testCount=0;
      var start = new Date().getTime();
      assert.count=0;

      output('Begin: '+name);
      try{
        if (typeof tests.setUp == 'function') {
          tests.setUp();
        }
        for(var test in tests) {
          if (!/^test/.test(test)) {
            continue;
          }
          testCount++;
          try{
            tests[test]();
            output(test);
            successful++;
          } catch(e) {
            output(test+' failed: '+e.toString(), '#c00');
          }
        }
        try{
          if (typeof tests.tearDown == 'function') {
            tests.tearDown();
          }
        } catch(e) {
          output('tearDown for '+test+' failed: '+e.message, '#c00');
        }
      } catch(e) {
        output('setUp for '+test+' failed: '+e.message, '#c00');
      }
      var end = new Date().getTime();
      output('End: '+name+' ('+(end-start)+' ms)');
      output(testCount+' tests, '+(testCount-successful)+' failures.',successful==testCount?'#0c0':'#c00');
      outputHR();
    }

    testCase("blr.W15yQC.crc32 function test", {
      "test making crc32 of a string": function() {
        var crc=blr.W15yQC.crc32('test');
        assert("crc32('test') should return 3632233996 but got "+crc, crc==3632233996);
      }
    });

    testCase("blr.W15yQC.fnIsValidLocale function test", {
      "test fnIsValidLocale of null": function() {
        assert("blr.W15yQC.fnIsValidLocale(null) should return false.", blr.W15yQC.fnIsValidLocale(null)===false);
      },
      "test fnIsValidLocale of en": function() {
        assert("blr.W15yQC.fnIsValidLocale('en') should return true.", blr.W15yQC.fnIsValidLocale('en')===true);
      },
      "test fnIsValidLocale of EN": function() {
        assert("blr.W15yQC.fnIsValidLocale('EN') should return true.", blr.W15yQC.fnIsValidLocale('EN')===true);
      },
      "test fnIsValidLocale of en-US": function() {
        assert("blr.W15yQC.fnIsValidLocale('en-US') should return true.", blr.W15yQC.fnIsValidLocale('en-US')===true);
      },
      "test fnIsValidLocale of en_US": function() {
        assert("blr.W15yQC.fnIsValidLocale('en_US') should return false.", blr.W15yQC.fnIsValidLocale('en_US')===false);
      }
    });

    testCase("link tests", {
      "test ": function() {
          loadURLInIFrame('chrome://w15yqc/content/linkTests01.html');
          var oW15yQCResults=blr.W15yQC.fnScannerInspect(iFrame.contentDocument, blr.W15yQC.testsDialog);
          iFrame.setAttribute('src','about:blank');
      }
    });
  },

  updateControlStates: function() {

  },

  cleanup: function () {
  },

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
      document.getElementById('progressMeterLabel').value=sLabel;
    }
    if(fPercentage != null) {
      document.getElementById('progressMeter').value=fPercentage;
    }
    blr.W15yQC.fnDoEvents();
  },

  focus: function() {
    
  },

  windowOnKeyDown: function (dialog, evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.badIDsDialog.bCmdIsPressed = true;
        break;
      case 27:
        dialog.close();
        break;
      case 87:
        if (blr.W15yQC.badIDsDialog.bCmdIsPressed == true) {
            evt.stopPropagation();
            evt.preventDefault();
            blr.W15yQC.badIDsDialog.cleanup();
            dialog.close();
        }
        break;
    }
  },

  windowOnKeyUp: function (evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.badIDsDialog.bCmdIsPressed = false;
        break;
    }
  }

};
