/**
 *  ==================================================
 *  SoftChalk LessonBuilder
 *  Copyright 2003-2009 SoftChalk LLC
 *  All Rights Reserved.
 *
 *  http://www.softchalk.com
 *  ==================================================
 *
 *  File date: January 20, 2012
 */


function writeNextGroupQP(GN, oneAtATime, summary) {
	if (currentQPNum[GN] > quizGroupSize[GN]) return;

	var qpNumbersArray = eval("qpNumbersArray" + GN);
	var groupQpArray = eval("groupQpArray" + GN);
	var groupQpStateArray = eval("groupQpStateArray" + GN);


	if (oneAtATime) {
	  if (firstDisplayed[GN]) {
	  	var pos = qpNumbersArray[currentQPNum[GN] - 1];
	  	var qpId = getQpId(groupQpArray[pos]);
	    var qpType = eval("q_type" + qpId);

	    if (summary)
	    	check_qpq(qpId, eval("mc_items" + qpId), qpType, true, false, false);

	    saveQpValues(qpId, qpType, pos, groupQpStateArray);
	    currentQPNum[GN]++;
	  }

	  firstDisplayed[GN] = true;

		main.document.getElementById('qgbackbottom' + GN).style.display = (currentQPNum[GN] > 1) ? 'inline' : 'none';

		if (currentQPNum[GN] < (quizGroupSize[GN] + 1)) {
			var pos = qpNumbersArray[currentQPNum[GN] - 1];
			main.document.getElementById('qgforwardbottom' + GN).style.display = 'inline';
		  main.document.getElementById('quizgroupspace' + GN).innerHTML = "<br>" + groupQpArray[pos] + "<br>" +
																																			"<em># " + currentQPNum[GN] + " / " + quizGroupSize[GN] + "</em>";

			if ((groupQpStateArray[pos] != undefined) && (groupQpStateArray[pos] != null)) {
				var qpId = getQpId(groupQpArray[pos]);
				var qpType = eval("q_type" + qpId);
				restoreQpValues(qpId, qpType, pos, groupQpStateArray);
			}
		}
		else {
			main.document.getElementById('qgforwardbottom' + GN).style.display = 'none';
			main.document.getElementById('quizgroupresults' + GN).style.display = 'inline';
			main.document.getElementById('quizgroupspace' + GN).innerHTML = '<br>' + qfGroupComplete;
		}

	}
	else {
		showAllAtOnce(GN, false);
	}
}



function showAllAtOnce(GN, results) {
	var groupQpArray = eval("groupQpArray" + GN);
	var qpNumbersArray = eval("qpNumbersArray" + GN);

	main.document.getElementById('qgforwardbottom' + GN).style.display = 'none';

	var myText = "";
	for (var i = 0; i < quizGroupSize[GN]; i++) {
		myText += groupQpArray[qpNumbersArray[i]] + "<br>";
	}

	main.document.getElementById('quizgroupspace' + GN).innerHTML = myText;

	if (results) {
		var groupQpStateArray = eval("groupQpStateArray" + GN);

		for (var j = 0; j < quizGroupSize[GN]; j++) {
			var pos = qpNumbersArray[j];
			var qpId = getQpId(groupQpArray[pos]);
	    var qpType = eval("q_type" + qpId);

			restoreQpValues(qpId, qpType, pos, groupQpStateArray);
		}
	}
	else {
		main.document.getElementById('quizgroupresults' + GN).style.display = 'inline';
	}
}



function writePrevGroupQP(GN, summary) {
	if (currentQPNum[GN] == 1) return;

	var qpNumbersArray = eval("qpNumbersArray" + GN);
	var groupQpArray = eval("groupQpArray" + GN);
	var groupQpStateArray = eval("groupQpStateArray" + GN);

	if (currentQPNum[GN] < quizGroupSize[GN] + 1) {
		var pos = qpNumbersArray[currentQPNum[GN] - 1];
		var qpId = getQpId(groupQpArray[pos]);
		var qpType = eval("q_type" + qpId);

		if (summary)
			check_qpq(qpId, eval("mc_items" + qpId), qpType, true, false, false);

		saveQpValues(qpId, qpType, pos, groupQpStateArray);
	}

	currentQPNum[GN]--;

	var pos = qpNumbersArray[currentQPNum[GN] - 1];
	var qpId = getQpId(groupQpArray[pos]);
	var qpType = eval("q_type" + qpId);

	main.document.getElementById('qgforwardbottom' + GN).style.display = 'inline';
	main.document.getElementById('quizgroupresults' + GN).style.display = 'none';
	main.document.getElementById('quizgroupspace' + GN).innerHTML = "<br>" + groupQpArray[pos] + "<br>" +
																																	"<em># " + currentQPNum[GN] + " / " + quizGroupSize[GN] + "</em>";

	restoreQpValues(qpId, qpType, pos, groupQpStateArray);

	main.document.getElementById('qgbackbottom' + GN).style.display = (currentQPNum[GN] > 1) ? 'inline' : 'none';
}



