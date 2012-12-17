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

 * File:        highlighters.js
 * Description: Handles displaying the Tables quick check dialog
 * Author:	Brian Richwine
 * Created:	2012.10.12
 * Modified:
 * Language:	JavaScript
 * Project:	W15y Quick Check
 *
 * Dev Notes:
 * 2012.10.12 - Created! 
 *
 * TODO:
 *      
 *    - Internationalize?
 *    
 * 
 */
if (!blr) { var blr = {}; }

    
blr.W15yQC.Highlighters = {

    highlightLists: function(aDocumentsList) {
        var err, styleElement = null, setHighlights=false;
        //try {
            if(aDocumentsList==null) {
              aDocumentsList = blr.W15yQC.fnGetDocuments(window.top.content.document);
            }
            if(aDocumentsList != null && aDocumentsList.length>0) {
                styleElement = aDocumentsList[0].doc.getElementById('W15yQCListsHighlightStyle');
                if (styleElement!=null)
                {
                    blr.W15yQC.Highlighters.removeListHighlights(aDocumentsList);
                    setHighlights = false;
                } else {
                    blr.W15yQC.Highlighters.extendedHighlightLists(aDocumentsList);
                    setHighlights = true;
                }
            }
        //} catch (err) { }
        return setHighlights; // return status of highlights
    },
    
    extendedHighlightLists: function(aDocumentsList) {
        var doc, styleElement, i, j, tables, tableIndex, insert, span1;
        if(aDocumentsList != null && aDocumentsList.length>0) {
            for(i=0; i<aDocumentsList.length; i++) {
                doc = aDocumentsList[i].doc;
                if(doc != null) {
                    var styleElement = doc.createElement('style');
                    styleElement.innerHTML = 'ul{border: 2px solid red !important;margin:3px !important}li{border: 2px dashed red !important;margin:3px !important; padding: 3px !important}';
                    styleElement.setAttribute('id', 'W15yQCListsHighlightStyle');
                    doc.head.insertBefore(styleElement,doc.head.firstChild);
                }
            }
        }
    },
    
    removeListHighlights: function(aDocumentsList) {
        var doc, i, styleElement=null, infoElements=null;
        if(aDocumentsList != null && aDocumentsList.length>0) {
            for(var i=0; i<aDocumentsList.length; i++) {
                doc = aDocumentsList[i].doc;
                if(doc != null) {
                    styleElement = doc.getElementById('W15yQCListsHighlightStyle');
                    if (styleElement) {
                      styleElement.parentNode.removeChild(styleElement);
                    }
                }
            }
        }
    },
    
    highlightHeadings: function(aDocumentsList, aHeadingsList) {
        var err, styleElement = null, setHighlights=false;
        //try {
            if(aDocumentsList==null) {
              aDocumentsList = blr.W15yQC.fnGetDocuments(window.top.content.document);
              if(aDocumentsList != null && aDocumentsList.length>0) {
                aHeadingsList = blr.W15yQC.fnGetHeadings(window.top.content.document);
              }
            }
            if(aDocumentsList != null && aDocumentsList.length>0) {
                styleElement = aDocumentsList[0].doc.getElementById('W15yQCHeadingsHighlightStyle');
                if (styleElement)
                {
                    blr.W15yQC.Highlighters.removeHeadingHighlights(aDocumentsList);
                    setHighlights = false;
                } else {
                    blr.W15yQC.Highlighters.extendedHighlightHeadings(aDocumentsList, aHeadingsList);
                    setHighlights = true;
                }
            }
        //} catch (err) { }
        return setHighlights; // return status of highlights
    },
    
    extendedHighlightHeadings: function(aDocumentsList, aHeadingsList) {
        var doc, styleElement, i, j, tables, tableIndex, insert, span1;
        if(aDocumentsList != null && aDocumentsList.length>0) {
            for(i=0; i<aDocumentsList.length; i++) {
                doc = aDocumentsList[i].doc;
                if(doc != null) {
                    var styleElement = doc.createElement('style');
                    styleElement.innerHTML = '.w15yqcHeadingInsert{float:left !important}.w15yqcH1{border: 2px solid red !important}.w15yqcH2{border: 2px solid red !important}.w15yqcH3{border: 2px solid red !important}.w15yqcH4{border: 2px solid red !important}.w15yqcH5{border: 2px solid red !important}.w15yqcH6{border: 2px solid red !important}span.w15yqcHxInsert{border: 2px solid green !important; font-weight:normal;color:black !important; background-color:#AAFFAA !important;margin:0 1px 0 1px !important;padding:2px 2px 2px 2px !important;position:relative !important; z-index:2140000000 !important;font-family:arial,sans-serif}.w15yqcH1 span.w15yqcHxInsert{font-size:18px;line-height:20px}.w15yqcH2 span.w15yqcHxInsert{font-size:17px;line-height:19px}.w15yqcH3 span.w15yqcHxInsert{font-size:16px;line-height:18px}.w15yqcH4 span.w15yqcHxInsert{font-size:15px;line-height:17px}.w15yqcH5 span.w15yqcHxInsert{font-size:14px;line-height:16px}.w15yqcH6 span.w15yqcHxInsert{font-size:13px;line-height:15px}';
                    styleElement.setAttribute('id', 'W15yQCHeadingsHighlightStyle');
                    doc.head.insertBefore(styleElement,doc.head.firstChild);
                }
            }
            for(j=0;j<aHeadingsList.length;j++) {
                aHeadingsList[j].node.className='w15yqcH'+aHeadingsList[j].level.toString()+' '+aHeadingsList[j].node.className;
                doc=aHeadingsList[j].doc;
                span1=doc.createElement('span');
                span1.setAttribute('style','position:static;clear:both');
                span1.className='w15yqcHeadingInsert';
                insert=doc.createElement('span');
                insert.className='w15yqcHxInsert';
                insert.setAttribute('title',aHeadingsList[j].text);
                insert.appendChild(doc.createTextNode('H'+aHeadingsList[j].level.toString()));
                span1.appendChild(insert);
                aHeadingsList[j].node.insertBefore(span1,aHeadingsList[j].node.firstChild);
            }
        }
    },
    
    removeHeadingHighlights: function(aDocumentsList) {
        var doc, i, styleElement=null, infoElements=null;
        if(aDocumentsList != null && aDocumentsList.length>0) {
            for(var i=0; i<aDocumentsList.length; i++) {
                doc = aDocumentsList[i].doc;
                if(doc != null) {
                    styleElement = doc.getElementById('W15yQCHeadingsHighlightStyle');
                    if (styleElement) {
                      styleElement.parentNode.removeChild(styleElement);
                    }
                    infoElements = doc.getElementsByClassName('w15yqcHeadingInsert');
                    while(infoElements != null && infoElements.length>0) {
                        infoElements[0].parentNode.removeChild(infoElements[0]);
                    }
                }
            }
        }
    },

    highlightARIALandmarks: function(aDocumentsList, aARIALandmarksList) {
        var err, styleElement = null, setHighlights=false;
        //try {
            if(aDocumentsList==null) {
              aDocumentsList = blr.W15yQC.fnGetDocuments(window.top.content.document);
              if(aDocumentsList != null && aDocumentsList.length>0) {
                aARIALandmarksList = blr.W15yQC.fnGetARIALandmarks(window.top.content.document);
              }
            }
            if(aDocumentsList != null && aDocumentsList.length>0) {
                styleElement = aDocumentsList[0].doc.getElementById('W15yQCARIALandmarksHighlightStyle');
                if (styleElement)
                {
                    blr.W15yQC.Highlighters.removeARIALandmarkHighlights(aDocumentsList);
                    setHighlights = false;
                } else {
                    blr.W15yQC.Highlighters.extendedHighlightARIALandmarks(aDocumentsList, aARIALandmarksList);
                    setHighlights = true;
                }
            }
        //} catch (err) { }
        return setHighlights; // return status of highlights
    },
    
    extendedHighlightARIALandmarks: function(aDocumentsList, aARIALandmarksList) {
        var doc, styleElement, i, j, tables, tableIndex, insert, span1, sInsertText;
        if(aDocumentsList != null && aDocumentsList.length>0) {
            for(i=0; i<aDocumentsList.length; i++) {
                doc = aDocumentsList[i].doc;
                if(doc != null) {
                    var styleElement = doc.createElement('style');
                    styleElement.innerHTML = '.w15yqcARIALandmarkInsert{float:left !important}.w15yqcARIALandmark{border:2px solid red !important}.w15yqcALInsert{float:left !important; border: 2px solid green !important; font-weight:normal;color:black !important; background-color:#AAFFAA !important;margin:0 1px 0 1px !important;padding:2px 2px 2px 2px !important;position:relative !important; z-index:2140000000 !important;font-family:arial,sans-serif}';
                    styleElement.setAttribute('id', 'W15yQCARIALandmarksHighlightStyle');
                    doc.head.insertBefore(styleElement,doc.head.firstChild);
                }
            }
            for(j=0;j<aARIALandmarksList.length;j++) {
                aARIALandmarksList[j].node.className='w15yqcARIALandmark'+' '+aARIALandmarksList[j].node.className;
                doc=aARIALandmarksList[j].doc;
                span1=doc.createElement('span');
                span1.setAttribute('style','position:static;clear:both');
                span1.className='w15yqcARIALandmarkInsert';
                insert=doc.createElement('span');
                insert.className='w15yqcALInsert';
                //insert.setAttribute('title',aARIALandmarksList[j].text);
                sInsertText = aARIALandmarksList[j].role.toString();
                if(blr.W15yQC.fnStringHasContent(aARIALandmarksList[j].label)) {
                    sInsertText = sInsertText + ': '+aARIALandmarksList[j].label;
                }
                insert.appendChild(doc.createTextNode(sInsertText));
                span1.appendChild(insert);
                aARIALandmarksList[j].node.insertBefore(span1,aARIALandmarksList[j].node.firstChild);
            }
        }
    },
    
    removeARIALandmarkHighlights: function(aDocumentsList) {
        var doc, i, styleElement=null, infoElements=null;
        if(aDocumentsList != null && aDocumentsList.length>0) {
            for(var i=0; i<aDocumentsList.length; i++) {
                doc = aDocumentsList[i].doc;
                if(doc != null) {
                    styleElement = doc.getElementById('W15yQCARIALandmarksHighlightStyle');
                    if (styleElement) {
                      styleElement.parentNode.removeChild(styleElement);
                    }
                    infoElements = doc.getElementsByClassName('w15yqcARIALandmarkInsert');
                    while(infoElements != null && infoElements.length>0) {
                        infoElements[0].parentNode.removeChild(infoElements[0]);
                    }
                }
            }
        }
    },

    highlightTables: function(aDocumentsList) {
        var err, styleElement = null, setHighlights=false;
        //try {
            if(aDocumentsList==null) {
              aDocumentsList = blr.W15yQC.fnGetDocuments(window.top.content.document);
            }
            if(aDocumentsList != null && aDocumentsList.length>0) {
                styleElement = aDocumentsList[0].doc.getElementById('W15yQCTableHighlightStyle');
                if (styleElement)
                {
                    blr.W15yQC.Highlighters.removeTableHighlights(aDocumentsList);
                    setHighlights = false;
                } else {
                    blr.W15yQC.Highlighters.extendedHighlightTables(aDocumentsList);
                    setHighlights = true;
                }
            }
        //} catch (err) { }
        return setHighlights; // return status of highlights
    },
    
    basicHighlightTables: function(aDocumentsList) {
        var doc, styleElement, i;
        if(aDocumentsList != null && aDocumentsList.length>0) {
            for(i=0; i<aDocumentsList.length; i++) {
                doc = aDocumentsList[i].doc;
                if(doc != null) {
                    var styleElement = doc.createElement('style');
                    styleElement.innerHTML = 'table {border: 1px solid red !important; } table th {border: 2px solid blue !important; } table td {border: 1px dotted  blue !important;} table caption {border: 1px dotted  red !important; } table th[scope=col],table th[scope=colgroup] {border-bottom: 4px solid green !important} table th[scope=row],table th[scope=rowgroup] {border-right: 4px solid green !important}';
                    styleElement.setAttribute('id', 'W15yQCTableHighlightStyle');
                    doc.head.insertBefore(styleElement,doc.head.firstChild);
                }
            }
        }
    },

    extendedHighlightTables: function(aDocumentsList) {
        var doc, styleElement, i, tables, tableIndex;
        if(aDocumentsList != null && aDocumentsList.length>0) {
            for(i=0; i<aDocumentsList.length; i++) {
                doc = aDocumentsList[i].doc;
                if(doc != null) {
                    var styleElement = doc.createElement('style');
                    styleElement.innerHTML = 'div.w15yqcTHSummary, div.w15yqcTHInsert{color:black !important;border: 2px solid green !important; background-color:#AAFFAA !important;margin:3px 0px 3px 0px !important;padding:3px !important}div.w15yqcTHSummary span{font-weight:bold !important}div.w15yqcTHInsert ul{margin:0 !important;padding-left:18px !important} table.w15yqcIsDataTable {border: 2px solid red !important; } table {border: 2px dotted red !important; } table th {border: 2px solid blue !important; } table td {border: 1px dotted  blue !important;} table caption {border: 1px dotted  red !important; } table th[scope=col],table th[scope=colgroup] {border-bottom: 4px solid green !important} table th[scope=row],table th[scope=rowgroup] {border-right: 4px solid green !important}';
                    styleElement.setAttribute('id', 'W15yQCTableHighlightStyle');
                    doc.head.insertBefore(styleElement,doc.head.firstChild);
                    tables = doc.getElementsByTagName('table');
                    if(tables != null) {
                        for(tableIndex=0; tableIndex<tables.length; tableIndex++) {
                            blr.W15yQC.Highlighters.addExtendedTableHighlights(doc, tables[tableIndex]);
                        }
                    }
                    
                }
            }
        }
    },
    
    addExtendedTableHighlights: function (doc, table) {
        var i,insert, sMsg, scope, summary, maxCols=0, maxRows=0, nodeStack=[], node, tagName, isDataTable=false, insertParents=[], insertEls=[], sAxis, aAxisList, ul, li, sAbbr,
        headers, headerText='', header, rowCount, colCount, span, firstRowFound=false, pastFirstRow=false, firstCol=true, nextSibling, nextRowCellIsAHeading=false,hasMoreRows=false;
        if(table != null && !table.className.match(new RegExp('(\\s|^)w15yqcIsDataTable(\\s|$)'))) {
            if(blr.W15yQC.fnStringHasContent(table.getAttribute('summary'))) {
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
                if(node==null) {
                    node=nodeStack.pop().nextSibling;
                }
                if(node != null) {
                    if (node.nodeType == 1) { // Only pay attention to element nodes
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
                insertParents[i].appendChild(insertEls[i]);
            }
        }
        if(isDataTable) {
            table.className = 'w15yqcIsDataTable '+table.className;
        } else {
            table.className = 'w15yqcIsNotDataTable '+table.className;
        }
        return isDataTable;
    },
    
    removeTableHighlights: function(aDocumentsList) {
        var doc, i, styleElement=null, infoElements=null, tables=null;
        if(aDocumentsList != null && aDocumentsList.length>0) {
            for(var i=0; i<aDocumentsList.length; i++) {
                doc = aDocumentsList[i].doc;
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
                        tables[0].className=tables[0].className.replace(/\bw15yqcIsDataTable\b\s?/,'');
                    }
                    tables = doc.getElementsByClassName('w15yqcIsNotDataTable');
                    while(tables != null && tables.length>0) {
                        tables[0].className=tables[0].className.replace(/\bw15yqcIsNotDataTable\b\s?/,'');
                    }
                }
            }
        }
    },


    
}