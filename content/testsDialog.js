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
  iTotalTests:0,
  iTotalTestFailures:0,

  iFrameOnLoadEventFired: function() {
    blr.W15yQC.testsDialog.iFrameLoaded=true;
  },

  init: function (dialog) {
    blr.W15yQC.fnReadUserPrefs();
    dialog.fnUpdateProgress('Ready',null);
  },


  runTests: function() {
    var iFrame=document.getElementById('pageBeingScannedIFrame');
    var unitTestsStart = new Date().getTime();

    blr.W15yQC.testsDialog.iTotalTests=0;
    blr.W15yQC.testsDialog.iTotalTestFailures=0;

    blr.W15yQC.fnBackupUserPrefs();
    blr.W15yQC.fnResetUserPrefsToDefaults();
    blr.W15yQC.fnReadUserPrefs();
    blr.W15yQC.bEnglishLocale=true;

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
      var pre=rd.createElement('pre');
      pre.appendChild(rd.createTextNode(text));
      pre.style.color=color?color:'#0c0';
      p.appendChild(pre);
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
      try {
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
            blr.W15yQC.testsDialog.iTotalTests++;
            try{
              tests[test]();
              output(test);
              successful++;
            } catch(e) {
              blr.W15yQC.testsDialog.iTotalTestFailures++;
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
      } catch(e) {
        alert('Unexpected error processing test case: '+e.toString());
      }
    }

    try {
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
          assert("blr.W15yQC.fnIsValidLocale('en_US') should return true.", blr.W15yQC.fnIsValidLocale('en_US')===false);
        },
        "test fnIsValidLocale of fr": function() {
          assert("blr.W15yQC.fnIsValidLocale('fr') should return true.", blr.W15yQC.fnIsValidLocale('fr')===true);
        },
        "test fnIsValidLocale of es": function() {
          assert("blr.W15yQC.fnIsValidLocale('es') should return true.", blr.W15yQC.fnIsValidLocale('es')===true);
        },
        "test fnIsValidLocale of fr-US": function() {
          assert("blr.W15yQC.fnIsValidLocale('fr-US') should return true.", blr.W15yQC.fnIsValidLocale('fr-US')===true);
        },
        "test fnIsValidLocale of empty string": function() {
          assert("blr.W15yQC.fnIsValidLocale('') should return false.", blr.W15yQC.fnIsValidLocale('')===false);
        },
        "test fnIsValidLocale of US": function() {
          assert("blr.W15yQC.fnIsValidLocale('US') should return true.", blr.W15yQC.fnIsValidLocale('US')===true);
        },
        "test fnIsValidLocale of en-GB": function() {
          assert("blr.W15yQC.fnIsValidLocale('en-GB') should return true.", blr.W15yQC.fnIsValidLocale('en-GB')===true);
        },
        "test fnIsValidLocale of EN-us": function() {
          assert("blr.W15yQC.fnIsValidLocale('EN-us') should return true.", blr.W15yQC.fnIsValidLocale('EN-us')===true);
        },
        "test fnIsValidLocale of ga": function() {
          assert("blr.W15yQC.fnIsValidLocale('ga') should return true.", blr.W15yQC.fnIsValidLocale('ga')===true);
        },
        "test fnIsValidLocale of cy-GB": function() {
          assert("blr.W15yQC.fnIsValidLocale('cy-GB') should return true.", blr.W15yQC.fnIsValidLocale('cy-GB')===true);
        },
        "test fnIsValidLocale of fr-FR": function() {
          assert("blr.W15yQC.fnIsValidLocale('fr-FR') should return true.", blr.W15yQC.fnIsValidLocale('fr-FR')===true);
        },
        "test fnIsValidLocale of de": function() {
          assert("blr.W15yQC.fnIsValidLocale('de') should return true.", blr.W15yQC.fnIsValidLocale('de')===true);
        },
        "test fnIsValidLocale of da": function() {
          assert("blr.W15yQC.fnIsValidLocale('da') should return true.", blr.W15yQC.fnIsValidLocale('da')===true);
        },
        "test fnIsValidLocale of de-DE": function() {
          assert("blr.W15yQC.fnIsValidLocale('de-DE') should return true.", blr.W15yQC.fnIsValidLocale('de-DE')===true);
        },
        "test fnIsValidLocale of es-ES": function() {
          assert("blr.W15yQC.fnIsValidLocale('es-ES') should return true.", blr.W15yQC.fnIsValidLocale('es-ES')===true);
        },
        "test fnIsValidLocale of es-US": function() {
          assert("blr.W15yQC.fnIsValidLocale('es-US') should return true.", blr.W15yQC.fnIsValidLocale('es-US')===true);
        }
      });

      testCase("blr.W15yQC.fnSetIsEnglishLocale function test", {
        "test fnSetIsEnglishLocale of null": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale(null) should return true.", blr.W15yQC.fnSetIsEnglishLocale(null)===true);
        },
        "test fnSetIsEnglishLocale of fr": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('fr') should return false.", blr.W15yQC.fnSetIsEnglishLocale('fr')===false);
        },
        "test fnSetIsEnglishLocale of es": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('es') should return false.", blr.W15yQC.fnSetIsEnglishLocale('es')===false);
        },
        "test fnSetIsEnglishLocale of fr-US": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('fr-US') should return false.", blr.W15yQC.fnSetIsEnglishLocale('fr-US')===false);
        },
        "test fnSetIsEnglishLocale of empty string": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('') should return true.", blr.W15yQC.fnSetIsEnglishLocale('')===true);
        },
        "test fnSetIsEnglishLocale of US": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('US') should return false.", blr.W15yQC.fnSetIsEnglishLocale('US')===false);
        },
        "test fnSetIsEnglishLocale of en": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('en') should return true.", blr.W15yQC.fnSetIsEnglishLocale('en')===true);
        },
        "test fnSetIsEnglishLocale of en-US": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('en-US') should return true.", blr.W15yQC.fnSetIsEnglishLocale('en-US')===true);
        },
        "test fnSetIsEnglishLocale of en-GB": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('en-GB') should return true.", blr.W15yQC.fnSetIsEnglishLocale('en-GB')===true);
        },
        "test fnSetIsEnglishLocale of EN-us": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('EN-us') should return true.", blr.W15yQC.fnSetIsEnglishLocale('EN-us')===true);
        },
        "test fnSetIsEnglishLocale of ga": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('ga') should return false.", blr.W15yQC.fnSetIsEnglishLocale('ga')===false);
        },
        "test fnSetIsEnglishLocale of cy-GB": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('cy-GB') should return false.", blr.W15yQC.fnSetIsEnglishLocale('cy-GB')===false);
        },
        "test fnSetIsEnglishLocale of fr-FR": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('fr-FR') should return false.", blr.W15yQC.fnSetIsEnglishLocale('fr-FR')===false);
        },
        "test fnSetIsEnglishLocale of de": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('de') should return false.", blr.W15yQC.fnSetIsEnglishLocale('de')===false);
        },
        "test fnSetIsEnglishLocale of da": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('da') should return false.", blr.W15yQC.fnSetIsEnglishLocale('da')===false);
        },
        "test fnSetIsEnglishLocale of de-DE": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('de-DE') should return false.", blr.W15yQC.fnSetIsEnglishLocale('de-DE')===false);
        },
        "test fnSetIsEnglishLocale of es-ES": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('es-ES') should return false.", blr.W15yQC.fnSetIsEnglishLocale('es-ES')===false);
        },
        "test fnSetIsEnglishLocale of es-US": function() {
          assert("blr.W15yQC.fnSetIsEnglishLocale('es-US') should return false.", blr.W15yQC.fnSetIsEnglishLocale('es-US')===false);
        }
      });

      testCase("blr.W15yQC.fnGetUserLocale function test", {
        "test fnIsValidLocale(blr.W15yQC.fnGetUserLocale)": function() {
          assert("blr.W15yQC.fnIsValidLocale(blr.W15yQC.fnGetUserLocale()) should return true.", blr.W15yQC.fnIsValidLocale(blr.W15yQC.fnGetUserLocale())===true);
        }
      });

      testCase("blr.W15yQC.fnMaxDecimalPlaces function test", {
        "test fnMaxDecimalPlaces('123',2)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('123',2) should return '123'.", blr.W15yQC.fnMaxDecimalPlaces('123',2)==='123');
        },
        "test fnMaxDecimalPlaces('123.12',2)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('123.12',2) should return '123.12'.", blr.W15yQC.fnMaxDecimalPlaces('123.12',2)==='123.12');
        },
        "test fnMaxDecimalPlaces('123.12',3)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('123.12',3) should return '123.12'.", blr.W15yQC.fnMaxDecimalPlaces('123.12',3)==='123.12');
        },
        "test fnMaxDecimalPlaces('.12',3)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('.12',3) should return '.12'.", blr.W15yQC.fnMaxDecimalPlaces('.12',3)==='.12');
        },
        "test fnMaxDecimalPlaces('.1234',3)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('.1234',3) should return '.123'.", blr.W15yQC.fnMaxDecimalPlaces('.1234',3)==='.123');
        },
        "test fnMaxDecimalPlaces('0.12',3)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('0.12',3) should return '0.12'.", blr.W15yQC.fnMaxDecimalPlaces('0.12',3)==='0.12');
        },
        "test fnMaxDecimalPlaces('0.1234',3)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('0.1234',3) should return '0.123'.", blr.W15yQC.fnMaxDecimalPlaces('0.1234',3)==='0.123');
        },
        "test fnMaxDecimalPlaces('12345.1234',3)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('12345.1234',3) should return '12345.123'.", blr.W15yQC.fnMaxDecimalPlaces('12345.1234',3)==='12345.123');
        },
        "test fnMaxDecimalPlaces('12345.1234',1)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('12345.1234',1) should return '12345.1'.", blr.W15yQC.fnMaxDecimalPlaces('12345.1234', 1)==='12345.1');
        },
        "test fnMaxDecimalPlaces('',1)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('',1) should return ''.", blr.W15yQC.fnMaxDecimalPlaces('', 1)==='');
        },
        "test fnMaxDecimalPlaces('dog',1)": function() {
          assert("blr.W15yQC.fnMaxDecimalPlaces('dog',1) should return 'dog'.", blr.W15yQC.fnMaxDecimalPlaces('dog', 1)==='dog');
        }
      });

      testCase("blr.W15yQC.fnFormatArrayAsList function test", {
        "test fnFormatArrayAsList('dog','cat')": function() {
          assert("blr.W15yQC.fnFormatArrayAsList('dog','cat') should return 'cat'.", blr.W15yQC.fnFormatArrayAsList('dog','cat')==='cat');
        },
        "test fnFormatArrayAsList(null)": function() {
          assert("blr.W15yQC.fnFormatArrayAsList(null) should return 'none'.", blr.W15yQC.fnFormatArrayAsList(null)==='none');
        },
        "test fnMaxDecimalPlaces([1,2,3,4],'cat')": function() {
          assert("blr.W15yQC.fnFormatArrayAsList([1,2,3,4],'cat') should return '1, 2, 3, 4'.", blr.W15yQC.fnFormatArrayAsList([1,2,3,4],'cat')==='1, 2, 3, 4');
        },
        "test fnMaxDecimalPlaces([1, 'dog', 'snake',3],'cat')": function() {
          assert("blr.W15yQC.fnFormatArrayAsList([1, 'dog', 'snake',3],'cat') should return '1, dog, snake, 3'.", blr.W15yQC.fnFormatArrayAsList([1, 'dog', 'snake',3],'cat')==='1, dog, snake, 3');
        }
      });

      testCase("blr.W15yQC.fnCleanSpaces function test", {
        "test fnCleanSpaces('')": function() {
          assert("blr.W15yQC.fnCleanSpaces('') should return ''.", blr.W15yQC.fnCleanSpaces('')==='');
        },
        "test fnCleanSpaces(' ')": function() {
          assert("blr.W15yQC.fnCleanSpaces(' ') should return ''.", blr.W15yQC.fnCleanSpaces(' ')==='');
        },
        "test fnCleanSpaces(' dogs cats mules ')": function() {
          assert("blr.W15yQC.fnCleanSpaces(' dogs cats mules ') should return 'dogs cats mules'.", blr.W15yQC.fnCleanSpaces(' dogs cats mules ')==='dogs cats mules');
        },
        "test fnCleanSpaces('  dogs  cats  mules  ')": function() {
          assert("blr.W15yQC.fnCleanSpaces('  dogs  cats  mules  ') should return 'dogs cats mules'.", blr.W15yQC.fnCleanSpaces('  dogs  cats  mules  ')==='dogs cats mules');
        },
        "test fnCleanSpaces('  dogs\\tcats\\tmules  ')": function() {
          assert("blr.W15yQC.fnCleanSpaces('  dogs\tcats\tmules  ') should return 'dogs cats mules'.", blr.W15yQC.fnCleanSpaces("  dogs\tcats\tmules  ")==='dogs cats mules');
        },
        "test fnCleanSpaces('  dogs\\rcats\\rmules  and  rats  ')": function() {
          assert("blr.W15yQC.fnCleanSpaces('  dogs\\rcats\\rmules  and  rats  ') should return 'dogs\\rcats\\rmules  and  rats'.", blr.W15yQC.fnCleanSpaces("  dogs\rcats\rmules  and  rats  ")==="dogs cats mules and rats");
        },
        "test fnCleanSpaces('  dogs\\rcats\\rmules  and  rats  ', true)": function() {
          assert("blr.W15yQC.fnCleanSpaces('  dogs\\rcats\\rmules  and  rats  ', true) should return 'dogs cats mules  and  rats'.", blr.W15yQC.fnCleanSpaces("  dogs\rcats\rmules  and  rats  ",true)==="dogs\rcats\rmules and rats");
        },
        "test fnCleanSpaces('  ')": function() {
          assert("blr.W15yQC.fnCleanSpaces('  ') should return ''.", blr.W15yQC.fnCleanSpaces('  ')==='');
        },
        "test fnCleanSpaces('   ')": function() {
          assert("blr.W15yQC.fnCleanSpaces('   ') should return ''.", blr.W15yQC.fnCleanSpaces('   ')==='');
        },
        "test fnCleanSpaces(null)": function() {
          assert("blr.W15yQC.fnCleanSpaces(null) should return null.", blr.W15yQC.fnCleanSpaces(null)===null);
        }
      });

      testCase("blr.W15yQC.fnNormalizeURL function tests", {
        "test blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml','test.html')": function() {
          assert("blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml','test.html') should return 'http://www.fake.url/~deep/url/test.html'.", blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml','test.html')==='http://www.fake.url/~deep/url/test.html');
        },
        "test blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml#ramdomId883','test.html')": function() {
          assert("blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml#ramdomId883','test.html') should return 'http://www.fake.url/~deep/url/test.html#ramdomId883'.", blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml#ramdomId883','test.html')==='http://www.fake.url/~deep/url/test.html');
        },
        "test blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml?d=f&yassfd=ef','test.html')": function() {
          assert("blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml?d=f&yassfd=ef','test.html') should return 'http://www.fake.url/~deep/url/test.html'.", blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml?d=f&yassfd=ef','test.html')==='http://www.fake.url/~deep/url/test.html');
        },
        "test blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml?d=f&yassfd=ef#dfs','test.html')": function() {
          assert("blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml?d=f&yassfd=ef#dfs','test.html') should return 'http://www.fake.url/~deep/url/test.html'.", blr.W15yQC.fnNormalizeURL('http://www.fake.url/~deep/url/index.shtml?d=f&yassfd=ef#dfs','test.html')==='http://www.fake.url/~deep/url/test.html');
        }
      });

      testCase("blr.W15yQC.fnURLsAreEqual function tests", {
        "test blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/index.html','test.html','http://www.fake.url/sub/dir/index.html','test.html')": function() {
          assert("blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/index.html','test.html','http://www.fake.url/sub/dir/index.html','test.html') should return true.", blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/index.html','test.html','http://www.fake.url/sub/dir/index.html','test.html')===true);
        },
        "test blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/faq.html','test.html','http://www.fake.url/sub/dir/support.html','test.html')": function() {
          assert("blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/faq.html','test.html','http://www.fake.url/sub/dir/support.html','test.html') should return true.", blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/faq.html','test.html','http://www.fake.url/sub/dir/support.html','test.html')===true);
        },
        "test blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/faq.html','test2.html','http://www.fake.url/sub/dir/support.html','test.html')": function() {
          assert("blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/faq.html','test2.html','http://www.fake.url/sub/dir/support.html','test.html') should return true.", blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/faq.html','test2.html','http://www.fake.url/sub/dir/support.html','test.html')===false);
        },
        "test blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/','test.html','http://www.fake.url/sub/dir/support.html','test.html')": function() {
          assert("blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/','test.html','http://www.fake.url/sub/dir/support.html','test.html') should return true.", blr.W15yQC.fnURLsAreEqual('http://www.fake.url/sub/dir/','test.html','http://www.fake.url/sub/dir/support.html','test.html')===true);
        },
      });

      testCase("blr.W15yQC.fnSpellOutNumber function tests", {
        "test blr.W15yQC.fnSpellOutNumber('')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('') should return ''.", blr.W15yQC.fnSpellOutNumber('')==='');
        },
        "test blr.W15yQC.fnSpellOutNumber(null)": function() {
          assert("blr.W15yQC.fnSpellOutNumber(null) should return ''.", blr.W15yQC.fnSpellOutNumber(null)==='');
        },
        "test blr.W15yQC.fnSpellOutNumber('0')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('0') should return 'zero'.", blr.W15yQC.fnSpellOutNumber('0')==='Zero');
        },
        "test blr.W15yQC.fnSpellOutNumber('1')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('1') should return 'one'.", blr.W15yQC.fnSpellOutNumber('1')==='One');
        },
        "test blr.W15yQC.fnSpellOutNumber('2')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('2') should return 'two'.", blr.W15yQC.fnSpellOutNumber('2')==='Two');
        },
        "test blr.W15yQC.fnSpellOutNumber('3')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('3') should return 'three'.", blr.W15yQC.fnSpellOutNumber('3')==='Three');
        },
        "test blr.W15yQC.fnSpellOutNumber('4')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('4') should return 'four'.", blr.W15yQC.fnSpellOutNumber('4')==='Four');
        },
        "test blr.W15yQC.fnSpellOutNumber('5')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('5') should return 'five'.", blr.W15yQC.fnSpellOutNumber('5')==='Five');
        },
        "test blr.W15yQC.fnSpellOutNumber('6')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('6') should return 'six'.", blr.W15yQC.fnSpellOutNumber('6')==='Six');
        },
        "test blr.W15yQC.fnSpellOutNumber('7')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('7') should return 'seven'.", blr.W15yQC.fnSpellOutNumber('7')==='Seven');
        },
        "test blr.W15yQC.fnSpellOutNumber('8')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('8') should return 'eight'.", blr.W15yQC.fnSpellOutNumber('8')==='Eight');
        },
        "test blr.W15yQC.fnSpellOutNumber('9')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('9') should return 'nine'.", blr.W15yQC.fnSpellOutNumber('9')==='Nine');
        },
        "test blr.W15yQC.fnSpellOutNumber('10')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('10') should return 'ten'.", blr.W15yQC.fnSpellOutNumber('10')==='Ten');
        },
        "test blr.W15yQC.fnSpellOutNumber('21')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('21') should return 'twenty one'.", blr.W15yQC.fnSpellOutNumber('21')==='Twenty One');
        },
        "test blr.W15yQC.fnSpellOutNumber('32')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('32') should return 'thirty two'.", blr.W15yQC.fnSpellOutNumber('32')==='Thirty Two');
        },
        "test blr.W15yQC.fnSpellOutNumber('43')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('43') should return 'forty three'.", blr.W15yQC.fnSpellOutNumber('43')==='Forty Three');
        },
        "test blr.W15yQC.fnSpellOutNumber('54')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('54') should return 'fifty four'.", blr.W15yQC.fnSpellOutNumber('54')==='Fifty Four');
        },
        "test blr.W15yQC.fnSpellOutNumber('65')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('65') should return 'sixty five'.", blr.W15yQC.fnSpellOutNumber('65')==='Sixty Five');
        },
        "test blr.W15yQC.fnSpellOutNumber('76')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('76') should return 'seventy six'.", blr.W15yQC.fnSpellOutNumber('76')==='Seventy Six');
        },
        "test blr.W15yQC.fnSpellOutNumber('87')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('87') should return 'eighty seven'.", blr.W15yQC.fnSpellOutNumber('87')==='Eighty Seven');
        },
        "test blr.W15yQC.fnSpellOutNumber('98')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('98') should return 'ninety eight'.", blr.W15yQC.fnSpellOutNumber('98')==='Ninety Eight');
        },
        "test blr.W15yQC.fnSpellOutNumber('109')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('109') should return 'one hundred nine'.", blr.W15yQC.fnSpellOutNumber('109')==='One Hundred Nine');
        },
        "test blr.W15yQC.fnSpellOutNumber('210')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('210') should return 'two hundred ten'.", blr.W15yQC.fnSpellOutNumber('210')==='Two Hundred Ten');
        },
        "test blr.W15yQC.fnSpellOutNumber('1345')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('1345') should return 'One Thousand Three Hundred Forty Five'.", blr.W15yQC.fnSpellOutNumber('1345')==='One Thousand Three Hundred Forty Five');
        },
        "test blr.W15yQC.fnSpellOutNumber('10456')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('10456') should return 'Ten Thousand Four Hundred Fifty Six'.", blr.W15yQC.fnSpellOutNumber('10456')==='Ten Thousand Four Hundred Fifty Six');
        },
        "test blr.W15yQC.fnSpellOutNumber('21567')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('21567') should return 'Twenty One Thousand Five Hundred Sixty Seven'.", blr.W15yQC.fnSpellOutNumber('21567')==='Twenty One Thousand Five Hundred Sixty Seven');
        },
        "test blr.W15yQC.fnSpellOutNumber('8912678')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('8912678') should return 'Eight Million Nine Hundred Twelve Thousand Six Hundred Seventy Eight'.", blr.W15yQC.fnSpellOutNumber('8912678')==='Eight Million Nine Hundred Twelve Thousand Six Hundred Seventy Eight');
        },
        "test blr.W15yQC.fnSpellOutNumber('57.23')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('57.23') should return 'Fifty Seven Point Two Three'.", blr.W15yQC.fnSpellOutNumber('57.23')==='Fifty Seven Point Two Three');
        },
        "test blr.W15yQC.fnSpellOutNumber('$ 69.52')": function() {
          assert("blr.W15yQC.fnSpellOutNumber('$ 69.52') should return 'Sixty Nine Dollars And Fifty Two Cents'.", blr.W15yQC.fnSpellOutNumber('$ 69.52')==='Sixty Nine Dollars And Fifty Two Cents');
        }
      });

      testCase("blr.W15yQC.fnSpellOutNumbers function tests", {
        "test blr.W15yQC.fnSpellOutNumbers('')": function() {
          assert("blr.W15yQC.fnSpellOutNumbers('') should return ''.", blr.W15yQC.fnSpellOutNumbers('')==='');
        },
        "test blr.W15yQC.fnSpellOutNumbers(null)": function() {
          assert("blr.W15yQC.fnSpellOutNumbers(null) should return ''.", blr.W15yQC.fnSpellOutNumbers(null)===null);
        },
        "test blr.W15yQC.fnSpellOutNumbers('23 dogs ate 12 cats!')": function() {
          assert("blr.W15yQC.fnSpellOutNumbers('23 dogs ate 12 cats!') should return 'Twenty Three dogs ate Twelve cats!'.", blr.W15yQC.fnSpellOutNumbers('23 dogs ate 12 cats!')==='Twenty Three dogs ate Twelve cats!');
        }
      });

      testCase("blr.W15yQC.fnSoundEx function tests", {
        "test blr.W15yQC.fnSoundEx('')": function() {
          assert("blr.W15yQC.fnSoundEx('') should return ''.", blr.W15yQC.fnSoundEx('')==='');
        },
        "test blr.W15yQC.fnSoundEx(null)": function() {
          assert("blr.W15yQC.fnSoundEx(null) should return ''.", blr.W15yQC.fnSoundEx(null)==='');
        },
        "test blr.W15yQC.fnSoundEx('Cat')": function() {
          assert("blr.W15yQC.fnSoundEx('Cat') should return 'C300000000'.", blr.W15yQC.fnSoundEx('Cat')==='C300000000');
        },
        "test blr.W15yQC.fnSoundEx('abrogate')": function() {
          assert("blr.W15yQC.fnSoundEx('abrogate') should return 'A162300000'.", blr.W15yQC.fnSoundEx('abrogate')==='A162300000');
        },
        "test blr.W15yQC.fnSoundEx('sphragistics')": function() {
          assert("blr.W15yQC.fnSoundEx('sphragistics') should return 'S162232000'.", blr.W15yQC.fnSoundEx('sphragistics')==='S162232000');
        },
        "test blr.W15yQC.fnSoundEx('through')": function() {
          assert("blr.W15yQC.fnSoundEx('through') should return 'T600000000'.", blr.W15yQC.fnSoundEx('through')==='T600000000');
        },
        "test blr.W15yQC.fnSoundEx('trough')": function() {
          assert("blr.W15yQC.fnSoundEx('trough') should return 'T600000000'.", blr.W15yQC.fnSoundEx('trough')==='T600000000');
        },
        "test blr.W15yQC.fnSoundEx('though')": function() {
          assert("blr.W15yQC.fnSoundEx('though') should return ''.", blr.W15yQC.fnSoundEx('though')==='T000000000');
        },
        "test blr.W15yQC.fnSoundEx('HONORIFICABILITUDINITATIBUS')": function() {
          assert("blr.W15yQC.fnSoundEx('HONORIFICABILITUDINITATIBUS') should return 'H561214335'.", blr.W15yQC.fnSoundEx('HONORIFICABILITUDINITATIBUS')==='H561214335');
        },
        "test blr.W15yQC.fnSoundEx('ALUMINOSILICATES')": function() {
          assert("blr.W15yQC.fnSoundEx('ALUMINOSILICATES') should return 'A455242320'.", blr.W15yQC.fnSoundEx('ALUMINOSILICATES')==='A455242320');
        },
        "test blr.W15yQC.fnSoundEx('EPICORACOHUMERALER')": function() {
          assert("blr.W15yQC.fnSoundEx('EPICORACOHUMERALER') should return 'E126256460'.", blr.W15yQC.fnSoundEx('EPICORACOHUMERALER')==='E126256460');
        },
        "test blr.W15yQC.fnSoundEx('HEXOSAMINIDASES')": function() {
          assert("blr.W15yQC.fnSoundEx('HEXOSAMINIDASES') should return 'H225532200'.", blr.W15yQC.fnSoundEx('HEXOSAMINIDASES')==='H225532200');
        },
        "test blr.W15yQC.fnSoundEx('ICULANIBOKOLAS')": function() {
          assert("blr.W15yQC.fnSoundEx('ICULANIBOKOLAS') should return 'I245124200'.", blr.W15yQC.fnSoundEx('ICULANIBOKOLAS')==='I245124200');
        },
        "test blr.W15yQC.fnSoundEx('PARAROSANILINES')": function() {
          assert("blr.W15yQC.fnSoundEx('PARAROSANILINES') should return 'P662545200'.", blr.W15yQC.fnSoundEx('PARAROSANILINES')==='P662545200');
        },
        "test blr.W15yQC.fnSoundEx('PARASITOLOGICAL')": function() {
          assert("blr.W15yQC.fnSoundEx('PARASITOLOGICAL') should return 'P623422400'.", blr.W15yQC.fnSoundEx('PARASITOLOGICAL')==='P623422400');
        },
        "test blr.W15yQC.fnSoundEx('VERISIMILITUDES')": function() {
          assert("blr.W15yQC.fnSoundEx('VERISIMILITUDES') should return 'V625433200'.", blr.W15yQC.fnSoundEx('VERISIMILITUDES')==='V625433200');
        }
      });

      testCase("blr.W15yQC.fnGetSoundExTokens function tests", {
        "test blr.W15yQC.fnGetSoundExTokens('')": function() {
          assert("blr.W15yQC.fnGetSoundExTokens('') should return ''.", blr.W15yQC.fnGetSoundExTokens('')==='');
        },
        "test blr.W15yQC.fnGetSoundExTokens(null)": function() {
          assert("blr.W15yQC.fnGetSoundExTokens(null) should return ''.", blr.W15yQC.fnGetSoundExTokens(null)==='');
        },
        "test blr.W15yQC.fnGetSoundExTokens('All 1234 dogs are cat eaters.')": function() {
          assert("blr.W15yQC.fnGetSoundExTokens('All 1234 dogs are cat eaters.') should return 'A400000000 O500000000 T253000000 T000000000 H536300000 T630000000 F600000000 D200000000 A600000000 C300000000 E362000000'.", blr.W15yQC.fnGetSoundExTokens('All 1234 dogs are cat eaters.')==='A400000000 O500000000 T253000000 T000000000 H536300000 T630000000 F600000000 D200000000 A600000000 C300000000 E362000000');
        }
      });

      blr.W15yQC.bEnglishLocale=false;

      testCase("blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits function without English Locale tests", {
        "test blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('1231')": function() {
          assert("blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('1231') should return false.", blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('1231')===false);
        },
        "test blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('Cat')": function() {
          assert("blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('Cat') should return false.", blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('Cat')===false);
        },
        "test blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('(*(* %^^% @#$@')": function() {
          assert("blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('(*(* %^^% @#$@') should return false.", blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('(*(* %^^% @#$@')===true);
        }
      });

      blr.W15yQC.bEnglishLocale=true;

      testCase("blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits function with English Locale tests", {
        "test blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('1231')": function() {
          assert("blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('1231') should return false.", blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('1231')===false);
        },
        "test blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('Cat')": function() {
          assert("blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('Cat') should return false.", blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('Cat')===false);
        },
        "test blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('(*(* %^^% @#$@')": function() {
          assert("blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('(*(* %^^% @#$@') should return false.", blr.W15yQC.fnOnlyASCIISymbolsWithNoLettersOrDigits('(*(* %^^% @#$@')===true);
        }
      });

      testCase("blr.W15yQC.fnStringsEffectivelyEqual function tests", {
        "test blr.W15yQC.fnStringsEffectivelyEqual('1231','1231')": function() {
          assert("blr.W15yQC.fnStringsEffectivelyEqual('1231','1231') should return true.", blr.W15yQC.fnStringsEffectivelyEqual('1231','1231')===true);
        },
        "test blr.W15yQC.fnStringsEffectivelyEqual(' 1231 ','1231')": function() {
          assert("blr.W15yQC.fnStringsEffectivelyEqual(' 1231 ','1231') should return true.", blr.W15yQC.fnStringsEffectivelyEqual(' 1231 ','1231')===true);
        },
        "test blr.W15yQC.fnStringsEffectivelyEqual(' 1231 ','12 31')": function() {
          assert("blr.W15yQC.fnStringsEffectivelyEqual(' 1231 ','12 31') should return false.", blr.W15yQC.fnStringsEffectivelyEqual(' 1231 ','12 31')===false);
        },
        "test blr.W15yQC.fnStringsEffectivelyEqual(' Dogs aNd caTs.','dogs and cats')": function() {
          assert("blr.W15yQC.fnStringsEffectivelyEqual(' Dogs aNd caTs','dogs and cats') should return true.", blr.W15yQC.fnStringsEffectivelyEqual(' Dogs aNd caTs','dogs and cats')===true);
        },
        "test blr.W15yQC.fnStringsEffectivelyEqual('','')": function() {
          assert("blr.W15yQC.fnStringsEffectivelyEqual('','') should return true.", blr.W15yQC.fnStringsEffectivelyEqual('','')===true);
        },
        "test blr.W15yQC.fnStringsEffectivelyEqual('',' ')": function() {
          assert("blr.W15yQC.fnStringsEffectivelyEqual('','') should return true.", blr.W15yQC.fnStringsEffectivelyEqual('',' ')===true);
        },
        "test blr.W15yQC.fnStringsEffectivelyEqual('',null)": function() {
          assert("blr.W15yQC.fnStringsEffectivelyEqual('',null) should return true.", blr.W15yQC.fnStringsEffectivelyEqual('',null)===true);
        }
      });

      testCase("blr.W15yQC.fnIsValidPositiveInt function tests", {
        "test blr.W15yQC.fnIsValidPositiveInt('')": function() {
          assert("blr.W15yQC.fnIsValidPositiveInt('') should return false.", blr.W15yQC.fnIsValidPositiveInt('')===false);
        },
        "test blr.W15yQC.fnIsValidPositiveInt(null)": function() {
          assert("blr.W15yQC.fnIsValidPositiveInt(null) should return false.", blr.W15yQC.fnIsValidPositiveInt(null)===false);
        },
        "test blr.W15yQC.fnIsValidPositiveInt('cat')": function() {
          assert("blr.W15yQC.fnIsValidPositiveInt('cat') should return false.", blr.W15yQC.fnIsValidPositiveInt('cat')===false);
        },
        "test blr.W15yQC.fnIsValidPositiveInt('12px')": function() {
          assert("blr.W15yQC.fnIsValidPositiveInt('12px') should return false.", blr.W15yQC.fnIsValidPositiveInt('12px')===false);
        },
        "test blr.W15yQC.fnIsValidPositiveInt('12.31')": function() {
          assert("blr.W15yQC.fnIsValidPositiveInt('12.31') should return false.", blr.W15yQC.fnIsValidPositiveInt('12.31')===false);
        },
        "test blr.W15yQC.fnIsValidPositiveInt('12')": function() {
          assert("blr.W15yQC.fnIsValidPositiveInt('12') should return true.", blr.W15yQC.fnIsValidPositiveInt('12')===true);
        },
        "test blr.W15yQC.fnIsValidPositiveInt('0')": function() {
          assert("blr.W15yQC.fnIsValidPositiveInt('0') should return true.", blr.W15yQC.fnIsValidPositiveInt('0')===true);
        },
        "test blr.W15yQC.fnIsValidPositiveInt('-12')": function() {
          assert("blr.W15yQC.fnIsValidPositiveInt('-12') should return false.", blr.W15yQC.fnIsValidPositiveInt('-12')===false);
        }
      });

      testCase("blr.W15yQC.fnMakeWebSafe function tests", {
        "test blr.W15yQC.fnMakeWebSafe('')": function() {
          assert("blr.W15yQC.fnMakeWebSafe('') should return ''.", blr.W15yQC.fnMakeWebSafe('')==='');
        },
        "test blr.W15yQC.fnMakeWebSafe(' ')": function() {
          assert("blr.W15yQC.fnMakeWebSafe(' ') should return ' '.", blr.W15yQC.fnMakeWebSafe(' ')===' ');
        },
        "test blr.W15yQC.fnMakeWebSafe('cat')": function() {
          assert("blr.W15yQC.fnMakeWebSafe('cat') should return 'cat'.", blr.W15yQC.fnMakeWebSafe('cat')==='cat');
        },
        "test blr.W15yQC.fnMakeWebSafe(null)": function() {
          assert("blr.W15yQC.fnMakeWebSafe(null) should return null.", blr.W15yQC.fnMakeWebSafe(null)===null);
        },
        "test blr.W15yQC.fnMakeWebSafe('<test></test>')": function() {
          assert("blr.W15yQC.fnMakeWebSafe('<test></test>') should return '&lt;test>&lt;/test>'.", blr.W15yQC.fnMakeWebSafe('<test></test>')==='&lt;test>&lt;/test>');
        },
      });

      // fnGetMaxNodeRectangleDimensions

      testCase("fnGetDoctypeString function tests HTML20", {
        "setUp": function() {
          loadURLInIFrame('chrome://w15yqc/content/qa/tests/docTypes/testHTML20.html');
        },
        "test ": function() {
          assert("blr.W15yQC.fnGetDoctypeString testHTML20.html", blr.W15yQC.fnGetDoctypeString(iFrame.contentDocument)==='<!DOCTYPE html PUBLIC "-//IETF//DTD HTML 2.0//EN">');
        },
        "tearDown": function() {
          iFrame.setAttribute('src','about:blank');
        }
      });

      testCase("fnGetDoctypeString function tests HTML32", {
        "setUp": function() {
          loadURLInIFrame('chrome://w15yqc/content/qa/tests/docTypes/testHTML32.html');
        },
        "test ": function() {
          assert("blr.W15yQC.fnGetDoctypeString testHTML32.html", blr.W15yQC.fnGetDoctypeString(iFrame.contentDocument)==='<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">');
        },
        "tearDown": function() {
          iFrame.setAttribute('src','about:blank');
        }
      });

      testCase("fnGetDoctypeString function tests HTML401 Frameset", {
        "setUp": function() {
          loadURLInIFrame('chrome://w15yqc/content/qa/tests/docTypes/testHTML401Frameset.html');
        },
        "test ": function() {
          assert("blr.W15yQC.fnGetDoctypeString testHTML401Frameset.html", blr.W15yQC.fnGetDoctypeString(iFrame.contentDocument)==='<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">');
        },
        "tearDown": function() {
          iFrame.setAttribute('src','about:blank');
        }
      });

      testCase("fnGetDoctypeString function tests HTML401 Strict", {
        "setUp": function() {
          loadURLInIFrame('chrome://w15yqc/content/qa/tests/docTypes/testHTML401Strict.html');
        },
        "test ": function() {
          assert("blr.W15yQC.fnGetDoctypeString testHTML401Strict.html", blr.W15yQC.fnGetDoctypeString(iFrame.contentDocument)==='<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">');
        },
        "tearDown": function() {
          iFrame.setAttribute('src','about:blank');
        }
      });

      testCase("linkTests01.html", {
        "setUp": function() {
          loadURLInIFrame('chrome://w15yqc/content/qa/tests/links/linkTests01.html');
        },
        "test ": function() {
          var oW15yQCResults=blr.W15yQC.fnScannerInspect(iFrame.contentDocument, blr.W15yQC.testsDialog);
          //output(blr.W15yQC.objectToString(oW15yQCResults.aLinks));
          assert("oW15yQCResults.aLinks[0].effectiveLabel should equal empty string.", oW15yQCResults.aLinks[0].effectiveLabel==='');
          assert("oW15yQCResults.aLinks[0].effectiveLabelSource should equal empty string.", oW15yQCResults.aLinks[0].effectiveLabelSource==='');
          assert("oW15yQCResults.aLinks[0].listedByAT should equal 23.", oW15yQCResults.aLinks[0].listedByAT===false);
          assert("oW15yQCResults.aLinks[0].notes.length should equal 2.", oW15yQCResults.aLinks[0].notes.length===2);
          assert("oW15yQCResults.aLinks[0].notes[1].msgKey should equal 'lnkIsNamedAnchor'.", oW15yQCResults.aLinks[0].notes[1].msgKey==='lnkIsNamedAnchor')
          assert("oW15yQCResults.aLinks[1].notes[0].msgKey should equal 'elContrastRatioChkPassed'.", oW15yQCResults.aLinks[1].notes[0].msgKey==='elContrastRatioChkPassed');
          assert("oW15yQCResults.aLinks[2].notes[0].msgKey should equal 'lnkIDNotValid'.", oW15yQCResults.aLinks[2].notes[0].msgKey==='elContrastRatioChkPassed');
          assert("oW15yQCResults.aLinks[2].notes[0].msgKey should equal 'lnkIDNotValid'.", oW15yQCResults.aLinks[2].notes[1].msgKey==='lnkIDNotValid');
        },
        "tearDown": function() {
          iFrame.setAttribute('src','about:blank');
        }
      });

      // End of tests
      var unitTestsEnd = new Date().getTime();
      outputHR();
      output('Total tests: '+blr.W15yQC.testsDialog.iTotalTests+', '+blr.W15yQC.testsDialog.iTotalTestFailures+' failures. ('+(unitTestsEnd-unitTestsStart)+' ms)',blr.W15yQC.testsDialog.iTotalTestFailures>0?'#c00':'#0c0');
    } catch(e) {
      alert('Unexpected error processing test cases: '+e.toString());
    }

    blr.W15yQC.fnRestoreUserPrefsFromBackup();
    blr.W15yQC.fnReadUserPrefs();
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
