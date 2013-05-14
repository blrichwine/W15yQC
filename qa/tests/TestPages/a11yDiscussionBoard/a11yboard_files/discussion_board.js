
/** THIS IS SO UGLY; I SHOULD BE DOING IT WITH jQUERY PLUGIN...
 ** OH WELL, I'LL GET AROUND TO CONVERTING IT SOMEDAY :-/
 **/
var doSelectOnchange = new Array();
var selectCallbackFn = new Array();
selectCallbackFn['discussionBoardNavPaneForumsListing'] = function (elemID) {
	var selectedForumValue = $("#" + elemID).val();
	var selectedForumName = $("#" + elemID).find("option:selected").text();
	//alert("Selected forum: (" + selectedForumValue + ")" + selectedForumName);
	
	//Load appropriate threads for selected forum (OLD)
	/*if(threadsByForum[selectedForumValue]) {
		//alert("Found it!");
		$("#discussionBoardNavPaneThreadListing").html(threadsByForum[selectedForumValue]);
		treeviewApp = new treeview('discussionBoardNavPaneThreadListing');
		drawAttention("discussionBoardNavPaneThreads",0,"");
	}*/
	
	//Load appropriate threads for selected forum (AJAX)
	//if(threadsByForum[selectedForumValue]) {
	
	var threadIDSearchPrefix = "discussionBoardNavPaneThreadListing-Forum";
	var threadRegionContainerID = "discussionBoardNavPaneThreads";
	var threadRegionNotificationsID = "discussionBoardNavPaneThreadsNotifications";
	var threadRegionThreadListingID = "discussionBoardNavPaneThreadListing";
	
	//Use the forum id from the clicked item in the select list to get the forum id
	var forumID = $("#" + elemID).val().replace(/^[^0-9]*/,threadIDSearchPrefix);
	
	var forumName = $("#" + elemID).find('option:selected').text();
	
	if(forumID) {
		//alert("Found it! " + forumID);
		$('#' + threadRegionThreadListingID).load('ajax/discussion_board-threads.html #'+forumID+' > LI', function(response, status, xhr) {
			if(status == "error") {
				$("#" + threadRegionNotificationsID).html("There was an error loading the messages for the forum:<br /><strong>" + forumName + "</strong>").attr("tabindex",0).focus();
			}
			else if( status == "success" ) {
				$("#" + threadRegionThreadListingID).focus();
				treeviewApp = new treeview(threadRegionThreadListingID);
			}
		});
		//$("#discussionBoardNavPaneThreadListing").html(threadsByForum[selectedForumValue]);
		
		drawAttention(threadRegionContainerID,0,"");
	}
}
selectCallbackFn['discussionBoardMessagePaneTools-ThreadMode'] = function (elemID) {
	//alert("YAY!" + elemID);
	var selectedForumValue = $("#" + elemID).val();
	var selectedForumName = $("#" + elemID).find("option:selected").text();
	//alert("Selected forum: (" + selectedForumValue + ")" + selectedForumName);
	
	
	alert("I don't currently do anything, but I should change the display mode for the threads below me...");
}

$(function() {
	$('#discussionBoardNavPaneForums').submit(function() {
		var selectedForum = $("#discussionBoardNavPaneForumsListing").val();
		alert('I would load the threads for this forum: ' + selectedForum);
		
		//Load appropriate threads for selected forum
		if(threadsByForum[selectedForum])
			alert("Found it!");
		
		return false;
	});
		
		//Override default onChange handling for SELECT lists to make it more accessible
		$('SELECT').keydown(function(e){
			//console.log(e.currentTarget.id);
			if(e.keyCode != 13 && e.keyCode != 32) { //Enter and Space keys
				doSelectOnchange[e.currentTarget.id] = false;
			}
			else {
				doSelectOnchange[e.currentTarget.id] = true;
				$(this).change();
			}
		});
		$('SELECT').change(function(e){
			if(doSelectOnchange[e.currentTarget.id] == undefined)
				doSelectOnchange[e.currentTarget.id] = true;
			
			//alert("(change) doSelectOnchange[" + e.currentTarget.id + "]: " + doSelectOnchange[e.currentTarget.id]);
			if(doSelectOnchange[e.currentTarget.id]) { //Enter or Space key
				if(selectCallbackFn[e.currentTarget.id]) {
					//alert("I should trigger the following callback function: selectCallbackFn[" + e.currentTarget.id + "]()");
					selectCallbackFn[e.currentTarget.id](e.currentTarget.id);
				}
			}
			doSelectOnchange[e.currentTarget.id] = true;
		});
});

