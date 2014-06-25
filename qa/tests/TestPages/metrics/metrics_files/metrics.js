"use strict";

var sNewState='uninitialized';
var currentState='';


var staffList=null;

var clients=null;

var sUserIDN=null;
var sUserFullName=null;

var bNoEntriesDeclared=false;
var staffMetrics=[];
var staffMember=null;
var dEntriesDate=null;

function metricsPageInit() {
	dEntriesDate=new Date();
  resetForm();
	$.when(
    $.get('get_staff_metrics.pl', function(jsStaffMetrics) { processStaffMetricsJSON(jsStaffMetrics); }, 'json'),
    $.get('get_metrics_staff.pl', function(jsStaffList) { processStaffListJSON(jsStaffList); }, 'json')
  )
  .done(function() {
    if(dEntriesDate==null || staffMember==null || /^\d+$/.test(staffMember.IDN)==false || stringHasContent(staffMember.fullName)==false) {
      switchStateTo('initFailed');
    } else {
      resetForm();
      switchStateTo('initial');
			setFocusToElement(displayElementById('makeAnEntry'));
    }
  })
  .fail(function(d) {
    switchStateTo('initFailed');
    })
  .always(function() {setTitleAndMainHeading();});
}

function hideAllSections() { 
  resetForm();
  hideAllSectionsBut([]);
}

function hideAllSectionsBut(aIDs) {
	var i, aSections;
	
  aSections=['initSection','declareNoEntries', 'chooseClientSection', 'clientSearchResultsTable', 'reverseNoEntriesDeclaration', 
      'journalEntryDetails', 'summary', 'dateNav', 'chooseType', 'entryMethodControls', 'serviceTypeControls',
      'durationControls', 'attendanceControls', 'presentationTitleControls', 'clientControls', 'tagControls', 
      'otherStaffControls', 'projectControls', 'summary', 'dateNav'];
      
	for(i=0;i<aIDs.length;i++) {
		displayElementById(aIDs[i]);
	}
	for(i=0;i<aSections.length;i++) {
    if(stringNotIn(aSections[i],aIDs)) { hideElementById(aSections[i]); }
	}
	
	return aIDs.length>0?document.getElementById(aIDs[0]):null;
}

function switchStateTo(sNewState) {
	switch(sNewState) {
		case 'initial':
			currentState='initial';
			clearAllNotifications();
      switchStateTo('chooseType');
			break;
		case 'initFailed':
			currentState='initFailed';
			clearAllNotifications();
			hideAllSections();
      addNotification('Initialization failed. If this problem persists or occurs frequently, please report it.');
			break;
		case 'declaredNoEntries':
      hideAllSectionsBut(['dateNav','reverseNoEntriesDeclaration']);
			setFocusToElement(displayElementById('reverseNoEntriesDeclaration'));
			break;
		case 'chooseType':
      if(staffMetrics==null || !staffMetrics.length || staffMetrics.length<1) {
        if(bNoEntriesDeclared===true) {
          switchStateTo('declaredNoEntries');
        } else {
          hideAllSectionsBut(['chooseType','summary','dateNav','declareNoEntries']);
        }
      } else {
        hideAllSectionsBut(['chooseType','summary','dateNav']);
      }
			setFocusToElement(displayElementById('addCourseSection'));
			break;
		default:
			alert('Invalid request to switch state to: "'+sNewState+'"');
			break;
	}
}

function setTitleAndMainHeading() {
  var df, h, span;
  
  h=document.getElementById('main');
  
  if(staffMember!=null && stringHasContent(staffMember.fullName) && dEntriesDate!=null && dEntriesDate.toDateString) {
    document.title='ATAC Personal Metrics Recording Tool - '+staffMember.fullName+': '+dEntriesDate.toDateString();
    h=document.getElementById('main');
    df=document.createDocumentFragment();
    df.appendChild(document.createTextNode('Record Personal Metrics for '+dEntriesDate.toDateString()));
    df.appendChild(document.createElement('br'));
    span=document.createElement('span');
    span.appendChild(document.createTextNode(staffMember.fullName));
    df.appendChild(span);
    h.innerHTML='';
    h.appendChild(df);
  } else {
    document.title='ATAC Personal Metrics Recording Tool: Initialization failed!';
    h.innerHTML=document.title;
  }
}

