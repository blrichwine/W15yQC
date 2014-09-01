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

   rd: null, // Report Document
   logElement: null,
   re: null, // Report Element
   sURL: null,

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
        results.hasOutline=pdf.pdfInfo.outline!==null && pdf.pdfInfo.outline.length && pdf.pdfInfo.outline.length>1;
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
    var h,div,span,el,l,li, key, i;
    var rd=blr.W15yQC.pdfChecker.rd;
    var re=blr.W15yQC.pdfChecker.re;
    var ds=null;

    function renderElementStatistics(d) {
      var table, thead, tbody, tr, th, td, keys,i;
      table=rd.createElement('table');
      thead=rd.createElement('thead');
      tr=rd.createElement('tr');
      th=rd.createElement('th');
      th.setAttribute('scope','col');
      th.appendChild(rd.createTextNode('Element'));
      tr.appendChild(th);
      th=rd.createElement('th');
      th.setAttribute('scope','col');
      th.appendChild(rd.createTextNode('Count'));
      tr.appendChild(th);
      thead.appendChild(tr);
      table.appendChild(thead);
      tbody=rd.createElement('tbody')

      keys=Object.getOwnPropertyNames(ds.stats);
      if (keys!=null && keys.length>0) {
        keys=keys.sort();
        for (i=0;i<keys.length;i++) {
          tr=rd.createElement('tr');
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(keys[i]));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(ds.stats[keys[i]]));
          tr.appendChild(td);
          tbody.appendChild(tr);
        }
      }
      table.appendChild(tbody);
      d.appendChild(table);
    }

    function getTextForDocStructure(docStructure, re) {
      ds=docStructure;
      var dsStack=[ds], dsiIndexes=[0], dsi=0, pageCache={}, pgNum, pgTCCache={}, pgsInCache=[], K, text, item, bFound=false;

      //blr.W15yQC.pdfChecker.log('Starting getTextForDocStructure: ');

      function getNext() {
        if (dsStack[dsi][dsiIndexes[dsi]].children!=null && dsStack[dsi][dsiIndexes[dsi]].children.length>0) { // Children?
          dsStack.push(dsStack[dsi][dsiIndexes[dsi]].children);
          dsiIndexes.push(0);
          dsi++;
        } else if (dsiIndexes[dsi]<dsStack[dsi].length-1) { // More at this level
          dsiIndexes[dsi]++;
        } else while (dsi>0) { // Return to previous level
          dsi--;
          dsStack.pop();
          dsiIndexes.pop();
          if (dsiIndexes[dsi]<dsStack[dsi].length-1 || dsi==0) { // More at this level
            dsiIndexes[dsi]++;
            break;
          }
        }
      }

      function getTextForDsi() {
        var tc;
        //blr.W15yQC.pdfChecker.log('Starting getTextForDsi: ');
        while (dsiIndexes[dsi]<dsStack[dsi].length || dsi>0) {
            //blr.W15yQC.pdfChecker.log('Checking: '+dsStack[dsi][dsiIndexes[dsi]].S);
          if (/^H\d+$/i.test(dsStack[dsi][dsiIndexes[dsi]].S) && typeof dsStack[dsi][dsiIndexes[dsi]].Pg != 'undefined' && typeof dsStack[dsi][dsiIndexes[dsi]].K != 'undefined') {
            //blr.W15yQC.pdfChecker.log('Found: '+dsStack[dsi][dsiIndexes[dsi]].S);
            break;
          }
          getNext();
        }
        if (dsiIndexes[dsi]>=dsStack[dsi].length && dsi<1) {
          //blr.W15yQC.pdfChecker.log('Calling renderAndCheckDocStructure');
          renderAndCheckDocStructure(re);
        } else {
          pgNum=ds.pageIndexByRef[dsStack[dsi][dsiIndexes[dsi]].Pg.num][dsStack[dsi][dsiIndexes[dsi]].Pg.gen];
          K=dsStack[dsi][dsiIndexes[dsi]].K;
          //blr.W15yQC.pdfChecker.log('Page Number:'+pgNum+'  K:'+K);
          if (typeof pgTCCache[pgNum]!='undefined') {
            //blr.W15yQC.pdfChecker.log('Using Cache');
            tc=pgTCCache[pgNum];
            bFound=false;
            text=''
            for(item=0;item<tc.items.length;item++) {
              if (tc.items[item].mcid==K) {
                bFound=true;
                text=text+tc.items[item].str;
              } else if (bFound==true) {
                break;
              }
            }
            if(bFound) {
              dsStack[dsi][dsiIndexes[dsi]].text=text;
              //blr.W15yQC.pdfChecker.log('Found: '+text);
            } else {
              //blr.W15yQC.pdfChecker.log('Not Found: ');
            }
            getNext();
            getTextForDsi();
          } else {
            //blr.W15yQC.pdfChecker.log('Calling getPage');
            pdf.getPage(pgNum+1).then(function(page){
              page.getTextContent().then(function(tc){
                bFound=false;
                text=''
                for(item=0;item<tc.items.length;item++) {
                  if (tc.items[item].mcid==K) {
                    bFound=true;
                    text=text+tc.items[item].str;
                  } else if (bFound==true) {
                    break;
                  }
                }
                if(bFound) {
                  dsStack[dsi][dsiIndexes[dsi]].text=text;
                  //blr.W15yQC.pdfChecker.log('Found: '+text);
                } else {
                    //blr.W15yQC.pdfChecker.log('Not Found: ');
                }
                if (pgsInCache.length>4) {
                  pgTCCache[pgsInCache[0]]=null;
                  pgsInCache.shift();
                }
                pgTCCache[pgNum]=tc;
                pgsInCache.push(pgNum);
                getNext();
                getTextForDsi();
              })
            });
          }
        }
      }
      getTextForDsi();
    }

    function renderDocStructureLevel(o,el) {
      var oi,ol,oli, k,s, keys=['T','Lang','Alt','E','ActualText','Pg', 'K'];
      if (o!=null && o.length) {
        ol=rd.createElement('ul');
        for(oi=0;oi<o.length;oi++) {
          oli=rd.createElement('li');
          s='';
          for(k=0;k<keys.length;k++) {
            if (typeof o[oi][keys[k]] != 'undefined') {
              s=blr.W15yQC.fnJoin(s,'"'+keys[k]+'": '+blr.W15yQC.objectToString(o[oi][keys[k]],true),', ');
            }
          }
//          oli.appendChild(rd.createTextNode((ds.rm.hasOwnProperty(o[oi].S)?ds.rm[o[oi].S]+' ('+o[oi].S+')':o[oi].S)+
//                          (blr.W15yQC.fnStringHasContent(o[oi].T)?': '+o[oi].T:'')));
          oli.appendChild(rd.createTextNode((ds.rm.hasOwnProperty(o[oi].S)?ds.rm[o[oi].S]+' ('+o[oi].S+')':o[oi].S)+(typeof o[oi].text!='undefined'?': "'+o[oi].text+'"':'')+(s!=''?' {'+s+'}':'')));
          ol.appendChild(oli);
          if (o[oi].children!=null && o[oi].children.length>0) {
            renderDocStructureLevel(o[oi].children,oli);
          }
        }
        el.appendChild(ol);
      }
    }

    function renderAndCheckDocStructure(el) {
      var rm={}, rmi, ol, oli, div, p;
      //blr.W15yQC.pdfChecker.log('DS:'+blr.W15yQC.objectToString(ds));
      //blr.W15yQC.pdfChecker.log('Kids:'+blr.W15yQC.objectToString(ds.pages));

      h=rd.createElement('h2');
      h.appendChild(rd.createTextNode('Document Structure:'));
      el.appendChild(h);
      if (ds!=null && ds.RoleMap && ds.RoleMap!==null && ds.RoleMap.map!==null && ds.RoleMap.map.length>0) {
        h=rd.createElement('h3');
        h.appendChild(rd.createTextNode('Role Map:'));
        el.appendChild(h);
        ol=rd.createElement('ul');
        for(rmi in ds.RoleMap.map) {
          rm[rmi]=ds.RoleMap.map[rmi].name;
          oli=rd.createElement('li');
          oli.appendChild(rd.createTextNode('"'+rmi+'": "'+ds.RoleMap.map[rmi].name+'"'));
          ol.appendChild(oli);
        }
        el.appendChild(ol);
      } else {
        p=rd.createElement('p');
        p.appendChild(rd.createTextNode('No Role Map'));
        el.appendChild(p);
      }
      ds.rm=rm;
      h=rd.createElement('h3');
      h.appendChild(rd.createTextNode('Element Statistics:'));
      el.appendChild(h);
      div=rd.createElement('div');
      el.appendChild(div);
      renderElementStatistics(div);

      h=rd.createElement('h3');
      h.appendChild(rd.createTextNode('Structure:'));
      el.appendChild(h);
      div=rd.createElement('div');
      el.appendChild(div);
      renderDocStructureLevel(ds,div);
    }

    function renderOutlineLevel(o,el) {
      var oi,ol,oli;
      if (o!=null && o.length) {
        ol=rd.createElement('ul');
        for(oi=0;oi<o.length;oi++) {
          oli=rd.createElement('li');
          oli.appendChild(rd.createTextNode(o[oi].title));
          ol.appendChild(oli);
          if (o[oi].items!=null && o[oi].items.length>0) {
            renderOutlineLevel(o[oi].items,oli);
          }
        }
        el.appendChild(ol);
      }
    }

    if (pdf!=null && re!=null) {
      if (pdf.pdfInfo) {
        h=rd.createElement('h1');
        h.appendChild(rd.createTextNode('PDF Accessibility Report'));
        re.appendChild(h);

        h=rd.createElement('h2');
        h.appendChild(rd.createTextNode('PDF Info:'));
        re.appendChild(h);

        l=rd.createElement('ul');

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('URL: '+blr.W15yQC.pdfChecker.sURL));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Number of pages: '+pdf.pdfInfo.numPages));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Structured: '+(pdf.pdfInfo.isStructured==true?'Yes'+(pdf.pdfInfo.hasSuspects==true?', but has suspects':''):'No')));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Tagged: '+(pdf.pdfInfo.isTagged==true?'Yes':'No')));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Default language: '+pdf.pdfInfo.defaultLang));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Outline/Bookmarks: '+((pdf.pdfInfo.outline!==null && pdf.pdfInfo.outline.length && pdf.pdfInfo.outline.length>1)?'Yes':'No')));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Linearized: '+(pdf.pdfInfo.isLinearized==true?'Yes':'No')));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Encrypted: '+(pdf.pdfInfo.encrypted==true?'Yes':'No')));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Fingerprint: '+pdf.pdfInfo.fingerprint));
        l.appendChild(li);

        for(key in pdf.pdfInfo.info) {
          if (pdf.pdfInfo.info.hasOwnProperty(key)) {
            li=rd.createElement('li');
            li.appendChild(rd.createTextNode(key+': '+pdf.pdfInfo.info[key]));
            l.appendChild(li);
          }
        }
        re.appendChild(l);

        h=rd.createElement('h2');
        h.appendChild(rd.createTextNode('PDF Outline (Bookmarks):'));
        re.appendChild(h);

        renderOutlineLevel(pdf.pdfInfo.outline,re);
        if (pdf.pdfInfo.isStructured==true) {
          pdf.getDocumentStructure().then(function(ds){getTextForDocStructure(ds,re);});
        } else {
          h=rd.createElement('h2');
          h.appendChild(rd.createTextNode('No document structure'));
          re.appendChild(h);
        }
      }
    } else {
      blr.W15yQC.pdfChecker.log('Error: pdf or re objects are null');
    }
  },


   getPdfForFullCheck: function(sURL, rd, tb, iframe) {
      blr.W15yQC.pdfChecker.sURL=sURL;
      blr.W15yQC.pdfChecker.rd=iframe.contentDocument;
      blr.W15yQC.pdfChecker.logElement=tb;
      blr.W15yQC.pdfChecker.re = iframe.contentDocument.body;


    return new Promise(function(resolve, reject) {

      blr.W15yQC.pdfChecker.log('Requesting: '+sURL);
      blr.PDFJS.getDocument(sURL).then(
        function(pdf){
        //  function handleTextContent(tc) {
        //    if (tc!=null) {
        //      blr.W15yQC.pdfChecker.log('TC:'+blr.W15yQC.objectToString(tc));
        //    }
        //  }
        //  pdf.getPage(2).then(function(page){
        //    page.getTextContent().then(function(tc){
        //        handleTextContent(tc);
        //      })
        //  })
          blr.W15yQC.pdfChecker.log('Checking document.');
          resolve(blr.W15yQC.pdfChecker.getPdfFullCheckResults(pdf));
        },
        function() {
          reject(null);
        });

     });
    }
};
