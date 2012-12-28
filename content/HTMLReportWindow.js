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

 * File:        HTMLReportWindow.js
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
if (!blr) { var blr = {}; }

/*
 * Object:  HTMLReportWindow
 * Returns:
 */
blr.W15yQC.HTMLReportWindow = {
    FirebugO: null,
    sReports: null,
    prompts: null,
    bCmdIsPressed: false,
    bQuick: false,
    rd: null,

    init: function(dialog) {
        var rw, if1;
        blr.W15yQC.fnReadUserPrefs();
        if(dialog && dialog.arguments && dialog.arguments.length) {
            if(dialog.arguments.length>1) blr.W15yQC.HTMLReportWindow.FirebugO=dialog.arguments[1];
            if(dialog.arguments.length>2) blr.W15yQC.HTMLReportWindow.sReports=dialog.arguments[2];
            if(dialog.arguments.length>3) blr.W15yQC.HTMLReportWindow.bQuick=dialog.arguments[3];
         } 
        rw = document.getElementById("HTMLReportWindow");
        if(rw != null) {
            if(blr.W15yQC.HTMLReportWindow.bQuick) {
                rw.setAttribute('title','Quick Report - W15y Quick Check');
            } else {
                rw.setAttribute('title','Full Report - W15y Quick Check');
            }
        }
        if1 = document.getElementById("HTMLReportIFrame");
        if(if1!=null && if1.contentDocument) { blr.W15yQC.HTMLReportWindow.rd=if1.contentDocument; }

        blr.W15yQC.HTMLReportWindow.prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
        blr.W15yQC.fnInspect(blr.W15yQC.HTMLReportWindow.rd,blr.W15yQC.HTMLReportWindow.sReports, blr.W15yQC.HTMLReportWindow.bQuick);
    },
    
    windowOnKeyDown: function(win,evt) {
        switch(evt.keyCode) {
            case 224: blr.W15yQC.HTMLReportWindow.bCmdIsPressed = true;
                break;
            case 27: win.close();
                break;
            case 87: if(blr.W15yQC.HTMLReportWindow.bCmdIsPressed==true) win.close();
                break;
        }
    },
    
    windowOnKeyUp: function(evt) {
        switch(evt.keyCode) {
            case 224: blr.W15yQC.HTMLReportWindow.bCmdIsPressed = false;
                break;
        }
    },
    
    cleanup: function() {
        if(blr.W15yQC.HTMLReportWindow.aDocumentsList != null) {
            blr.W15yQC.HTMLReportWindow.rd=null;
            blr.W15yQC.HTMLReportWindow.sReports=null;
            blr.W15yQC.HTMLReportWindow.prompts=null;
            blr.W15yQC.HTMLReportWindow.FirebugO=null;
        }
    },
    
    showInFirebug: function() {
        var treebox,aList, selectedRow;
        if(blr.W15yQC.HTMLReportWindow.FirebugO!=null) {
            try{
                if(blr.W15yQC.HTMLReportWindow.aFormControlsList != null && blr.W15yQC.HTMLReportWindow.aFormControlsList.length && blr.W15yQC.HTMLReportWindow.aFormControlsList.length>0) {
                    if(blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus != null) {
                        treebox=blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus;
                        aList=blr.W15yQC.HTMLReportWindow.aLastList;
                    } else {
                        treebox = document.getElementById('treebox2');
                        aList=blr.W15yQC.HTMLReportWindow.aFormControlsList;
                    }
                    selectedRow = treebox.currentIndex;
                    if(selectedRow == null || treebox.currentIndex < 0) {
                        selectedRow = 0;
                    }
                    if(blr.W15yQC.HTMLReportWindow.aDocumentsList != null) {
                        blr.W15yQC.fnResetHighlights(blr.W15yQC.HTMLReportWindow.aDocumentsList);
                    }
                    aList[selectedRow].node.ownerDocument.defaultView.focus();
                    void function(arg){blr.W15yQC.HTMLReportWindow.FirebugO.GlobalUI.startFirebug(function(){blr.W15yQC.HTMLReportWindow.FirebugO.Inspector.inspectFromContextMenu(arg);});}(aList[selectedRow].node);
                }
            } catch(ex) {}
        }
    },
    
     moveToSelectedElement: function() {
        var treebox, aList, selectedRow;
        if(blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus != null) {
            treebox=blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus;
            aList=blr.W15yQC.HTMLReportWindow.aLastList;
        } else {
            treebox = document.getElementById('treebox2');
            aList=blr.W15yQC.HTMLReportWindow.aFormControlsList;
        }
        selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnMoveToElement(aList[selectedRow].node);
        }        
    },
    
    moveFocusToSelectedElement: function() {
        var treebox, aList, selectedRow;
        if(blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus != null) {
            treebox=blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus;
            aList=blr.W15yQC.HTMLReportWindow.aLastList;
        } else {
            treebox = document.getElementById('treebox2');
            aList=blr.W15yQC.HTMLReportWindow.aFormControlsList;
        }
        selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.HTMLReportWindow.aDocumentsList);
            blr.W15yQC.fnMoveFocusToElement(aList[selectedRow].node);
        }        
    },
        
    forceMinSize: function(dialog) {
        if(dialog.outerWidth>10 && dialog.outerHeight>10 && (dialog.outerWidth<940 || dialog.outerHeight<610)) {
            dialog.resizeTo(Math.max(940,dialog.outerWidth),Math.max(610,dialog.outerHeight));
        }
    },
    
    printReport: function () {
        if(blr.W15yQC.HTMLReportWindow.rd != null && blr.W15yQC.HTMLReportWindow.rd.documentElement && blr.W15yQC.HTMLReportWindow.rd.documentElement.innerHTML && blr.W15yQC.HTMLReportWindow.rd.body && blr.W15yQC.HTMLReportWindow.rd.body.children && blr.W15yQC.HTMLReportWindow.rd.body.children.length &&
           blr.W15yQC.HTMLReportWindow.rd.defaultView && blr.W15yQC.HTMLReportWindow.rd.defaultView.print) {
            blr.W15yQC.HTMLReportWindow.rd.defaultView.print();
        } else { 
            if(blr.W15yQC.HTMLReportWindow.prompts.alert) blr.W15yQC.HTMLReportWindow.prompts.alert(null, "W15yQC HTML Report Alert", "Nothing to print!");
        }
    },
    
    saveHTMLReport: function () {
        var converter,
          file,
          foStream,
          fp,
          nsIFilePicker,
          rv;
          
        if(blr.W15yQC.HTMLReportWindow.rd != null && blr.W15yQC.HTMLReportWindow.rd.documentElement &&
           blr.W15yQC.HTMLReportWindow.rd.documentElement.innerHTML && blr.W15yQC.HTMLReportWindow.rd.body &&
           blr.W15yQC.HTMLReportWindow.rd.body.children && blr.W15yQC.HTMLReportWindow.rd.body.children.length) {
          nsIFilePicker = Components.interfaces.nsIFilePicker;
    
          fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
          fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
          fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterAll);
          rv = fp.show();
          if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
            
            file = fp.file;
            if(/\.html?$/.test(file.path)==false) {
              file.initWithPath(file.path+'.html');
            }
    
            foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].  
                           createInstance(Components.interfaces.nsIFileOutputStream);  
    
            foStream.init(file, 0x2A, 438, 0);
            converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);  
            converter.init(foStream, "UTF-8", 0, 0);  
            converter.writeString('<html>'+blr.W15yQC.HTMLReportWindow.rd.documentElement.innerHTML+'</html>');
            converter.close(); // this closes foStream            
          }
        } else { 
            if(blr.W15yQC.HTMLReportWindow.prompts.alert) blr.W15yQC.HTMLReportWindow.prompts.alert(null, "W15yQC HTML Report Alert", "Nothing to save!");
        }
    }

};