function processStaffMetricsJSON(jsStaffMetrics) {
  if(jsStaffMetrics!=null && jsStaffMetrics.staffMember) { 
    dEntriesDate=new Date(jsStaffMetrics.date);
    bNoEntriesDeclared=jsStaffMetrics.declaredNoMetrics;
    staffMember=jsStaffMetrics.staffMember;
    staffMetrics=jsStaffMetrics.staffMetrics;
    staffMember.formalFullName=formatFormalFullName(staffMember.firstName,staffMember.middleName,staffMember.lastName);
    staffMember.fullName=formatFullName(staffMember.firstName,staffMember.middleName,staffMember.lastName);
  } else {
    dEntriesDate=null;
    staffMember=null;
    bNoEntriesDeclared=false;
    staffMetrics=[];
  }
}

function processStaffListJSON(jsStaffList) { 
  if(jsStaffList!=null && jsStaffList.atacStaff) {
    staffList=jsStaffList.atacStaff;
  } else {
    staffList=[];
  }
}

function declareNoEntries() {
  if(staffMetrics==null || !staffMetrics.length || staffMetrics.length<1) {
		bNoEntriesDeclared=true;
		resetForm();

    $.post( 'set_declared_no_entries.pl', { staffIDN: staffMember.IDN, metricsDate: shortDate(dEntriesDate) }, function(d) {
        if(d!=null && d.success && d.success==='true') {
          switchStateTo('declaredNoEntries');
          addNotification('Successfully declared no entries for '+dEntriesDate.toDateString());
        } else {
          addNotification(d.message);
        }
      }, 'json')
      .fail(function(d) {
          addNotification('Call to database to declare no entries failed.');
      });
	} else {
    addNotification('Cannot declare no entries because metrics for this date already exist.');
  }
}

function reverseNoEntriesDeclaration() {
  if(staffMember!=null && dEntriesDate!=null && staffMember.IDN) {
    $.post( 'reverse_declared_no_entries.pl', { staffIDN: staffMember.IDN, metricsDate: shortDate(dEntriesDate) }, function(d) {
        if(d!=null && d.success && d.success==='true') {
          bNoEntriesDeclared=false;
          resetForm();
          switchStateTo('chooseType');
          addNotification('Successfully reversed declared no entries for '+dEntriesDate.toDateString());
        } else {
          addNotification(d.message);
        }
      }, 'json')
      .fail(function(d) {
          addNotification('Call to database to reverse no entries declaration failed.');
      });
	} else {
    addNotification('Cannot declare no entries because staff member or date value is not set.');
  }
}

function displaySearchStatus(sMsg) {
	var table=document.getElementById('clientSearchResultsTable'),
	    p=document.createElement('p');
	removeElementById('pSearchingStatusText');
	p.appendChild(document.createTextNode(sMsg));
	p.setAttribute('id','pSearchingStatusText');
	table.parentNode.insertBefore(p,table);
}

