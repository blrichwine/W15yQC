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

 * File:        removeStylesWindow.js
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
 * Object:  RemoveStylesWindow
 * Returns:
 */
blr.W15yQC.RemoveStylesWindow = {
    FirebugO: null,
    aDocumentsList: null,
    aFormsList: null,
    aFormControlsList: null,
    oLastTreeviewToHaveFocus: null,
    aLastList: null,
    prompts: null,
    rd: null,
    srcDoc: null,

    init: function(dialog) {
        var metaElements, i;
        blr.W15yQC.fnReadUserPrefs();
        blr.W15yQC.RemoveStylesWindow.FirebugO=dialog.arguments[1];
        blr.W15yQC.RemoveStylesWindow.srcDoc = dialog.arguments[2];
        var if1 = document.getElementById("HTMLReportIFrame");
        rd=if1.contentDocument;

        prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
        metaElements = blr.W15yQC.RemoveStylesWindow.srcDoc.head.getElementsByTagName('meta');
        if(metaElements != null && metaElements.length>0) {
          for(i=0;i<metaElements.length;i++) {
            rd.head.appendChild(rd.importNode(metaElements[i], false));
          }
        }
        rd.title = 'Removed Style View - '+blr.W15yQC.RemoveStylesWindow.srcDoc.title+' - W15yQC';
        blr.W15yQC.fnBuildRemoveStylesView(rd, rd.body, blr.W15yQC.RemoveStylesWindow.srcDoc);
    },
    
    cleanup: function() {
        if(blr.W15yQC.RemoveStylesWindow.aDocumentsList != null) {
            //blr.W15yQC.fnResetHighlights(blr.W15yQC.HTMLReportWindow.aDocumentsList);
            //blr.W15yQC.HTMLReportWindow.aDocumentsList=null;
            //blr.W15yQC.HTMLReportWindow.aFormControlsList=null;
            //blr.W15yQC.HTMLReportWindow.aFormsList=null;
            //blr.W15yQC.HTMLReportWindow.FirebugO=null;
            //blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus=null;
            //blr.W15yQC.HTMLReportWindow.aLastList=null;
        }
    },
    
    showInFirebug: function() {
        var treebox,aList;
        if(blr.W15yQC.RemoveStylesWindow.FirebugO!=null) {
            try{
                if(blr.W15yQC.RemoveStylesWindow.aFormControlsList != null && blr.W15yQC.RemoveStylesWindow.aFormControlsList.length && blr.W15yQC.HTMLReportWindow.aFormControlsList.length>0) {
                    if(blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus != null) {
                        treebox=blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus;
                        aList=blr.W15yQC.HTMLReportWindow.aLastList;
                    } else {
                        treebox = document.getElementById('treebox2');
                        aList=blr.W15yQC.HTMLReportWindow.aFormControlsList;
                    }
                    var selectedRow = treebox.currentIndex;
                    if(selectedRow == null || treebox.currentIndex < 0) {
                        selectedRow = 0;
                    }
                    if(blr.W15yQC.HTMLReportWindow.aDocumentsList != null) {
                        blr.W15yQC.fnResetHighlights(blr.W15yQC.HTMLReportWindow.aDocumentsList);
                    }
                    aList[selectedRow].node.ownerDocument.defaultView.focus();
                    void function(arg){blr.W15yQC.HTMLReportWindow.FirebugO.GlobalUI.startFirebug(function(){blr.W15yQC.HTMLReportWindow.FirebugO.Inspector.inspectFromContextMenu(arg);})}(aList[selectedRow].node);
                }
            } catch(ex) {}
        }
    },
    
     moveToSelectedElement: function() {
        var treebox, aList;
        if(blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus != null) {
            treebox=blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus;
            aList=blr.W15yQC.HTMLReportWindow.aLastList;
        } else {
            treebox = document.getElementById('treebox2');
            aList=blr.W15yQC.HTMLReportWindow.aFormControlsList;
        }
        var selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnMoveToElement(aList[selectedRow].node);
        }        
    },
    
    moveFocusToSelectedElement: function() {
        var treebox, aList;
        if(blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus != null) {
            treebox=blr.W15yQC.HTMLReportWindow.oLastTreeviewToHaveFocus;
            aList=blr.W15yQC.HTMLReportWindow.aLastList;
        } else {
            treebox = document.getElementById('treebox2');
            aList=blr.W15yQC.HTMLReportWindow.aFormControlsList;
        }
        var selectedRow = treebox.currentIndex;
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
        if(rd != null && rd.documentElement && rd.documentElement.innerHTML && rd.body && rd.body.children && rd.body.children.length &&
           rd.defaultView && rd.defaultView.print) {
            rd.defaultView.print();
        } else { 
            if(prompts.alert) prompts.alert(null, "W15yQC HTML Report Alert", "Nothing to print!");
        }
    },
    
    saveHTMLReport: function () {
        var converter,
          file,
          foStream,
          fp,
          nsIFilePicker,
          rv;
          
        if(rd != null && rd.documentElement && rd.documentElement.innerHTML && rd.body && rd.body.children && rd.body.children.length) {
          nsIFilePicker = Components.interfaces.nsIFilePicker;
    
          fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
          fp.init(window, "Dialog Title", nsIFilePicker.modeSave);
          fp.appendFilters(nsIFilePicker.filterHTML | nsIFilePicker.filterAll);
          rv = fp.show();
          if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
            
            file = fp.file;
            // work with returned nsILocalFile...
            if(/\.html?$/.test(file.path)==false) {
              file.initWithPath(file.path+'.html');
            }
    
            foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].  
                           createInstance(Components.interfaces.nsIFileOutputStream);  
    
            foStream.init(file, 0x2A, 438, 0);
            converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);  
            converter.init(foStream, "UTF-8", 0, 0);  
            converter.writeString('<html>'+rd.documentElement.innerHTML+'</html>');
            converter.close(); // this closes foStream            
          }
        } else { 
            if(prompts.alert) prompts.alert(null, "W15yQC HTML Report Alert", "Nothing to save!");
        }
    },

}