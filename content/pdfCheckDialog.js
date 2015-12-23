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

 * File:        pdfCheckDialog.js
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
 *   http://www.pdfa.org/wp-content/uploads/2014/06/MatterhornProtocol_1-02.pdf
 *   http://www.udlcenter.org/sites/udlcenter.org/files/updateguidelines2_0.pdf
 *   http://www.udlcenter.org/sites/udlcenter.org/files/UDLinPostsecondary.pdf
 *   http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_reference_1-7.pdf
 *   http://www.adobe.com/enterprise/accessibility/pdfs/acro6_pg_ue.pdf
 *   http://www.csus.edu/accessibility/guides/creating_accessible_pdfs.pdf
 *   http://wac.osu.edu/pdf/why-pdf.pdf
 *
 * TODO:
 *
 *   Report on:
 *     # of figures
 *     # of pages
 *     # of headings
 *     # of tables
 *     # of links
 *     # of bookmarks
 *     # of characters
 *
 * Checks:
 *   PDF has XMP Meta Data
 *   Document title in XMP Meta Data
 *   Document title configured to display: DisplayDocTitle
 *   H1 heading present
 *   Heading numbering correct
 *   Headings have text
 *   Headings are not the same within a group of the same level
 *   All figures have Alt text
 *   All figures have Alt text that does not appear to be default
 *   All form controls have labels
 *   Only standard elements are used
 *   Structual element use / ordering appears valid
 *   All text content is covered by a language indication
 *   Table Checks:
 *    - Table is not nested
 *    - Table tag's children are valid
 *    - Caption tag is either the Table tag's first or last child
 *    - Caption has content and is not default text (if present)
 *    - Each row has the same number of cells as the first table row does
 *    - Each TD cell has a heading
 *    - Each ID listed in a Headers attribute exists in the table
 *
 */
"use strict";

var blr=this.arguments[0];
var ds=null;
var sURL=null;
var bAutoCheckPDF=(this.arguments.length>2 && this.arguments[2]==true)?true:false;
var bCmdIsPressed;

function check() {
  var tbURL=document.getElementById('tbURL'), butCheckPDF=document.getElementById('button-loadPDF');
  sURL=tbURL.value;
  ds=null;

  if (blr.W15yQC.fnAppearsToBeFullyQualifiedURL(sURL)||/^file:.+\.pdf$/i.test(sURL)) {
    tbURL.readOnly=true;
    butCheckPDF.disabled=true;
    getPdfForFullCheck(sURL);
  } else if(blr.W15yQC.fnStringHasContent(sURL)){
    alert('URL looks invalid: '+sURL);
  } else {
    alert('Provide a URL to the PDF in the textbox.');
  }
}

function makeSemanticView() {
  var dialogID, dialogPath;
  if(ds!==null) {
    dialogID = 'semanticPdfWindow';
    dialogPath = 'chrome://W15yQC/content/semanticPdfWindow.xul';
    window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen',blr,ds);
  } else {
    alert('No semantic structure');
  }
}

function makeScreenReaderView() {
  var dialogID, dialogPath;
  if(ds!==null) {
    dialogID = 'semanticPdfWindow';
    dialogPath = 'chrome://W15yQC/content/semanticPdfWindow.xul';
    window.openDialog(dialogPath, dialogID, 'chrome,resizable=yes,centerscreen',blr,ds,true);
  } else {
    alert('No semantic structure');
  }
}

function windowOnKeyDown(dialog, evt) {
  switch (evt.keyCode) {
    case 224:
      bCmdIsPressed = true;
      break;
    case 27:
      dialog.close();
      break;
    case 87:
      if (bCmdIsPressed == true) {
        evt.stopPropagation();
        evt.preventDefault();
        dialog.close();
      }
      break;
  }
}

