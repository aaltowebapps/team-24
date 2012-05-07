$(document).delegate("#openEditEventDialog", "click", function() {
	$('<div>').simpledialog2({
		mode: 'blank',
		headerText: 'Event details',
		headerClose: true,
		blankContent : "<h1>Event details</h1></div><div class='content' data-role='content'><form action='/newEvent' method='post'></form><input id='title' name='title' placeholder='Event description' type='text' /><br /><div data-role='fieldcontain'><label for='duration'></label><input id='duration' max='300' min='5' type='range' value='5' /></div><br /><input id='title' name='latitude' placeholder='Latitude' type='text' /><br /><button id='postEntry' type='submit'>Add</button><button id='deleteEntry' type='delete'>Delete</button>"
	});
});
