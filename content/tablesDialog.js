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

 * File:        tablesDialog.js
 * Description: Handles displaying the Tables quick check dialog
 * Author:	Brian Richwine
 * Created:	2012.04.08
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2012.04.08 - Created! 
 *
 * TODO:
 *      
 *    - Internationalize?
 *    
 * 
 */
if (!blr) { var blr = {}; }

/*
 * Object:  QuickW15yTablesDialog
 * Returns:
 */
blr.W15yQC.TablesDialog = {
    oFirebug: null,
    aDocumentsList: null,
    aTablesList: null,
    fnPopulateTree: function(aDocumentsList, aTablesList) {
        if(aDocumentsList != null && aTablesList != null && aTablesList.length && aTablesList.length > 0) {
            var tbc = document.getElementById('treeboxChildren');
            var bHasCaption = false;
            var bHasSummary = false;
            var bHasParentTable = false;
            if(tbc != null) {
                for(var i=0; i<aTablesList.length; i++) {
                    var ak = aTablesList[i];
                    if(ak.caption != null && ak.caption.length>0) bHasCaption = true;
                    if(ak.summary != null && ak.summary.length>0) bHasSummary = true;
                    if(ak.parentTable != null && ak.parentTable>0) bHasSummary = true;
                }
                if(!bHasCaption) {
                    var ch = document.getElementById('col-header-caption');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasSummary) {
                    var ch = document.getElementById('col-header-summary');
                    ch.setAttribute('hidden','true');
                }
                if(!bHasParentTable) {
                    var ch = document.getElementById('col-header-parentTable');
                    ch.setAttribute('hidden','true');
                }
                if(aDocumentsList.length<=1) {
                    var ch = document.getElementById('col-header-documentNumber');
                    ch.setAttribute('hidden','true');
                }
                for(var i=0; i<aTablesList.length; i++) {
                    var treeitem = document.createElement('treeitem');
                    var treerow = document.createElement('treerow');
                    
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label',i+1);
                    treerow.appendChild(treecell);
                    
                    var ak = aTablesList[i];
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.ownerDocumentNumber);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.parentTable);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.nestingLevel);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.nodeDescription);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.summary);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.caption);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.maxCols);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.maxRows);
                    treerow.appendChild(treecell);
                                        
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.title);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.role);
                    treerow.appendChild(treecell);
                    
                    treecell = document.createElement('treecell');
                    treecell.setAttribute('label', ak.stateDescription);
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
            if(aTablesList.length==1) {
                blr.W15yQC.TablesDialog.updateNotesField([aDocumentsList,aTablesList], false);
            }
        } else {
            var textbox = document.getElementById('note-text');
            textbox.value = "No Table elements were detected.";
        }
    },
        
    init: function(dialog) {
        blr.W15yQC.fnReadUserPrefs();
        if(dialog!= null && dialog.arguments != null && dialog.arguments.length>1) { blr.W15yQC.TablesDialog.FirebugO=dialog.arguments[1]; }
        blr.W15yQC.TablesDialog.aDocumentsList = blr.W15yQC.fnGetDocuments(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeDocuments(blr.W15yQC.TablesDialog.aDocumentsList);
        
        blr.W15yQC.TablesDialog.aTablesList = blr.W15yQC.fnGetTables(window.opener.parent._content.document);
        blr.W15yQC.fnAnalyzeTables(blr.W15yQC.TablesDialog.aTablesList, blr.W15yQC.TablesDialog.aDocumentsList);
        blr.W15yQC.TablesDialog.fnPopulateTree(blr.W15yQC.TablesDialog.aDocumentsList, blr.W15yQC.TablesDialog.aTablesList);
        if(blr.W15yQC.TablesDialog.FirebugO == null || !blr.W15yQC.TablesDialog.FirebugO.Inspector ) { document.getElementById('button-showInFirebug').hidden=true; }
    },
    
    cleanup: function() {
        if(blr.W15yQC.TablesDialog.aDocumentsList != null) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
            blr.W15yQC.TablesDialog.aDocumentsList=null;
            blr.W15yQC.TablesDialog.aTablesList=null;
        }
    },
    
    updateNotesField: function(bHighlightElement) {
        var treebox = document.getElementById('treebox');
        var textbox = document.getElementById('note-text');
        if(bHighlightElement === null) bHighlightElement = true;
        
        var selectedRow = treebox.currentIndex;
        blr.W15yQC.fnLog('selectedRow after init:'+selectedRow);
        if(selectedRow == null || treebox.currentIndex < 0) {
            selectedRow = 0;
            bHighlightElement = false;
        }
        
        
        if(blr.W15yQC.TablesDialog.aTablesList[selectedRow].notes != null) {
            textbox.value = blr.W15yQC.fnMakeTextNotesList(blr.W15yQC.TablesDialog.aTablesList[selectedRow]);
        } else {
            textbox.value = '';
        }
        
        
        if(blr.W15yQC.TablesDialog.aTablesList[selectedRow].summary != null) {
            textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Summary: '+blr.W15yQC.TablesDialog.aTablesList[selectedRow].summary, "\n\n");
        }
        
        if(blr.W15yQC.TablesDialog.aTablesList[selectedRow].caption != null) {
            textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Caption: '+blr.W15yQC.TablesDialog.aTablesList[selectedRow].caption, "\n\n");
        }

        textbox.value = blr.W15yQC.fnJoin(textbox.value, blr.W15yQC.TablesDialog.aTablesList[selectedRow].nodeDescription, "\n\n");
        
        if(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node != null) {
            var box = blr.W15yQC.TablesDialog.aTablesList[selectedRow].node.getBoundingClientRect();
            if(box != null) {
                textbox.value = blr.W15yQC.fnJoin(textbox.value, 'Top:'+Math.floor(box.top)+', Left:'+Math.floor(box.left)+', Width:'+Math.floor(box.width)+', Height:'+Math.floor(box.height), "\n\n");                
            }
        }
        textbox.value = blr.W15yQC.fnJoin(textbox.value, 'xPath: '+blr.W15yQC.TablesDialog.aTablesList[selectedRow].xpath, "\n");

        blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
        if(bHighlightElement != false) blr.W15yQC.highlightElement(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node, blr.W15yQC.TablesDialog.aTablesList[selectedRow].doc);
    },
    
    highlightTables: function() {
        var err, styleElement = null, setHighlights=false;
        //try {
            if(blr.W15yQC.TablesDialog.aDocumentsList != null && blr.W15yQC.TablesDialog.aDocumentsList.length>0) {
                styleElement = blr.W15yQC.TablesDialog.aDocumentsList[0].doc.getElementById('W15yQCTableHighlightStyle');
                if (styleElement)
                {
                    blr.W15yQC.TablesDialog.removeTableHighlights();
                    setHighlights = false;
                    // TODO: Set text on table highlight button
                } else {
                    blr.W15yQC.TablesDialog.extendedHighlightTables();
                    setHighlights = true;
                    // TODO: Set text on table highlight button
                }
            }
        //} catch (err) { }
        return setHighlights; // return status of highlights
    },
    
    basicHighlightTables: function() {
        var doc, styleElement, i;
        if(blr.W15yQC.TablesDialog.aDocumentsList != null && blr.W15yQC.TablesDialog.aDocumentsList.length>0) {
            for(i=0; i<blr.W15yQC.TablesDialog.aDocumentsList.length; i++) {
                doc = blr.W15yQC.TablesDialog.aDocumentsList[i].doc;
                if(doc != null) {
                    var styleElement = doc.createElement('style');
                    styleElement.innerHTML = 'table {border: 1px solid red !important; } table th {border: 2px solid blue !important; } table td {border: 1px dotted  blue !important;} table caption {border: 1px dotted  red !important; } table th[scope=col],table th[scope=colgroup] {border-bottom: 4px solid green !important} table th[scope=row],table th[scope=rowgroup] {border-right: 4px solid green !important}';
                    styleElement.setAttribute('id', 'W15yQCTableHighlightStyle');
                    doc.head.insertBefore(styleElement,doc.head.firstChild);
                }
            }
        }
    },

    extendedHighlightTables: function() {
        var doc, styleElement, i, tables, tableIndex;
        blr.W15yQC.fnLog('extendedHighlightTables starts');
        if(blr.W15yQC.TablesDialog.aDocumentsList != null && blr.W15yQC.TablesDialog.aDocumentsList.length>0) {
            for(i=0; i<blr.W15yQC.TablesDialog.aDocumentsList.length; i++) {
                doc = blr.W15yQC.TablesDialog.aDocumentsList[i].doc;
                if(doc != null) {
                    var styleElement = doc.createElement('style');
                    styleElement.innerHTML = 'div.w15yqcTHSummary, div.w15yqcTHInsert{border: 2px solid green; background-color:#AAFFAA;margin:3px 0px 3px 0px;padding:3px}div.w15yqcTHSummary span{font-weight:bold}div.w15yqcTHInsert ul{margin:0;padding-left:18px} table.w15yqcIsDataTable {border: 2px solid red !important; } table {border: 2px dotted red !important; } table th {border: 2px solid blue !important; } table td {border: 1px dotted  blue !important;} table caption {border: 1px dotted  red !important; } table th[scope=col],table th[scope=colgroup] {border-bottom: 4px solid green !important} table th[scope=row],table th[scope=rowgroup] {border-right: 4px solid green !important}';
                    styleElement.setAttribute('id', 'W15yQCTableHighlightStyle');
                    doc.head.insertBefore(styleElement,doc.head.firstChild);
                    tables = doc.getElementsByTagName('table');
                    if(tables != null) {
                        for(tableIndex=0; tableIndex<tables.length; tableIndex++) {
                            blr.W15yQC.fnLog('extendedHighlightTables found ' + tables.length.toString()+' tables.');
                            blr.W15yQC.TablesDialog.addExtendedTableHighlights(doc, tables[tableIndex]);
                            blr.W15yQC.fnLog('extendedHighlightTables found ' + tables.length.toString()+' tables 2.');
                        }
                    }
                    
                }
            }
        }
    },
    
    addExtendedTableHighlights: function (doc, table) {
        var i,insert, sMsg, scope, summary, maxCols=0, maxRows=0, nodeStack=[], node, tagName, isDataTable=false, insertParents=[], insertEls=[], sAxis, aAxisList, ul, li, sAbbr,
        headers, headerText='', header, rowCount, colCount, span, firstRowFound=false, pastFirstRow=false, firstCol=true, nextSibling, nextRowCellIsAHeading=false,hasMoreRows=false;
        blr.W15yQC.fnLog('fnIsDataTable starting');
        if(table != null && !table.className.match(new RegExp('(\\s|^)w15yqcIsDataTable(\\s|$)'))) {
            if(blr.W15yQC.fnStringHasContent(table.getAttribute('summary'))) {
                blr.W15yQC.fnLog('fnIsData: has summary');
                isDataTable = true;
                insert = doc.createElement('div');
                insert.className = 'w15yqcTHInsert w15yqcTHSummary';
                span=doc.createElement('span');
                span.appendChild(doc.createTextNode('Summary: '));
                insert.appendChild(span);
                insert.appendChild(doc.createTextNode(table.getAttribute('summary')));
                table.parentNode.insertBefore(insert, table);
            }
            node = table.firstChild;
            while(node != null || nodeStack.length>0) {
                blr.W15yQC.fnLog('nodeStack.length:'+nodeStack.length.toString());
                if(node==null) {
                    node=nodeStack.pop().nextSibling;
                }
                if(node != null) {
                    if (node.nodeType == 1) { // Only pay attention to element nodes
                        blr.W15yQC.fnLog('node.tagName:'+node.tagName);
                        tagName = node.tagName.toLowerCase();
                        if(tagName=='caption' || tagName=='col' || tagName=='colgroup') {
                            isDataTable = true;
                        } else {
                            if(tagName=='td') {
                                foundFirstRow=true;
                                if(blr.W15yQC.fnStringHasContent(node.getAttribute('headers')) || blr.W15yQC.fnStringHasContent(node.getAttribute('axis')) ||
                                   blr.W15yQC.fnStringHasContent(node.getAttribute('abbr'))) {
                                    isDataTable = true;
                                    if(blr.W15yQC.fnStringHasContent(node.getAttribute('headers'))) {
                                        insert = doc.createElement('div');
                                        insert.className = 'w15yqcTHInsert';
                                        headers = node.getAttribute('headers').split(/\s/);
                                        headerText='';
                                        for (i=0; i< headers.length; i++) {
                                            header=doc.getElementById(headers[i].toString());
                                            if(header!=null) {
                                                if(blr.W15yQC.fnStringHasContent(header.getAttribute('abbr'))) {
                                                    headerText=headerText+' '+header.getAttribute('abbr');
                                                } else {
                                                    headerText=headerText+' '+blr.W15yQC.fnGetDisplayableTextRecursively(header);
                                                }
                                            }
                                        }
                                        insert.appendChild(doc.createTextNode('Headers: '+headerText));
                                        insertParents.push(node);
                                        insertEls.push(insert);
                                    }
                                }
                                firstCol=false;
                            } else if(tagName=='th') {
                                isDataTable=true;
                                foundFirstRow=true;
                                nextRowCellIsAHeading=false;
                                nextSibling=node.nextSibling;
                                while(nextRowCellIsAHeading==false && nextSibling!=null) {
                                    if(nextSibling.nodeType==1 && nextSibling.tagName.toLowerCase()=='th') {
                                        nextRowCellIsAHeading=true;
                                    } else if(nextSibling.nodeType!=1) {
                                        nextSibling=nextSibling.nextSibling;
                                    } else {
                                        nextSibling=null;
                                    }
                                }
                                insert = doc.createElement('div');
                                insert.className = 'w15yqcTHInsert';
                                sMsg='Header';
                                if(node.hasAttribute('scope')) {
                                    scope=node.getAttribute('scope').toLowerCase();
                                    if(scope=='row') {
                                        sMsg='Row '+sMsg;
                                    } else if(scope=='col') {
                                        sMsg='Column '+sMsg;
                                    }
                                    if(scope=='rowgroup') {
                                        sMsg='Row Group '+sMsg;
                                    } else if(scope=='colgroup') {
                                        sMsg='Column Group '+sMsg;
                                    }
                                } else if(firstCol && (hasMoreRows==false||nextRowCellIsAHeading==false)) {
                                    sMsg='Row '+sMsg;
                                } else if(foundFirstRow==true && pastFirstRow==false) {
                                    sMsg='Column '+sMsg;
                                }
                                insert.appendChild(doc.createTextNode(sMsg));
                                insertParents.push(node);
                                insertEls.push(insert);
                                firstCol=false;
                            }
                            if(tagName=='td'||tagName=='th') {
                                sAxis = node.getAttribute('axis');
                                if(blr.W15yQC.fnStringHasContent(sAxis)) {
                                    insert = doc.createElement('div');
                                    insert.className = 'w15yqcTHInsert';
                                    aAxisList = sAxis.split(',');
                                    if(aAxisList != null && aAxisList.length>1) {
                                        insert.appendChild(doc.createTextNode('Axis Values: '));
                                        ul = doc.createElement('ul');
                                        for(i=0;i<aAxisList.length;i++) {
                                            li=doc.createElement('li');
                                            li.appendChild(doc.createTextNode(aAxisList[i]));
                                            ul.appendChild(li);
                                        }
                                        insert.appendChild(ul);
                                    } else {
                                        insert.appendChild(doc.createTextNode('Axis: '+sAxis));
                                    }
                                    node.appendChild(insert);
                                }

                                sAbbr = node.getAttribute('abbr');
                                if(blr.W15yQC.fnStringHasContent(sAbbr)) {
                                    insert = doc.createElement('div');
                                    insert.className = 'w15yqcTHInsert';
                                    insert.appendChild(doc.createTextNode('Abbr: '+sAbbr));
                                    node.appendChild(insert);
                                }
                            }
                        }
                        if(node.firstChild != null && tagName=='tr' || tagName=='thead' || tagName=='tbody' || tagName=='tfoot') {
                            if(firstRowFound==true) {pastFirstRow==true;}
                            firstCol=true;
                            hasMoreRows=false;
                            nextSibling=node.nextSibling;
                            while(hasMoreRows==false && nextSibling!=null) {
                                if(nextSibling.nodeType==1 && nextSibling.getElementsByTagName('tr')!=null) {
                                    hasMoreRows=true;
                                } else {
                                    nextSibling=nextSibling.nextSibling;
                                }
                            }
                            nodeStack.push(node);
                            node=node.firstChild;
                        } else {
                            node=node.nextSibling;
                        }
                    } else {
                        node=node.nextSibling;
                    }
                }
            }
            for(i=0;i<insertParents.length;i++) {
                blr.W15yQC.fnLog('appendChildTo:'+insertParents[i].tagName);
                insertParents[i].appendChild(insertEls[i]);
            }
        }
        blr.W15yQC.fnLog('fnIsDataTable ending');
        if(isDataTable) {
            table.className += " w15yqcIsDataTable";
        } else {
            table.className += " w15yqcIsNotDataTable";
        }
        return isDataTable;
    },
    
    removeTableHighlights: function() {
        var doc, i, styleElement=null, infoElements=null, tables=null;
        if(blr.W15yQC.TablesDialog.aDocumentsList != null && blr.W15yQC.TablesDialog.aDocumentsList.length>0) {
            for(var i=0; i<blr.W15yQC.TablesDialog.aDocumentsList.length; i++) {
                doc = blr.W15yQC.TablesDialog.aDocumentsList[i].doc;
                if(doc != null) {
                    styleElement = doc.getElementById('W15yQCTableHighlightStyle');
                    if (styleElement) {
                      styleElement.parentNode.removeChild(styleElement);
                    }
                    infoElements = doc.getElementsByClassName('w15yqcTHInsert');
                    while(infoElements != null && infoElements.length>0) {
                        infoElements[0].parentNode.removeChild(infoElements[0]);
                    }
                    tables = doc.getElementsByClassName('w15yqcIsDataTable');
                    while(tables != null && tables.length>0) {
                        tables[0].className=tables[0].className.replace(/\s?w15yqcIsDataTable\b/,'');
                    }
                    tables = doc.getElementsByClassName('w15yqcIsNotDataTable');
                    while(tables != null && tables.length>0) {
                        tables[0].className=tables[0].className.replace(/\s?w15yqcIsNotDataTable\b/,'');
                    }
                }
            }
        }
    },

    moveToSelectedElement: function() {
        var treebox = document.getElementById('treebox'),
            selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
            blr.W15yQC.highlightElement(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node, blr.W15yQC.TablesDialog.aTablesList[selectedRow].doc);
            blr.W15yQC.fnMoveToElement(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node);
        }        
    },
    
    moveFocusToSelectedElement: function() {
        var treebox = document.getElementById('treebox'),
            selectedRow = treebox.currentIndex;
        if(selectedRow != null && treebox.currentIndex >= 0) {
            blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
            blr.W15yQC.fnMoveFocusToElement(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node);
        }        
    },
    
    showInFirebug: function() {
        if(blr.W15yQC.TablesDialog.FirebugO!=null) {
            try{
                if(blr.W15yQC.TablesDialog.aTablesList != null && blr.W15yQC.TablesDialog.aTablesList.length && blr.W15yQC.TablesDialog.aTablesList.length>0) {
                    var treebox = document.getElementById('treebox');
                    var selectedRow = treebox.currentIndex;
                    if(selectedRow == null || treebox.currentIndex < 0) {
                        selectedRow = 0;
                    }
                    //blr.W15yQC.TablesDialog.nodeToInspect = blr.W15yQC.TablesDialog.aTablesList[selectedRow].node;
                    //blr.W15yQC.TablesDialog.FirebugO.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(blr.W15yQC.TablesDialog.nodeToInspect);});
                    //oncommand=void function(arg){Firebug.GlobalUI.startFirebug(function(){Firebug.Inspector.inspectFromContextMenu(arg);})}(document.popupNode)
                    //blr.W15yQC.TablesDialog.FirebugO.
                    blr.W15yQC.fnResetHighlights(blr.W15yQC.TablesDialog.aDocumentsList);
                    blr.W15yQC.TablesDialog.aTablesList[selectedRow].node.ownerDocument.defaultView.focus();
                    void function(arg){blr.W15yQC.TablesDialog.FirebugO.GlobalUI.startFirebug(function(){blr.W15yQC.TablesDialog.FirebugO.Inspector.inspectFromContextMenu(arg);})}(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node);
                    //blr.W15yQC.showInFirebug(blr.W15yQC.TablesDialog.aTablesList[selectedRow].node,blr.W15yQC.TablesDialog.firebugO);
                }
            } catch(ex) {}
        }
    },
    
    generateReportHTML: function() {
        var reportDoc = blr.W15yQC.fnInitDisplayWindow(window.opener.parent._content.document);
        blr.W15yQC.fnDisplayTablesResults(reportDoc, blr.W15yQC.TablesDialog.aTablesList);
        blr.W15yQC.fnDisplayFooter(reportDoc);        
    }
    
}