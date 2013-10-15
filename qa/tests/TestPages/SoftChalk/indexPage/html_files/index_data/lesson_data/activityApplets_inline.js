/**
 *  ==================================================
 *  SoftChalk LessonBuilder
 *  Copyright 2003-2007 SoftChalk LLC
 *  All Rights Reserved.
 *
 *  http://www.softchalk.com
 *  ==================================================
 *
 *  File date: July 3, 2011
 */

/*
 * other = 0 as a safety
 * 1 is not used
 *
 * FLASH_CARD_ACTIVITY = 2;
 * SEEK_A_WORD_ACTIVITY = 3;
 * DRAG_N_DROP_ACTIVITY = 4;
 * ORDERING_ACTIVITY = 5;
 * CROSSWORD_ACTIVITY = 6;
 * LABELING_ACTIVITY = 7;
 * SORTING_ACTIVITY = 8;
 * HOT_SPOT_ACTIVITY = 9;
 */


// Chris' debugging method not needed
// but keep method name to avoid javascript errors
function readit() {}


// called from lesson page
function cookit() {

	// 0 is id:act_type (followed by the word "score")
	// 1 is percent
	// 2 is not used
	// 3 is drag/fill-in attempts, currently not used
	//alert("0 = " + cookit.arguments[0] + "\n1 = " + cookit.arguments[1] + "\n2 = " + cookit.arguments[2] + "\n3 = " + cookit.arguments[3]);

	var arg1 = cookit.arguments[0];

	if (arg1.length < 6) {
		alert("Error parsing ID number.\nThis activity can not be scored.");
		return;
	}

	var act_id = null;
	var act_type = null;

	var v = arg1.substring(0, arg1.length - 5);
	var c = v.indexOf(":");

	if (c != -1) {
		act_id = v.substring(0, c);
		act_type = v.substring(c + 1);
	}
	else {
		alert("Error parsing cookit arguments.\nThis activity can not be scored.");
		return;
	}

	//pick up any previous course scoring info
	if (parent.courseExists) {
		parent.my_score = eval("parent.parent.frame_my_score" + parent.lessonID)[0];
		parent.attempted_points = eval("parent.parent.frame_my_attempted" + parent.lessonID)[0];
		parent.q_done_a[act_id] = eval("parent.parent.L" + parent.lessonID + "_q_done_a")[act_id];
	}

	// bail if the activity has no points,
	// or if only one attempt is allowed
	if (!parent.scoreQa[act_id] || (parent.q_done_a[act_id] && !parent.show_restart_a[act_id])) {
		return;
	}

	// get the activity's point value
	var act_value = eval("parent.a_value" + act_id);

	// if first attempt, set attempted_points, q_done_a, course info
	if (!parent.q_done_a[act_id]) {
		parent.attempted_q++;
		parent.attempted_points += act_value;
		parent.q_done_a[act_id] = true;
		if (parent.courseExists) {
			eval("parent.parent.L" + parent.lessonID + "_q_done_a")[act_id] = true;
			eval("parent.parent.frame_my_attempted" + parent.lessonID)[0] = parent.attempted_points;
		}
	}
	else { // remove previous score from total score
		if (parent.courseExists) {
			parent.score_a[act_id] = eval("parent.parent.L" + parent.lessonID + "_this_activity_score")[act_id];
		}
		parent.my_score -= parent.score_a[act_id];
	}

	// get current score
	parent.score_a[act_id] = 0;

	var act_percent = cookit.arguments[1];

	// set to one decimal place
	if (act_percent > 0) {
  	parent.score_a[act_id] = Math.round(((act_value * act_percent) / 100) * 10) / 10;
  }

	// add current score to total score
	parent.my_score += parent.score_a[act_id];

	// set to one decimal place
  if (parent.my_score > 0) {
  	parent.my_score = Math.round(parent.my_score * 10) / 10;
  }

	// set course values
	if (parent.courseExists) {
		eval("parent.parent.frame_my_score" + parent.lessonID)[0] = parent.my_score;
		eval("parent.parent.L" + parent.lessonID + "_this_activity_score")[act_id] = parent.score_a[act_id];
	}
	
	// update floating score window
	var scoreSpan = parent.main.document.getElementById("my_score_span");
	if (scoreSpan) {
		parent.main.stayTopLeft();
		parent.main.document.getElementById("floatingscore").style.visibility = "visible";
		scoreSpan.innerHTML = parent.qfLangFloat + "<br /><strong>" + parent.my_score + " / " + parent.total_points + "</strong>";
	}
	
	var mobileScoreSpan = parent.main.document.getElementById("my_mobile_score_span");
	if (mobileScoreSpan) {
		mobileScoreSpan.innerHTML = parent.qfLangFloat + " " + parent.my_score + "/" + parent.total_points;
	}

	//SCORM data
	if (parent.scorm) {
		var q_type = 7;
		var student_answer = "n/a";

		var correct = "no";
		if (act_percent == "100") {
			correct = "yes";
		}

		//alert("my_status = " + parent.my_status + "\ntotal_points = " + parent.total_points + "\nmy_score = " + parent.my_score + "\napplet_id = " + act_id + "\nq_type = " + q_type + "\nstudent_answer = " + student_answer + "\ncorrect = " + correct);
		parent.sendScorm(act_id, q_type, act_type, student_answer, correct, act_percent);
	}
}
