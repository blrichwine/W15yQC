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


  checkPDF: function(pdf) {
        var results={"version":null, "isLinearized":null, "hasOutline":null, "isStructured":null, "isTagged":null, "defaultLang":null, "errors":false};

        if (pdf!=null) {
          if (pdf.pdfInfo) {
            pdf.pdfInfo.outline=null;
            pdf.pdfInfo.metadata=null;
            alert(blr.W15yQC.objectToString(pdf.pdfInfo));
          }
        }
        //alert('Number of pages:'+pdf.pdfInfo.numPages);
        //pdf.getOutline().toString();
        //alert('pdfInfo:'+blr.W15yQC.objectToString(pdf.pdfInfo));
        //alert('pdf:'+blr.W15yQC.objectToString(pdf,false));

        // var byte3 = uInt8Array[4]; // byte at offset 4
        //blr.W15yQC.pdfChecker.log("Stream Length: "+pdfStream.length);
        //pdfVer=blr.W15yQC.pdfChecker.getPDFVersion(pdfStream);
        //if (pdfVer!=null) {
        //  blr.W15yQC.pdfChecker.log("PDF Version:"+pdfVer);
        //  results.version=pdfVer;
        //
        //  startxref=blr.W15yQC.pdfChecker.readFileTrailerForXrefStart(pdfStream);
        //  if (startxref!=null) {
        //    //blr.W15yQC.pdfChecker.log("startxref: "+startxref);
        //    pdfStream.pos=startxref;
        //
        //    var xref = new blr.W15yQC.pdfChecker.XRef(pdfStream);
        //    xref.setStartXRef(startxref);
        //    xref.parse(false);
        //    //blr.W15yQC.pdfChecker.log("\nXREF Parsed.");
        //
        //    var rootDict, value=false;
        //    try {
        //      rootDict = xref.trailer.get('Root');
        //      if (rootDict.has) {
        //        if (blr.W15yQC.pdfChecker.isLinearized(pdfStream, pdfStream.length)) {
        //          blr.W15yQC.pdfChecker.log("PDF is linearized.");
        //          results.isLinearized=true;
        //        } else {
        //          results.isLinearized=false;
        //        }
        //        if (rootDict.has('Outlines')) {
        //          results.hasOutline=true;
        //          //outline=rootDict.get('Outlines');
        //          //blr.W15yQC.pdfChecker.log("Outlines:"+blr.W15yQC.objectToString(outline));
        //        } else {
        //          results.hasOutline=false;
        //        }
        //        if (rootDict.has('StructTreeRoot')) {
        //          results.isStructured=true;
        //          blr.W15yQC.pdfChecker.log("Has StructTreeRoot");
        //          try {
        //            str = rootDict.get('StructTreeRoot');
        //            if (str!=null && str.has('Lang')) {
        //              results.defaultLang=str.get('Lang');
        //              if (blr.W15yQC.fnStringHasContent(results.defaultLang)) {
        //                blr.W15yQC.pdfChecker.log("Default Lang value set in StructTreeRoot:"+results.defaultLang);
        //              }
        //            }
        //          } catch(e) {
        //            blr.W15yQC.pdfChecker.error("Error reading structtreeroot:"+e);
        //          }
        //        } else {
        //          results.isStructured=false;
        //        }
        //        results.isTagged=false;
        //        if (rootDict.has('MarkInfo')) {
        //          mi = rootDict.get('MarkInfo');
        //          mi=mi.map.Marked;
        //          blr.W15yQC.pdfChecker.log('MarkInfo:'+mi);
        //          if (mi==true) {
        //            results.isTagged=true;
        //          }
        //        }
        //        if (blr.W15yQC.fnStringHasContent(results.defaultLang)==false && rootDict.has('Lang')) {
        //          value = rootDict.get('Lang');
        //          blr.W15yQC.pdfChecker.log('Root Dictionary Lang:'+value);
        //          if (blr.W15yQC.fnStringHasContent(value)) {
        //            results.defaultLang=value;
        //          }
        //        }
        //      } else {
        //        blr.W15yQC.pdfChecker.error('The document root directory could not be read.');
        //      }
        //    } catch (err) {
        //      blr.W15yQC.pdfChecker.error('The document root dictionary is invalid.'+err);
        //    }
        //
        //  } else {
        //    blr.W15yQC.pdfChecker.error("PDF file trailer and startxref NOT FOUND");
        //  }
        //} else {
        //  blr.W15yQC.pdfChecker.error("PDF Version NOT FOUND");
        //}
        //results.errors=(blr.W15yQC.pdfChecker.error==true);
        blr.W15yQC.pdfChecker.log('Results: '+blr.W15yQC.objectToString(results));
        return results;
  },

   getPDF: function(sURL, tb, re) {
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
          resolve(blr.W15yQC.pdfChecker.checkPDF(pdf));
        },
        function() {
          reject(null);
        });

     });
    }
};

