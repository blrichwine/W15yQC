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

 * File:        pdfChecker.js
 * Description: Handles displaying the ARIA Landmarks quick check dialog
 * Author:	Brian Richwine
 * Created:	2014.08.04
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2014.08.04 - Created!
 *
 * TEST PDFs:
 *   http://www.udlcenter.org/sites/udlcenter.org/files/updateguidelines2_0.pdf
 *   http://www.udlcenter.org/sites/udlcenter.org/files/UDLinPostsecondary.pdf
 *   http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_reference_1-7.pdf
 *   http://www.adobe.com/enterprise/accessibility/pdfs/acro6_pg_ue.pdf
 *   http://www.csus.edu/accessibility/guides/creating_accessible_pdfs.pdf
 *   http://wac.osu.edu/pdf/why-pdf.pdf
 *
 * TODO:
 *
 *
 */
"use strict";

if (!blr) {
  var blr = {};
}

/*
 * Object:  RemoveStylesWindow
 * Returns:
 */
blr.W15yQC.pdfChecker = {


//var PatternCS = (function PatternCSClosure() {
//  function PatternCS(baseCS) {
//    this.name = 'Pattern';
//    this.base = baseCS;
//  }
//  PatternCS.prototype = {};
//
//  return PatternCS;
//})();


  getPDF: function(sURL) {
    function getPdfQuickCheckResults(pdf) {
      var results={"version":null, "isLinearized":null, "hasOutline":null, "isStructured":null, "hasSuspects":null,
                   "isTagged":null, "hasForm":null, "defaultLang":null, "numPages":null, "errors":false, "messages":null};

      try {
        if (pdf!=null) {
          if (pdf.pdfInfo) {
            results.numPages=pdf.pdfInfo.numPages;
            results.isStructured=pdf.pdfInfo.isStructured;
            results.hasSuspects=pdf.pdfInfo.hasSuspects;
            results.isTagged=pdf.pdfInfo.isTagged;
            results.hasOutline=pdf.pdfInfo.outline!==null && pdf.pdfInfo.outline.length && pdf.pdfInfo.outline.length>0;
            results.isLinearized=pdf.pdfInfo.isLinearized;
            if (pdf.pdfInfo.info) {
              results.version=pdf.pdfInfo.info.PDFFormatVersion;
              results.hasForm=pdf.pdfInfo.info.IsAcroFormPresent||pdf.pdfInfo.info.IsXFAPresent;
            }
          }
        }
      } catch(ex) {
        results.messages=ex.toString();
        results.errors=true;
      }
      return results;
    }

    return new Promise(function(resolve, reject) {
      blr.PDFJS.getDocument(sURL).then(
        function(pdf){
          resolve(getPdfQuickCheckResults(pdf));
        },
        function() {
          reject(null);
        });
    });
  }

};
