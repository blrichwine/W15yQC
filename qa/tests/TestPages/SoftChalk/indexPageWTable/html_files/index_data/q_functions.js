/**
 *  ==================================================
 *  SoftChalk LessonBuilder
 *  Copyright 2003-2010 SoftChalk LLC
 *  All Rights Reserved.
 *
 *  http://www.softchalk.com
 *  ==================================================
 *
 *  File date: February 16, 2012
 */


 /**
 *	From lesson.js file:
 *
 *  tableToggle_array=new Array();
 *  feed=new Array();
 *  f_right=new Array();
 *  f_wrong=new Array();
 *  f_show_correct=new Array();
 *  f_done=new Array();
 *  f_partial=new Array();
 *
 *  scoreQ[]	indicates whether to include question in scoring
 *  q_done[]	indicates whether the question has been attempted to be answered
 *
 *	"q_num"     form and question number (which are the same)
 *	"mc_items"  number of multiple choice/matching items - value is 0 for short answer, 2 for true-false
 *
 *	"q_type"
 *
 *  MULTIPLE_CHOICE = 1;
 *  TRUE_FALSE = 2;
 *  MULTIPLE_ANSWER = 3;
 *  SHORT_ANSWER = 4;
 *  MATCHING = 5;
 *  ORDERING = 6;
 *
 * 	ACTIVITY = 7;
 *
 *  ESSAY = 8;
 *
 *
 *  **********************************************
 *
 *	In lessons that have no quizpoppers:
 *  scoreQ[] is defined in header of page.
 *
 *  **********************************************
 *
 */



var lessonStartTime = new Date().getTime();

var scorm = false					//unless overriden by scorm.js
var attempted_points = 0; //total points possible on questions attempted to be answered so far
var total_points = 0;			//total points possible for all questions to be scored for entire lesson
var my_score = 0;					//current cumulative number of points scored on all questions answered
var totalQ = 0;						//total questions to be scored for this lesson
var attempted_q = 0;			//total number of questions attempted to answer

var file_name = location.href.substring((location.href.lastIndexOf('/') + 1),location.href.length);

var CLOSE_THIS_WINDOW = "<a href='javascript:window.close()'>" +
												"<img src='close_feedback.png' border='0' align='right' alt='" + qfLangCloseAlt + "'>" +
												"</a><br /><br />";

var INLINE_ID_NAMES = new Array("feed","f_done"); //inline div ids

var q_value = new Array();				//gets value of variable q_value from lesson.js and converts to value in this array
var q_text = new Array();         //gets value of variable thequestion from lesson.js and converts to value in this array
var groupQData = new Array();
var essayAnswers = new Array();

var this_question_score = new Array();



// course environment check
var courseExists = false;
if (parent.document.getElementById("SCLBCourseIndexPage") != null) {
	courseExists = true;
	my_score = eval("parent.frame_my_score" + lessonID)[0]; //pick up any previous lesson score
}


// determine which questions are scored
for (var i = 1; i <= (scoreQ.length); i++) {
  if (scoreQ[i] == "yes") {
	  totalQ++;
    q_value[i] = eval("q_value" + i);
    q_text[i] = eval("theQuestion" + i);
    total_points += q_value[i];
    this_question_score[i] = 0;
	}
	else {
		q_value[i] = 0;

		if (scoreQ[i] == "no") {
			q_text[i] = eval("theQuestion" + i);
		}
	}
}


// determine which activities are scored.
for (var i = 1; i <= (scoreQa.length); i++) {
  if (scoreQa[i]) {
	  totalQ++;
    total_points += eval("a_value" + i);
	}
}



// called by single quizpoppers

function check_q(q_num, mc_items, q_type, allow_retry) {
	check_qpq(q_num, mc_items, q_type, allow_retry, true, true);
}



// called by quiz groups