function searchForClient() {
	var ste=document.getElementById('clientSearchTerms'), st=ste.value, table, tbody;

	if(stringHasContent(st)) {
		table=document.getElementById('clientSearchResultsTable');
		displaySearchStatus('Searching...');
		hideElement(table);
		try {
			tbody=table.getElementsByTagName('TBODY')[0];
			tbody.parentNode.removeChild(tbody);
		} catch(e) {}

    $.post( 'get_metric_client_search_results.pl', { searchTerms: ste.value }, function(d) {
        if(d!=null && d.clients && d.clients.length) {
          updateClientSearchResults(d.clients);
        } else {
          addNotification(d.message);
        }
      }, 'json')
      .fail(function(d) {
          addNotification('Call to database to declare no entries failed.'+objectToString(d));
      });
    } else {
		alert('No search terms entered');
	}
}

  function updateClientSearchResults(c) {
    var table, tbody, i, tr, td, button, el, p;
    table=document.getElementById('clientSearchResultsTable');
		removeElementById('pSearchingStatusText');
		try {
			tbody=table.getElementsByTagName('TBODY')[0];
			tbody.parentNode.removeChild(tbody);
		} catch(e) {}
		clients=c;
		if(clients!=null && clients.length>0) {
			tbody=document.createElement('TBODY');		
			for(i=0;i<clients.length;i++) {
				tr=document.createElement('TR');
				td=document.createElement('TD');
				button=document.createElement('BUTTON');
				button.setAttribute('aria-label','Add '+htmlDecode(clients[i].lastName+', '+clients[i].firstName+' '+clients[i].middleName));
				button.setAttribute('onclick','addClientToList('+i+');return false;');
				button.setAttribute('type','button');
				button.appendChild(document.createTextNode('Add'));
				td.appendChild(button);
				tr.appendChild(td);
				
				td=document.createElement('TD');
				td.appendChild(document.createTextNode(clients[i].UserID));
				tr.appendChild(td);
				
				td=document.createElement('TD');
				td.appendChild(document.createTextNode(htmlDecode(clients[i].lastName+', '+clients[i].firstName+' '+clients[i].middleName)));
				tr.appendChild(td);
				
				td=document.createElement('TD');
				td.appendChild(document.createTextNode(clients[i].affiliation));
				tr.appendChild(td);
				
				td=document.createElement('TD');
				td.appendChild(document.createTextNode(clients[i].role));
				tr.appendChild(td);
				
				td=document.createElement('TD');
				td.appendChild(document.createTextNode(clients[i].lastActive));
				tr.appendChild(td);
				
				tbody.appendChild(tr);
			}
			table.appendChild(tbody);
			displayElement(table);
      displayElementById('clearClientSearchResultsTable');
		} else {
			displaySearchStatus('No clients matching the search terms were found.');
		}
  }

function clearClientSearchTable() {
    var table=document.getElementById('clientSearchResultsTable'), tbody, e;
		removeElementById('pSearchingStatusText');
    hideElementById('clientSearchResultsTable');
    hideElementById('clearClientSearchResultsTable');
		try {
			tbody=table.getElementsByTagName('TBODY')[0];
			tbody.parentNode.removeChild(tbody);
		} catch(e) {}  
}
  
function addClientToList(ci) {
	var clientList=document.getElementById('clientList'), li, c, i, value;
	c=clientList.getElementsByTagName('li');

	if(ci!=null && ci>=0) {
		if(c!=null) {
			for(i=0;i<c.length;i++) { // Already in list?
        if(parseInt(c[i].getAttribute('data-clientIDN'))==clients[ci].UserIDN) { return; }
			}
		}

		li=document.createElement('li');
    li.appendChild(document.createTextNode(htmlDecode(clients[ci].lastName+', '+clients[ci].firstName+' '+clients[ci].middleName+' ('+clients[ci].UserID+')')));
    li.setAttribute('data-clientIDN',clients[ci].UserIDN);
		clientList.appendChild(li);
  }
}

function clearClientsList() {
	document.getElementById('clientToAdd').value='';
	document.getElementById('clientList').innerHTML='';
	hideSection('clearClientList');
}


function addOtherStaffToList() {
	var staffEl=document.getElementById('otherStaffToAdd'),
			otherStaffList=document.getElementById('otherStaffList'), li, c, i, value;
	c=otherStaffList.getElementsByTagName('li');
	value=staffEl.value;
	if(/\S/.test(value)) {
		if(c!=null) {
			for(i=0;i<c.length;i++) {
			if(decodeEntities(c[i].innerHTML)==value) { return; }
			}
		}

		li=document.createElement('li');
		li.appendChild(document.createTextNode(staffEl.value));
		otherStaffList.appendChild(li);
		displaySection('clearOtherStaffList');
		}
	staffEl.value='';
}

function clearOtherStaffFromList() {
	document.getElementById('otherStaffToAdd').value='';
	document.getElementById('otherStaffList').innerHTML='';
	hideSection('clearOtherStaffList');
}

function displayConsultationEntryForm() {
	var 	elHeading=document.getElementById('entryDetailsHeading'),
			elSubmit=document.getElementById('submitForm');
	if(elHeading!=null && elSubmit != null) {
		elHeading.innerHTML='';
		elHeading.appendChild(document.createTextNode('Enter Consultation'));
		elSubmit.value='Submit Consultation';
    displaySummary();
		hideAllSectionsBut(['entryMethodControls','serviceTypeControls','chooseClientSection','otherStaffControls','journalEntryDetails','summary']);
	}
}

