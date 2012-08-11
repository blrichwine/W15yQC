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

 * File:        luminosityCheckDialog.js
 * Description: Handles displaying the Images quick check dialog
 * Author:	Brian Richwine
 * Created:	2011.12.17
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2011.12.17 - Created! 
 *
 * TODO:
 *      
 *    - Internationalize?
 *    
 * 
 */
if (!blr) { var blr = {}; }

/*
 * Object:  LuminosityCheckDialog
 * Returns:
 */
blr.W15yQC.LuminosityCheckDialog = {
    FirebugO: null,
    aDocumentsList: null,
    aLumCheckList: null,
    iLastSelectedRow: 0,
    fnPopulateTree: function(aDocumentsList, aLumCheckList) {
        if(aDocumentsList != null && aLumCheckList != null && aLumCheckList.length && aLumCheckList.length > 0) {
            var tbc = document.getElementById('treeboxChildren');
            var bHasID = false;
            var bHasClass = false;
            if(tbc != null) {
                for(var i=0; i<aLumCheckList.length; i++) {
                    var ak = aLumCheckList[i];
                    if(ak.node.hasAttribute('id')) bHasID = true;
                    if(ak.node.hasAttribute('class')) bHasClass = true;
                }
                 if(!bHasID) {
                    var ch = document.getElementById('col-header-id');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasClass) {
                    var ch = document.getElementById('col-header-class');
                    ch.setAttribute('hidden','true');
                }
               if(aDocumentsList.length<=1) {
                    var ch = document.getElementById('col-header-documentNumber');
                    ch.setAttribute('hidden','true');
                }
                for(var i=0; i<aLumCheckList.length; i++) {
                    var treeitem = document.createElement('treeitem');
                    var treerow = document.createElement('treerow');
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    var ak = aLumCheckList[i];
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.ownerDocumentNumber);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.nodeDescription);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.node.tagName);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ' '+(ak.node.hasAttribute('id') ? ak.node.getAttribute('id') : '')+' ');
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ' '+(ak.node.hasAttribute('class') ? ak.node.getAttribute('class') : '')+' ');
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ' '+ak.textSize+' ');
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ' '+ak.textWeight+' ');
                    treerow.appendChild(treecell);
                    
                    var fgC = blr.W15yQC.fnGetColorString(parseInt(ak.fgColor[0])*65536+parseInt(ak.fgColor[1]*256)+parseInt(ak.fgColor[2]));
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ' '+fgC+' ');
                    treerow.appendChild(treecell);
                                        
                    var bgC = blr.W15yQC.fnGetColorString(parseInt(ak.bgColor[0])*65536+parseInt(ak.bgColor[1]*256)+parseInt(ak.bgColor[2]));
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ' '+bgC+' ');
                    treerow.appendChild(treecell);
                    
                    var lRatio = parseFloat(ak.luminosityRatio).toFixed(2);
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ' '+lRatio+(ak.hasBackgroundImage?'?':' ')+' ');
                    treerow.appendChild(treecell);
                                                            
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ' '+ak.text);
                    treerow.appendChild(treecell);
                                        
                    if(ak.failed) {
                      treerow.setAttribute('properties', 'failed');
                    } else if(ak.warning) {
                      treerow.setAttribute('properties', 'warning');
                    }

                    treeitem.appendChild(treerow);
                    tbc.appendChild(treeitem);
                }
            }
            blr.W15yQC.autoAdjustColumnWidths(document.getElementById('treebox'));
            if(aLumCheckList.length==1) {
                blr.W15yQC.LuminosityCheckDialog.updateNotesField([aDocumentsList,aLumCheckList], false);
            }
        } else {
            var textbox = document.getElementById('note-text');
            textbox.value = "No Image elements were detected.";
        }
    },
        
    init: function(dialog) {
        blr.W15yQC.fnReadUserPrefs();
        blr.W15yQC.LuminosityCheckDialog.FirebugO=dialog.arguments[1];
        blr.W15yQC.LuminosityCheckDialog.aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.LuminosityCheckDialog.aDocumentsList); //http://stackoverflow.com/questions/1030747/how-to-set-a-xulrunner-main-windows-minimum-size
        blr.W15yQC.LuminosityCheckDialog.aLumCheckList = blr.W15yQC.fnGetLuminosityCheckElements(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeLuminosityCheckElements(blr.W15yQC.LuminosityCheckDialog.aLumCheckList, blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
        blr.W15yQC.LuminosityCheckDialog.fnPopulateTree(blr.W15yQC.LuminosityCheckDialog.aDocumentsList, blr.W15yQC.LuminosityCheckDialog.aLumCheckList);
        if(blr.W15yQC.LuminosityCheckDialog.FirebugO == null || !blr.W15yQC.LuminosityCheckDialog.FirebugO.Inspector ) { document.getElementById('button-showInFirebug').hidden=true; }
    },
    
    forceMinSize: function(dialog) {
        if(dialog.outerWidth>100 && dialog.outerHeight>100 && (dialog.outerWidth<800 || dialog.outerHeight<470)) dialog.resizeTo(Math.max(800,dialog.outerWidth),Math.max(470,dialog.outerHeight));
    },
    
    cleanup: function() {
        if(blr.W15yQC.LuminosityCheckDialog.aDocumentsList != null) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
            blr.W15yQC.LuminosityCheckDialog.aDocumentsList=null;
            blr.W15yQC.LuminosityCheckDialog.aLumCheckList=null;
        }
    },
    
    updateNotesField: function(bHighlightElement) {
        var treebox = document.getElementById('treebox');
        var textbox = document.getElementById('note-text');
        if(bHighlightElement === null) bHighlightElement = true;
        
        var selectedRow = treebox.currentIndex;
        if(selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
            bHighlightElement = false;
        }
        var ak=blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedRow];
        if(ak.notes != null) {
            textbox.value = blr.W15yQC.fnMakeTextNotesList(ak);
        } else {
            textbox.value = '';
        }

        var textSize = parseFloat(ak.textSize);
        var textWeight = parseInt(ak.textWeight);
        var lRatio = parseFloat(ak.luminosityRatio);

        var AALimit;
        var AAALimit;
        var sTextDescription;
        if(textSize>=18) {
            AALimit = 3.0;
            AAALimit = 4.5;
            sTextDescription = '18pt or larger';
        } else if(textSize >= 14 && textWeight>=700) {
            AALimit = 3.0;
            AAALimit = 4.5;
            sTextDescription = 'bold and 14pt or larger';
        } else if(textWeight<700) {
            AALimit = 4.5;
            AAALimit = 7.0;
            sTextDescription = 'not bold and is smaller than 18pt';
        } else {
            AALimit = 4.5;
            AAALimit = 7.0;
            sTextDescription = 'bold and smaller than 14pt';
        }
        var sMeetsLimitText;
        if(lRatio-AAALimit>4) {
            sMeetsLimitText='handily meets AAA compliance.';
        } else if(lRatio-AAALimit>.2) {
            sMeetsLimitText='meets AAA compliance.';
        } else if(lRatio>=AAALimit) {
            sMeetsLimitText='just meets AAA compliance.';
        } else if(AAALimit-lRatio<.2) {
            sMeetsLimitText='meets AA compliance while just missing AAA compliance.';
        } else if(lRatio<AALimit) {
            sMeetsLimitText='fails to meet AA compliance.';
        } else if(lRatio-AALimit>.2) {
            sMeetsLimitText='meets AA compliance.';
        } else {
            sMeetsLimitText='just meets AA compliance.';
        }
        
        var sLimitMsg;
        var sSpec=Application.prefs.getValue('extensions.W15yQC.testContrast.MinSpec','WCAG2 AA');
        if(sSpec=='WCAG2 AA') {
            if(lRatio<AALimit) {
                sLimitMsg='Failed to meet';
            } else {
                sLimitMsg='Meets'
            }
        } else {
            if(lRatio<AAALimit) {
                sLimitMsg='Failed to meet';
            } else {
                sLimitMsg='Meets'
            }
        }
        
        sLimitMsg += ' '+sSpec+': For text that is '+sTextDescription+', the minimum required contrast ratio to meet WCAG 2.0 AA compliance is: '+AALimit+
        ":1, and to meet AAA compliance is: "+AAALimit+':1. The contrast ratio of '+lRatio+':1 '+sMeetsLimitText;
        
        if(ak.hasBackgroundImage==true) {
            textbox.value = blr.W15yQC.fnJoin(textbox.value, "NOTICE: Element appears to be over a background image. Contrast results may be invalid. Verify styling against sample on the right.", "\n\n");
        }
        
        textbox.value = blr.W15yQC.fnJoin(textbox.value, sLimitMsg+"\n\n"+ak.nodeDescription, "\n\n");
        
        if(ak.node != null) {
            var box = ak.node.getBoundingClientRect();
            if(box != null) {
                textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:'+Math.floor(box.top)+', Left:'+Math.floor(box.left)+', Width:'+Math.floor(box.width)+', Height:'+Math.floor(box.height), "\n");                
            }
        }
        
        textbox.value = blr.W15yQC.fnJoin(textbox.value, ak.xpath, "\n");

        var if1 = document.getElementById("iframeCSample");
        var fgC = blr.W15yQC.fnGetColorString(parseInt(ak.fgColor[0])*65536+parseInt(ak.fgColor[1]*256)+parseInt(ak.fgColor[2]));
        var bgC = blr.W15yQC.fnGetColorString(parseInt(ak.bgColor[0])*65536+parseInt(ak.bgColor[1]*256)+parseInt(ak.bgColor[2]));
        if1.contentDocument.body.style.color=fgC;
        if1.contentDocument.body.style.backgroundColor=bgC;
        if1.contentDocument.body.style.fontFamily=window.getComputedStyle(ak.node, null).getPropertyValue("font-family");
        if1.contentDocument.body.style.fontSize=(textSize*.80).toString()+'pt';
        if1.contentDocument.body.style.margin='0';
        if1.contentDocument.body.style.padding='4px';
        if1.contentDocument.body.innerHTML='Example text at '+textSize+' points. <i>Example text in italic.</i> <b>Example text in bold.</b>';

        blr.W15yQC.fnResetHighlights(blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
        var highlightElementsCB = document.getElementById('chkbox-highlighton');
        if(highlightElementsCB.checked && bHighlightElement != false) blr.W15yQC.highlightElement(ak.node, ak.doc);
    },
    
    toggleHighlighting: function() {
        var highlightElementsCB = document.getElementById('chkbox-highlighton');
        if(highlightElementsCB.checked) {
            var treebox = document.getElementById('treebox');
            var selectedRow = treebox.currentIndex;
            if(selectedRow != null && treebox.currentIndex >= 0) {
                blr.W15yQC.highlightElement(blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedRow].node, blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedRow].doc);
            }        
        } else {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
        }
    },
    
    moveToSelectedElement: function() {
        var treebox = document.getElementById('treebox');
        var selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnMoveToElement(blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedRow].node);
        }        
    },
    
    moveFocusToSelectedElement: function() {
        var treebox = document.getElementById('treebox');
        var selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
            blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedRow].node);
        }        
    },
    
    openColorsInContrastTool: function() {
        var treebox = document.getElementById('treebox');
        var selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            var ak=blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedRow];
            var fgC = blr.W15yQC.fnGetColorString(parseInt(ak.fgColor[0])*65536+parseInt(ak.fgColor[1]*256)+parseInt(ak.fgColor[2]));
            var bgC = blr.W15yQC.fnGetColorString(parseInt(ak.bgColor[0])*65536+parseInt(ak.bgColor[1]*256)+parseInt(ak.bgColor[2]));
            var newWin=window.openDialog('chrome://W15yQC/content/contrastDialog.xul', 'contrastToolDialog', 'chrome,resizable=yes,centerscreen', blr, fgC, bgC);
        }        
    },
    
    showInFirebug: function() {
        if(blr.W15yQC.LuminosityCheckDialog.FirebugO!=null) {
            try{
                if(blr.W15yQC.LuminosityCheckDialog.aLumCheckList != null && blr.W15yQC.LuminosityCheckDialog.aLumCheckList.length && blr.W15yQC.LuminosityCheckDialog.aLumCheckList.length>0) {
                    var treebox = document.getElementById('treebox');
                    var selectedRow = treebox.currentIndex;
                    if(selectedRow == null || treebox.currentIndex < 0) { selectedRow = 0; }
                    blr.W15yQC.fnResetHighlights(blr.W15yQC.LuminosityCheckDialog.aDocumentsList);
                    blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedRow].node.ownerDocument.defaultView.focus();
                    void function(arg){blr.W15yQC.LuminosityCheckDialog.FirebugO.GlobalUI.startFirebug(function(){blr.W15yQC.LuminosityCheckDialog.FirebugO.Inspector.inspectFromContextMenu(arg);})}(blr.W15yQC.LuminosityCheckDialog.aLumCheckList[selectedRow].node);
                }
            } catch(ex) {}
        }
    },
    
    generateReportHTML: function() {
        var reportDoc = blr.W15yQC.fnInitDisplayWindow(window.opener.parent._content.document);
        //blr.W15yQC.fnDisplayImagesResults(reportDoc, blr.W15yQC.LuminosityCheckDialog.aLumCheckList);
        blr.W15yQC.fnDisplayFooter(reportDoc);        
    }
    
}