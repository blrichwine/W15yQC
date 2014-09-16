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
 *
 */
"use strict";

  function getPdfFullCheckResults(pdf,sURL,rd,re,le) {
    var standardElements=['Document', 'Part', 'Art', 'Sect', 'Div', 'BlockQuote', 'Caption',
    'TOC', 'TOCI', 'Index', 'NonStruct', 'Private', 'P', 'H', 'H1', 'H2', 'H3',
    'H4', 'H5', 'H6', 'L', 'LI', 'Lbl', 'LBody', 'Table', 'TR', 'TH', 'TD', 'THead',
    'TBody', 'TFoot', 'Span', 'Quote', 'Note', 'Reference', 'BibEntry',
    'Code', 'Link', 'Annot', 'Ruby', 'Warichu', 'RB', 'RT', 'RP', 'WT', 'WP',
    'Figure', 'Formula', 'Form'];

    var h,div,span,el,l,li, key, i, meta, style;
    var prevPg=-19392, pgNum=1;

    function log(s) {
     le.value=blr.W15yQC.fnJoin(le.value,s,"\n");
     blr.W15yQC.fnDoEvents();
    }

    function tick() {
     le.value+='.';
     blr.W15yQC.fnDoEvents();
    }

    function renderElementStatistics(d) {
      var h, table, thead, tbody, tr, th, td, keys, mappedKey, i, span, mappedStats={};
      h=rd.createElement('h3');
      h.appendChild(rd.createTextNode('Un-Mapped'));
      d.appendChild(h);
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
        for (i=0;i<standardElements.length;i++) {
          standardElements[i]=standardElements[i].toLowerCase();
        }
        for (i=0;i<keys.length;i++) {
          tr=rd.createElement('tr');
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(keys[i]));
          tr.appendChild(td);
          td=rd.createElement('td');
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
          if (standardElements.indexOf(keys[i].toLowerCase())<0) {
            span=rd.createElement('span');
            span.appendChild(rd.createTextNode(' (Not a standard element)'));
            td.appendChild(span);
          }
          tr.appendChild(td);
          tbody.appendChild(tr);
        }
      }
      table.appendChild(tbody);
      d.appendChild(table);

      if (ds.rm!=null && Object.getOwnPropertyNames(ds.rm).length>0) {
        h=rd.createElement('h3');
        h.appendChild(rd.createTextNode('Mapped'));
        d.appendChild(h);
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

        keys=Object.getOwnPropertyNames(mappedStats);
        if (keys!=null && keys.length>0) {
          keys=keys.sort();
          for (i=0;i<keys.length;i++) {
            tr=rd.createElement('tr');
            td=rd.createElement('td');
            td.appendChild(rd.createTextNode(keys[i]));
            tr.appendChild(td);
            td=rd.createElement('td');
            td.appendChild(rd.createTextNode(mappedStats[keys[i]]));
            if (standardElements.indexOf(keys[i].toLowerCase())<0) {
              span=rd.createElement('span');
              span.appendChild(rd.createTextNode(' (Not a standard element)'));
              td.appendChild(span);
              td.setAttribute('class','error');
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
          }
        }
        table.appendChild(tbody);
        d.appendChild(table);
      }
    }

    function getTextForDocStructure(docStructure, re) {
      ds=docStructure;
      ds.title=pdf.pdfInfo!==null?(pdf.pdfInfo.info!=null?pdf.pdfInfo.info.Title:null):null;
      var rm={}, dsStack=[ds], dsiIndexes=[0], dsi=0, pageCache={}, pgNum, pgTCCache={}, pgsInCache=[],
          K, text, item, bFound=false, i=-1,
          h, div, ol, rmi, oli, p, keys;

      //blr.W15yQC.pdfCheckDialog.log('Starting getTextForDocStructure: ');

      h=rd.createElement('h2');
      h.appendChild(rd.createTextNode('Document Structure:'));
      re.appendChild(h);
      if (ds!=null && typeof ds.RoleMap!='undefined' && ds.RoleMap!==null && typeof ds.RoleMap.map!='undefined') {
        document.getElementById('button-makeSemanticView').disabled=false;
        h=rd.createElement('h3');
        h.appendChild(rd.createTextNode('Role Map:'));
        re.appendChild(h);
        div=rd.createElement('div');
        ol=rd.createElement('ul');
        keys=Object.getOwnPropertyNames(ds.RoleMap.map);
        if (keys!=null && keys.length>0) {
          keys=keys.sort();
          for (i=0;i<standardElements.length;i++) {
            standardElements[i]=standardElements[i].toLowerCase();
          }
          for (i=0;i<keys.length;i++) {
            rmi=keys[i];
            rm[rmi]=ds.RoleMap.map[rmi].name;
            oli=rd.createElement('li');
            oli.appendChild(rd.createTextNode('"'+rmi+'": "'+ds.RoleMap.map[rmi].name+'"'));

            if (standardElements.indexOf(ds.RoleMap.map[rmi].name.toLowerCase())<0) {
              span=rd.createElement('span');
              span.appendChild(rd.createTextNode(' (Not a standard element)'));
              oli.appendChild(span);
              oli.setAttribute('class','error');
            }

            ol.appendChild(oli);
          }
          div.appendChild(ol);
          re.appendChild(div);
        }
      }
      if (i<0) {
        p=rd.createElement('p');
        p.appendChild(rd.createTextNode('No Role Map'));
        re.appendChild(p);
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
        //blr.W15yQC.pdfCheckDialog.log('Starting getTextForDsi: ');
        while (dsiIndexes[dsi]<dsStack[dsi].length || dsi>0) {
            //blr.W15yQC.pdfCheckDialog.log('Checking: '+dsStack[dsi][dsiIndexes[dsi]].S);
          if ((typeof dsStack[dsi][dsiIndexes[dsi]].Pg != 'undefined') || (typeof dsStack[dsi][dsiIndexes[dsi]].MCID != 'undefined')) {
            //blr.W15yQC.pdfCheckDialog.log('Found: '+dsStack[dsi][dsiIndexes[dsi]].S);
            break;
          }
          getNext();
        }
        if (dsiIndexes[dsi]>=dsStack[dsi].length && dsi<1) {
          //blr.W15yQC.pdfCheckDialog.log('Calling renderAndCheckDocStructure');
          renderAndCheckDocStructure(re);
        } else {
            //blr.W15yQC.pdfCheckDialog.log('Checking2: '+dsStack[dsi][dsiIndexes[dsi]].S);
            //blr.W15yQC.pdfCheckDialog.log('Checking2: '+blr.W15yQC.objectToString(dsStack[dsi][dsiIndexes[dsi]]));
            //blr.W15yQC.pdfCheckDialog.log('Checking2Index: '+blr.W15yQC.objectToString(ds.pageIndexByRef));
          if (typeof dsStack[dsi][dsiIndexes[dsi]].Pg!='undefined') { // Track the page number
            pgNum=ds.pageIndexByRef[dsStack[dsi][dsiIndexes[dsi]].Pg.num][dsStack[dsi][dsiIndexes[dsi]].Pg.gen];
            getNext();
            getTextForDsi();
          } else if (typeof dsStack[dsi][dsiIndexes[dsi]].MCID!='undefined') {
            mcid=dsStack[dsi][dsiIndexes[dsi]].MCID;
            //blr.W15yQC.pdfCheckDialog.log('Page Number:'+pgNum+'  K:'+K);
            if (typeof pgTCCache[pgNum]!='undefined') {
              //blr.W15yQC.pdfCheckDialog.log('Using Cache');
              tc=pgTCCache[pgNum];
              bFound=false;
              text=''
              if (tc!==null && typeof tc.items!='undefined') {
                for(item=0;item<tc.items.length;item++) {
                  if (tc.items[item].mcid!==null) {
                    for(i=0;i<tc.items[item].mcid.length;i++) {
                      if (mcid==tc.items[item].mcid[i]) {
                        bFound=true;
                        text=text+tc.items[item].str;
                        break;
                      }
                    }
                  }
                }
              }
              if(bFound) {
                dsStack[dsi][dsiIndexes[dsi]].text=text;
                //blr.W15yQC.pdfCheckDialog.log('Found: '+text);
              } else {
                dsStack[dsi][dsiIndexes[dsi]].text='';
                //blr.W15yQC.pdfCheckDialog.log('Not Found: ');
              }
              getNext();
              getTextForDsi();
            } else {
              //blr.W15yQC.pdfCheckDialog.log('Calling getPage');
              pdf.getPage(pgNum+1).then(function(page){
                page.getTextContent().then(function(tc){
                  bFound=false;
                  text=''
                  if (tc!==null && typeof tc.items!='undefined') {
                    for(item=0;item<tc.items.length;item++) {
                      if (tc.items[item].mcid!==null) {
                        for(i=0;i<tc.items[item].mcid.length;i++) {
                          if (mcid==tc.items[item].mcid[i]) {
                            bFound=true;
                            text=text+tc.items[item].str;
                            break;
                          }
                        }
                      }
                    }
                  }
                  if(bFound) {
                    dsStack[dsi][dsiIndexes[dsi]].text=text;
                    //blr.W15yQC.pdfCheckDialog.log('Found: '+text);
                  } else {
                    dsStack[dsi][dsiIndexes[dsi]].text='';
                      //blr.W15yQC.pdfCheckDialog.log('Not Found: ');
                  }
                  if (pgsInCache.length>4) {
                    pgTCCache[pgsInCache[0]]=null;
                    pgsInCache.shift();
                  }
                  //blr.W15yQC.pdfCheckDialog.log("TC:\n"+blr.W15yQC.objectToString(tc)+"\n\n");
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
      }
      getTextForDsi();
    }

    function renderHeadings(el) {
      var dsStack=[ds], dsiIndexes=[0], dsi=0, bFoundHeadings=false, p, ul, ul2, li, prevHeadingLevel=0, hLevel, hList=[], lStack=[], elType, i, j, t;

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
        var text='', oi;

        if (o===null) {
          return '';
        } else if (typeof o.MCID != 'undefined') {
          text=o.text;
        } else if (typeof o.ActualText!='undefined') {
          text=o.ActualText;
        } else if (typeof o.Alt!='undefined') {
          text=o.Alt;
        } else if (o.length) {
          for(oi=0;oi<o.length;oi++) {
            if (typeof o[oi].MCID != 'undefined') {
              text+=o[oi].text;
            } else if (typeof o[oi].ActualText!='undefined') {
              text+=o[oi].ActualText;
            } else if (typeof o[oi].Alt!='undefined') {
              text+=o[oi].Alt;
            } else if (typeof o[oi].children != 'undefined') {
              text+=getRecursiveText(o[oi].children);
            }
          }
        } else if (typeof o.children!='undefined') {
          text+=getRecursiveText(o.children);
        }
        return text;
      }

      while (dsiIndexes[dsi]<dsStack[dsi].length) {
        while (dsiIndexes[dsi]<dsStack[dsi].length) {
          elType=(ds.rm.hasOwnProperty(dsStack[dsi][dsiIndexes[dsi]].S))?ds.rm[dsStack[dsi][dsiIndexes[dsi]].S]:dsStack[dsi][dsiIndexes[dsi]].S;
            //blr.W15yQC.pdfCheckDialog.log('Checking: '+dsStack[dsi][dsiIndexes[dsi]].S);
          if (/^H\d+$/i.test(elType)) {
            break;
          }
          getNext();
        }
        if (dsiIndexes[dsi]>=dsStack[dsi].length && dsi<1) {
          //blr.W15yQC.pdfCheckDialog.log('Calling renderAndCheckDocStructure');
          break;
        } else {
          t=getRecursiveText(dsStack[dsi][dsiIndexes[dsi]]);
          hList.push({level:parseInt(elType.substring(1),10), text:t});
          getNext();
        }
      }

      if (hList.length>0) {
        prevHeadingLevel=1;
        ul=rd.createElement('ul');
        lStack=[ul];
        for(i=0;i<hList.length;i++) {
          hLevel=hList[i].level>0?hList[i].level:1;
          //blr.W15yQC.pdfCheckDialog.log('i:'+i+' hLevel:'+hLevel+' lStack.length:'+lStack.length);
          if (prevHeadingLevel<hLevel-1) {
            for(j=prevHeadingLevel+1;j<hLevel;j++) {
              li=rd.createElement('li');
              li.appendChild(rd.createTextNode('<H'+j+' - Missing Heading>'));
              lStack[lStack.length-1].appendChild(li);
              ul2=rd.createElement('ul');
              li.appendChild(ul2);
              lStack.push(ul2);
            }
          } else if (prevHeadingLevel==hLevel-1) {
              if (i==0) {
                li=rd.createElement('li');
                li.appendChild(rd.createTextNode('<H1 - Missing Heading>'));
                lStack[0].appendChild(li);
              }
              ul2=rd.createElement('ul');
              lStack[lStack.length-1].appendChild(ul2);
              lStack.push(ul2);
          } else if (prevHeadingLevel>hLevel) {
            for(j=prevHeadingLevel;j>hLevel;j--) {
              if(lStack.length>1) { lStack.pop(); }
            }
          }
          li=rd.createElement('li');
          li.appendChild(rd.createTextNode('[H'+hLevel+']: '+hList[i].text))
          lStack[lStack.length-1].appendChild(li);
          prevHeadingLevel=hLevel;
        }
        el.appendChild(lStack[0]);
      } else {
        p=rd.createElement('p');
        p.appendChild(rd.createTextNode('No Headings'));
        el.appendChild(p);
      }
    }

    function renderDocStructureLevel(o,el) {
      var oi,ol,oli, k,s, keys=['T','Lang','Alt','E','ActualText'];
      if (o!=null && o.length) {
        ol=rd.createElement('ul');
        for(oi=0;oi<o.length;oi++) {
          oli=rd.createElement('li');
          s='';
          if (o[oi].Pg!=null && typeof o[oi].Pg.num!='undefined' && typeof o[oi].Pg.gen!='undefined') {
            pgNum=ds.pageIndexByRef[o[oi].Pg.num][o[oi].Pg.gen]+1;
          } else if (/^(l|table|thead|tbody|tfoot|art|div|form|part|sect)$/i.test(ds.rm.hasOwnProperty(o[oi].S)?ds.rm[o[oi].S]:o[oi].S) && o[oi].children!=null && o[oi].children.length>0 &&
                     typeof o[oi].children[0].Pg!='undefined' && typeof o[oi].children[0].Pg.gen!='undefined') {
            pgNum=ds.pageIndexByRef[o[oi].children[0].Pg.num][o[oi].children[0].Pg.gen]+1;
          }
          if (pgNum!=prevPg) {
            if(prevPg>0) { oli.setAttribute('class','newPage'); }
            prevPg=pgNum;
            s=blr.W15yQC.fnJoin(s,'Page: '+pgNum,', ');
            tick();
          }
          for(k=0;k<keys.length;k++) {
            if (typeof o[oi][keys[k]] != 'undefined') {
              s=blr.W15yQC.fnJoin(s,'"'+keys[k]+'": '+blr.W15yQC.objectToString(o[oi][keys[k]],true),', ');
            }
          }
          if (typeof o[oi].S!='undefined') {
            oli.appendChild(rd.createTextNode((ds.rm.hasOwnProperty(o[oi].S)?ds.rm[o[oi].S]+' ('+o[oi].S+')':o[oi].S)+(s!=''?' {'+s+'}':'')));
          } else if (typeof o[oi].MCID!='undefined') {
            oli.appendChild(rd.createTextNode('[MCID='+o[oi].MCID+']'+(typeof o[oi].text!='undefined'?':'+o[oi].text:'')));
          } else {
            oli.appendChild(rd.createTextNode('ERROR'));
          }
          ol.appendChild(oli);
          if (o[oi].children!=null && o[oi].children.length>0) {
            renderDocStructureLevel(o[oi].children,oli);
          }
        }
        el.appendChild(ol);
      }
    }

    function renderAndCheckDocStructure(el) {
      var rmi, ol, oli, div, p, keys, i=-1;
      //blr.W15yQC.pdfCheckDialog.log('DS:'+blr.W15yQC.objectToString(ds));
      //blr.W15yQC.pdfCheckDialog.log('Kids:'+blr.W15yQC.objectToString(ds.pages));

      h=rd.createElement('h3');
      h.appendChild(rd.createTextNode('Element Statistics:'));
      el.appendChild(h);
      div=rd.createElement('div');
      el.appendChild(div);
      renderElementStatistics(div);

      h=rd.createElement('h3');
      h.appendChild(rd.createTextNode('Headings:'));
      el.appendChild(h);
      div=rd.createElement('div');
      el.appendChild(div);
      renderHeadings(div);

      h=rd.createElement('h3');
      h.appendChild(rd.createTextNode('Structure:'));
      el.appendChild(h);
      div=rd.createElement('div');
      el.appendChild(div);
      prevPg=-19392;
      pgNum=1;
      renderDocStructureLevel(ds,div);
      log('Finished.');
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
        meta=rd.createElement('meta');
        meta.setAttribute('http-equiv','content-type');
        meta.setAttribute('content','text/html; charset=UTF-8');
        rd.head.appendChild(meta);

        style=rd.createElement('style');
        style.appendChild(rd.createTextNode('li.newPage{border-top:1px solid black;}'));
        rd.head.appendChild(style);
        h=rd.createElement('h1');
        h.appendChild(rd.createTextNode('PDF Accessibility Report'));
        re.appendChild(h);

        h=rd.createElement('h2');
        h.appendChild(rd.createTextNode('PDF Info:'));
        re.appendChild(h);

        div=rd.createElement('div');
        re.appendChild(div);
        l=rd.createElement('ul');

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('URL: '+sURL));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Number of pages: '+pdf.pdfInfo.numPages));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Structured: '+(pdf.pdfInfo.isStructured==true?'Yes'+(pdf.pdfInfo.hasSuspects==true?', but has suspects':', and no suspects are indicated'):'No')));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Tagged: '+(pdf.pdfInfo.isTagged==true?'Yes':'No')));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Default language: '+pdf.pdfInfo.defaultLang));
        l.appendChild(li);

        li=rd.createElement('li');
        li.appendChild(rd.createTextNode('Outline/Bookmarks: '+((pdf.pdfInfo.outline!==null && pdf.pdfInfo.outline.length && pdf.pdfInfo.outline.length>0)?'Yes':'No')));
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
        div.appendChild(l);

        h=rd.createElement('h2');
        h.appendChild(rd.createTextNode('PDF Outline (Bookmarks):'));
        re.appendChild(h);
        div=rd.createElement('div');
        re.appendChild(div);

        renderOutlineLevel(pdf.pdfInfo.outline,div);

        if (pdf.pdfInfo.isStructured==true) {
          pdf.getDocumentStructure().then(function(ds){getTextForDocStructure(ds,re);});
        } else {
          h=rd.createElement('h2');
          h.appendChild(rd.createTextNode('No document structure'));
          re.appendChild(h);
          log('Finished.');
        }
      }
    } else {
      log('Error: pdf or re objects are null');
      log('Finished.');
    }
  }

  function getPdfForFullCheck(sURL) {
    var rd=document.getElementById('reportIFrame').contentDocument,
        re=rd.body,
        le=document.getElementById('note-text');

    return new Promise(function(resolve, reject) {
      le.value='Requesting: '+sURL;
      blr.PDFJS.getDocument(sURL).then(
        function(pdf){
          le.value=le.value+"\nChecking document.";
          resolve(getPdfFullCheckResults(pdf,sURL,rd,re,le));
        },
        function() {
          reject(null);
        });
    });
  }