function displayMeaningfulContactEntryForm() {
	var elHeading=document.getElementById('entryDetailsHeading'),
			elSubmit=document.getElementById('submitForm');
	if(elHeading!=null && elSubmit != null) {
		elHeading.innerHTML='';
		elHeading.appendChild(document.createTextNode('Enter Meaningful Contact'));
		elSubmit.value='Submit Meaningful Contact';
    displaySummary();
		hideAllSectionsBut(['entryMethodControls','serviceTypeControls','clientControls','otherStaffControls','journalEntryDetails','summary']);
	}
}

function displayPresentationEntryForm(sType) {
	var elHeading=document.getElementById('entryDetailsHeading'),
			elSubmit=document.getElementById('submitForm'),
      elTitleLabel=document.getElementById('titleLabel');
	if(elHeading!=null && elSubmit != null) {
		elHeading.innerHTML='';
		elHeading.appendChild(document.createTextNode('Enter '+sType));
		elSubmit.value='Submit '+sType;
    elTitleLabel.innerHTML='';
		elTitleLabel.appendChild(document.createTextNode(sType+' Title'));
    displaySummary();
		hideAllSectionsBut(['presentationTitleControls','attendanceControls','otherStaffControls','journalEntryDetails','summary']);
	}
}

function displayProjectWorkEntryForm() {
	var elHeading=document.getElementById('entryDetailsHeading'),
			elSubmit=document.getElementById('submitForm');
	if(elHeading!=null && elSubmit != null) {
		elHeading.innerHTML='';
		elHeading.appendChild(document.createTextNode('Enter Project Work'));
    displaySummary();
		hideAllSectionsBut(['serviceTypeControls','projectControls','journalEntryDetails','summary']);
		elSubmit.value='Submit Project Work';
	}
}

function resetForm() {
//	document.getElementById('clientToAdd').value='';
//	document.getElementById('clientList').innerHTML='';
	document.getElementById('durationHours').value='';
	document.getElementById('durationMinutes').value='';
	document.getElementById('entryNotes').value='';
}

function commitForm() {
	var tr, th, td, tbody=document.getElementById('summaryTbody');

  iEntriesCount=iEntriesCount+1;

	tr=document.createElement('tr');

	th=document.createElement('th');
	th.appendChild(document.createTextNode(iEntriesCount.toString()));
	th.setAttribute('scope','row');
	tr.appendChild(th);

	td=document.createElement('td');
	td.appendChild(document.createTextNode(document.getElementById('selectEntryType').value));
	tr.appendChild(td);

	td=document.createElement('td');
	td.appendChild(document.createTextNode(document.getElementById('selectEntryMethod').value));
	tr.appendChild(td);

	td=document.createElement('td');
	td.appendChild(document.createTextNode('Clients'));
	tr.appendChild(td);

	td=document.createElement('td');
	td.appendChild(document.createTextNode(document.getElementById('consultDuration').value));
	tr.appendChild(td);

	td=document.createElement('td');
	td.appendChild(document.createTextNode(document.getElementById('entryNotes').value));
	tr.appendChild(td);

	tbody.appendChild(tr);
	tbody.removeChild(document.getElementById('emptyTableRow'));
	resetForm();
}

