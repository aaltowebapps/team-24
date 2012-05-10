$(document).delegate("#openEditEventDialog", "click", function() {
	$('<div>').simpledialog2({
		mode: 'blank',
		headerText: 'Event details',
		headerClose: true,
		blankContent : "<div class='content' style='margin-left=10px;' data-role='content'><form action='/newEvent' method='post'></form><input id='title' style='max-width:260px;margin-left: 5px;width: 255px' name='title' placeholder='Event description' data-mini='true' type='text' /><label for='duration' style='margin-left:7px;padding-top:10px;'>Minutes to expiration: </label><input id='duration' style='margin-left: 5px;' max='300' min='1' type='range' data-mini='true' value='5' /><button id='postEntry' type='submit' data-mini='true'>Add</button><button id='deleteEntry' type='delete' data-theme='e' data-mini='true'>Delete</button></div>"
	});
});
