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
if (!blr) var blr = {};
if (!blr.a11yTools) blr.a11yTools = {};

/*
 * Object:  LuminosityCheckDialog
 * Returns:
 */
blr.W15yQC.LuminosityCheckDialog = {
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
                    treecell.setAttribute('label', ' '+lRatio+' ');
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
        var aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(aDocumentsList);
        
        var aLumCheckList = blr.W15yQC.fnGetLuminosityCheckElements(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeLuminosityCheckElements(aLumCheckList, aDocumentsList);
        blr.W15yQC.LuminosityCheckDialog.fnPopulateTree(aDocumentsList, aLumCheckList);
        
        return [aDocumentsList, aLumCheckList];
    },
    
    cleanup: function(aResults) {
        if(aResults != null) {
            for(var i=0;i<aResults[0].length;i++) blr.W15yQC.resetHighlightElement(aResults[0][i].doc);
            aResults[0]=null;
            aResults[1]=null;
        }
    },
    
    updateNotesField: function(aResults, bHighlightElement) {
        var treebox = document.getElementById('treebox');
        var textbox = document.getElementById('note-text');
        if(bHighlightElement === null) bHighlightElement = true;
        
        var selectedRow = treebox.currentIndex;
        if(selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
            bHighlightElement = false;
        }
        var ak=aResults[1][selectedRow];
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
        var sLimitMsg = 'For text that is '+sTextDescription+', the minimum required contrast ratio to meet WCAG 2.0 AA compliance is: '+AALimit+
        ":1,\n and to meet AAA compliance is: "+AAALimit+':1. The contrast ratio of '+lRatio+':1 '+sMeetsLimitText;
        
        if(ak.hasBackgroundImage==true) {
            textbox.value = blr.W15yQC.fnJoin(textbox.value, "WARNING: Appears to have a background image. Results may be invalid.", "\n\n");
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
        if1.contentDocument.body.style.margin='0';
        if1.contentDocument.body.style.padding='0';
        if1.contentDocument.body.innerHTML='<p style="margin:0;padding:4px;font-size:'+textSize.toString()+'pt">Example text at '+textSize+' points. <i>Example text in italic.</i> <b>Example text in bold.</b></p>';

        for(var i=0;i<aResults[0].length;i++) blr.W15yQC.resetHighlightElement(aResults[0][i].doc);
        var highlightElementsCB = document.getElementById('chkbox-highlighton');
        if(highlightElementsCB.checked && bHighlightElement != false) blr.W15yQC.highlightElement(ak.node, ak.doc);
    },
    
    toggleHighlighting: function(aResults) {
        var highlightElementsCB = document.getElementById('chkbox-highlighton');
        if(highlightElementsCB.checked) {
            var treebox = document.getElementById('treebox');
            var selectedRow = treebox.currentIndex;
            if(selectedRow != null && treebox.currentIndex >= 0) {
                blr.W15yQC.highlightElement(aResults[1][selectedRow].node, aResults[1][selectedRow].doc);
            }        
        } else {
            for(var i=0;i<aResults[0].length;i++) blr.W15yQC.resetHighlightElement(aResults[0][i].doc);
        }
    },
    
    moveToSelectedElement: function() {
        var treebox = document.getElementById('treebox');
        var selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnMoveToElement(aResults[1][selectedRow].node);
        }        
    },
    
    moveFocusToSelectedElement: function() {
        var treebox = document.getElementById('treebox');
        var selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnMoveFocusToElement(aResults[1][selectedRow].node);
        }        
    },
    
    openColorsInContrastTool: function() {
        var treebox = document.getElementById('treebox');
        var selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            var ak=aResults[1][selectedRow];
            var fgC = blr.W15yQC.fnGetColorString(parseInt(ak.fgColor[0])*65536+parseInt(ak.fgColor[1]*256)+parseInt(ak.fgColor[2]));
            var bgC = blr.W15yQC.fnGetColorString(parseInt(ak.bgColor[0])*65536+parseInt(ak.bgColor[1]*256)+parseInt(ak.bgColor[2]));
            var newWin=window.openDialog('chrome://W15yQC/content/contrastDialog.xul', 'contrastToolDialog', 'chrome,resizable=yes,centerscreen', fgC,bgC);
        }        
    },
    
    generateReportHTML: function(aResults) {
        var reportDoc = blr.W15yQC.fnInitDisplayWindow(window.opener.parent._content.document);
        //blr.W15yQC.fnDisplayImagesResults(reportDoc, aResults[1]);
        blr.W15yQC.fnDisplayFooter(reportDoc);        
    }
    
}