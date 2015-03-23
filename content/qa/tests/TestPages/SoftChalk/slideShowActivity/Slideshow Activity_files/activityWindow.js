/**
 *  ==================================================
 *  SoftChalk LessonBuilder
 *  Copyright 2003-2006 SoftChalk LLC
 *  All Rights Reserved.
 *
 *  http://www.softchalk.com
 *  ==================================================
 *	File date: May 1, 2006
 */

function answersWin(myFile, myID, winSpecs) {
	answersWindow = window.open(myFile, myID, winSpecs);
}

function activity_win_close() {
	window.opener = top;
	window.close();
}