function displaySummary() {
  var i,el,el2,el3,el4,sc=document.getElementById('summaryContainer');
  
  if(staffMetrics==null || !staffMetrics.length || staffMetrics.length<1) {
    el=document.createElement('p');
    el.appendChild(document.createTextNode('No entries have been made for '+dEntriesDate.toDateString()+'.'));
  } else {
    el=document.createElement('table');
    el2=document.createElement('caption');
    el2.appendChild(document.createTextNode('Metrics Summary Table.'));
    el.appendChild(el2);
    el2.document.createElement('thead');
    el3.document.createElement('tr');
    el4.document.createElement('th');
    el4.setAttribute('span','col');
    el4.appendChild(document.createTextNode('Type'));
    el3.appendChild(el4);
    el4.document.createElement('th');
    el4.setAttribute('span','col');
    el4.appendChild(document.createTextNode('Method'));
    el3.appendChild(el4);
    el4.document.createElement('th');
    el4.setAttribute('span','col');
    el4.appendChild(document.createTextNode('# of Contacts'));
    el3.appendChild(el4);
    el4.document.createElement('th');
    el4.setAttribute('span','col');
    el4.appendChild(document.createTextNode('Activity'));
    el3.appendChild(el4);
    el4.document.createElement('th');
    el4.setAttribute('span','col');
    el4.appendChild(document.createTextNode('Description'));
    el3.appendChild(el4);
    el4.document.createElement('th');
    el4.setAttribute('span','col');
    el4.appendChild(document.createTextNode('Notes'));
    el3.appendChild(el4);
    el2.appendChild(el3);
    el.appendChild(el2);
    
    el2.document.createElement('tbody');
    for(i=0;i++;i<staffMetrics.length) {
      el3.document.createElement('tr'); // Create the row
      
      el4.document.createElement('td');
      el4.appendChild(document.createTextNode(staffMetrics[i].type));
      el3.appendChild(el4)
      
      el4.document.createElement('td');
      el4.appendChild(document.createTextNode(staffMetrics[i].method));
      el3.appendChild(el4)
      
      el4.document.createElement('td');
      el4.appendChild(document.createTextNode(staffMetrics[i].activity));
      el3.appendChild(el4)
      
      el4.document.createElement('td');
      el4.appendChild(document.createTextNode(staffMetrics[i].numOfContacts));
      el3.appendChild(el4)
      
      el4.document.createElement('td');
      el4.appendChild(document.createTextNode(staffMetrics[i].description));
      el3.appendChild(el4)
      
      el4.document.createElement('td');
      el4.appendChild(document.createTextNode(staffMetrics[i].notes));
      el3.appendChild(el4)
      
      el2.appendChild(el3); // Append the row
    }
    el.appendChild(el2);
  }
  sc.innerHTML='';
  sc.appendChild(el);
  displayElementById('summary');
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
}

function changeDateTo(date) {
}

function changeDateBy(days) {
  if(dEntriesDate==null) {
    dEntriesDate=new Date();
  }
  dEntriesDate.setDate(dEntriesDate.getDate() + days);
  getMetricsFromDB();
}

function getMetricsFromDB() {
  var el,sDate;
  el=document.getElementById('initLoadingDataP');
  if(dEntriesDate==null) {
    dEntriesDate=new Date();
  }
  sDate=(dEntriesDate.getMonth()+1).toString()+'/'+dEntriesDate.getDate().toString()+'/'+dEntriesDate.getFullYear();
  el.innerHTML='';
  el.appendChild(document.createTextNode('Loading metrics for: '+sDate));
  hideAllSectionsBut(['initSection']);
	$.when(
    $.get('get_staff_metrics.pl?metricsDate='+sDate, function(jsStaffMetrics) { processStaffMetricsJSON(jsStaffMetrics); })
  )
  .done(function() {
    if(dEntriesDate==null || staffMember==null || /^\d+$/.test(staffMember.IDN)==false || stringHasContent(staffMember.fullName)==false) {
      switchStateTo('initFailed');
    } else {
      resetForm();
      switchStateTo('initial');
			setFocusToElement(displayElementById('makeAnEntry'));
    }
  })
  .fail(function() {
    switchStateTo('initFailed');
    })
  .always(function() {setTitleAndMainHeading();});
}

function cancelForm() {
	resetForm();
  switchStateTo('chooseType');
}

function shortDate(d) {
  return (d.getMonth()+1).toString()+'/'+d.getDate().toString()+'/'+d.getFullYear();
}

function objectToString(o, bDig) {
  var p, out = '';
  if (o != null) {
    for (p in o) {
      if(o.hasOwnProperty(p)) {
        if (/object\s+object/i.test(o[p].toString()) && bDig != false) {
          out += 'STARTOBJ:' + p + ': [' + objectToString(o[p], true) + ']\n';
        } else {
          out += p + ': ' + o[p] + '\n';
        }
      }
    }
  }
  return out;
}