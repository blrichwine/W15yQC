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

 * File:        overallScannerReportWindow.js
 * Description: Handles displaying the Overall Scanner Report
 * Author:	Brian Richwine
 * Created:	2012.12.10
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2012.12.10 - Created!
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
 * Object:  OverallScannerReportWindow
 * Returns:
 */
blr.W15yQC.OverallScannerReportWindow = {
  sw: null,
  urlList: null,
  prompts: null,
  bCmdIsPressed: false,
  rd: null,

  init: function (dialog) {
    var rw, if1;

    blr.W15yQC.OverallScannerReportWindow.prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    blr.W15yQC.fnReadUserPrefs();

    if (dialog && dialog.arguments && dialog.arguments.length) {
      if (dialog.arguments.length > 1) {
        blr.W15yQC.OverallScannerReportWindow.sw = dialog.arguments[1];
        blr.W15yQC.OverallScannerReportWindow.urlList=blr.W15yQC.OverallScannerReportWindow.sw.urlList;
        rw = document.getElementById("OverallScannerReportWindow");
        if (rw != null) {
            if1 = document.getElementById("HTMLReportIFrame");
            if (if1 != null && if1.contentDocument) {
                blr.W15yQC.OverallScannerReportWindow.rd = if1.contentDocument;
                rw.setAttribute('title', blr.W15yQC.fnJoin(blr.W15yQC.OverallScannerReportWindow.sw.sProjectTitle,'Overall Scanner Report - W15yQC',' - '));
                blr.W15yQC.OverallScannerReportWindow.generateReport();
                dialog.fnUpdateProgress('Ready.',null);
            }
        }
      }
    }
  },

  addPair: function(count, idx, maxLength, list) {
    var i;

    if (list==null) {
      list={
        c:[],
        i:[]
      };
      if (count>0) {
        list.c.push(count);
        list.i.push(idx);
      }
    } else if (count>0 && (list.c.length<maxLength || count>list.c[maxLength-1])) {
      if (list.c.length<1 || (count<=list.c[list.c.length-1] && list.c.length<maxLength)) {
        list.c.push(count);
        list.i.push(idx);
      } else {
        for(i=list.c.length-1;i>=0;i--) {
          if (i<list.c.length-1) {
            list.c[i+1]=list.c[i];
            list.i[i+1]=list.i[i];
          }
          if(i<1 || count<list.c[i-1]) {
            list.c[i]=count;
            list.i[i]=idx;
            break;
          }
        }
      }
    }
    return list;
  },
  
  
  generateMaxPagesSection: function(sTitle,sFirstColumnHeading,rd,list) {
    var table, caption, thead, tbody, tr, th, td, h, a, i;
      if (list!=null && list.c.length>0) {
        table=rd.createElement('table');
        caption=rd.createElement('caption');
        h=rd.createElement('h2');
        h.appendChild(rd.createTextNode(sTitle));
        caption.appendChild(h);
        table.appendChild(caption);
        thead=rd.createElement('thead');
        tr=rd.createElement('tr');

        th=rd.createElement('th');
        th.appendChild(rd.createTextNode(sFirstColumnHeading));
        th.setAttribute('style','text-align:right;');
        th.setAttribute('scope','col');
        tr.appendChild(th);

        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('Page Score'));
        th.setAttribute('style','text-align:right;padding-left:20px');
        th.setAttribute('scope','col');
        tr.appendChild(th);

        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('URL'));
        th.setAttribute('style','text-align:left;padding-left:20px');
        th.setAttribute('scope','col');
        tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);
        
        tbody=rd.createElement('tbody');
        for(i=0;i<list.c.length;i++) {
          tr=rd.createElement('tr');
          
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(list.c[i]));
          td.setAttribute('style','text-align:right;vertical-align:top');
          tr.appendChild(td);
          
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode(blr.W15yQC.OverallScannerReportWindow.urlList[list.i[i]].score));
          td.setAttribute('style','text-align:right;vertical-align:top');
          tr.appendChild(td);
          
          td=rd.createElement('td');
          td.appendChild(rd.createTextNode('(#'+(list.i[i]+1)+') '+blr.W15yQC.OverallScannerReportWindow.urlList[list.i[i]].windowTitle));
          td.appendChild(rd.createElement('br'));
          a=rd.createElement('a');
          a.setAttribute('href',blr.W15yQC.OverallScannerReportWindow.urlList[list.i[i]].loc);
          a.setAttribute('target','_blank');
          a.appendChild(rd.createTextNode(blr.W15yQC.OverallScannerReportWindow.urlList[list.i[i]].loc));
          td.appendChild(a);
          td.setAttribute('style','text-align:left;padding-left:20px');
          tr.appendChild(td);
          
          tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        rd.body.appendChild(table);
      }
  },
  
  generateReport: function() {
    var i, j, l, list, llen, rd,
        maxFailuresList=null, maxDocumentsList=null, maxFormControlsList=null,
        missingTitles=[], pagesWithNonUniqueTitles=0, pageScoreHistogram=[], effectiveNonUniqueTitles=[], nonUniqueTitles, effectiveWindowTitle, maxPSHValue,
        ul,li,a,ul2,li2,h, table, thead, tbody, tr, th, td, caption, span, fv, ev, w;
    rd=blr.W15yQC.OverallScannerReportWindow.rd;
    list=blr.W15yQC.OverallScannerReportWindow.urlList;
    nonUniqueTitles=new blr.W15yQC.HashTable();
    h=rd.createElement('h1');
    h.appendChild(rd.createTextNode('Overall Report'));
    rd.body.appendChild(h);
    if (list!=null && list.length>0) {
      for(i=0;i<100;i++) { pageScoreHistogram[i]=0; }
      llen=list.length;
      for(i=0;i<llen;i++) {
        if(list[i]!=null && list[i].score!=null) {
          pageScoreHistogram[list[i].score/5<19?list[i].score/5:19]++;
        }
        // Pages with the most form controls
        if(list[i].formControlsCount>2) { maxFormControlsList=blr.W15yQC.OverallScannerReportWindow.addPair(list[i].formControlsCount,i,30,maxFormControlsList); }
  
        // Pages with the most documents
        if(list[i].downloadsCount>0) { maxDocumentsList=blr.W15yQC.OverallScannerReportWindow.addPair(list[i].downloadsCount,i,30,maxDocumentsList); }

        // Pages with the most failures
        if(list[i].failuresCount>0) { maxFailuresList=blr.W15yQC.OverallScannerReportWindow.addPair(list[i].failuresCount,i,30,maxFailuresList); }

        if (!blr.W15yQC.fnStringHasContent(list[i].windowTitle)) {
          missingTitles.push(i);
        } else if(list[i].windowTitleNotUnique==true) {
          effectiveWindowTitle=list[i].windowTitle.replace(/['"]/,'').replace(/[!\(\)_;:\/\\\|\?\^=]+/g, ' ').replace(/[\.,\+-]+([a-z\s]|$)/ig, '$1').replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '').toLowerCase();
          if (!nonUniqueTitles.hasItem(effectiveWindowTitle)) {
            nonUniqueTitles.setItem(effectiveWindowTitle,[i]);
            effectiveNonUniqueTitles.push(effectiveWindowTitle);
          } else {
            nonUniqueTitles.getItem(effectiveWindowTitle).push(i);
          }          
        }
      }
      
      table=rd.createElement('table');
      table.setAttribute('style','border-collapse: collapse');
      caption=rd.createElement('caption');
      h=rd.createElement('h2');
      h.appendChild(rd.createTextNode('Page Score Histogram'));
      h.setAttribute('style','text-align:left');
      caption.appendChild(h);
      caption.setAttribute('style','text-align:left');
      table.appendChild(caption);
      thead=rd.createElement('thead');
      tr=rd.createElement('tr');
      th=rd.createElement('th');
      th.appendChild(rd.createTextNode('Page Score'));
      th.setAttribute('scope','col');
      tr.appendChild(th);
      th=rd.createElement('th');
      th.appendChild(rd.createTextNode('Page Count'));
      th.setAttribute('scope','col');
      th.setAttribute('style','text-align:left;padding-left:20px;');
      tr.appendChild(th);
      thead.appendChild(tr);
      table.appendChild(thead);
      tbody=rd.createElement('tbody');
      maxPSHValue=0;
      for(i=0;i<20;i++) {
        if (pageScoreHistogram[i]>maxPSHValue) {
          maxPSHValue=pageScoreHistogram[i];
        }
      }
      for(i=0;i<20;i++) {
        tr=rd.createElement('tr');
        th=rd.createElement('th');
        th.setAttribute('scope','row');
        fv=i*5;
        ev=(((i+1)*5-1)>98) ? 100:(i+1)*5-1;
        th.appendChild(rd.createTextNode(fv+' - '+ev));
        tr.appendChild(th);
        td=rd.createElement('td');
        span=rd.createElement('div');
        span.appendChild(rd.createTextNode(pageScoreHistogram[i]));
        span.setAttribute('class','PageScoreValue');
        span.setAttribute('style','display:table-cell;width:50px;text-align:right');
        td.appendChild(span);
        span=rd.createElement('div');
        span.setAttribute('class','PageScoreBar');
        w=Math.floor(800.0*pageScoreHistogram[i]/maxPSHValue);
        span.setAttribute('style','display:table-cell;background-color:red;width:'+w+'px;');
        td.appendChild(span);
        tr.appendChild(td);
        tr.setAttribute('style','line-height:1.1em');
        tbody.appendChild(tr);
      }
      table.appendChild(tbody);
      rd.body.appendChild(table);
      
      if (maxFailuresList!=null && maxFailuresList.c.length>0) {
        blr.W15yQC.OverallScannerReportWindow.generateMaxPagesSection('Pages with the Most Elements with Failures','Elements with Failures',rd,maxFailuresList);
      }
      
      if (maxFormControlsList!=null && maxFormControlsList.c.length>0) {
        blr.W15yQC.OverallScannerReportWindow.generateMaxPagesSection('Pages with the Most Form Controls','Form Controls',rd,maxFormControlsList);
      }
      
      if (maxDocumentsList!=null && maxDocumentsList.c.length>0) {
        blr.W15yQC.OverallScannerReportWindow.generateMaxPagesSection('Pages with the Most Links to Downloads','Links to Downloads',rd,maxDocumentsList);
      }
      
      if (missingTitles.length>0) {
        h=rd.createElement('h2');
        h.appendChild(rd.createTextNode('Pages Without Titles'));
        rd.body.appendChild(h);
        // sort titles
        ul=rd.createElement('ul');
        for (i=0;i<missingTitles.length;i++) {
          li=rd.createElement('li');
          a=rd.createElement('a');
          a.setAttribute('href',list[missingTitles[i]].loc);
          a.setAttribute('target','_blank');
          a.appendChild(rd.createTextNode(list[missingTitles[i]].loc));
          li.appendChild(a);
          ul.appendChild(li);
          if (j>=29 && l.length>35) {
            li=rd.createElement('li');
            li.appendChild(rd.createTextNode('Plus '+(missingTitles.length-i)+' more...'));
            ul.appendChild(li);
            break;
          }
        }
        rd.body.appendChild(ul);
      }
            
      if (effectiveNonUniqueTitles.length>0) {
        h=rd.createElement('h2');
        h.appendChild(rd.createTextNode('Pages with Non Unique Titles'));
        rd.body.appendChild(h);
        effectiveNonUniqueTitles.sort();
        
        ul=rd.createElement('ul');
        for (i=0;i<effectiveNonUniqueTitles.length;i++) {
          li=rd.createElement('li');
          l=nonUniqueTitles.getItem(effectiveNonUniqueTitles[i]);
          li.appendChild(rd.createTextNode(list[l[0]].windowTitle));
          ul2=rd.createElement('ul');
          for(j=0;j<l.length;j++) {
            li2=rd.createElement('li');
            a=rd.createElement('a');
            a.setAttribute('href',list[l[j]].loc);
            a.setAttribute('target','_blank');
            a.appendChild(rd.createTextNode(list[l[j]].loc));
            li2.appendChild(a);
            ul2.appendChild(li2);
            if (j>=29 && l.length>35) {
              li2=rd.createElement('li');
              li2.appendChild(rd.createTextNode('Plus '+(l.length-j)+' more...'));
              ul2.appendChild(li2);
              break;
            }
          }
          li.appendChild(ul2);
          ul.appendChild(li);
        }
        rd.body.appendChild(ul);
      }
    }
  },
  
  windowOnKeyDown: function (win, evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.OverallScannerReportWindow.bCmdIsPressed = true;
        break;
      case 27:
        win.close();
        break;
      case 87:
        if (blr.W15yQC.OverallScannerReportWindow.bCmdIsPressed == true) win.close();
        break;
    }
  },

  windowOnKeyUp: function (evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.OverallScannerReportWindow.bCmdIsPressed = false;
        break;
    }
  },

  cleanup: function () {
    if (blr.W15yQC.OverallScannerReportWindow.aDocumentsList != null) {
      blr.W15yQC.OverallScannerReportWindow.rd = null;
      blr.W15yQC.OverallScannerReportWindow.sReports = null;
      blr.W15yQC.OverallScannerReportWindow.prompts = null;
    }
  },

  moveToSelectedElement: function () {
    var treebox, aList, selectedRow;
    if (blr.W15yQC.OverallScannerReportWindow.oLastTreeviewToHaveFocus != null) {
      treebox = blr.W15yQC.OverallScannerReportWindow.oLastTreeviewToHaveFocus;
      aList = blr.W15yQC.OverallScannerReportWindow.aLastList;
    } else {
      treebox = document.getElementById('treebox2');
      aList = blr.W15yQC.OverallScannerReportWindow.aFormControlsList;
    }
    selectedRow = treebox.currentIndex;
    if (selectedRow != null && treebox.currentIndex >= 0) {
      blr.W15yQC.fnMoveToElement(aList[selectedRow].node);
    }
  },

  forceMinSize: function (dialog) {
    if (dialog.outerWidth > 10 && dialog.outerHeight > 10 && (dialog.outerWidth < 940 || dialog.outerHeight < 610)) {
      dialog.resizeTo(Math.max(940, dialog.outerWidth), Math.max(610, dialog.outerHeight));
    }
  },

  printReport: function () {
    if (blr.W15yQC.OverallScannerReportWindow.rd != null && blr.W15yQC.OverallScannerReportWindow.rd.documentElement && blr.W15yQC.OverallScannerReportWindow.rd.documentElement.innerHTML && blr.W15yQC.OverallScannerReportWindow.rd.body && blr.W15yQC.OverallScannerReportWindow.rd.body.children && blr.W15yQC.OverallScannerReportWindow.rd.body.children.length && blr.W15yQC.OverallScannerReportWindow.rd.defaultView && blr.W15yQC.OverallScannerReportWindow.rd.defaultView.print) {
      blr.W15yQC.OverallScannerReportWindow.rd.defaultView.print();
    } else {
      if (blr.W15yQC.OverallScannerReportWindow.prompts.alert) blr.W15yQC.OverallScannerReportWindow.prompts.alert(null, "W15yQC HTML Report Alert", "Nothing to print!");
    }
  },

  saveHTMLReport: function () {
    var converter,
    file,
    foStream,
    fp,
    nsIFilePicker,
    rv;

    if (blr.W15yQC.OverallScannerReportWindow.rd != null && blr.W15yQC.OverallScannerReportWindow.rd.documentElement && blr.W15yQC.OverallScannerReportWindow.rd.documentElement.innerHTML && blr.W15yQC.OverallScannerReportWindow.rd.body && blr.W15yQC.OverallScannerReportWindow.rd.body.children && blr.W15yQC.OverallScannerReportWindow.rd.body.children.length) {
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
        converter.writeString('<html>' + blr.W15yQC.OverallScannerReportWindow.rd.documentElement.innerHTML + '</html>');
        converter.close(); // this closes foStream
      }
    } else {
      if (blr.W15yQC.OverallScannerReportWindow.prompts.alert) blr.W15yQC.OverallScannerReportWindow.prompts.alert(null, "W15yQC HTML Report Alert", "Nothing to save!");
    }
  }

};
