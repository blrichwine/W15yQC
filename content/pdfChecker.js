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

  /*
   * checkIfTaggedPDF
   *  1. Perform HTTP HEAD request to get PDF length
   *  2.
   *
   *
   */

   logElement: null,
   re: null, // Report Element


   log: function(s) {
    if (blr.W15yQC.pdfChecker.logElement!=null) {
      blr.W15yQC.pdfChecker.logElement.value=blr.W15yQC.fnJoin(blr.W15yQC.pdfChecker.logElement.value,s,"\n");
    }
   },

  getPdfQuickCheckResults: function(pdf) {
    var results={"version":null, "isLinearized":null, "hasOutline":null, "isStructured":null, "hasSuspects":null,
                 "isTagged":null, "hasForm":null, "defaultLang":null, "numPages":null, "errors":false};

    if (pdf!=null) {
      if (pdf.pdfInfo) {
        results.numPages=pdf.pdfInfo.numPages;
        results.isStructured=pdf.pdfInfo.isStructured;
        results.hasSuspects=pdf.pdfInfo.hasSuspects;
        results.isTagged=pdf.pdfInfo.isTagged;
        results.hasOutline=pdf.pdfInfo.outline!==null;
        results.isLinearized=pdf.pdfInfo.isLinearized;
        if (pdf.pdfInfo.info) {
          results.version=pdf.pdfInfo.info.PDFFormatVersion;
          results.hasForm=pdf.pdfInfo.info.IsAcroFormPresent||pdf.pdfInfo.info.IsXFAPresent;
        }
      }
    }
    blr.W15yQC.pdfChecker.log('Results: '+blr.W15yQC.objectToString(results));
    return results;
  },

  getPDF: function(sURL) {
    return new Promise(function(resolve, reject) {

      blr.W15yQC.pdfChecker.log('Requesting: '+sURL);
      blr.PDFJS.getDocument(sURL).then(
        function(pdf){
          blr.W15yQC.pdfChecker.log('Checking document.');
          resolve(blr.W15yQC.pdfChecker.getPdfQuickCheckResults(pdf));
        },
        function() {
          reject(null);
        });

     });
    },

  getPdfFullCheckResults: function(pdf) {
    var results={"version":null, "isLinearized":null, "hasOutline":null, "isStructured":null, "hasSuspects":null,
                 "isTagged":null, "hasForm":null, "defaultLang":null, "numPages":null, "errors":false};

    if (pdf!=null) {
      if (pdf.pdfInfo) {
        results.numPages=pdf.pdfInfo.numPages;
        results.isStructured=pdf.pdfInfo.isStructured;
        results.hasSuspects=pdf.pdfInfo.hasSuspects;
        results.isTagged=pdf.pdfInfo.isTagged;
        results.hasOutline=pdf.pdfInfo.outline!==null;
        results.isLinearized=pdf.pdfInfo.isLinearized;
        if (pdf.pdfInfo.info) {
          results.version=pdf.pdfInfo.info.PDFFormatVersion;
          results.hasForm=pdf.pdfInfo.info.IsAcroFormPresent||pdf.pdfInfo.info.IsXFAPresent;
        }
      }
      pdf.getDocumentStructure().then(function(docStruc){alert('here');});
    }
    blr.W15yQC.pdfChecker.log('Results: '+blr.W15yQC.objectToString(results));
    return results;
  },


   getPdfForFullCheck: function(sURL, tb, re) {
    if (tb!=null) {
      blr.W15yQC.pdfChecker.logElement=tb;
    } else {
      blr.W15yQC.pdfChecker.logElement=null;
    }
    if (re!=null) {
      blr.W15yQC.pdfChecker.re = re;
    } else {
      blr.W15yQC.pdfChecker.re = null;
    }
    return new Promise(function(resolve, reject) {

      blr.W15yQC.pdfChecker.log('Requesting: '+sURL);
      blr.PDFJS.getDocument(sURL).then(
        function(pdf){
          blr.W15yQC.pdfChecker.log('Checking document.');
          resolve(blr.W15yQC.pdfChecker.getPdfQuickCheckResults(pdf));
        },
        function() {
          reject(null);
        });

     });
    }
};