// Modified from https://dl.dropbox.com/u/573324/presentations/commonsamples/stocks/index.html
function drawAttention(strPanel, iColour, origColor)
{
	var objPanel = document.getElementById(strPanel);

	if (objPanel)
	{
		if(origColor == undefined) {
			origColor = objPanel.style.backgroundColor;
		}
		
		objPanel.style.backgroundColor = 'rgb(255, 255, ' + iColour + ')';
		objPanel.style.opacity = 255/iColour;

		if (iColour < 256)
		{
			iColour += 32;
			setTimeout('drawAttention("' + strPanel + '", ' + iColour + ',"' + origColor + '")', 75);
		}
		else
		{
			if(origColor === "")
				objPanel.style.backgroundColor = origColor;
			else
				objPanel.style.backgroundColor = 'transparent';
		}
	}
}



function updateMessageRegion(clickedItem) {
	//alert("Enter key pressed! " + clickedItem.attr('id'));
	
	var messageIDSearchPrefix = "discussionBoardMessagePaneContents";
	var messageRegionContainerID = "discussionBoardMessagePaneContents";
	var messageRegionNotificationsID = "discussionBoardMessagePaneContentsNotifications";
	var messageRegionThreadListingID = "discussionBoardMessagePaneContentsThreadListing";
	
	//Use the thread id from the clicked item in the tree widget to get the message id
	var threadID = clickedItem.attr('id').replace(/^[^-]*/,messageIDSearchPrefix);
	
	var threadName = clickedItem.find('span:first').text();
	
	//if(threadName) {
	if(threadID) {
		$("#" + messageRegionNotificationsID).empty();
		//alert(threadID);
		drawAttention(messageRegionContainerID,0,"#FFF");
		//$("#" + messageRegionContainerID).html("<p>Soon I will update the message region for the following thread: " + threadName + "</p><p>I will add this thread (by its id): " + threadID + "</p>");
		$('#' + messageRegionThreadListingID).load('ajax/discussion_board-messages.html #'+threadID, function(response, status, xhr) {
			if(status == "error") {
				$("#" + messageRegionNotificationsID).html("There was an error loading the messages for the thread: " + threadName).attr("tabindex",0).focus();
			}
			else if( status == "success" ) {
				
				//Move focus to the message thread listing in the message region
				$("#" + messageRegionThreadListingID).focus();
				
				//Make all the action sections menubars
				$(".postActions > UL").menubar({
					//autoExpand: true,
					menuIcon: true,
					buttons: true,
					position: {
						within: $("#nonExistentID").add(window).first()
					},
					select: function() { alert("I would perform an action on this thread"); return(false); }
				});
			}
		});
	}
}

//Not currently used
function updateMessageRegionFromTopThread(clickedItem) {
	//alert("Enter key pressed! " + clickedItem.attr('id'));
	
	var messageIDSearchPrefix = "discussionBoardMessagePaneContents";
	var messageRegionContainerID = "discussionBoardMessagePaneContents";
	var messageRegionNotificationsID = "discussionBoardMessagePaneContentsNotifications";
	var messageRegionThreadListingID = "discussionBoardMessagePaneContentsThreadListing";
	
	//Pattern is {thread treeview id}-{forum#}-{thread#}, possibly followed by some additional nesting; essentially just need to get forum and thread numbers to load message pane
	var threadID = clickedItem.attr('id').replace(/^[^-]*-([^-]*)-([^-]*).*$/,messageIDSearchPrefix+"-\$1-\$2");
	
	//Use the thread id from the clicked item in the tree widget to get the message id
	var messageID = clickedItem.attr('id').replace(/^[^-]*/,messageIDSearchPrefix);
	
	//alert("threadID\n"+threadID);
	
	var threadName = clickedItem.find('span:first').text();
	
	//if(threadName) {
	if(threadID) {
		$("#" + messageRegionNotificationsID).empty();
		//alert(threadID);
		drawAttention(messageRegionContainerID,0,"#FFF");
		//$("#" + messageRegionContainerID).html("<p>Soon I will update the message region for the following thread: " + threadName + "</p><p>I will add this thread (by its id): " + threadID + "</p>");
		$('#' + messageRegionThreadListingID).load('ajax/discussion_board-messages.html #'+threadID, function(response, status, xhr) {
			if(status == "error") {
				$("#" + messageRegionNotificationsID).html("There was an error loading the messages for the thread: " + threadName).attr("tabindex",0).focus();
			}
			else if( status == "success" ) {
				//$("#" + messageRegionThreadListingID).focus();
				$("#" + messageID).attr("tabindex",-1).focus();
			}
		});
	}
}


function updateBreadcrumbs() {
	//Update current forum selection breadcrumb
	// Set content
	// Show/hide
	
	//Update current thread selection breadcrumb
	// Set content
	// Show/hide
}