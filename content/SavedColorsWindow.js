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

 * File:        SavedColorsWindow.js
 * Description: Handles displaying the ARIA Landmarks quick check dialog
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
if (!blr) {
  var blr = {};
}

/*
 * Object:  SavedColorsWindow
 * Returns:
 */
blr.W15yQC.SavedColorsWindow = {
  prompts: null,
  bCmdIsPressed: false,
  rd: null,
  sourceDocument: null,
  storedColors: [],
  
  init: function (dialog) {
    var if1;
    blr.W15yQC.fnReadUserPrefs();
    if (dialog && dialog.arguments && dialog.arguments.length && dialog.arguments.length > 1) {
        blr.W15yQC.SavedColorsWindow.storedColors = dialog.arguments[1];

        if1 = document.getElementById("HTMLReportIFrame");
        if (if1 != null && if1.contentDocument) {
          blr.W15yQC.SavedColorsWindow.rd = if1.contentDocument;
        }
    
        blr.W15yQC.SavedColorsWindow.prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
        blr.W15yQC.SavedColorsWindow.fnGenerateHTMLViewOfStoredColors();
    }
  },

  fnGenerateHTMLViewOfStoredColors: function() {
    var i, sc=blr.W15yQC.SavedColorsWindow.storedColors, hasThreeColors=false,
        table, thead, tbody, tr, th, td, span, el, el2, rd=blr.W15yQC.SavedColorsWindow.rd;

    for(i=0;i<sc.length;i++) {
        if(sc[i][3]) {
            hasThreeColors=true;
            break;
        }
    }
    el=rd.createElement('style');
    el.setAttribute('type','text/css');
    el.appendChild(rd.createTextNode('table{border-collapse:collapse;margin:5px;padding:0}tr{margin:0;padding:0}th{white-space:nowrap;border:thin solid black;text-align:right;background-color:#E3E3E3;color:#000;padding:3px}td{text-align:right;margin:0;padding:3px;border:thin solid black}'));
    rd.head.appendChild(el);
    table=rd.createElement('table');
    thead=rd.createElement('thead');
    tr=rd.createElement('tr');
    th=rd.createElement('th');
    th.appendChild(rd.createTextNode('C1'));
    tr.appendChild(th);
    if(hasThreeColors==true) {
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('C2'));
        tr.appendChild(th);
    }
    th=rd.createElement('th');
    th.appendChild(rd.createTextNode('BG'));
    tr.appendChild(th);
    th=rd.createElement('th');
    th.appendChild(rd.createTextNode('C1 - BG'));
    tr.appendChild(th);
    if(hasThreeColors==true) {
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('C2 - BG'));
        tr.appendChild(th);
        th=rd.createElement('th');
        th.appendChild(rd.createTextNode('C1 - C2'));
        tr.appendChild(th);
    }
    th=rd.createElement('th');
    th.appendChild(rd.createTextNode('Color Sample'));
    th.setAttribute('style','text-align:left');
    tr.appendChild(th);
    thead.appendChild(tr)
    table.appendChild(thead);
    tbody=rd.createElement('tbody');
    
    for(i=0;i<blr.W15yQC.SavedColorsWindow.storedColors.length;i++) {
        tr=rd.createElement('tr');
        td=rd.createElement('td');
        td.appendChild(rd.createTextNode(sc[i][0])); // C1
        tr.appendChild(td);
        if(hasThreeColors==true) {
            td=rd.createElement('td');
            td.appendChild(rd.createTextNode(sc[i][3] ? sc[i][1] : '-')); // C2
            tr.appendChild(td);
        }
        td=rd.createElement('td');
        td.appendChild(rd.createTextNode(sc[i][2])); // BGC
        tr.appendChild(td);
        td=rd.createElement('td');
        td.appendChild(rd.createTextNode(sc[i][4])); // c1 - bg
        tr.appendChild(td);
        if(hasThreeColors==true) {
            td=rd.createElement('td');
            td.appendChild(rd.createTextNode(sc[i][3] ? sc[i][5] : '-')); // c2 - bg
            tr.appendChild(td);
            td=rd.createElement('td');
            td.appendChild(rd.createTextNode(sc[i][3] ? sc[i][6] : '-')); // c1 - c2
            tr.appendChild(td);
        }
        if(sc[i][3]) {
            td=rd.createElement('td');
            td.setAttribute('style','text-align:left;font-size:14px;color:'+sc[i][0]+';background-color:'+sc[i][2]+';');
            td.appendChild(rd.createTextNode('Example text in color 1 at 14 points. '));
            el = rd.createElement('i');
            el.appendChild(rd.createTextNode('Example text in italic. '));
            td.appendChild(el);
            el = rd.createElement('b');
            el.appendChild(rd.createTextNode('Example text in bold. '));
            td.appendChild(el);

            span=rd.createElement('span');
            span.setAttribute('style','font-size:14px;color:'+sc[i][1]+';background-color:'+sc[i][2])
            span.appendChild(rd.createTextNode('Example text in color 2 at 14 points. '));
            
            el = rd.createElement('i');
            el.appendChild(rd.createTextNode('Example text in italic. '));
            span.appendChild(el);
            el = rd.createElement('b');
            el.appendChild(rd.createTextNode('Example text in bold.'));
            span.appendChild(el);
            td.appendChild(span);
            td.appendChild(rd.createElement('br'));
            
            el = rd.createElement('div');
            el.setAttribute('style', 'width:16px;height:16px;background-color:' + sc[i][0] + ';margin:3px;float:left');
            td.appendChild(el);

            el = rd.createElement('div');
            el.setAttribute('style', 'width:16px;height:16px;background-color:' + sc[i][1] + ';margin:3px;float:left');
            td.appendChild(el);

            el = rd.createElement('div');
            el.setAttribute('style', 'color:' + sc[i][0] + ';');
            el.appendChild(rd.createTextNode(' This has '));
            el2 = rd.createElement('span');
            el2.setAttribute('style', 'color:' + sc[i][1]);
            el2.appendChild(rd.createTextNode('two different'));
            el.appendChild(el2);
            el.appendChild(rd.createTextNode(' colors in it.'));
            td.appendChild(el);
            tr.appendChild(td);
        } else {
            td=rd.createElement('td');
            td.setAttribute('style','text-align:left;font-size:14px;color:'+sc[i][0]+';background-color:'+sc[i][2]+';');
            td.appendChild(rd.createTextNode('Example text in color 1 at 14 points. '));
            el = rd.createElement('i');
            el.appendChild(rd.createTextNode('Example text in italic. '));
            td.appendChild(el);
            el = rd.createElement('b');
            el.appendChild(rd.createTextNode('Example text in bold. '));
            td.appendChild(el);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    rd.body.appendChild(table);
  },
  
  windowOnKeyDown: function (win, evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.SavedColorsWindow.bCmdIsPressed = true;
        break;
      case 27:
        win.close();
        break;
      case 87:
        if (blr.W15yQC.SavedColorsWindow.bCmdIsPressed == true) win.close();
        break;
    }
  },

  windowOnKeyUp: function (evt) {
    switch (evt.keyCode) {
      case 224:
        blr.W15yQC.SavedColorsWindow.bCmdIsPressed = false;
        break;
    }
  },

  cleanup: function () {
    blr.W15yQC.SavedColorsWindow.rd = null;
  },

  forceMinSize: function (dialog) {
    if (dialog.outerWidth > 10 && dialog.outerHeight > 10 && (dialog.outerWidth < 940 || dialog.outerHeight < 610)) {
      dialog.resizeTo(Math.max(940, dialog.outerWidth), Math.max(610, dialog.outerHeight));
    }
  },

  printReport: function () {
    if (blr.W15yQC.SavedColorsWindow.rd != null && blr.W15yQC.SavedColorsWindow.rd.documentElement && blr.W15yQC.SavedColorsWindow.rd.documentElement.innerHTML && blr.W15yQC.SavedColorsWindow.rd.body && blr.W15yQC.SavedColorsWindow.rd.body.children && blr.W15yQC.SavedColorsWindow.rd.body.children.length && blr.W15yQC.SavedColorsWindow.rd.defaultView && blr.W15yQC.SavedColorsWindow.rd.defaultView.print) {
      blr.W15yQC.SavedColorsWindow.rd.defaultView.print();
    } else {
      if (blr.W15yQC.SavedColorsWindow.prompts.alert) blr.W15yQC.SavedColorsWindow.prompts.alert(null, "W15yQC Alert", "Nothing to print!");
    }
  },

  saveStoredColorsAsText: function () {
    var converter,
    file,
    foStream,
    fp,
    nsIFilePicker,
    rv, sc=blr.W15yQC.SavedColorsWindow.storedColors, i;

    if (sc != null && sc.length && sc.length>0) {
      nsIFilePicker = Components.interfaces.nsIFilePicker;

      fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
      fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
      fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterAll);
      rv = fp.show();
      if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {

        file = fp.file;
        if (/\.txt$/.test(file.path) == false) {
          file.initWithPath(file.path + '.txt');
        }

        foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].
        createInstance(Components.interfaces.nsIFileOutputStream);

        foStream.init(file, 0x2A, 438, 0);
        converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
        converter.init(foStream, "UTF-8", 0, 0);
        for(i=0;i<sc.length;i++) {
            converter.writeString('#'+(i+1).toString() +"\t C1: " + sc[i][0] + (sc[i][3] ? "\t C2: " + sc[i][1] : "") + "\t BG: " + sc[i][2] + "\t C1-BG: "+ sc[i][4]);
            if(sc[i][3]) {
                converter.writeString("\t C2-BG: "+ sc[i][5]+"\t C1-C2: "+ sc[i][6]);
            }
            converter.writeString("\n");
        }
        converter.close(); // this closes foStream            
      }
    } else {
      if (blr.W15yQC.SavedColorsWindow.prompts.alert) blr.W15yQC.SavedColorsWindow.prompts.alert(null, "W15yQC Alert", "Nothing to save!");
    }
  },
  
  saveStoredColorsAsHTML: function () {
    var converter,
    file,
    foStream,
    fp,
    nsIFilePicker,
    rv;

    if (blr.W15yQC.SavedColorsWindow.rd != null && blr.W15yQC.SavedColorsWindow.rd.documentElement && blr.W15yQC.SavedColorsWindow.rd.documentElement.innerHTML && blr.W15yQC.SavedColorsWindow.rd.body && blr.W15yQC.SavedColorsWindow.rd.body.children && blr.W15yQC.SavedColorsWindow.rd.body.children.length) {
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
        converter.writeString('<html>' + blr.W15yQC.SavedColorsWindow.rd.documentElement.innerHTML + '</html>');
        converter.close(); // this closes foStream            
      }
    } else {
      if (blr.W15yQC.SavedColorsWindow.prompts.alert) blr.W15yQC.SavedColorsWindow.prompts.alert(null, "W15yQC Alert", "Nothing to save!");
    }
  }

};