function check_qpq(q_num, mc_items, q_type, allow_retry, allow_inline_feedback, allow_score_win) {

	if (courseExists && eval("parent.L" + lessonID + "_q_done")[q_num] == true) {
		q_done[q_num] = true;
	}

	if (!q_done[q_num]) {
		attempted_q++;
	  attempted_points = attempted_points + q_value[q_num];
	  q_done[q_num] = true;
	  if (courseExists) eval("parent.L" + lessonID + "_q_done")[q_num] = true;
	}
	else if (allow_retry) {
		if (courseExists) this_question_score[q_num] = eval("parent.L" + lessonID + "_this_question_score")[q_num];
		my_score -= this_question_score[q_num];
	}
	else {
		myWin(qfLangBeenAnswered, "", q_num, q_type, "", allow_inline_feedback, allow_score_win);
		return;
	}

	var correct = "no";
	var feedback = "";
	var student_answer = "";
	var fieldno = eval("main.document.f" + q_num + ".q" + q_num); // input name
	var imageno = eval("main.document.check" + q_num);
	var right_answers = eval("right_answers" + q_num);
	var showCorrect = (eval("showCorrect" + q_num) == "yes");
	var this_q_score = 0;


	switch (q_type) {

		// MULTIPLE_CHOICE, TRUE_FALSE
		case 1:
		case 2:
			for (var i = 0; i < mc_items; i++) {
				if (fieldno[i].checked) {
					student_answer = fieldno[i].value;
					break;
				}
			}

	    if (student_answer.toUpperCase() == right_answers[0].toUpperCase()) {
	    	correct = "yes";
	    }
	    else {
	    	feedback = eval("feedbackWrong" + q_num);
	      if (showCorrect) {
	        feedback += "<br />" + qfLangFBmctf + " " + right_answers[0];
	      }
			}
			break;

		// MULTIPLE_ANSWER
		case 3:
			var selected_items = new Array();
			var correct_selections = new Array();

	  	for (var i = 0; i < mc_items; i++) {
	      if (fieldno[i].checked) {
	        selected_items[selected_items.length] = fieldno[i].value;
	      }
	    }

	    var correct_items = right_answers[0].split(",");
	    for (var i = 0; i < selected_items.length; i++) {
	      for (var j = 0; j < correct_items.length; j++) {
		      if (selected_items[i] == correct_items[j]) {
			      correct_selections[correct_selections.length] = selected_items[i];
		      }
	      }
	    }
			
			// maybe compute partial points
			if (eval('partial_credit' + q_num) && q_value[q_num] > 0 && correct_selections.length > 0) {
				var pointsPerItem = q_value[q_num] / correct_items.length;
				var rightPoints = correct_selections.length * pointsPerItem;
				
				if (selected_items.length > correct_selections.length) { // some selected items are wrong
					var numWrong = selected_items.length - correct_selections.length;
					var wrongPoints = numWrong * pointsPerItem;
					this_q_score = rightPoints - wrongPoints;
					if (this_q_score < 0)
						this_q_score = 0;
					else
						this_q_score = Math.round(this_q_score * 10) / 10; // round to 1 decimal
				}
				else if (correct_selections.length < correct_items.length) { // not all correct items were selected
					this_q_score = Math.round(rightPoints * 10) / 10; // round to 1 decimal
				}
			}

	    if (correct_selections.length == correct_items.length) {
	    	if (selected_items.length > correct_selections.length) {
			  	correct = "partial";
			  	feedback = eval("feedbackPartial" + q_num);
					if (showCorrect) {
						feedback += "<br />" + qfLangFBmaOnly + " " + correct_selections;
					}
			  }
			  else {
		    	correct = "yes";
	    	}
	    }
	    else if (correct_selections.length > 0) {
				correct = "partial";
		    feedback = eval("feedbackPartial" + q_num);
				if (showCorrect) {
					feedback += "<br />" + qfLangFBmasaWrong + " " + right_answers;
				}
	    }
			else {
				feedback = eval("feedbackWrong" + q_num);
				if (showCorrect) {
					feedback += "<br />" + qfLangFBmasaWrong + " " + right_answers;
				}
			}

	    student_answer = selected_items;
			break;

		// SHORT_ANSWER
		case 4:
	  	student_answer = fieldno.value;
			var caseSensitiveValue = eval("case_sensitive" + q_num);

			if (caseSensitiveValue != null && caseSensitiveValue != undefined) {
				var caseSensitive = (caseSensitiveValue == "true");
			}
			else {
				var caseSensitive = false;
			}

			if (caseSensitive) {
				for (var i = 0; i < right_answers.length; i++) {
					if (getTrimmed(student_answer) == getTrimmed(right_answers[i])) {
						correct = "yes";
						break;
					}
				}
			}
			else {
				var upper = getTrimmed(student_answer.toUpperCase());
				for (var i = 0; i < right_answers.length; i++) {
					if (upper == getTrimmed(right_answers[i].toUpperCase())) {
						correct = "yes";
						break;
					}
				}
			}

	  	if (correct != "yes") {
	    	feedback = eval("feedbackWrong" + q_num);
	    	if (showCorrect) {
					feedback += "<br />" + qfLangFBmasaWrong + " " + right_answers;
	    	}
	  	}
			break;

		// MATCHING, ORDERING
		case 5:
		case 6:
			var correct_selections = new Array();
	    var correct_answers = new Array();
	    var student_answers = new Array();
			
	  	for (var i = 0; i < mc_items; i++) {
	  		var option_num = i + 1;
	  	  fieldno = eval("main.document.f" + q_num + ".q" + q_num + "_" + option_num);
	  	  var s_index = fieldno.options.selectedIndex;
	  	  var ra_index = right_answers[i];

	  	  student_answers[i] = fieldno.options[s_index].value;
	  	  correct_answers[i] = " " + option_num + " = " + fieldno.options[ra_index].value;

	      if(s_index == ra_index) {
	        correct_selections[correct_selections.length] = option_num;
	      }
	    }

	    if (correct_selections.length == right_answers.length) {
	    	correct = "yes";
	    }
	    else if (correct_selections.length > 0) {
	    	correct = "partial";
	      feedback = eval("feedbackPartial" + q_num);
				if (showCorrect) {
	      	feedback += "<br />" + qfLangFBmatorPartial + " " + correct_selections;
	      }
				
				if (eval('partial_credit' + q_num) && q_value[q_num] > 0) {
					var pointsPerItem = q_value[q_num] / right_answers.length;
					this_q_score = pointsPerItem * correct_selections.length;
					this_q_score = Math.round(this_q_score * 10) / 10; // round to 1 decimal
				}
			}
	    else {
	      feedback = eval("feedbackWrong" + q_num);
	      if (showCorrect) {
	      	feedback += "<br />" + qfLangFBmatorWrong + " " + correct_answers;
	      }
	    }

	    student_answer = student_answers;
			break;

		// Essay
		case 8:
			correct = "yes";
			essayAnswers[q_num] = fieldno.value.replace(/\n/g, "<br />");
			break;
	}

	// set the icon
	if (imageno != undefined) imageno.src = (correct == "yes") ? "check.png" : "wrong.png";

	var correct_text = "";

	if (correct == "yes") {
		if (q_type == 8) {
			correct_text = "essay";
			feedback = "" + qfLangEssayFeedback;
		}
		else {
			correct_text = "correct";
			feedback = eval("feedbackRight" + q_num);
			this_q_score = q_value[q_num];
		}
	}
	else if (correct == "partial") correct_text = "partially correct";
	else if (correct == "no") correct_text = "incorrect";
	
	my_score += this_q_score;

	this_question_score[q_num] = this_q_score;
	if (courseExists) {
		eval("parent.L" + lessonID + "_this_question_score")[q_num] = this_q_score;
		eval("parent.frame_my_score" + lessonID)[0] = my_score;
	}

	groupQData[q_num] = this_q_score + "*#*" + correct_text + "*#*" + student_answer + "*#*" + q_text[q_num];

 	myWin(feedback, correct, q_num, q_type, student_answer, allow_inline_feedback, allow_score_win, this_q_score);
}