/*
 *  MULTIPLE_CHOICE = 1;
 *  TRUE_FALSE = 2;
 *  MULTIPLE_ANSWER = 3;
 *  SHORT_ANSWER = 4;
 *  MATCHING = 5;
 *  ORDERING = 6;
 *  (activities are #7)
 *  ESSAY = 8;
 */

function saveQpValues(qpId, qpType, pos, groupQpStateArray) {

	var myQP = eval("main.document.f" + qpId + ".q" + qpId);

	switch(qpType) {
		case 1:
		case 2:
			for (var x = 0; x < myQP.length; x++) {
				if (myQP[x].checked) {
					groupQpStateArray[pos] = x;
				}
			}
			break;

		case 3:
			var c_value;
			for (var i = 0; i < myQP.length; i++){
				if (myQP[i].checked) {
					if (c_value) {
						c_value += "," + i.toString();
					}
					else {
						c_value = i.toString();
					}
				}
			}

			if (c_value != "") {
				groupQpStateArray[pos] = c_value;
			}
			break;

		case 4:
		case 8:
			groupQpStateArray[pos] = myQP.value;
			break;

		case 5:
		case 6:
			var mc_items = eval("mc_items" + qpId);
			var mySelect = new Array();

			for (var i = 0; i < mc_items; i++) {
				var option_num = i + 1;
				myQP = eval("main.document.f" + qpId + ".q" + qpId + "_" + option_num);
				mySelect[i] = myQP.options.selectedIndex;
			}
			groupQpStateArray[pos] = mySelect;
			break;

		default:
			break;
	}
}



function restoreQpValues(qpId, qpType, pos, groupQpStateArray) {

	var myQP = eval("main.document.f" + qpId + ".q" + qpId);

	switch(qpType) {
		case 1:
		case 2:
			if (groupQpStateArray[pos] != undefined) {
				myQP[groupQpStateArray[pos]].checked = true
			}
			break;

		case 3:
			if (groupQpStateArray[pos] != undefined) {
				var myString = groupQpStateArray[pos].toString();
				var restoreArray = myString.split(",");
				for (var i = 0; i < restoreArray.length; i++) {
					var myItem = restoreArray[i];
					myQP[restoreArray[i]].checked = true;
				}
			}
			break;

		case 4:
		case 8:
			myQP.value = groupQpStateArray[pos];
			break;

		case 5:
		case 6:
			var mc_items = eval("mc_items" + qpId);
			var myString = groupQpStateArray[pos].toString();
			var restoreArray = myString.split(",");

			for (var i = 0; i < mc_items; i++) {
				var option_num = i + 1;
				myQP = eval("main.document.f" + qpId + ".q" + qpId + "_" + option_num);
				myQP.options.selectedIndex = restoreArray[i];
			}
			break;

		default:
			break;
	}
}



function getQpId(txt) {
	var ind = txt.indexOf('<div id="quizpopper', 0);
	if (ind != -1) {
		ind += 19;
		var ind2 = txt.indexOf('"', ind);
		var num = txt.substring(ind, ind2);
		return num;
	}
	else
		return null;
}



function checkQuizGroup(GN, oneAtATime, summary, retry) {
	main.document.getElementById('qgbackbottom' + GN).style.display = 'none';
	main.document.getElementById('qgforwardbottom' + GN).style.display = 'none';
	main.document.getElementById('quizgroupresults' + GN).style.display = 'none';

	if (!retry && groupFinished[GN]) {
		return;
	}

	groupFinished[GN] = true;

	if (oneAtATime) {
		if (!summary) {
			showAllAtOnce(GN, true);
			runCheckQPQ(GN);
		}
	}
  else {
    runCheckQPQ(GN);
  }

  var groupTotal = showGroupResult(GN, oneAtATime, summary);

  if (retry)
		main.document.getElementById('quizgroupretry' + GN).style.display = 'inline';

	main.document.getElementById('quizgroupfeedback' + GN).scrollIntoView(true);
	
	if (groupTotal > 0) // the score window will not be present if there are no points in the lesson
		main.courseScore();
}