function windowOnKeyUp(evt) {
  switch (evt.keyCode) {
    case 224:
      bCmdIsPressed = false;
      break;
  }
}


  function getPdfFullCheckResults(pdf,sURL,rd,re) {
    var standardElements=['Document', 'Part', 'Art', 'Sect', 'Div', 'BlockQuote', 'Caption',
    'TOC', 'TOCI', 'Index', 'NonStruct', 'Private', 'P', 'H', 'H1', 'H2', 'H3',
    'H4', 'H5', 'H6', 'L', 'LI', 'Lbl', 'LBody', 'Table', 'TR', 'TH', 'TD', 'THead',
    'TBody', 'TFoot', 'Span', 'Quote', 'Note', 'Reference', 'BibEntry',
    'Code', 'Link', 'Annot', 'Ruby', 'Warichu', 'RB', 'RT', 'RP', 'WT', 'WP',
    'Figure', 'Formula', 'Form'];

    var displayKeys=['T','Lang','A','Alt','E','ActualText','Desc','checked','ListNumbering', 'RowSpan','ColSpan','Headers','ID','Scope','Summary'];
    var tableData=[];
    var tableStack=[], currentTable=null;

    var FfBitNames={"1":"ReadOnly",
                    "2":"Required",
                    "3":"NoExport",
                    "13":"Multiline",
                    "14":"Password",
                    "15":"NoToggleToOff",
                    "16":"Radio",
                    "17":"PushButton",
                    "18":"Combo",
                    "19":"Edit",
                    "20":"Sort",
                    "21":"FileSelect",
                    "22":"MultiSelect",
                    "23":"DoNotSpellCheck",
                    "24":"DoNotScroll",
                    "25":"Comb",
                    "26":"RichText-RadiosInUnison",
                    "27":"CommitOnSelChange"};

    var h, div, span, el, l, li, key, i, meta, script, style, p, pre, m, sTitle;
    var prevPg=-19392, pgNum=1, numberOfPages=0, ticks=0;

    var formControlTypes = { "Btn":"Button",
                      "Tx":"Text",
                      "Ch":"Choice",
                      "Sig":"Signature"
                    };
Components.utils.import("resource://gre/modules/devtools/Console.jsm");
    var formControls=[];
    var figureTags=[];

    var results={ "bDocHasXmpMetaData":null,
                  "bDocTitleInXmpMetaData":null,
                  "bDocTitleConfiguredToDisplay":null,
                  "bIsStructuredNoSuspectsAndTagged":null,
                  "bNoErrorsParsingDocumentStructure":null,
                  "bH1Present":null,
                  "bFirstHeadingIsH1":null,
                  "bHeadingLevelsNotSkipped":null,
                  "bHeadingsAllHaveText":null,
                  "bHeadingsNotTheSameWithinALevel":null,
                  "bHeadingsAreAllExplicit":null,
                  "bHeadingsAreAllImplicit":null,
                  "bAllFiguresHaveAltText":null,
                  "bAllFiguresHaveAltTextNotDefault":null,
                  "bAllFormControlsHaveLabels":null,
                  "bAllFormControlsHaveUniqueLabels":null,
                  "bOnlyStandardTagsAreUsed":null,
                  "bTagUseAppearsValid":null,
                  "bAllTextContentHasMarkedLang":null
                };

    var tagNestingResults={
      "bNestedParagraphTags": [],
      "bNestedTableTags": [],
      "bNestedFormTags": [],
      "bNestedFigureTags": [],
      "bInvalidHeadingParent": [],
      "bNonEmptyHeadingTag": [],
      "bNonEmptyFigureTag": [],
      "bNonEmptyFormTag": [],
      "bMissingLabelOnFormTag": [],
      "bMissingAltTextOnFigureTag": [],
      "bInvalidUseOfTHead": [],
      "bInvalidUseOfTBody": [],
      "bInvalidUseOfTFoot": [],
      "bLIShouldBeInL": [],
      "bTOCIShouldBeInTOC:": []
    }

    function makeExpandoCollapsoHeading(sTagName, sText) {
      var hTag, aTag;
        switch (sTagName.toLowerCase()) {
            case 'h1':
              hTag=rd.createElement('h1');
              break;
            case 'h2':
              hTag=rd.createElement('h2');
              break;
            case 'h3':
              hTag=rd.createElement('h3');
              break;
            case 'h4':
              hTag=rd.createElement('h4');
              break;
            case 'h5':
              hTag=rd.createElement('h5');
              break;
            case 'h6':
              hTag=rd.createElement('h6');
              break;
            default:
              hTag=rd.createElement('h2');
        }
        aTag=rd.createElement('a');
        aTag.appendChild(rd.createTextNode(sText));
        aTag.setAttribute('onclick','ec(this);return false;');
        aTag.setAttribute('aria-expanded','true');
        aTag.setAttribute('href','#');
        hTag.appendChild(aTag);
        hTag.setAttribute('class','ec');
        return hTag;
    }
    function countOccurancesOf(s1, s2) {
      var count=0, pos=0;
      if (s2!=null && s1!=null && s2.length>0 && s1.length>0) {
        while(true) {
         pos=s2.indexOf(s1,pos);
         if (pos>0) {
          count++;
          pos+=s1.length;
         } else break;
        }
        // alert('"'+s1+'"  "'+s2+'" >> '+count);
        return count;
      }
      // alert('"'+s1+'"  "'+s2+'" >> '+0);
      return 0;
    }
    function appendReport() {
      var mainDiv, p;

      function buildTOC() {
        var elH1, el, div, ul1, ul2, cl, li, a, subHeadings=re.querySelectorAll('h2,h3'), i, hid, divBanner, divNav;

        elH1=rd.createElement('h1');
        elH1.appendChild(rd.createTextNode('PDF Accessibility Report'));
        elH1.setAttribute('tabindex','0');
        divBanner=rd.createElement('div');
        divBanner.setAttribute('role','banner');
        divBanner.appendChild(elH1);
        rd.body.appendChild(divBanner);

        ul1=rd.createElement('ul');
        cl=ul1;

        for(i=0;i<subHeadings.length;i++) {
          h=subHeadings[i];
          h.setAttribute('tabindex','-1');
          if (h.hasAttribute('id')) {
            hid=h.getAttribute('id');
          } else {
            hid='toc'+i.toString();
            h.setAttribute('id',hid);
          }
          if (h.nodeName.toLowerCase()=='h3' && cl===ul1 && li!=null) {
            ul2=rd.createElement('ul');
            li.appendChild(ul2);
            cl=ul2;
          } else if (h.nodeName.toLowerCase()!=='h3') {
            cl=ul1;
          }
          li=rd.createElement('li');
          a=rd.createElement('a');
          a.setAttribute('href','#'+hid);
          a.appendChild(rd.createTextNode(h.textContent.replace(/:$/,'')));
          a.setAttribute('onclick',"try{document.getElementById('"+hid+"').scrollIntoView(true);}catch(e){}window.setTimeout(function(){try{document.getElementById('"+hid+"').focus();document.getElementById('"+hid+"').firstChild.focus();}catch(e){}},10);");
          li.appendChild(a);
          cl.appendChild(li);
        }

        divNav=rd.createElement('div');
        divNav.setAttribute('role','navigation');
        el=rd.createElement('h2');
        el.appendChild(rd.createTextNode('Contents:'));
        el.setAttribute('tabindex','0');
        divNav.appendChild(el);
        divNav.appendChild(ul1);
        rd.body.appendChild(divNav);
      }

      while(rd!=null && rd.body!=null && rd.body.firstChild!=null) { // get rid of please wait message
        rd.body.removeChild(rd.body.firstChild);
      }
      rd.title=blr.W15yQC.fnStringHasContent(sTitle)?sTitle:sURL;

      buildTOC();

      mainDiv=rd.createElement('div');
      mainDiv.setAttribute('role','main');
      if (ds != null && ds.errors != null && ds.errors==true) {
        p=rd.createElement('p');
        p.setAttribute('class','dsReadError');
        p.appendChild(rd.createTextNode('Errors reading document structure. PDF might be corrupted.'));
        if (ds.errorMsg != null) {
          p.appendChild(rd.createTextNode(' '+ds.errorMsg));
        }
        mainDiv.appendChild(p);
      }
      mainDiv.appendChild(re);

      rd.body.appendChild(mainDiv); // append in the report
    }

    function log(s) {
     blr.W15yQC.fnDoEvents();
     document.getElementById('progressMeterLabel').value=s;
     blr.W15yQC.fnDoEvents();
    }

    function tick(p) {
      var progressPercentage=0;
      ticks++;
      if (p!=null && p>=0 && p<=100) {
        progressPercentage=p;
      } else if (numberOfPages>0) {
        progressPercentage=50*ticks/numberOfPages;
      } else {
        progressPercentage=ticks;
      }
      if (progressPercentage<1) {
        progressPercentage=1;
      } else if (progressPercentage>100) {
        progressPercentage=100;
      }
      blr.W15yQC.fnDoEvents();
      document.getElementById('progressMeter').value=progressPercentage;
      blr.W15yQC.fnDoEvents();
    }

    function renderResults() {
      var el=re.getElementById('a11yResults'), i, ul, li, span,
          resultKeys=['bIsStructuredNoSuspectsAndTagged',
                      'bNoErrorsParsingDocumentStructure',
                      'bOnlyStandardTagsAreUsed',
                      'bTagUseAppearsValid',
                      'bAllTextContentHasMarkedLang',
                      'bH1Present',
                      'bFirstHeadingIsH1',
                      'bHeadingLevelsNotSkipped',
                      'bHeadingsAllHaveText',
                      'bHeadingsNotTheSameWithinALevel',
                      'bHeadingsAreAllExplicit',
                      'bAllFiguresHaveAltText',
                      'bAllFiguresHaveAltTextNotDefault',
                      'bAllFormControlsHaveLabels',
                      'bAllFormControlsHaveUniqueLabels',
                      'bDocHasXmpMetaData',
                      'bDocTitleInXmpMetaData',
                      'bDocTitleConfiguredToDisplay'],
          resultChk =['The PDF is structured, contains no suspects, and is tagged',
                      'Document structure was parsed successfully',
                      'Only standard PDF tags are used',
                      'No invalid tag use was detected',
                      'All text content has a specified text language',
                      'The PDF contains a level one heading',
                      'The first heading in the PDF is a level 1 heading',
                      'No heading levels are skipped in the PDF',
                      'All headings in the PDF contain text',
                      'The text of headings of the same level within a section are all unique',
                      'All of the headings are explicit (H1, H2, H3, etc. -- no \'H\' tags)',
                      'All of the figures in the PDF have alternate text',
                      'None of the figure alternate text appear to be a default',
                      'All form controls have labels',
                      'All form controls have unique labels',
                      'The PDF contains XMP metadata',
                      'The PDF contains a document title in the XMP metadata',
                      'The PDF is configured to display the document title'],

      ul=rd.createElement('ul');
      for(i=0;i<resultKeys.length;i++) {
        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','a11yResultText')
        span.appendChild(rd.createTextNode(resultChk[i]));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        if (results[resultKeys[i]]===true) {
          span.appendChild(rd.createTextNode('Passed'));
          span.setAttribute('class','a11yPassResult');
        } else if (results[resultKeys[i]]===false) {
          span.appendChild(rd.createTextNode('FAILED'));
          span.setAttribute('class','a11yFailResult');
        } else {
          switch(resultKeys[i]) {

            case 'bAllFiguresHaveAltText':
            case 'bAllFiguresHaveAltTextNotDefault':
            case 'bOnlyStandardTagsAreUsed':
            case 'bTagUseAppearsValid':
              if (!pdf.pdfInfo.isStructured) {
                span.appendChild(rd.createTextNode('Not checked because: PDF is not structured.'));
              } else {
                span.appendChild(rd.createTextNode('??? Should be not checked because PDF is not structured, but PDF Info says PDF is structured.'));
              }
              break;

            case '':
              span.appendChild(rd.createTextNode('??? Not checked because: Check not yet implemented.'));
              break;

            case 'bAllFormControlsHaveLabels':
            case 'bAllFormControlsHaveUniqueLabels':
              if (!pdf.pdfInfo.isStructured) {
                span.appendChild(rd.createTextNode('Not checked because: PDF is not structured.'));
              } else {
                span.appendChild(rd.createTextNode('Not checked because: No form controls were found.'));
              }
              break;

            case 'bH1Present':
            case 'bFirstHeadingIsH1':
            case 'bHeadingLevelsNotSkipped':
            case 'bHeadingsAllHaveText':
            case 'bHeadingsNotTheSameWithinALevel':
            case 'bHeadingsAreAllExplicit':
              if (!pdf.pdfInfo.isStructured) {
                span.appendChild(rd.createTextNode('Not checked because: PDF is not structured.'));
              } else {
                span.appendChild(rd.createTextNode('Not checked because: PDF contains no headings.'));
              }
              break;

            case 'bDocHasXmpMetaData':
            case 'bDocTitleInXmpMetaData':
            case 'bDocTitleConfiguredToDisplay':
            case 'bAllTextContentHasMarkedLang':
            case 'bIsStructuredNoSuspectsAndTagged':
            case 'bNoErrorsParsingDocumentStructure':
            default:
              span.appendChild(rd.createTextNode('??? Not checked ???'));
          }
          span.setAttribute('class','a11yResultNotChecked');
        }
        li.appendChild(span);
        ul.appendChild(li);
      }

      el.appendChild(ul);
    }

    function renderElementStatistics(d) {
      var h, table, caption, thead, tbody, tr, th, td, keys, mappedKey, i, span, mappedStats={}, bNonStandardTags=false, p;
      h=rd.createElement('h4');
      h.appendChild(rd.createTextNode('Un-Mapped'));
      d.appendChild(h);
      table=rd.createElement('table');
      caption=rd.createElement('caption');
      caption.appendChild(rd.createTextNode('Table of the raw (unmapped) tag names used to mark up the document structure of the PDF.'));
      table.appendChild(caption);
      table.setAttribute('id','unMappedElements');
      thead=rd.createElement('thead');
      tr=rd.createElement('tr');
      th=rd.createElement('th');
      th.setAttribute('class','tagNameHeader');
      th.setAttribute('scope','col');
      th.appendChild(rd.createTextNode('Tag Name'));
      tr.appendChild(th);
      th=rd.createElement('th');
      th.setAttribute('class','tagNameStatsHeader');
      th.setAttribute('scope','col');
      th.appendChild(rd.createTextNode('Count'));
      tr.appendChild(th);
      thead.appendChild(tr);
      table.appendChild(thead);
      tbody=rd.createElement('tbody')

      keys=Object.getOwnPropertyNames(ds.stats);
      if (keys!=null && keys.length>0) {
        keys=keys.sort();
        for (i=0;i<standardElements.length;i++) {
          standardElements[i]=standardElements[i].toLowerCase();
        }
        for (i=0;i<keys.length;i++) {
          tr=rd.createElement('tr');
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(keys[i]));
          if (standardElements.indexOf(keys[i].toLowerCase())<0) {
            span=rd.createElement('span');
            span.setAttribute('class','nonStandardTag');
            span.setAttribute('title','Non-standard tag.');
            span.appendChild(rd.createTextNode(' *'));
            td.appendChild(span);
            bNonStandardTags=true;
          }
          tr.appendChild(td);
          td=rd.createElement('td');
          td.setAttribute('class','tagStat');
          td.appendChild(rd.createTextNode(ds.stats[keys[i]]));
          if (ds.rm.hasOwnProperty(keys[i])) {
            mappedKey=ds.rm[keys[i]];
          } else {
            mappedKey=keys[i];
          }
          if (mappedStats.hasOwnProperty(mappedKey)) {
            mappedStats[mappedKey]=mappedStats[mappedKey]+ds.stats[keys[i]];
          } else {
            mappedStats[mappedKey]=ds.stats[keys[i]];
          }
          tr.appendChild(td);
          tbody.appendChild(tr);
        }
      }
      table.appendChild(tbody);
      d.appendChild(table);
      if (bNonStandardTags) {
        p=rd.createElement('p');
        p.setAttribute('class','hasNonStandardTags');
        span=rd.createElement('span');
        span.setAttribute('class','nonStandardTag');
        span.appendChild(rd.createTextNode('*'));
        p.appendChild(span);
        p.appendChild(rd.createTextNode(' = Non-standard tag.'));
        d.appendChild(p);
      }

      if (ds.rm!=null && Object.getOwnPropertyNames(ds.rm).length>0) {
        bNonStandardTags=false;
        h=rd.createElement('h4');
        h.appendChild(rd.createTextNode('Mapped'));
        d.appendChild(h);
        table=rd.createElement('table');
        table.setAttribute('class','mappedTags');
        caption=rd.createElement('caption');
        caption.appendChild(rd.createTextNode('Table of tag names used to mark up the document structure of the PDF as translated by the PDF\'s role map entries.'));
        table.appendChild(caption);
        thead=rd.createElement('thead');
        tr=rd.createElement('tr');
        th=rd.createElement('th');
        th.setAttribute('class','tagNameHeader');
        th.setAttribute('scope','col');
        th.appendChild(rd.createTextNode('Tag Name'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.setAttribute('class','tagNameStatsHeader');
        th.setAttribute('scope','col');
        th.appendChild(rd.createTextNode('Count'));
        tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);
        tbody=rd.createElement('tbody')

        keys=Object.getOwnPropertyNames(mappedStats);
        if (keys!=null && keys.length>0) {
          keys=keys.sort();
          for (i=0;i<keys.length;i++) {
            tr=rd.createElement('tr');
            td=rd.createElement('td');
            td.appendChild(rd.createTextNode(keys[i]));
            if (standardElements.indexOf(keys[i].toLowerCase())<0) {
              span=rd.createElement('span');
              span.setAttribute('class','nonStandardTag');
              span.setAttribute('title','Non-standard tag.');
              span.appendChild(rd.createTextNode(' *'));
              td.setAttribute('class','error');
              td.appendChild(span);
              bNonStandardTags=true;
            }
            tr.appendChild(td);
            td=rd.createElement('td');
            td.setAttribute('class','tagStat');
            td.appendChild(rd.createTextNode(mappedStats[keys[i]]));
            tr.appendChild(td);
            tbody.appendChild(tr);
          }
        }
        table.appendChild(tbody);
        d.appendChild(table);
        if (bNonStandardTags) {
          p=rd.createElement('p');
          p.setAttribute('class','hasNonStandardTags');
          span=rd.createElement('span');
          span.setAttribute('class','nonStandardTag');
          span.appendChild(rd.createTextNode('*'));
          p.appendChild(span);
          p.appendChild(rd.createTextNode(' = Non-standard tag.'));
          d.appendChild(p);
        }
      }
    }

    function getTextForDocStructure(docStructure, re) {
      ds=docStructure;
      var rm={}, dsStack=[ds], dsiIndexes=[0], dsi=0, pageCache={}, pgNum, pgTCCache={}, pgsInCache=[],
          K, text, item, bFound=false, i=-1,
          h, div, ol, rmi, oli, p, keys, span;

      //console.log('Starting getTextForDocStructure: ');
      if (ds!=null) {
        ds.effectiveLanguages=[];
        ds.effectiveLanguagesPagesS=[];
        ds.effectiveLanguagesPagesE=[];
        ds.title=pdf.pdfInfo!==null?(pdf.pdfInfo.info!=null?pdf.pdfInfo.info.Title:null):null;
      }
      h=rd.createElement('h2');
      h.appendChild(rd.createTextNode('Document Structure:'));
      re.appendChild(h);
      if (ds!=null && typeof ds.RoleMap!='undefined' && ds.RoleMap!==null && typeof ds.RoleMap.map!='undefined') {
        re.appendChild(makeExpandoCollapsoHeading('h3','Role Map:'));
        //h=rd.createElement('h3');
        //h.appendChild(rd.createTextNode('Role Map:'));
        //h.setAttribute('onclick','ec(this)');
        //h.setAttribute('class','ec'); h.setAttribute('aria-expanded','true');
        //re.appendChild(h);
        div=rd.createElement('div');
        ol=rd.createElement('ul');
        keys=Object.getOwnPropertyNames(ds.RoleMap.map);
        if (keys!=null && keys.length>0) {
          keys=keys.sort();
          for (i=0;i<standardElements.length;i++) {
            standardElements[i]=standardElements[i].toLowerCase();
          }
          for (i=0;i<keys.length;i++) {
            oli=rd.createElement('li');

            rmi=keys[i];
            rm[rmi]=ds.RoleMap.map[rmi].name;

            if (keys[i]!=null && ds.RoleMap.map[rmi]!=null && ds.RoleMap.map[rmi].name != null) {
              oli.appendChild(rd.createTextNode('"'));
              span=rd.createElement('span');
              span.setAttribute('class','attr');
              span.appendChild(rd.createTextNode(rmi));
              oli.appendChild(span);
              oli.appendChild(rd.createTextNode('": "'));
              span=rd.createElement('span');
              span.setAttribute('class','attrValue');
              span.appendChild(rd.createTextNode(ds.RoleMap.map[rmi].name));
              oli.appendChild(span);
              oli.appendChild(rd.createTextNode('"'));

              if (standardElements.indexOf(rmi.toLowerCase())>=0) {
                oli.appendChild(rd.createTextNode(' ('));
                span=rd.createElement('span');
                span.appendChild(rd.createTextNode(' Warning '));
                span.setAttribute('class','warning');
                oli.appendChild(span);
                oli.appendChild(rd.createTextNode(': Redefining a standard element)'));
              }
              if (standardElements.indexOf(ds.RoleMap.map[rmi].name.toLowerCase())<0) {
                oli.appendChild(rd.createTextNode(' ('));
                span=rd.createElement('span');
                span.appendChild(rd.createTextNode(' ERROR '));
                span.setAttribute('class','error');
                oli.appendChild(span);
                oli.appendChild(rd.createTextNode(': Not mapped to a standard element)'));
              }
            } else {
              oli.appendChild(rd.createTextNode('Error in role map. Entry: '+i+', Key: '+keys[i]));
            }

            ol.appendChild(oli);
          }
          div.appendChild(ol);
          re.appendChild(div);
        }
      }
      if (i<0) {
        div=rd.createElement('div');
        p=rd.createElement('p');
        p.appendChild(rd.createTextNode('No Role Map'));
        div.appendChild(p);
        re.appendChild(div);
      }
      ds.rm=rm;

      function getNext(bDontDig) {
        if (bDontDig!==true && dsStack[dsi][dsiIndexes[dsi]].children!=null && dsStack[dsi][dsiIndexes[dsi]].children.length>0) { // Children?
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

      function getTextForDsi() { // TODO: Index MCID to Items to speed this up
        var tc, mcid;

        function filter(s) {
         if(s!==null && s.replace) {
          return s.replace(/^þÿ/,'');
         }
         return s;
        }

        //console.log('Starting getTextForDsi: ');
        while (dsiIndexes[dsi]<dsStack[dsi].length || dsi>0) {
            //console.log('Checking: '+dsStack[dsi][dsiIndexes[dsi]].S);
          if ((typeof dsStack[dsi][dsiIndexes[dsi]].Pg !== 'undefined') || (typeof dsStack[dsi][dsiIndexes[dsi]].MCID !== 'undefined') || (typeof dsStack[dsi][dsiIndexes[dsi]].StructParent !== 'undefined')) {
            //console.log('Found: '+dsStack[dsi][dsiIndexes[dsi]].S);
            break;
          }
          getNext();
        }
        if (dsiIndexes[dsi]>=dsStack[dsi].length && dsi<1) {
          //console.log('Calling renderAndCheckDocStructure');
          renderAndCheckDocStructure(re);
        } else {
            //console.log('Checking2: '+dsStack[dsi][dsiIndexes[dsi]].S);
            //console.log('Checking2: '+blr.W15yQC.objectToString(dsStack[dsi][dsiIndexes[dsi]]));
            //console.log('Checking2Index: '+blr.W15yQC.objectToString(ds.pageIndexByRef));
          if (typeof dsStack[dsi][dsiIndexes[dsi]].Pg!='undefined') { // Track the page number
            try {
              pgNum=ds.pageIndexByRef[dsStack[dsi][dsiIndexes[dsi]].Pg.num][dsStack[dsi][dsiIndexes[dsi]].Pg.gen];
            } catch(ex) { }
            getNext();
            getTextForDsi();
          } else if (typeof dsStack[dsi][dsiIndexes[dsi]].MCID!=='undefined' || typeof dsStack[dsi][dsiIndexes[dsi]].StructParent!=='undefined') {
            if (typeof dsStack[dsi][dsiIndexes[dsi]].StructParent!=='undefined') { //alert('here');
              mcid=dsStack[dsi][dsiIndexes[dsi]].StructParent;
              if (typeof dsStack[dsi][dsiIndexes[dsi]].P!='undefined') {
                try {
                  //alert('P:'+blr.W15yQC.objectToString(dsStack[dsi][dsiIndexes[dsi]].P));
                  pgNum=ds.pageIndexByRef[dsStack[dsi][dsiIndexes[dsi]].P.num][dsStack[dsi][dsiIndexes[dsi]].P.gen];
                } catch(ex) { alert('crap');}
              }
            } else {
              mcid=dsStack[dsi][dsiIndexes[dsi]].MCID;
            }
            //console.log('Page Number:'+pgNum+'  K:'+K);
            if (typeof pgTCCache[pgNum]!=='undefined') {
              //console.log('Using Cache');
              tc=pgTCCache[pgNum];
              bFound=false;
              text=''
              if (tc!==null && typeof tc.items!=='undefined') {
                for(item=0;item<tc.items.length;item++) {
                  if (tc.items[item].mcid!==null) {
                    for(i=0;i<tc.items[item].mcid.length;i++) {
                      if (mcid==tc.items[item].mcid[i]) {
                        bFound=true;
                        text=text+tc.items[item].str;
                        dsStack[dsi][dsiIndexes[dsi]].MCParams=typeof tc.items[item].mcparams!=='undefined'?tc.items[item].mcparams:null;
                        break;
                      }
                    }
                  }
                }
              }
              if(bFound) {
                dsStack[dsi][dsiIndexes[dsi]].text=filter(text);
                //console.log('Found: '+text);
              } else {
                dsStack[dsi][dsiIndexes[dsi]].text='';
                //console.log('Not Found: ');
              }
              getNext();
              getTextForDsi();
            } else {
              //console.log('Calling getPage');
              pdf.getPage(pgNum+1).then(function(page){
                page.getTextContent().then(function(tc){
                  bFound=false;
                  text=''
                  if (tc!==null && typeof tc.items!=='undefined') {
                    for(item=0;item<tc.items.length;item++) {
                      if (tc.items[item].mcid!==null) {
                        for(i=0;i<tc.items[item].mcid.length;i++) {
                          if (mcid==tc.items[item].mcid[i]) {
                            bFound=true;
                            text=text+tc.items[item].str;
                            dsStack[dsi][dsiIndexes[dsi]].MCParams=typeof tc.items[item].mcparams!=='undefined'?tc.items[item].mcparams:null;
                            break;
                          }
                        }
                      }
                    }
                  }
                  if(bFound) {
                    dsStack[dsi][dsiIndexes[dsi]].text=filter(text);
                    //console.log('Found: '+text);
                  } else {
                    dsStack[dsi][dsiIndexes[dsi]].text='';
                      //console.log('Not Found: ');
                  }
                  if (pgsInCache.length>100) {
                    pgTCCache[pgsInCache[0]]=null;
                    pgsInCache.shift();
                  }
                  //console.log("TC:\n"+blr.W15yQC.objectToString(tc)+"\n\n");
                  pgTCCache[pgNum]=tc;
                  pgsInCache.push(pgNum);
                  tick();
                  getNext();
                  getTextForDsi();
                })
              });
            }
          }
        }
      } // end function getTextForDsi

      getTextForDsi();
    }

    function renderHeadings(el) {
      var dsStack=[ds], dsiIndexes=[0], dsi=0, bFoundHeadings=false, p, ul, ul2, li, liSpan, prevHeadingLevel=0, lastHLevel, hLevel, hList=[], lStack=[], elType, i, j, t, span, liList, str, sEl;

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

      function getRecursiveText(o) {
        var rText='', oi;
        if (o===null) {
          return '';
        } else if (typeof o.MCID !== 'undefined') {
          rText=o.text;
        } else if (typeof o.ActualText!=='undefined') {
          rText=o.ActualText;
        } else if (typeof o.Alt!=='undefined') {
          rText=o.Alt;
        } else if (o.length || (typeof o.children!='undefined' && o.children.length)) {
          if (typeof o.children!='undefined') {
            o=o.children;
          }
          for(oi=0;oi<o.length;oi++) {
            if (typeof o[oi].MCID !== 'undefined') {
              rText+=o[oi].text;
            } else if (typeof o[oi].ActualText!=='undefined') {
              rText+=o[oi].ActualText;
            } else if (typeof o[oi].Alt!=='undefined') {
              rText+=o[oi].Alt;
            } else if (typeof o[oi].children !== 'undefined') {
              rText+=getRecursiveText(o[oi].children);
            }
          }
        }
        return rText;
      }

      lastHLevel=1;
      while (dsiIndexes[dsi]<dsStack[dsi].length) {
        while (dsiIndexes[dsi]<dsStack[dsi].length) {
          elType=(ds.rm.hasOwnProperty(dsStack[dsi][dsiIndexes[dsi]].S))?ds.rm[dsStack[dsi][dsiIndexes[dsi]].S]:dsStack[dsi][dsiIndexes[dsi]].S;
            //console.log('Checking: '+dsStack[dsi][dsiIndexes[dsi]].S);
          if (/^H\d*$/i.test(elType)) {
            break;
          }
          getNext();
        }
        if (dsiIndexes[dsi]>=dsStack[dsi].length && dsi<1) {
          //console.log('Calling renderAndCheckDocStructure');
          break;
        } else {
          t=getRecursiveText(dsStack[dsi][dsiIndexes[dsi]]);
          hLevel=/^H\d*$/i.test(elType)?parseInt(elType.substring(1),10):lastHLevel;
          hList.push({level:hLevel, text:t, S:elType});
          lastHLevel=hLevel;
          getNext();
        }
      }

      results.bH1Present=false;
      results.bFirstHeadingIsH1=true;
      results.bHeadingLevelsNotSkipped=true;
      results.bHeadingsAllHaveText=true;
      results.bHeadingsNotTheSameWithinALevel=true;
      results.bHeadingsAreAllExplicit=true;
      results.bHeadingsAreAllImplicit=true;

      if (hList.length>0) {
        prevHeadingLevel=1;
        ul=rd.createElement('ul');
        ul.setAttribute('id','headingList');
        lStack=[ul];
        for(i=0;i<hList.length;i++) {
          if (i==0 && hList[i].level!==1) {
            results.bFirstHeadingIsH1=false;
          }
          if (hList[i].level===1 && blr.W15yQC.fnStringHasContent(hList[i].text)) {
            results.bH1Present=true;
          }
          if (blr.W15yQC.fnStringHasContent(hList[i].text)==false) {
            results.bHeadingsAllHaveText=false;
          }
          hLevel=hList[i].level>0?hList[i].level:1;
          //blr.W15yQC.pdfCheckDialog.log('i:'+i+' hLevel:'+hLevel+' lStack.length:'+lStack.length);
          if (prevHeadingLevel<hLevel-1) {
            for(j=prevHeadingLevel+1;j<hLevel;j++) {
              li=rd.createElement('li');
              liSpan=rd.createElement('span');
              li.appendChild(liSpan);
              liSpan.setAttribute('class','error');
              liSpan.appendChild(rd.createTextNode('<H'+j+' - Skipped Heading Level>'));
              results.bHeadingLevelsNotSkipped=false;
              lStack[lStack.length-1].appendChild(li);
              ul2=rd.createElement('ul');
              li.appendChild(ul2);
              lStack.push(ul2);
            }
          } else if (prevHeadingLevel==hLevel-1) {
              if (i==0) {
                li=rd.createElement('li');
                liSpan=rd.createElement('span');
                li.appendChild(liSpan);
                liSpan.setAttribute('class','error');
                liSpan.appendChild(rd.createTextNode('<H1 - Skipped Heading Level>'));
                results.bHeadingLevelsNotSkipped=false;
                lStack[0].appendChild(li);
              }
              ul2=rd.createElement('ul');
              if (li==null) {
                lStack[lStack.length-1].appendChild(ul2);
              } else {
                li.appendChild(ul2);
              }

              lStack.push(ul2);
          } else if (prevHeadingLevel>hLevel) {
            for(j=prevHeadingLevel;j>hLevel;j--) {
              if(lStack.length>1) { lStack.pop(); }
            }
          }
          li=rd.createElement('li');
          liSpan=rd.createElement('span');
          if (!blr.W15yQC.fnStringHasContent(hList[i].text)) {
            liSpan.setAttribute('class','error');
          }
          li.appendChild(liSpan);
          span=rd.createElement('span');
          span.setAttribute('class','pdfTag');
          span.appendChild(rd.createTextNode('['+hList[i].S+']'))
          liSpan.appendChild(span);
          span=rd.createElement('span');
          span.setAttribute('class','punctuation');
          span.appendChild(rd.createTextNode(': '));
          liSpan.appendChild(span);
          span=rd.createElement('span');
          span.setAttribute('class','pdfTextContent');
          span.appendChild(rd.createTextNode(hList[i].text));
          liSpan.appendChild(span);

          if (lStack[lStack.length-1]!==null && blr.W15yQC.fnStringHasContent(hList[i].text)) {
            liList=lStack[lStack.length-1].children;
            str=hList[i].text.toLowerCase() // TODO: Fix this!!! QA This
            for(j=0;j<liList.length;j++) {
              sEl=liList[j].firstChild.querySelector('span.pdfTextContent');
              if (sEl!=null && blr.W15yQC.fnStringsEffectivelyEqual(sEl.textContent,str)) {
                results.bHeadingsNotTheSameWithinALevel=false;
                liSpan.setAttribute('class','error');
                sEl.parentNode.setAttribute('class','error');
              }
            }
          }
          lStack[lStack.length-1].appendChild(li);
          prevHeadingLevel=hLevel;
        }
        el.appendChild(lStack[0]);
      } else {
        p=rd.createElement('p');
        p.appendChild(rd.createTextNode('No Headings'));
        results.bFirstHeadingIsH1=false;
        results.bH1Present=false;
        results.bHeadingLevelsNotSkipped=false;
        results.bHeadingsAllHaveText=null;
        results.bHeadingsNotTheSameWithinALevel=null;
        el.appendChild(p);
      }
    }

    /*
     * punctuation: black
     * tag: green
     * attribute: red
     * attribute value: blue
     * text: orange
     */
    function renderDocStructureLevel(o,el,currentLang,sNesting) {
      var oi,ol,oli, k, l, s, errTxt, bFoundFormInAcroForm,
        efIndex, efPLen, span, bInBrackets, sTagName, sEndNesting, nObj, bThRowScope=false, bThColScope=false;

      if (sNesting==null || typeof sNesting=='undefined') {
        sNesting='';
      }

      function spanAttrValue(attr,attrClass,value,valueClass) {
        var df = document.createDocumentFragment(), span;
        if (!bInBrackets) {
          span=rd.createElement('span');
          span.setAttribute('class','punctuation');
          span.appendChild(rd.createTextNode(' {'));
          df.appendChild(span);
          bInBrackets=true;
        } else {
          span=rd.createElement('span');
          span.setAttribute('class','punctuation');
          span.appendChild(rd.createTextNode(', '));
          df.appendChild(span);
        }
        span=rd.createElement('span');
        span.setAttribute('class','punctuation');
        span.appendChild(rd.createTextNode('"'));
        df.appendChild(span);
        span=rd.createElement('span');
        span.setAttribute('class', attrClass);
        span.appendChild(rd.createTextNode(attr));
        df.appendChild(span);
        span=rd.createElement('span');
        span.setAttribute('class','punctuation');
        span.appendChild(rd.createTextNode('": "'));
        df.appendChild(span);
        span=rd.createElement('span');
        span.setAttribute('class', valueClass);
        span.appendChild(rd.createTextNode(value));
        df.appendChild(span);
        span=rd.createElement('span');
        span.setAttribute('class','punctuation');
        span.appendChild(rd.createTextNode('"'));
        df.appendChild(span);
        return df;
      }

      if (o!=null && o.length) {
        ol=rd.createElement('ul');
        for(oi=0;oi<o.length;oi++) {
          oli=rd.createElement('li');
          s='';
          sTagName='';
          errTxt='';
          try{
            if (o[oi].Pg!=null && typeof o[oi].Pg.num!='undefined' && typeof o[oi].Pg.gen!='undefined') {
              pgNum=ds.pageIndexByRef[o[oi].Pg.num][o[oi].Pg.gen]+1;
            } else if (/^(l|table|thead|tbody|tfoot|art|div|form|part|sect)$/i.test(ds.rm.hasOwnProperty(o[oi].S)?ds.rm[o[oi].S]:o[oi].S) && o[oi].children!=null && o[oi].children.length>0 &&
                       typeof o[oi].children[0].Pg!='undefined' && typeof o[oi].children[0].Pg.gen!='undefined') {
              pgNum=ds.pageIndexByRef[o[oi].children[0].Pg.num][o[oi].children[0].Pg.gen]+1;
            }
          } catch(ex) {}
          if (pgNum!=prevPg) {
            if(prevPg>0) { oli.setAttribute('class','newPage'); }
            prevPg=pgNum;
            s=blr.W15yQC.fnJoin(s,'Page: '+pgNum,', ');
            tick();
          }
          if (typeof o[oi].Lang != 'undefined') {
            currentLang=o[oi].Lang;
          } else if (typeof o[oi].MCParams!='undefined' && o[oi].MCParams.Lang!==null ) {
            currentLang=o[oi].MCParams.Lang;
          }
          if (typeof o[oi].MCID !== 'undefined' || typeof o[oi].Alt !== 'undefined' || typeof o[oi].ActualText !== 'undefined') {
            if (currentLang==='') {
              errTxt=blr.W15yQC.fnJoin(errTxt, '[Natural language is UNDEFINED]', ', ');
              efIndex=ds.effectiveLanguages.indexOf('UNDEFINED');
              results.bAllTextContentHasMarkedLang=false;
            } else {
              efIndex=ds.effectiveLanguages.indexOf(currentLang);
            }
            if (efIndex<0) {
              ds.effectiveLanguages.push(currentLang!==''?currentLang:'UNDEFINED');
              ds.effectiveLanguagesPagesS.push([pgNum]);
              ds.effectiveLanguagesPagesE.push([pgNum]);
            } else {
              efPLen=ds.effectiveLanguagesPagesS[efIndex].length;
              if(pgNum!== ds.effectiveLanguagesPagesE[efIndex][efPLen-1]) {
                if(pgNum == ds.effectiveLanguagesPagesE[efIndex][efPLen-1]+1) {
                  ds.effectiveLanguagesPagesE[efIndex][efPLen-1]=pgNum;
                } else if(pgNum < ds.effectiveLanguagesPagesS[efIndex][efPLen-1]) { // TODO: Find existing range or add new one
                  var bRangeFound=false;
                  for(var ii=0;ii<efPLen;ii++) {
                    if (pgNum >= ds.effectiveLanguagesPagesS[efIndex][ii] && pgNum <= ds.effectiveLanguagesPagesE[efIndex][ii]) {
                      bRangeFound=true;
                      break;
                    }
                  }
                  if (!bRangeFound) {
                    ds.effectiveLanguagesPagesS[efIndex].push(pgNum);
                    ds.effectiveLanguagesPagesE[efIndex].push(pgNum);
                  }
                } else if (pgNum > ds.effectiveLanguagesPagesE[efIndex][efPLen-1]+1 && efPLen<20) {
                  ds.effectiveLanguagesPagesS[efIndex].push(pgNum);
                  ds.effectiveLanguagesPagesE[efIndex].push(pgNum);
                }
              }
            }
          }
          if (typeof o[oi].S!='undefined' && o[oi].S!=null) {
            if (ds.rm.hasOwnProperty(o[oi].S) && ds.rm[o[oi].S]!=null) {
              span=rd.createElement('span');
              if (standardElements.indexOf(ds.rm[o[oi].S].toLowerCase())>=0) {
                span.setAttribute('class','pdfTag');
                if (/^figure$/i.test(ds.rm[o[oi].S])) {
                  if(blr.W15yQC.fnStringHasContent(o[oi]['Alt'])==false) {
                    results.bAllFiguresHaveAltText=false;
                  } else if(blr.W15yQC.fnAppearsToBeDefaultAltText(o[oi]['Alt'])) {
                    results.bAllFiguresHaveAltTextNotDefault=false;
                  }
                }
              } else {
                span.setAttribute('class','pdfTag nonStandardTag');
                results.bOnlyStandardTagsAreUsed=false;
              }
              sTagName=ds.rm[o[oi].S];
              span.appendChild(rd.createTextNode('<'+ds.rm[o[oi].S]+'>'));
              oli.appendChild(span);
              span=rd.createElement('span');
              span.setAttribute('class','punctuation');
              span.appendChild(rd.createTextNode(' ('));
              oli.appendChild(span);
              span=rd.createElement('span');
              span.setAttribute('class','mappedPdfTag');
              span.appendChild(rd.createTextNode(o[oi].S));
              oli.appendChild(span);
              span=rd.createElement('span');
              span.setAttribute('class','punctuation');
              span.appendChild(rd.createTextNode(')'));
              oli.appendChild(span);
            } else {
              span=rd.createElement('span');
              if (o[oi].S!==null && standardElements.indexOf(o[oi].S.toLowerCase())>=0) {
                span.setAttribute('class','pdfTag');
                if (/figure/i.test(o[oi].S)) {
                  if(blr.W15yQC.fnStringHasContent(o[oi]['Alt'])==false) {
                    results.bAllFiguresHaveAltText=false;
                  } else if(blr.W15yQC.fnAppearsToBeDefaultAltText(o[oi]['Alt'])) {
                    results.bAllFiguresHaveAltTextNotDefault=false;
                  }
                }
              } else {
                span.setAttribute('class','pdfTag nonStandardTag');
                results.bOnlyStandardTagsAreUsed=false;
              }
              sTagName=o[oi].S;
              span.appendChild(rd.createTextNode('<'+o[oi].S+'>'));
              oli.appendChild(span);
            }
          } else if (typeof o[oi].MCID!='undefined') {
//            oli.appendChild(rd.createTextNode((typeof o[oi].MCParams!='undefined'?o[oi].MCParams.type:'')+'[MCID='+o[oi].MCID+(typeof o[oi].MCParams!='undefined' && o[oi].MCParams.Lang!==null ?', Lang="'+o[oi].MCParams.Lang+'"':'')+']'+(typeof o[oi].text!='undefined'?':'+o[oi].text:'')));
            if (typeof o[oi].MCParams!='undefined') {
              span=rd.createElement('span');
              span.setAttribute('class','contentTag');
              span.appendChild(rd.createTextNode(o[oi].MCParams.type));
              oli.appendChild(span);
            }
            span=rd.createElement('span');
            span.setAttribute('class','punctuation');
            span.appendChild(rd.createTextNode('['));
            oli.appendChild(span);
            span=rd.createElement('span');
            span.setAttribute('class','attr');
            span.appendChild(rd.createTextNode('MCID'));
            oli.appendChild(span);
            span=rd.createElement('span');
            span.setAttribute('class','punctuation');
            span.appendChild(rd.createTextNode('='));
            oli.appendChild(span);
            span=rd.createElement('span');
            span.setAttribute('class','attrValue');
            span.appendChild(rd.createTextNode(o[oi].MCID));
            oli.appendChild(span);
            if (typeof o[oi].MCParams!='undefined' && o[oi].MCParams.Lang!==null) {
              span=rd.createElement('span');
              span.setAttribute('class','punctuation');
              span.appendChild(rd.createTextNode(', '));
              oli.appendChild(span);
              span=rd.createElement('span');
              span.setAttribute('class','attr');
              span.appendChild(rd.createTextNode('Lang'));
              oli.appendChild(span);
              span=rd.createElement('span');
              span.setAttribute('class','punctuation');
              span.appendChild(rd.createTextNode('="'));
              oli.appendChild(span);
              span=rd.createElement('span');
              span.setAttribute('class','attrValue');
              span.appendChild(rd.createTextNode(o[oi].MCParams.Lang));
              oli.appendChild(span);
              span=rd.createElement('span');
              span.setAttribute('class','punctuation');
              span.appendChild(rd.createTextNode('"'));
              oli.appendChild(span);
            }
            span=rd.createElement('span');
            span.setAttribute('class','punctuation');
            span.appendChild(rd.createTextNode(']'));
            oli.appendChild(span);
            if (typeof o[oi].text!='undefined') {
              span=rd.createElement('span');
              span.setAttribute('class','pdfTextContent');
              if (o[oi].text!=null) {
                span.appendChild(rd.createTextNode(': '+o[oi].text.replace(//g,'▪').replace(//g,'•').replace(//g,'•').replace(//g,'•')));
              } else {
                span.appendChild(rd.createTextNode(': '+o[oi].text));
              }
              oli.appendChild(span);
              if (currentTable!==null && /\|\s*Caption\s*(\|\s*P)?\s*\|?\s*$/.test(sNesting)) {
                tableData[currentTable].captionText=blr.W15yQC.fnJoin(tableData[currentTable].captionText, o[oi].text, '');
              }
            }
          } else {
            span=rd.createElement('span');
            span.setAttribute('class','structureError');
            span.appendChild(rd.createTextNode('ERROR'));
            oli.appendChild(span);
          }
          bInBrackets=false;
          if (s!=='') {
            oli.appendChild(spanAttrValue('Page','attr',pgNum,'attrValue'));
          }
          if (errTxt!=='') {
            span=rd.createElement('span');
            span.setAttribute('class','punctuation');
            span.appendChild(rd.createTextNode(' ['));
            oli.appendChild(span);
            span=rd.createElement('span');
            span.setAttribute('class','errorText');
            span.appendChild(rd.createTextNode(errTxt));
            oli.appendChild(span);
            span=rd.createElement('span');
            span.setAttribute('class','punctuation');
            span.appendChild(rd.createTextNode(']'));
            oli.appendChild(span);
          }
          if (/^form$/i.test(sTagName)) { // TODO: Does this need to be limited to valid form tags? (ones with FT values?)
            //alert("Form:"+blr.W15yQC.objectToString(o[oi].objr));
            if(results.bAllFormControlsHaveLabels===null) { // Must be first form control
              formControls=[];
              results.bAllFormControlsHaveLabels=true;
              results.bAllFormControlsHaveUniqueLabels=true;
            }
            bFoundFormInAcroForm=false;
            //for(k=0;k<ds.formFields.length;k++) {
            //  if (ds.formFields[k].AnnotObjr!=null) {
            //    if (ds.formFields[k].AnnotObjr.gen===o[oi].objr.AnnotObjr.gen && ds.formFields[k].AnnotObjr.num===o[oi].objr.AnnotObjr.num) {
            //      bFoundFormInAcroForm=true;
            //      //alert(blr.W15yQC.objectToString(ds.formFields[k]));
            //      formControls.push({"FT":ds.formFields[k].FT, "Ff":ds.formFields[k].Ff, "T":ds.formFields[k].T, "TU":ds.formFields[k].TU, "Opt":null, "V":null, "Pg":null, "Unique":true});
            //      if (ds.formFields[k].FT!=null) {
            //        o[oi].objr.FT=ds.formFields[k].FT;
            //      }
            //      if (ds.formFields[k].Ff!=null) {
            //        o[oi].objr.Ff=ds.formFields[k].Ff;
            //      }
            //      if (ds.formFields[k].T!=null) {
            //        o[oi].objr.T=ds.formFields[k].T;
            //      }
            //      if (ds.formFields[k].TU!=null) {
            //        o[oi].objr.TU=ds.formFields[k].TU;
            //      }
            //      //alert(blr.W15yQC.objectToString(formControls[formControls.length-1]));
            //      break;
            //    }
            //  }
            //}

            formControls.push({"FT":null, "Ff":null, "T":null, "TU":null, "Opt":null, "V":null, "Pg":null, "Unique":true});

            k=formControls.length-1;
//alert(blr.W15yQC.objectToString(o[oi]));
            if (typeof o[oi].objr!='undefined') {
              if (typeof o[oi].objr.FT!='undefined' && formControls[k].FT===null) {
                formControls[k].FT=o[oi].objr.FT;
              }
              if (typeof o[oi].objr.TU!='undefined' && formControls[k].TU===null) {
                formControls[k].TU=o[oi].objr.TU;
              }
              if (typeof o[oi].objr.Ff!='undefined' && formControls[k].Ff===null) {
                formControls[k].Ff=o[oi].objr.Ff;
              }
              if (typeof o[oi].objr.T!='undefined' && formControls[k].T===null) {
                formControls[k].T=o[oi].objr.T;
              }
              if (typeof o[oi].objr.Opt!='undefined' && formControls[k].Opt===null) {
                formControls[k].Opt=o[oi].objr.Opt;
              }
              if (typeof o[oi].objr.V!='undefined' && formControls[k].V===null) {
                formControls[k].V=o[oi].objr.V;
              }
            }
            if (!blr.W15yQC.fnStringHasContent(formControls[k].TU)) {
              results.bAllFormControlsHaveLabels=false;
            }
            formControls[k].Pg=pgNum;
            for(l=0;l<k;l++) {
              if (blr.W15yQC.fnStringsEffectivelyEqual(formControls[k].TU,formControls[l].TU)) {
                formControls[k].Unique=false;
                formControls[l].Unique=false;
                results.bAllFormControlsHaveUniqueLabels=false;
              }
            }
          } else if (/^H$/i.test(sTagName)) {
            //alert(sTagName);
            results.bHeadingsAreAllExplicit=false;
          } else if (/^H\d+$/i.test(sTagName)) {
            //alert(sTagName);
            results.bHeadingsAreAllImplicit=false;
          } else if (/^figure$/i.test(sTagName)) {
            if(blr.W15yQC.fnStringHasContent(o[oi]['Alt'])==false) {
              results.bAllFiguresHaveAltText=false;
            } else if(blr.W15yQC.fnAppearsToBeDefaultAltText(o[oi]['Alt'])) {
              results.bAllFiguresHaveAltTextNotDefault=false;
            }
            figureTags.push({"Alt":o[oi]['Alt'], "ActualText":o[oi]['ActualText'], "Pg":pgNum});
          } else if (/^Table$/.test(sTagName)) {
            // log new table
            // log page #
            // log nesting level
            // set columnCount to 0
            // set rowCount to 0
            // init columnRowCount totals to 0
            // init Table ID hash
            // init Notes to ""
            tableData.push({"Pg":pgNum, "columnCount":0, "bRowHeading":false, "bNotAllTDCellsHaveHeaders":false, "columnHasHeading":[], "rowSpans":[],
                            "nestingLevel":countOccurancesOf('Table',sNesting), "firstRowColumnCount":0, "thisRowColumnCount":0,
                            "bInRow":false, "rowCount":0, "IDs":{}, "headerIDs":[], "bComplexTable":false, "captionText":null,
                            "notes":[]});
            currentTable=tableData.length-1;
            tableStack.push(currentTable);
          } else if (/^Caption$/.test(sTagName) && /\bTable$/.test(sNesting)) {
            if (oi>1) {
              tableData[currentTable].notes.push("Caption tag not first child in the table.");
            }
          } else if (/^TR$/.test(sTagName) && /\bTable\b/.test(sNesting)) {
            tableData[currentTable].bInRow=true;
            tableData[currentTable].bRowHeading=false;
            tableData[currentTable].rowCount++;
            tableData[currentTable].thisRowColumnCount=0;
          } else if (/^TH$/.test(sTagName) && /\bTable\b/.test(sNesting)) {
            while (tableData[currentTable].rowSpans.length<tableData[currentTable].thisRowColumnCount+1) {
              tableData[currentTable].rowSpans.push(0);
            }
            while (tableData[currentTable].rowSpans[tableData[currentTable].thisRowColumnCount]>0) {
              tableData[currentTable].thisRowColumnCount++;
            }
            if (o[oi].A != null && /row|both/i.test(o[oi].A.Scope) || (tableData[currentTable].rowCount>1 && tableData[currentTable].thisRowColumnCount<1)) {
              bThRowScope=true;
              tableData[currentTable].bRowHeading=true;
            } else {
              bThRowScope=false;
            }
            if (o[oi].A != null && /col|both/i.test(o[oi].A.Scope) || tableData[currentTable].rowCount==1) {
              bThColScope=true;
            } else {
              bThColScope=false;
            }
            if (tableData[currentTable].bInRow!==true) {
              tableData[currentTable].notes.push("TH tag without being in a TR tag.");
            }
            if (o[oi].A != null && o[oi].A.ColSpan>1) {
              if (o[oi].A.RowSpan>0) {
                for(i=0;i<o[oi].A.ColSpan;i++) {
                  while (tableData[tableData[currentTable].currentTable].rowSpans.length<tableData[currentTable].thisRowColumnCount+i+1) {
                    tableData[tableData[currentTable].currentTable].rowSpans.push(0);
                  }
                  tableData[currentTable].rowSpans[tableData[currentTable].thisRowColumnCount+i]=o[oi].A.RowSpan;
                }
              }
              tableData[currentTable].thisRowColumnCount=tableData[currentTable].thisRowColumnCount+o[oi].A.ColSpan;
              tableData[currentTable].bComplexTable=true;
            } else {
              if (o[oi].A!=null && o[oi].A.RowSpan>1) {
                while (tableData[currentTable].rowSpans.length<tableData[currentTable].thisRowColumnCount+1) {
                  tableData[tableData[currentTable].currentTable].rowSpans.push(0);
                }
                tableData[currentTable].rowSpans[tableData[currentTable].thisRowColumnCount]=o[oi].A.RowSpan;
              }
              tableData[currentTable].thisRowColumnCount=tableData[currentTable].thisRowColumnCount+1;
            }
            while(tableData[currentTable].columnHasHeading.length<tableData[currentTable].thisRowColumnCount) {
              tableData[currentTable].columnHasHeading.push(bThColScope);
            }
            if (o[oi].A != null && o[oi].A.RowSpan>1) {
              tableData[currentTable].bComplexTable=true;
            }
          } else if (/^TD$/.test(sTagName) && /\bTable\b/.test(sNesting)) {
            while (tableData[currentTable].rowSpans.length<tableData[currentTable].thisRowColumnCount+1) {
              tableData[currentTable].rowSpans.push(0);
            }
            while (tableData[currentTable].rowSpans[tableData[currentTable].thisRowColumnCount]>0) {
              tableData[currentTable].thisRowColumnCount++;
            }
            if (tableData[currentTable].bInRow!==true) {
              tableData[currentTable].notes.push("TD tag without being in a TR tag.");
            }
            if (o[oi].A != null && o[oi].A.ColSpan>1) {
              if (o[oi].A.RowSpan>0) {
                for(i=0;i<o[oi].A.ColSpan;i++) {
                  while (tableData[currentTable].rowSpans.length<tableData[currentTable].thisRowColumnCount+i+1) {
                    tableData[tableData[currentTable].currentTable].rowSpans.push(0);
                  }
                  tableData[currentTable].rowSpans[tableData[currentTable].thisRowColumnCount+i]=o[oi].A.RowSpan;
                }
              }
              tableData[currentTable].thisRowColumnCount=tableData[currentTable].thisRowColumnCount+o[oi].A.ColSpan;
              tableData[currentTable].bComplexTable=true;
            } else {
              if (o[oi].A!=null && o[oi].A.RowSpan>1) {
                while (tableData[currentTable].rowSpans.length<tableData[currentTable].thisRowColumnCount+1) {
                  tableData[tableData[currentTable].currentTable].rowSpans.push(0); // make sure rowSpans array is long enough
                }
                tableData[currentTable].rowSpans[tableData[currentTable].thisRowColumnCount]=o[oi].A.RowSpan;
              }
              tableData[currentTable].thisRowColumnCount=tableData[currentTable].thisRowColumnCount+1;
            }
            while(tableData[currentTable].columnHasHeading.length<tableData[currentTable].thisRowColumnCount) {
              tableData[currentTable].columnHasHeading.push(false);
            }
            if (tableData[currentTable].bRowHeading!=true && (tableData[currentTable].columnHasHeading.length<tableData[currentTable].thisRowColumnCount || tableData[currentTable].columnHasHeading[tableData[currentTable].thisRowColumnCount-1]!=true)) {
              tableData[currentTable].bNotAllTDCellsHaveHeaders=true;
            }
            if (o[oi].A != null && o[oi].A.RowSpan>1) {
              tableData[currentTable].bComplexTable=true;
            }
          }

          for(k=0;k<displayKeys.length;k++) {
            if (typeof o[oi][displayKeys[k]] != 'undefined') {
              //s=blr.W15yQC.fnJoin(s,'"'+displayKeys[k]+'": '+blr.W15yQC.objectToString(o[oi][displayKeys[k]],true),', ');
              oli.appendChild(spanAttrValue(displayKeys[k],'attr', /string/i.test(typeof o[oi][displayKeys[k]])?o[oi][displayKeys[k]]:blr.W15yQC.objectToString(o[oi][displayKeys[k]],true),'attrValue'));
            }
          }
          if (typeof o[oi].objr!='undefined') {
            if (typeof o[oi].objr.FT!='undefined') {
              oli.appendChild(spanAttrValue('Obj.FT','attr',o[oi].objr.FT,'attrValue'));
            }
            if (typeof o[oi].objr.Ff!='undefined') {
              oli.appendChild(spanAttrValue('Obj.Ff','attr',o[oi].objr.Ff,'attrValue'));
            }
            if (typeof o[oi].objr.T!='undefined') {
              oli.appendChild(spanAttrValue('Obj.T','attr',o[oi].objr.T,'attrValue'));
            }
            if (typeof o[oi].objr.TU!='undefined') {
              oli.appendChild(spanAttrValue('Obj.TU','attr',o[oi].objr.TU,'attrValue'));
            }
            if (typeof o[oi].objr.StructParent!='undefined') {
              oli.appendChild(spanAttrValue('Obj.StructParent','attr',o[oi].objr.StructParent,'attrValue'));
            }
            if (typeof o[oi].objr.TU!='undefined') {
              oli.appendChild(spanAttrValue('Obj.TU','attr',o[oi].objr.TU,'attrValue'));
            }
            if (typeof o[oi].objr.Opt!='undefined') {
              oli.appendChild(spanAttrValue('Obj.Opt','attr',o[oi].objr.Opt,'attrValue'));
            }
            if (typeof o[oi].objr.V!='undefined') {
              oli.appendChild(spanAttrValue('Obj.V','attr',o[oi].objr.V,'attrValue'));
            }
          }

          if (bInBrackets) {
            span=rd.createElement('span');
            span.setAttribute('class','punctuation');
            span.appendChild(rd.createTextNode('}'));
            oli.appendChild(span);
          }
          bInBrackets=false;
          ol.appendChild(oli);

          if(sTagName!=='') {
            sEndNesting=sNesting===''?sTagName:sNesting+' | '+sTagName;
          } else {
            sEndNesting=sNesting;
          }
          if (o[oi].children!=null && o[oi].children.length>0) {
            if (results.bAllFiguresHaveAltText===null) {
              results.bAllFiguresHaveAltText=true;
              results.bAllFiguresHaveAltTextNotDefault=true;
              results.bOnlyStandardTagsAreUsed=true;
              results.bAllTextContentHasMarkedLang=true;
            }

            renderDocStructureLevel(o[oi].children,oli, currentLang, sEndNesting);

          } else {
            if (sTagName!='' || blr.W15yQC.fnStringHasContent(sEndNesting)) {
              if (blr.W15yQC.pdfTagNestingHash.hasItem(sEndNesting)) {
                nObj=blr.W15yQC.pdfTagNestingHash.getItem(sEndNesting);
                nObj[0]++;
                if (nObj[1][nObj[1].length-1]!==pgNum && nObj[1].length<20) {
                  nObj[1].push(pgNum);
                }
                blr.W15yQC.pdfTagNestingHash.setItem(sEndNesting,nObj);
              } else {
                blr.W15yQC.pdfTagNestingHash.setItem(sEndNesting,[1,[pgNum]]);
              }
            }
          }

          if (/^Table$/.test(sTagName) && tableStack.length>0) {
            if (tableData[currentTable].nestingLevel>0) {
              tableData[currentTable].notes.push('Table is nested in '+tableData[currentTable].nestingLevel+' other table(s).');
            }
            if (tableData[currentTable].bComplexTable==true) {
              tableData[currentTable].notes.push('Table is complex.');
            }
            if (tableData[currentTable].bNotAllTDCellsHaveHeaders==true) {
              tableData[currentTable].notes.push('Not all TD cells have a header.');
            }
            tableStack.pop();
            if (tableStack.length>0) {
              currentTable=tableStack[tableStack.length-1];
            } else {
              currentTable=null;
            }
          } else if (/^TR$/.test(sTagName) && tableStack.length>0) {
            // alert(tableData[currentTable].rowCount+' - '+tableData[currentTable].thisRowColumnCount+' - '+blr.W15yQC.objectToString(tableData[currentTable].rowSpans)+' - '+blr.W15yQC.objectToString(tableData[currentTable].columnHasHeading));
            while (tableData[currentTable].rowSpans.length>tableData[currentTable].thisRowColumnCount && tableData[currentTable].rowSpans[tableData[currentTable].thisRowColumnCount]>0) {
              tableData[currentTable].thisRowColumnCount=tableData[currentTable].thisRowColumnCount+1;
              // alert(tableData[currentTable].rowCount+' - '+tableData[currentTable].thisRowColumnCount+' - '+blr.W15yQC.objectToString(tableData[currentTable].rowSpans));
            }
            if (tableData[currentTable].rowCount==1) {
              tableData[currentTable].firstRowColumnCount=tableData[currentTable].thisRowColumnCount;
            }
            if (tableData[currentTable].firstRowColumnCount<1) {
              tableData[currentTable].notes.push('First row has zero columns.');
            } else if (tableData[currentTable].firstRowColumnCount!=tableData[currentTable].thisRowColumnCount) {
              tableData[currentTable].notes.push('Row '+tableData[currentTable].rowCount+' has '+tableData[currentTable].thisRowColumnCount+' columns which does not equal the '+tableData[currentTable].firstRowColumnCount+' columns in the first row.');
            }
            tableData[currentTable].bInRow=false;
            tableData[currentTable].thisRowColumnCount=0;
            for (i=0;i<tableData[currentTable].rowSpans.length;i++) {
              if (tableData[currentTable].rowSpans[i]>0) {
                tableData[currentTable].rowSpans[i]=tableData[currentTable].rowSpans[i]-1;
              }
            }
          }

        }
        el.appendChild(ol);
      }
    }

    function renderEffectiveLanguages() {
      var el=re.getElementById('langIndicationsList'), ol, efIndx, li, pgsIndx, span;
      ol=rd.createElement('ol');
      for(efIndx=0;efIndx<ds.effectiveLanguages.length;efIndx++) {
        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('"'));
        span=rd.createElement('span');
        span.setAttribute('class','attrValue');
        span.appendChild(rd.createTextNode(ds.effectiveLanguages[efIndx]));
        li.appendChild(span);
        li.appendChild(rd.createTextNode('" appears on pages: '));
        for(pgsIndx=0;pgsIndx<ds.effectiveLanguagesPagesS[efIndx].length;pgsIndx++) {
          if (ds.effectiveLanguagesPagesS[efIndx][pgsIndx]==ds.effectiveLanguagesPagesE[efIndx][pgsIndx]) {
            li.appendChild(rd.createTextNode(ds.effectiveLanguagesPagesS[efIndx][pgsIndx]+(pgsIndx+1<ds.effectiveLanguagesPagesS[efIndx].length?', ':'')));
          } else {
            li.appendChild(rd.createTextNode(ds.effectiveLanguagesPagesS[efIndx][pgsIndx]+'-'+ds.effectiveLanguagesPagesE[efIndx][pgsIndx]+(pgsIndx+1<ds.effectiveLanguagesPagesS[efIndx].length?', ':'')));
          }
        }
        ol.appendChild(li);
      }
      el.appendChild(ol);
    }

    function checkTagNesting(sTagNesting, pli) {
      var aTags, i, j, bFound, ol, li, errorsHash=new blr.W15yQC.HashTable();

      ol=rd.createElement('ol');
      if (blr.W15yQC.fnStringHasContent(sTagNesting)) {
        aTags=sTagNesting.split(/\s*\|\s*/);
        for(i=0;i<aTags.length;i++) {
          bFound=false;
          for (j=0;j<standardElements.length;j++) {
            if(aTags[i].toLowerCase()==standardElements[j].toLowerCase()) {
              bFound=true;
              break;
            }
          }
          if (bFound!=true && !/\(implied\)/i.test(aTags[i])) {
            li=rd.createElement('li');
            li.appendChild(rd.createTextNode('Non-standard tag: "'+aTags[i]+'"'));
            ol.appendChild(li);
          }
          switch(blr.W15yQC.fnTrim(aTags[i]).replace(/^H\d$/i,'H')) {
            case "H":
              for(j=i-1;j>0;j--) {
                if (/^(P|Figure|Table|TD|TH|THead|TBody|TFoot|TOCI|TOC|Form)$/.test(aTags[j]) && !errorsHash.hasItem('HInvalidParent')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"Hx" (Heading) tag should not be a child of "'+aTags[j]+'".'));
                errorsHash.setItem('HInvalidParent',1);
                ol.appendChild(li);
                }
              }
              break;
            case "Figure":
              if (i<aTags.length-1 && !errorsHash.hasItem('FigureHasChildren')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"Figure" tag should not contain children.'));
                errorsHash.setItem('FigureHasChildren',1);
                ol.appendChild(li);
              }
              if (/\bFigure\s*\|.*\bFigure\b/i.test(sTagNesting) && !errorsHash.hasItem('FigureNested')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"Figure" tags should not be nested.'));
                ol.appendChild(li);
                errorsHash.setItem('FigureNested',1);
              }
              break;
            case "Form":
              if (i<aTags.length-1 && !errorsHash.hasItem('FormHasChildren')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"Form" tag should not contain children.'));
                ol.appendChild(li);
                errorsHash.setItem('FormHasChildren',1);
              }
              if (/\bForm\s*\|.*\bForm\b/i.test(sTagNesting) && !errorsHash.hasItem('FormNested')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"Form" tags should not be nested.'));
                ol.appendChild(li);
                errorsHash.setItem('FormNested',1);
              }
              break;
            case "P":
              if (/\bP\s*\|.*\bP\b/i.test(sTagNesting) && !errorsHash.hasItem('PNested')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"P" tags should not be nested.'));
                ol.appendChild(li);
                errorsHash.setItem('PNested',1);
              }
              break;
            case "Table":
              if (/\bTable\s*\|.*\bTable\b/i.test(sTagNesting) && !errorsHash.hasItem('TableNested')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"Table" tags should not be nested.'));
                ol.appendChild(li);
                errorsHash.setItem('TableNested',1);
              }
              if (i==aTags.length-1 && !errorsHash.hasItem('TableEmpty')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"Table" tags should not be empty.'));
                ol.appendChild(li);
                errorsHash.setItem('TableEmpty',1);
              } else if (!/^(Caption|THead|TBody|TFoot|TR)$/.test(blr.W15yQC.fnTrim(aTags[i+1])) && !errorsHash.hasItem('TableInvalidChild')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"Table" tag children should be either "THead", "TBody", "TFoot", or "TR" tags.'));
                ol.appendChild(li);
                errorsHash.setItem('TableInvalidChild',1);
              }
              break;
            case "TD":
              if ((i<1 || aTags[i-1]!=='TR') && !errorsHash.hasItem('TDShouldBeUnderTR')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"TD" tags should the child of a "TR" tag.'));
                ol.appendChild(li);
                errorsHash.setItem('TDShouldBeUnderTR',1);
              }
              break;
            case "TH":
              if ((i<1 || aTags[i-1]!=='TR') && !errorsHash.hasItem('THShouldBeUnderTR')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"TH" tags should the child of a "TR" tag.'));
                ol.appendChild(li);
                errorsHash.setItem('THShouldBeUnderTR',1);
              }
              break;
            case "TR":
              if ((i<2 || !((aTags[i-1]=='Table') || (aTags[i-2]=='Table' && /(THead|TBody|TFoot)/.test(aTags[i-1])))) && !errorsHash.hasItem('TRWrongParent')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"TR" tags should the child of a "Table" or a "Table" tag and either a "THead", "TBody", or "TFoot" tag.'));
                ol.appendChild(li);
                errorsHash.setItem('TRWrongParent',1);
              }
              break;
            case "TOC":
              if (i==aTags.length-1 && !errorsHash.hasItem('TOCShouldNotBeEmpty')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"TOC" (Table Of Contents) tags should not be empty.'));
                ol.appendChild(li);
                errorsHash.setItem('TOCShouldNotBeEmpty',1);
              } else if (!/^TOCI$/.test(aTags[i+1]) && !errorsHash.hasItem('TOCInvalidChild')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"TOC" tag children should be "TOCI" tags, not "'+aTags[i+1]+'".'));
                ol.appendChild(li);
                errorsHash.setItem('TOCInvalidChild',1);
              }
              break;
            case "TOCI":
              if ((i<1 || !/^TOC$/.test(aTags[i-1])) && !errorsHash.hasItem('TOCIInvalidParent')) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('"TOCI" tag should be contained by a "TOC" tag, not "'+aTags[i-1]+'".'));
                ol.appendChild(li);
                errorsHash.setItem('TOCIInvalidParent',1);
              }
              break;
          }
          if (ol.firstElementChild!=null) {
            ol.setAttribute('class','error');
            pli.appendChild(ol);
            results.bTagUseAppearsValid=false;
          }
        }
      }
    }

    function renderUniqueTagNestings() {
      var el=re.getElementById('uniqueTagListingsList'), ol, efIndx, li, pgsIndx, span, sPgs;
      if(results.bTagUseAppearsValid===null) {
        results.bTagUseAppearsValid=true;
      }
      ol=rd.createElement('ol');
      ol.setAttribute('id','uniqueTagNestings');
      blr.W15yQC.pdfTagNestingHash.each(function(k,v){
          li=rd.createElement('li');
          li.appendChild(rd.createTextNode(k+' : '+v[0].toString()+' on pages: '));
          li.appendChild(rd.createTextNode(v[1].toString().replace(/,/g,', ')));
          if (v[1].length>=20) {
            li.appendChild(rd.createTextNode(', ...'));
          }
          ol.appendChild(li);
          checkTagNesting(k,li);
        });

      el.appendChild(ol);
    }

    function renderFormControlsTable() {
      var el=re.getElementById('formControlsTable'), i, k, table, th, td, tr, thead, tbody, p, sNotes, sFf, iFf;

      if (formControls!==null && formControls.length>0) {
        table=rd.createElement('table');
        table.setAttribute('id','formControlsTableTable');

        thead=rd.createElement('thead');
        tr=rd.createElement('tr');
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('#'));
        th.setAttribute('aria-label','Number');
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Page'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Type'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Flags'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Name'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Label'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Options'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Value'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Notes'));
        tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);

        tbody=rd.createElement('tbody');

        for(i=0;i<formControls.length; i++) {
          tr=rd.createElement('tr');
          sNotes='';
          if (!formControlTypes.hasOwnProperty(formControls[i].FT)) {
            sNotes=blr.W15yQC.fnJoin(sNotes,'Not a valid use of the form tag',', ');
          }
          if (!formControls[i].Unique) {
            sNotes=blr.W15yQC.fnJoin(sNotes,'Label is not unique',', ');
          }
          if (!blr.W15yQC.fnStringHasContent(formControls[i].TU)) {
            sNotes=blr.W15yQC.fnJoin(sNotes,'Control is not labeled',', ');
          }
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode((i+1).toString()));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(formControls[i].Pg));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.setAttribute('class','formControlType');
          td.appendChild(rd.createTextNode(formControls[i].FT+' ('+(formControlTypes.hasOwnProperty(formControls[i].FT)?formControlTypes[formControls[i].FT]:'Invalid')+')'));
          tr.appendChild(td);
          //(dec >>> 0).toString(2)
          td=rd.createElement('td');
          td.setAttribute('class','formControlFlags');
          if (parseInt(formControls[i].Ff)!=NaN) {
            iFf=parseInt(formControls[i].Ff,10);
            sFf=(parseInt(formControls[i].Ff,10) >>> 0).toString(2);
            while (sFf.length<28) {
              sFf='0'+sFf;
            }
            sFf=sFf.replace(/(.{4})/g,"$1-").trim().replace(/-$/,'');
            for(k=27;k>=0;k--) {
              if ((iFf & (1 << k)) && blr.W15yQC.fnStringHasContent(FfBitNames[(k+1).toString().trim()])) {
                sFf=blr.W15yQC.fnJoin(sFf,FfBitNames[(k+1).toString().trim()]+'(bit'+(k+1)+')',', ');
              }
            }
            if (/Radio\(/.test(sFf)) {
              sFf=sFf.replace('RichText-','');
            } else {
              sFf=sFf.replace('-RadiosInUnison','');
            }
            td.appendChild(rd.createTextNode(sFf));
          } else {
            td.appendChild(rd.createTextNode(formControls[i].Ff));
          }
          tr.appendChild(td);
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(formControls[i].T));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(formControls[i].TU));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(formControls[i].Opt));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(formControls[i].V));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(sNotes));
          tr.appendChild(td);

          tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        el.appendChild(table);
      } else {
        p=rd.createElement('p');
        p.appendChild(rd.createTextNode('No form controls found.'));
        el.appendChild(p);
      }
    }

    function renderFigureControlsTable() {
      var el=re.getElementById('figureControlsTable'), i, table, th, td, tr, thead, tbody, p, sNotes, bHasActualText=false, sText;

      if (figureTags!==null && figureTags.length>0) {
        for(i=0;i<figureTags.length; i++) {
          if (figureTags[i].ActualText!=null) {
            bHasActualText=true;
          }
        }
        table=rd.createElement('table');
        table.setAttribute('id','figureControlsTableTable');

        thead=rd.createElement('thead');
        tr=rd.createElement('tr');
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('#'));
        th.setAttribute('aria-label','Number');
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Page'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Alt'));
        tr.appendChild(th);
        if (bHasActualText) {
          th=rd.createElement('th');
          th.appendChild(rd.createTextNode('ActualText'));
          tr.appendChild(th);
        }
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Notes'));
        tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);

        tbody=rd.createElement('tbody');
        for(i=0;i<figureTags.length; i++) {
          sText='';
          if (figureTags[i].Alt!=null) {
            sText=figureTags[i].Alt;
          } else if (figureTags[i].ActualText!=null) {
            sText=figureTags[i].ActualText;
          }
          tr=rd.createElement('tr');
          sNotes='';
          if (!blr.W15yQC.fnStringHasContent(sText)) {
            sNotes=blr.W15yQC.fnJoin(sNotes,'Missing alternate text for figure.',', ');
          }
          if (blr.W15yQC.fnAppearsToBeDefaultAltText(sText)) {
            sNotes=blr.W15yQC.fnJoin(sNotes,'Figure alternate text appears to be default.',', ');
          }
          if (blr.W15yQC.fnStringHasContent(figureTags[i].ActualText) && blr.W15yQC.fnStringHasContent(figureTags[i].Alt) && !blr.W15yQC.fnStringsEffectivelyEqual(figureTags[i].Alt,figureTags[i].ActualText)) {
            sNotes=blr.W15yQC.fnJoin(sNotes,'Figure has conflicting Alt and ActualText.',', ');
          }
          if (blr.W15yQC.fnStringHasContent(figureTags[i].ActualText) && !blr.W15yQC.fnStringHasContent(figureTags[i].Alt) && !blr.W15yQC.fnStringsEffectivelyEqual(figureTags[i].Alt,figureTags[i].ActualText)) {
            sNotes=blr.W15yQC.fnJoin(sNotes,'Figure alternate text should come from Alt instead of ActualText.',', ');
          }
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode((i+1).toString()));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(figureTags[i].Pg));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.setAttribute('class','Alt');
          td.appendChild(rd.createTextNode(figureTags[i].Alt!=null?figureTags[i].Alt:''));
          tr.appendChild(td);
          if (bHasActualText) {
            td=rd.createElement('td');
            td.appendChild(rd.createTextNode(figureTags[i].ActualText!=null?figureTags[i].ActualText:''));
            tr.appendChild(td);
          }
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(sNotes));
          tr.appendChild(td);

          tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        el.appendChild(table);
      } else {
        p=rd.createElement('p');
        p.appendChild(rd.createTextNode('No figure tags found.'));
        el.appendChild(p);
      }
    }

    function renderTablesTable() {
      var el=re.getElementById('tablesTable'), i, j, table, th, td, tr, thead, tbody, p, sNotes, bHasActualText=false, sText, sSize, ul, li;

      if (tableData!==null && tableData.length>0) {
        for(i=0;i<tableData.length; i++) {
          if (tableData[i].ActualText!=null) {
            bHasActualText=true;
          }
        }
        table=rd.createElement('table');
        table.setAttribute('id','tablesTableTable');

        thead=rd.createElement('thead');
        tr=rd.createElement('tr');
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('#'));
        th.setAttribute('aria-label','Number');
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Page'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Size'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Caption'));
        tr.appendChild(th);
        if (bHasActualText) {
          th=rd.createElement('th');
          th.appendChild(rd.createTextNode('ActualText'));
          tr.appendChild(th);
        }
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Notes'));
        tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);

        tbody=rd.createElement('tbody');
        for(i=0;i<tableData.length; i++) {
          sText='';
          if (tableData[i].Alt!=null) {
            sText=tableData[i].Alt;
          } else if (tableData[i].ActualText!=null) {
            sText=tableData[i].ActualText;
          } else if (tableData[i].captionText!=null) {
            sText=tableData[i].captionText;
          }
          tr=rd.createElement('tr');
          if (!blr.W15yQC.fnStringHasContent(sText)) {
            tableData[i].notes.push('Missing caption or alternate text for table.');
          }
          if (blr.W15yQC.fnAppearsToBeDefaultAltText(sText)) {
            tableData[i].notes.push('Table caption or alternate text appears to be default.');
          }
          if ((blr.W15yQC.fnStringHasContent(tableData[i].ActualText)||blr.W15yQC.fnStringHasContent(tableData[i].Alt)) && !blr.W15yQC.fnStringHasContent(tableData[i].captionText)) {
            tableData[i].notes.push('Table description text should come from a Caption instead of ActualText or Alt attributes.');
          }
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode((i+1).toString()));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(tableData[i].Pg));
          tr.appendChild(td);
          sSize=tableData[i].firstRowColumnCount.toString()+'C x '+tableData[i].rowCount.toString()+'R';
          td=rd.createElement('td');
          td.setAttribute('class','Size');
          td.appendChild(rd.createTextNode(sSize));
          tr.appendChild(td);
          td=rd.createElement('td');
          td.setAttribute('class','Caption');
          td.appendChild(rd.createTextNode(sText));
          tr.appendChild(td);
          if (bHasActualText) {
            td=rd.createElement('td');
            td.appendChild(rd.createTextNode(tableData[i].ActualText!=null?tableData[i].ActualText:''));
            tr.appendChild(td);
          }
          td=rd.createElement('td');
          ul=rd.createElement('ul');
          for (j=0;j<tableData[i].notes.length;j++) {
            li=rd.createElement('li');
            li.appendChild(rd.createTextNode(tableData[i].notes[j]));
            ul.appendChild(li);
          }
          td.appendChild(ul);
          tr.appendChild(td);

          tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        el.appendChild(table);
      } else {
        p=rd.createElement('p');
        p.appendChild(rd.createTextNode('No table tags found.'));
        el.appendChild(p);
      }
    }

    function renderAndCheckDocStructure(el) {
      var rmi, ol, oli, div, p, keys, i=-1, dlM, defaultLang;
      //blr.W15yQC.pdfCheckDialog.log('DS:'+blr.W15yQC.objectToString(ds));
      //blr.W15yQC.pdfCheckDialog.log('Kids:'+blr.W15yQC.objectToString(ds.pages));

      blr.W15yQC.pdfTagNestingHash=null;

      el.appendChild(makeExpandoCollapsoHeading('h3','Tag Usage Statistics:'));
      div=rd.createElement('div');
      el.appendChild(div);
      renderElementStatistics(div);

      el.appendChild(makeExpandoCollapsoHeading('h3','Effective Language Indications:'));
      div=rd.createElement('div');
      div.setAttribute('id','langIndicationsList');
      el.appendChild(div); // Place holder for content that gets rendered later!

      el.appendChild(makeExpandoCollapsoHeading('h3','Unique Tag Nestings:'));
      div=rd.createElement('div');
      div.setAttribute('id','uniqueTagListingsList');
      el.appendChild(div); // Place holder for content that gets rendered later!

      el.appendChild(makeExpandoCollapsoHeading('h3','Figure Tags:'));
      div=rd.createElement('div');
      div.setAttribute('id','figureControlsTable');
      el.appendChild(div); // Place holder for content that gets rendered later!

      el.appendChild(makeExpandoCollapsoHeading('h3','Form Controls:'));
      div=rd.createElement('div');
      div.setAttribute('id','formControlsTable');
      el.appendChild(div); // Place holder for content that gets rendered later!

      el.appendChild(makeExpandoCollapsoHeading('h3','Table Tags:'));
      div=rd.createElement('div');
      div.setAttribute('id','tablesTable');
      el.appendChild(div); // Place holder for content that gets rendered later!

      el.appendChild(makeExpandoCollapsoHeading('h3','Headings:'));
      div=rd.createElement('div');
      el.appendChild(div);
      renderHeadings(div);

      el.appendChild(makeExpandoCollapsoHeading('h3','Structure:'));
      div=rd.createElement('div');
      el.appendChild(div);
      prevPg=-19392;
      pgNum=1;
      defaultLang='';
      dlM=pdf.pdfInfo.defaultLang.match(/'([\w-]*)'/);
      if (dlM!==null && dlM.length>1) {
        defaultLang=dlM[1];
      }

      blr.W15yQC.pdfTagNestingHash=new blr.W15yQC.HashTable();

      results.bNoErrorsParsingDocumentStructure=ds.errors===false;
      tableData=[];
      tableStack=[];
      currentTable=null;

      renderDocStructureLevel(ds,div,defaultLang);
      if(results.bHeadingsAreAllImplicit==true && results.bHeadingsAreAllExplicit==true) {
        results.bHeadingsAreAllImplicit=null;
        results.bHeadingsAreAllExplicit=null;
      }
      renderEffectiveLanguages();
      renderUniqueTagNestings();
      renderFormControlsTable();
      renderFigureControlsTable();
      renderTablesTable();

      enableReportButtons(true,true);
      renderResults();
      log('Finished.');
      tick(100);
      appendReport();
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

    function formatPDFDate(sPdfDate) {
      var sFormatedDate='', sAMPM='', sTZ='';
      if (/^([dD]:)?\d\d\d\d\d\d\d\d\d\d\d\d\d\d([zZ\+\-]\d\d'\d\d')?$/.test(sPdfDate)) {
        if (/^[dD]:\d\d\d\d\d\d\d\d\d\d\d\d\d\d$/.test(sPdfDate)) {
          sPdfDate=sPdfDate+"L00'00'";
        }
        m=sPdfDate.toUpperCase().match(/(\d\d\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)([zZL\+\-])(\d\d)'(\d\d)'/);
        if (m!=null && m.length>6) {
          if (parseInt(m[4])>12) {
            m[4]=(parseInt(m[4])-12).toString();
            sAMPM=' PM';
          } else {
            sAMPM=' AM';
          }
          if (blr.W15yQC.timeZones.hasOwnProperty(m[7]+m[8]) && m[9]=='00') {
            sTZ=blr.W15yQC.timeZones[m[7]+m[8]]+' time';
          } else if(m[7]=='Z' && m[8]=='00' && m[9]=='00') {
            sTZ='UTC';
          } else if (m[7]=='L') {
            sTZ='Local time';
          } else {
            sTZ='UTC'+m[7]+m[8]+':'+m[9];
          }
          sFormatedDate=m[2]+'/'+m[3]+'/'+m[1]+' '+m[4]+':'+m[5]+':'+m[6]+sAMPM+' '+sTZ+'  ('+sPdfDate+')';
          return sFormatedDate;
        }
      }
      return sPdfDate; // If not a match, return passed string
    }

    if (pdf!=null && re!=null) {
      if (pdf.pdfInfo) {
        meta=rd.createElement('meta');
        meta.setAttribute('http-equiv','content-type');
        meta.setAttribute('content','text/html; charset=UTF-8');
        rd.head.appendChild(meta);

        style=rd.createElement('style');
        style.setAttribute('type','text/css');
        style.appendChild(rd.createTextNode('.hideSibling+*{display:none;}h4{margin-top:5px}table.mappedTags{margin-bottom:25px}table+p,h3+h4{margin-top:0}caption{text-align:left;width:100% !important}table{margin-top:5px;border-collapse: collapse;border:thin solid black}th,td{border:thin solid black;padding:3px 5px 3px 5px}th{font-weight: bold;background: #CCC}tr:nth-child(even) {background: #EEE}tr:nth-child(odd) {background: #FFF}h1{margin:0 10px 0 0}h2,h3,h4,h5,h6{margin-bottom:0}h2{margin-left:15px}h1+h2{margin-top:0}h2+div{margin:0 0 0 30px}h2+div>p,h3+div>p{margin:0}h3{margin:10px 0px 0px 45px}h3+div{margin:0 0 0 60px}ul,ol{margin-top:0}.pdfInfoParam, .a11yResultText{font-weight:bold}.a11yPassResult{color:028A00}.a11yFailResult{color:red}.a11yResultNotChecked{color:blue}th.tagNameStatsHeader{width:3em}th.tagNameHeader{width:12em}.error{background-color:#FF9696}li.newPage{border-top:1px solid black;}td.tagStat{text-align:right}td span.nonStandardTag,p span.nonStandardTag{color:#aa0000;text-decoration:none}span.attr{color:#DE0000}span.attrValue{color:#0000FA}span.pdfTextContent{color:#BA4700}span.pdfTag{color:#028A00;font-weight:bold}span.contentTag{color:#028A00}span.mappedPdfTag{color:#028A00}span.nonStandardTag{text-decoration:underline}'));
        style.appendChild(rd.createTextNode('.hideSibling a{ background-image:url(data:image/gif;base64,R0lGODlhEAAQANUAAO7t7urp6uXk5dPS0+3t7unp6tvb3Onq6uTl5eLj49vc29bX1urq6e7t7dfW1v////n5+fHx8e3t7enp6eXl5ePj4+Dg4Nvb29fX19PT09DQ0MzMzMTExK2trZqampSUlDg4OP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACEALAAAAAAQABAAAAZ6wJBwSCwOMZykcsnZDDmah3Q61XyeUSrVioV4O6COF8IVQiNocAcdKYc4g0mn4wF55pPM1byogP6AIAkOe28GF3N1dx0KBoUcFpEWapIWjxQUAgJqFAiYjwEHDAUMoxOjB48AqwQSDQQNEhIEhRsft7i5H05Gvb6/QkEAOw%3D%3D);background-repeat: no-repeat;padding-left: 20px;}.ec a{ cursor:pointer;background-position:left center;background-image:url(data:image/gif;base64,R0lGODlhDQANAOYAAK6xr8/Drvz8++Hj5dfSx9ze39fX1r7Bwf/+97m7vPz8+rO2teHi5NTW1M7BrNXY2bq9u7m5utLV2Obn6c/KxN/f3v/99MXIyP336dnUzMLExv//9v///Orbxd/h4tnOva+xsNrb2NHT1e7m2v358uzj1Pj06s/CrsPExeDg383Aq9fX09zY0NDS09fY1djGrNLMwK2wrv//+9HEsba3tv//+NXJtuXn6NPV1+Tm57/Cw9XPxL65sOfp6tHT1O3z9tPW2f/98sLDwd7e3a6wr8/PzdfSyLCxrf39+8vO0eLk5kxMTKCnrrK3vKassf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAANAA0AAAeEgElNTE6Fhk5MTYISA0qOj0oDQIM9T5aXlxOEDE9InkgCAgocBYUFmJgWIoU3TygGQxUpIQdBOIU/FEu7vEs8HoU5T0INKwYuRREYPoUPG08yNQgIJCYlGoUtIywZRgQEOzAfB4gXHTYzJwEBDiovNIk6EAsgRAAAMQBHCYqDh4aJkgQCADs%3D);background-repeat: no-repeat;padding-left:20px;}'));
        rd.head.appendChild(style);

        script=rd.createElement('script');
        script.appendChild(rd.createTextNode("function ec(node) {if (node.parentNode.getAttribute('class') == 'hideSibling') {node.parentNode.setAttribute('class', 'ec');node.setAttribute('aria-expanded','true');} else {node.parentNode.setAttribute('class', 'hideSibling');node.setAttribute('aria-expanded','false');}}"));
        rd.head.appendChild(script);

        re.appendChild(makeExpandoCollapsoHeading('h2','Accessibility Check Results:'));
        div=rd.createElement('div');
        div.setAttribute('id','a11yResults');
        re.appendChild(div);

        re.appendChild(makeExpandoCollapsoHeading('h2','PDF Info:'));

        div=rd.createElement('div');
        re.appendChild(div);
        l=rd.createElement('ul');

        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoParam')
        span.appendChild(rd.createTextNode('URL'));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoValue')
        span.appendChild(rd.createTextNode(sURL));
        li.appendChild(span);
        l.appendChild(li);

        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoParam')
        span.appendChild(rd.createTextNode('Number of pages'));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoValue')
        span.appendChild(rd.createTextNode(pdf.pdfInfo.numPages));
        numberOfPages=pdf.pdfInfo.numPages;
        li.appendChild(span);
        l.appendChild(li);

        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoParam')
        span.appendChild(rd.createTextNode('Structured'));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoValue')
        span.appendChild(rd.createTextNode((pdf.pdfInfo.isStructured==true?'Yes'+(pdf.pdfInfo.hasSuspects==true?', but has suspects':', and no suspects are indicated'):'No')));
        li.appendChild(span);
        l.appendChild(li);

        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoParam')
        span.appendChild(rd.createTextNode('Tagged'));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoValue')
        span.appendChild(rd.createTextNode(pdf.pdfInfo.isTagged==true?'Yes':'No'));
        li.appendChild(span);
        l.appendChild(li);

        results.bIsStructuredNoSuspectsAndTagged = pdf.pdfInfo.isStructured==true && pdf.pdfInfo.hasSuspects==false && pdf.pdfInfo.isTagged==true;

        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoParam')
        span.appendChild(rd.createTextNode('Set to display title'));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoValue')
        span.appendChild(rd.createTextNode(pdf.pdfInfo.setToDisplayTitle==true?'Yes':'No'));
        li.appendChild(span);
        l.appendChild(li);

        results.bDocTitleConfiguredToDisplay=(pdf.pdfInfo.setToDisplayTitle==true?true:false);
        results.bDocHasXmpMetaData=/xmpmeta/i.test(pdf.pdfInfo.metadata);

        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoParam')
        span.appendChild(rd.createTextNode('Default language'));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoValue')
        span.appendChild(rd.createTextNode(pdf.pdfInfo.defaultLang));
        li.appendChild(span);
        l.appendChild(li);

        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoParam')
        span.appendChild(rd.createTextNode('Outline/Bookmarks'));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoValue')
        span.appendChild(rd.createTextNode((pdf.pdfInfo.outline!==null && pdf.pdfInfo.outline.length && pdf.pdfInfo.outline.length>0)?'Yes':'No'));
        li.appendChild(span);
        l.appendChild(li);

        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoParam')
        span.appendChild(rd.createTextNode('Linearized'));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoValue')
        span.appendChild(rd.createTextNode(pdf.pdfInfo.isLinearized==true?'Yes':'No'));
        li.appendChild(span);
        l.appendChild(li);

        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoParam')
        span.appendChild(rd.createTextNode('Encrypted'));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoValue')
        span.appendChild(rd.createTextNode(pdf.pdfInfo.encrypted==true?'Yes':'No'));
        li.appendChild(span);
        l.appendChild(li);

        li=rd.createElement('li');
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoParam')
        span.appendChild(rd.createTextNode('Fingerprint'));
        li.appendChild(span);
        li.appendChild(rd.createTextNode(': '));
        span=rd.createElement('span');
        span.setAttribute('class','pdfInfoValue')
        span.appendChild(rd.createTextNode(pdf.pdfInfo.fingerprint));
        li.appendChild(span);
        l.appendChild(li);

        for(key in pdf.pdfInfo.info) {
          if (pdf.pdfInfo.info.hasOwnProperty(key)) {
            li=rd.createElement('li');
            span=rd.createElement('span');
            span.setAttribute('class','pdfInfoParam')
            span.appendChild(rd.createTextNode(key));
            li.appendChild(span);
            li.appendChild(rd.createTextNode(': '));
            span=rd.createElement('span');
            span.setAttribute('class','pdfInfoValue')
            span.appendChild(rd.createTextNode(formatPDFDate(pdf.pdfInfo.info[key])));
            li.appendChild(span);
            l.appendChild(li);
          }
        }
        div.appendChild(l);

        if (pdf.pdfInfo.isStructured!==true) {
          results.bH1Present=false;
          results.bOnlyStandardTagsAreUsed=false;
          if (!blr.W15yQC.fnIsValidLocale(pdf.pdfInfo.defaultLang)) {
            results.bAllTextContentHasMarkedLang=false;
          }
        }

        re.appendChild(makeExpandoCollapsoHeading('h2','XMP Metadata:'));
        div=rd.createElement('div');
        if (pdf.pdfInfo.metadata != null && blr.W15yQC.fnStringHasContent(pdf.pdfInfo.metadata)==true) {
          pre=rd.createElement('pre');
          pre.appendChild(rd.createTextNode(pdf.pdfInfo.metadata.replace(/[\s\n\r]+<\?xpacket/,"\n<\?xpacket")));
          div.appendChild(pre);
        } else {
          p=rd.createElement('p');
          p.appendChild(rd.createTextNode('None. The PDF does not contain any XMP metadata.'));
          div.appendChild(p);
        }
        div.setAttribute('id','xmpMetadata');
        re.appendChild(div);

        results.bDocTitleInXmpMetaData=false;
        if (results.bDocHasXmpMetaData!==false && blr.W15yQC.fnStringHasContent(pdf.pdfInfo.metadata)) {
          m=pdf.pdfInfo.metadata.match(/<dc:title>[\s\S]+<\/dc:title>/);
          if (m!==null && m.length) {
            sTitle=m[0].replace(/<[^>]+>/g,'');
            if (blr.W15yQC.fnStringHasContent(sTitle)) {
              results.bDocTitleInXmpMetaData=true;
            }
          }
        }

        re.appendChild(makeExpandoCollapsoHeading('h2','PDF Outline (Bookmarks):'));
        div=rd.createElement('div');
        re.appendChild(div);

        if (pdf.pdfInfo.outline!==null && pdf.pdfInfo.outline.length && pdf.pdfInfo.outline.length>0) {
          renderOutlineLevel(pdf.pdfInfo.outline,div);
        } else {
          p=rd.createElement('p');
          p.appendChild(rd.createTextNode('None. The PDF does not contain any bookmarks.'));
          div.appendChild(p);
        }

        if (pdf.pdfInfo.isStructured==true) {
          pdf.getDocumentStructure().then(function(ds){
                                            if(ds!=null) {
                                              getTextForDocStructure(ds,re);
                                            } else {
                                              h=rd.createElement('h2');
                                              h.appendChild(rd.createTextNode('Error getting document structure'));
                                              re.appendChild(h);
                                              enableReportButtons(true,false);
                                              renderResults();
                                              log('Stopped due to errors.');
                                              appendReport();
                                            }
                                          },
                                          function(){
                                            h=rd.createElement('h2');
                                            h.appendChild(rd.createTextNode('Error getting document structure'));
                                            re.appendChild(h);
                                            enableReportButtons(true,false);
                                            renderResults();
                                            log('Stopped due to errors.');
                                            appendReport();
                                          });
        } else {
          h=rd.createElement('h2');
          h.appendChild(rd.createTextNode('No document structure'));
          re.appendChild(h);
          enableReportButtons(true,false);
          renderResults();
          log('Finished.');
          tick(100);
          appendReport();
        }
      }
    } else {
      log('Error: pdf or re objects are null');
      enableReportButtons(false,false);
      //log('Finished.');
      tick(100);
      appendReport();
    }

  }

  function getPdfForFullCheck(sURL) {
    var rd, re;

    rd=document.getElementById('reportIFrame').contentDocument;
    rd.body.setAttribute('lang','en-US');
    re=rd.createDocumentFragment();

    return new Promise(function(resolve, reject) {
      document.getElementById('progressMeterLabel').value='Requesting: '+sURL;
      blr.PDFJS.getDocument(sURL).then(
        function(pdf){
          var el;
          document.getElementById('progressMeterLabel').value="Checking PDF...";
          el=rd.createElement('h1');
          el.appendChild(rd.createTextNode('Checking PDF. Please wait...'));
          rd.body.appendChild(el);
          resolve(getPdfFullCheckResults(pdf,sURL,rd,re));
        },
        function(eee) {
          var el;
          document.getElementById('progressMeterLabel').value="Error requesting PDF.";
          el=rd.createElement('h1');
          el.appendChild(rd.createTextNode('Error requesting PDF:'));
          rd.body.appendChild(el);
          el=rd.createElement('p');
          el.appendChild(rd.createTextNode('Error: '+blr.W15yQC.objectToString(eee)));
          rd.body.appendChild(el);
          reject(null);
        });
    });
  }

  function enableReportButtons (bSavePrint, bAltViews) {
    document.getElementById('button-savePDFReport').disabled=!bSavePrint;
    document.getElementById('button-printPDFReport').disabled=!bSavePrint;
    document.getElementById('button-makeSemanticView').disabled=!bAltViews;
    document.getElementById('button-makeScreenReaderView').disabled=!bAltViews;
    //document.getElementById('button-loadPDF').disabled=bSavePrint;
  }

  function printPdfReport () {
    var rd=document.getElementById('reportIFrame').contentDocument;

    if (rd != null && rd.documentElement && rd.documentElement.innerHTML && rd.body &&
        rd.body.children && rd.body.children.length && rd.defaultView && rd.defaultView.print) {
      rd.defaultView.print();
    } else {
      alert("Nothing to print!");
    }
  }

  function savePdfReport () {
    var converter,
    file,
    foStream,
    fp,
    nsIFilePicker,
    rv,
    rd=document.getElementById('reportIFrame').contentDocument;

    if (rd != null && rd.documentElement && rd.documentElement.innerHTML && rd.body && rd.body.children && rd.body.children.length) {
      nsIFilePicker = Components.interfaces.nsIFilePicker;

      fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
      fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
      fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterAll);
      rv = fp.show();
      if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {

        file = fp.file;
        if (/\.html?$/.test(file.path) == false) {
          file.initWithPath(file.path + '.html');
        }

        foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
        createInstance(Components.interfaces.nsIFileOutputStream);

        foStream.init(file, 0x2A, 438, 0);
        converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
        converter.init(foStream, "UTF-8", 0, 0);
        converter.writeString('<html>' + rd.documentElement.innerHTML + '</html>');
        converter.close(); // this closes foStream
      }
    } else {
      alert("Nothing to save!");
    }
  }

  function savePdfNestingReport () {
    var converter,
    file,
    foStream,
    fp,
    nsIFilePicker,
    rv, sList='',
    rd=document.getElementById('reportIFrame').contentDocument;

    if (rd != null && rd.documentElement && rd.documentElement.innerHTML && rd.body && rd.body.children && rd.body.children.length) {
      nsIFilePicker = Components.interfaces.nsIFilePicker;

      fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
      fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
      fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterAll);
      rv = fp.show();
      if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {

        file = fp.file;
        if (/\.html?$/.test(file.path) == false) {
          file.initWithPath(file.path + '.html');
        }

        blr.W15yQC.pdfTagNestingHash.each(function(k,v){sList=sList+'<li>'+blr.W15yQC.fnMakeWebSafe(k)+' : '+blr.W15yQC.fnMakeWebSafe(v)+'</li>';});
        foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
        createInstance(Components.interfaces.nsIFileOutputStream);

        foStream.init(file, 0x2A, 438, 0);
        converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
        converter.init(foStream, "UTF-8", 0, 0);
        converter.writeString('<html><body><ul>' + sList + '</ul></body></html>');
        converter.close(); // this closes foStream
      }
    } else {
      alert("Nothing to save!");
    }
  }

  if(this.arguments[1]!==null && typeof this.arguments[1].documentURI !== 'undefined') {
      document.getElementById('tbURL').value=this.arguments[1].documentURI;
    if(/^about:blank$/i.test(document.getElementById('tbURL').value)) {
          document.getElementById('tbURL').value="";
      }
  }
  sURL=document.getElementById('tbURL').value;
  if(bAutoCheckPDF==true && ((blr.W15yQC.fnAppearsToBeFullyQualifiedURL(sURL)&&/\.pdf$/i.test(sURL))||/^file:.+\.pdf$/i.test(sURL))) {
      window.setTimeout(function(){check();}, 50);
  }