function myWin(stuff, correct, q_num, q_type, student_answer, allow_inline_feedback, allow_score_win, this_q_points) {

	if (eval('inline_feedback' + q_num)) {																	// inline
		if (allow_inline_feedback) {
	    clearMe(q_num);

			main.document.getElementById("f_done" + q_num).innerHTML = "<embed src=spacer.gif width=0 height=0>" + stuff;
			f_done[q_num] = true;
			togglefeed(q_num, "f_done", false);

			if (stuff != qfLangBeenAnswered && q_value[q_num] > 0 && q_type != 8) {
				main.document.getElementById("feed" + q_num).innerHTML = "<br />" + qfLangPoints + " <strong>" + this_q_points + "</strong>";
				feed[q_num] = true;
				togglefeed(q_num, "feed", false);
	    }
  	}
  }
  else {																																	// popup
  	winSpecs = 'width=400,height=200,resizable=yes,scrollbars=yes';
    win = window.open("", 'pic', winSpecs);
    win.document.open();
    //win.document.clear();
    win.document.write("<html>\n<head>\n<title>" + qfLangFeedback + "</title>\n</head>\n<body style='font-size: 90%; font-family: Arial, Helvetica, sans-serif;'>\n");
    win.document.write(CLOSE_THIS_WINDOW);
    win.document.write(stuff);

    if (stuff != qfLangBeenAnswered && q_value[q_num] > 0 && q_type != 8) {
      win.document.write("<div style=\"font-family: 'Comic Sans MS'; border-top: 1px solid #000000; margin-top: 10px;\"><br />\n" +
      									 qfLangPoints + " <span style=\"font-weight: bold;\">" + this_q_points + "</span>\n" +
      									 "</div>\n");
    }

    win.document.write("</body>\n</html>");
    win.document.close();
    win.focus();
  }

	// show the floating score window
	if (allow_score_win && q_value[q_num] > 0) {
		var scoreSpan = main.document.getElementById("my_score_span");
		if (scoreSpan) {
			main.stayTopLeft();
			main.document.getElementById("floatingscore").style.visibility = "visible";
			scoreSpan.innerHTML = qfLangFloat + "<br /><strong>" + my_score + " / " + total_points + "</strong>";
		}
	}
	
	var mobileScoreSpan = main.document.getElementById("my_mobile_score_span");
	if (mobileScoreSpan) {
		mobileScoreSpan.innerHTML = qfLangFloat + " " + my_score + "/" + total_points;
	}


  if (scorm && q_type != 8 && stuff != qfLangBeenAnswered) {
  	var act_type = 0;
  	var act_percent = 0;
  	sendScorm(q_num, q_type, act_type, student_answer, correct, act_percent);
  }
}