function runCheckQPQ(GN) {
	var qpNumbersArray = eval("qpNumbersArray" + GN);
	var groupQpArray = eval("groupQpArray" + GN);

	var size = quizGroupSize[GN];

	for (var i = 0; i < size; i++) {
		var pos = qpNumbersArray[i];
		var qpId = getQpId(groupQpArray[pos]);
		var qpType = eval("q_type" + qpId);
		var mcItems = eval("mc_items" + qpId);

		check_qpq(qpId, mcItems, qpType, true, true, false);
	}
}



function showGroupResult(GN, oneAtATime, summary) {

  var qpNumbersArray = eval("qpNumbersArray" + GN);
  var groupQpArray = eval("groupQpArray" + GN);
  var size = quizGroupSize[GN];

  var groupTotalPoints = 0;
  var groupScore = 0;

  for (var i = 0; i < size; i++) {
		var pos = qpNumbersArray[i];
		var qpId = getQpId(groupQpArray[pos]);
		groupTotalPoints += q_value[qpId];

		var qData_array = groupQData[qpId].split("*#*");
		groupScore += parseFloat(qData_array[0]);
	}

	var scoreResults = '<p><strong>' + qfGroupScore + '&nbsp;&nbsp;' + groupScore + ' / ' + groupTotalPoints + '</strong></p>';

	if (summary) {
		main.document.getElementById('quizgroupspace' + GN).innerHTML = "";
	}

	main.document.getElementById('quizgroupfeedback' + GN).innerHTML = scoreResults;
	
	return groupTotalPoints;
}



function toggleQuizGoup(GN, oneAtATime, summary, retry) {                    // show/hide group
	if (quizGroupToggle_array[GN]) {
    quizGroupToggle_array[GN] = false;
    showTheGroup(GN, false);
  }
  else {
	  if (!retry && groupFinished[GN]) {
		  return;
	  }
    quizGroupToggle_array[GN] = true;
    showTheGroup(GN, true);
    if (oneAtATime) {
	    if (groupFinished[GN]) {
	    	currentQPNum[GN] = 1;
	    	var groupQpStateArray = eval("groupQpStateArray" + GN);
				for (var i = 0; i < groupQpStateArray.length; i++) {
					groupQpStateArray[i] = null;
				}
    	}
	    firstDisplayed[GN] = false;
    }

		if (groupFinished[GN])
			groupFinished[GN] = false;

     writeNextGroupQP(GN, oneAtATime, summary);
  }
}



function showTheGroup(GN, show) {
	var elem = main.document.getElementById("quizgroupwrapper" + GN);
	if (show) {
		elem.style.display = 'block';
	}
	else {
		var retryelem = main.document.getElementById('quizgroupretry' + GN);
		if (retryelem != undefined) retryelem.style.display = 'none';

		main.document.getElementById('quizgroupfeedback' + GN).innerHTML = "";
		main.document.getElementById('quizgroupspace' + GN).innerHTML = "";
		main.document.getElementById('qgbackbottom' + GN).style.display = 'none';
		main.document.getElementById('qgforwardbottom' + GN).style.display = 'none';
		main.document.getElementById('quizgroupresults' + GN).style.display = 'none';
		elem.style.display = 'none';
	}
}



function quizGroupRetry(GN, oneAtATime, summary) {
	main.document.getElementById('quizgroup' + GN).scrollIntoView(true);
	showTheGroup(GN, false);
	quizGroupToggle_array[GN] = false;
	currentQPNum[GN] = 1;

	if (oneAtATime) {
		var groupQpStateArray = eval("groupQpStateArray" + GN);
		for (var i = 0; i < groupQpStateArray.length; i++) {
			groupQpStateArray[i] = null;
		}
		firstDisplayed[GN] = false;
	}

	toggleQuizGoup(GN, oneAtATime, summary, true);
}


/*
function access() {
	if (!moreAccess) {
		moreAccess = true;
		//alert("Acessibility enhancements activated");
		sndGo = "<embed hidden=true name=sound1 src=clickdn.aif>";
		sndBack = "<embed hidden=true name=sound1 src=click2.wav>";
	}
	else {
		moreAccess = false;
		//alert("Acessibility enhancements turned off");
		sndGo = "";
		sndBack = "";
	}
}
*/