function print_essay(q_num) {
	check_q(q_num, 0, 8, true);

	var userName = "";
	userName = prompt(qfLangNameAlert, " ");
	userName = getTrimmed(userName);

	// handles if users type a single quotes in their names (070312)
	var apos = userName.indexOf("'");
	while (apos != -1) {
		userName = userName.replace(/\'/,"&apos;");
		apos = userName.indexOf("'");
	}

	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
  var year = currentTime.getFullYear();

	// format for display - include student name, question, and response
	winSpecs = "width=700,height=500,resizable=yes,scrollbars=yes,menubar=no";
	winPrint = window.open("", 'pic', winSpecs);
	winPrint.document.open();
  //winPrint.document.clear();

  winPrint.document.write("<html>\n<head>\n<title> Essay Response </title>\n" +
								 "<meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1' />\n" +

								 "<style type='text/css'>@media print{input,hr{display:none;}}</style>\n" +
								 "</head>\n" +

								 "<form><input type=button value='Print'onClick='window.print();window.close();'> <input type=button value='Cancel'onClick='window.close();return false;'></form>\n" +

								 "<body>\n" +
								 "<p style=\"text-align: right;\">" + userName + "<br />" +
								 month + "/" + day + "/" + year + "</p><br />\n" +
								 "<p style=\"text-align: center;\"><strong>" + q_text[q_num] + "</strong></p><br /><br />\n" +
								 "<p>" + essayAnswers[q_num] + "</p>" +
								 "</body>\n</html>\n");

	winPrint.document.close();
}


function clearEssayFeedback(essayNo) {
  var imageno = eval("main.document.check" + essayNo);
  if (essayAnswers[essayNo]) {
    imageno.src = "spacer.gif";
    togglefeed(essayNo, "f_done", false);
  }
}


function toggletable(which) {                    // show/hide question
	var num = which.substring(10); //remove prefix "quizpopper"
  if (tableToggle_array[num]) {
    tableToggle_array[num] = false;
    setShow(which, false);
  }
  else {
    tableToggle_array[num] = true;
    setShow(which, true);
  }
}


function togglefeed(q_num, which, hide) {						// show/hide feedback
  my_item_value = eval(which + "[" + q_num + "]");
  if (!hide) {
    if (!my_item_value) {
      setState(q_num, which, true);
      setShow(which + q_num, false);
    }
    else {
      setState(q_num, which, false);
      setShow(which + q_num, true);
    }
	}
  else {
    for (i = 0; i < INLINE_ID_NAMES.length; i++) {
	  	setState(q_num, INLINE_ID_NAMES[i], false);
	  }
    setShow(which + q_num, false);
  }
}


function setState(q_num, which, state) {
	if (which == "feed") {feed[q_num] = state;}
	else if (which == "f_done") {f_done[q_num] = state;}
}


function setShow(elemId, show) {
	var elem = main.document.getElementById(elemId);
	if (show) {
		elem.style.display = 'block';
	}
	else {
		elem.style.display = 'none';
	}
}


function clearMe(q_num) {
	for (i = 0; i < INLINE_ID_NAMES.length; i++) {
  	setShow(INLINE_ID_NAMES[i] + q_num, false);
  }
}


function hint(q_num) {
  my_hint = eval("hint" + q_num);

  if (!eval('inline_feedback' + q_num)) {
    winSpecs = 'width=400,height=200,resizable=yes,scrollbars=yes';
    win = window.open ("", 'pic', winSpecs);
    win.document.open();
    //win.document.clear();
    win.document.write("<html><head><title>" + qfLangHint + "</title></head><body style='font-family: Verdana, Helvetica, sans-serif;'>");
    win.document.write(CLOSE_THIS_WINDOW);
    win.document.write(my_hint);
    win.document.write("</body></html>");
    win.document.close();
    win.focus();
  }
  else {
  	clearMe(q_num);
    main.document.getElementById("f_done" + q_num).innerHTML = "<embed src=spacer.gif width=0 height=0>" + my_hint;
		f_done[q_num] = true;
		togglefeed(q_num, "f_done", false);
  }
}


function quit_lesson() {
	if (scorm) {
    ScormOnunload();
	}
	else {
		window.opener = top;
  	window.close();
	}
}


function getLessonTime() {
  var lessonTotalTime = "0";
  if (lessonStartTime != 0) {
  	var currentDate = new Date().getTime();
    var elapsed_Seconds = ((currentDate - lessonStartTime) / 1000);
    if (elapsed_Seconds < 60) {
      lessonTotalTime = Math.round(elapsed_Seconds) + " seconds";
    }
    else if (elapsed_Seconds > 3600) {
    	var whole_hours = Math.round(elapsed_Seconds / 3600);
    	var whole_secs = (whole_hours * 3600);
    	var rem_minutes = (elapsed_Seconds - whole_secs) / 60;
    	rem_minutes = Math.round(rem_minutes);
    	if (rem_minutes > 0) {
      	lessonTotalTime = whole_hours + " hours and " + rem_minutes + " minutes";
    	}
    	else {
    		lessonTotalTime = whole_hours + " hours";
    	}
		}
		else {
			lessonTotalTime = Math.round(elapsed_Seconds / 60) + " minutes";
  	}
  }
  return lessonTotalTime;
}


function getEssays() {
	var allEssays = "";

	for (var q = 1; q <= (q_item); q++)
	{
		if (essayAnswers[q] != undefined)
		{
			allEssays += "<br />" + "<strong>" + q_text[q] + "</strong>" + "<br /><br />" + essayAnswers[q] + "<br />";
		}
  }
	return allEssays;
}


function lessonReport(which) {
	var userName = main.document.send_form.user_name.value;
	userName = getTrimmed(userName);

	if (userName == "") {
		alert(qfLangNameAlert);
		main.document.send_form.user_name.focus();
		return false;
	}

	// handles if users type a single quotes in their names (070312)
	var apos = userName.indexOf("'");
	while (apos != -1) {
		userName = userName.replace(/\'/,"&apos;");
		apos = userName.indexOf("'");
	}

	// need this "if" statement for a forced frames environment
	// when there are no points, i.e. teacher wants a cert.
	// otherwise total_score would be NaN
  var total_score = 0;
  if (my_score > 0) {
  	total_score = Math.round((my_score / total_points) * 100);
  }

  if (which == "email") {
  	var lesTitle = document.title;
  	if (lesTitle.length > 200) {
  		lesTitle = lesTitle.substring(0, 200);
  	}
  	main.document.send_form.action = "https://softchalk.com/send_score/send_score_v6.cgi";
  	main.document.send_form.method = "post";
  	main.document.send_form.my_lesson.value = lesTitle;
	  main.document.send_form.my_attempted_points.value = attempted_points;
	  main.document.send_form.my_score.value = total_score;
	  main.document.send_form.my_time_spent.value = getLessonTime();
	  main.document.send_form.total_points.value = total_points;
	  main.document.send_form.my_scored_points.value = my_score;

	  var allEssays = getEssays();
	  if (allEssays.length > 0) {
		  main.document.send_form.essay.value = "Essay Responses:<br>" + allEssays;
	  }

	  main.document.send_form.recipient.value = qfRecipient;
	  main.document.send_form.submit();
		return true;
  }

  if (which == "scoretracker") {
  	// need to check if they selected a course,
  	// compare against lang REPORT_OPTION
  	var courseID = main.document.send_form.course_id.value;
  	if (courseID == qfLangReportOptionAlert) { // must use non-html version of qfLangReportOption for the comparison test!
  		alert(qfLangReportOptionAlert);
  		return false;
  	}

		// essays
		var essayCount = 0;
		var qNumber = 0;
		var formValue;
		for (var i = 0; i < (qOrder.length); i++) {
			qNumber = qOrder[i];
			try {
				if (eval("q_type" + qNumber) == 8) {
					essayCount++;
					formValue = eval("main.document.send_form.essay" + essayCount);
					formValue.value = essayAnswers[qNumber];
					formValue = eval("main.document.send_form.essayQuestion" + essayCount);
					formValue.value = eval("theQuestion" + qNumber);
				}
			}
			catch (err) { // ("q_type" + qNumber) is undefined, there is no question with that qNumber
				continue;
			}
		}
		main.document.send_form.essayCount.value = essayCount;
		// end essays

  	var lesTitle = document.title;
  	if (lesTitle.length > 200) {
  		lesTitle = lesTitle.substring(0, 200);
  	}
  	main.document.send_form.action = qfScoreTrackerPath;
  	main.document.send_form.method = "post";
  	main.document.send_form.my_lesson.value = lesTitle;
	  main.document.send_form.my_attempted_points.value = attempted_points;
	  main.document.send_form.my_score.value = total_score;
	  main.document.send_form.my_time_spent.value = getLessonTime();
	  main.document.send_form.total_points.value = total_points;
	  main.document.send_form.my_scored_points.value = my_score;
	  main.document.send_form.timestamp.value = qfScoreTrackerTimeStamp;
	  main.document.send_form.recipient.value = qfRecipient;
	  main.document.send_form.submit();
		return true;
  }

	if (which == "certificate" && (total_score < passing_score)) {
		alert(qfLangScoreAlertOne + " " + total_score + "%\n" +
						qfLangScoreAlertTwo + " " + passing_score + "%.\n\n" +
						qfLangScoreAlertThree);
		return false;
	}

  var winTitle;
  var movieName;
  var getstring;
  var flName = which;

  if (which == "certificate") {
    winTitle = qfLangCertTitle;
    movieName = "certificate";
    getstring = "&name=" + userName;
  }
  else {
  	winTitle = qfLangSumTitle;
  	movieName = "score summary";
		getstring = "&name=" + userName + "&points=" + total_points + "&timespent=" +
								getLessonTime() + "&attempted=" + attempted_points + "&correct=" + my_score + "&score=" + total_score;
  }

	var obWidth = "925";
	var obHeight = "775";
	winSpecs = "width=700,height=500,resizable=yes,scrollbars=yes,menubar=no";
	win = window.open("", "pic", winSpecs);
  win.document.open();
  //win.document.clear();
	win.document.write("<html>\n<head>\n<title>" + winTitle + "</title>\n" +
									 "<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />\n" +
									 "</head>\n" +
									 "<body>\n" +
									 "<p align='center' style='font-size: 90%;'>\n" +
									 "<br />" + qfLangPrintIns + "<br />\n" +
									 "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' " +
									 "codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0' " +
									 "width='" + obWidth + "' height='" + obHeight + "' align='middle' id='" + flName + "'>\n" +
									 "<param name='allowScriptAccess' value='sameDomain' />\n" +
									 "<param name='movie' value='" + flName + ".swf' />\n" +
									 "<param name='quality' value='high' />\n" +
									 "<param name='bgcolor' value='#ffffff' />\n" +
									 "<param name=FlashVars value='" + getstring + "' />\n" +
									 "<embed src='" + flName + ".swf' name='" + flName + "' " +
									 "quality='high' bgcolor='#ffffff' " +
									 "width='" + obWidth + "' height='" + obHeight + "' align='middle' " +
									 "FlashVars='" + getstring + "' " +
									 "allowScriptAccess='sameDomain' type='application/x-shockwave-flash' " +
									 "pluginspage='http://www.macromedia.com/go/getflashplayer' />\n" +
									 "</object>\n" +
									 "</p>\n" +
									 "</body>\n</html>\n");

  win.document.close();
  win.focus();
	return true;
}


function getTrimmed(s) {
	var l = 0;
	var r = s.length -1;

	while (l < s.length && s[l] == ' ') {
		l++;
	}

	while (r > l && s[r] == ' ') {
		r -= 1;
	}

	return s.substring(l, r + 1);
}
