// Note that displayDialog and isDialogOpen, as declared below, are global variables. It is bad practice to have a global variable in this file we're in a hurry.



// By default, the dialog is closed.
isDialogOpen = false;



// The following function opens a modal dialog using the SimpleDialog2 jQuery plugin.
displayDialog = function(model_id) {

	$('<div>').simpledialog2({

		mode: 'blank',

		headerText: 'Event Details',

		headerClose: false,

		blankContent:	"<div class='content' style='margin-left=10px;' data-role='content'>"+
							"<form action='/events' method='put'>"+
								"<label for='title' style='margin-left:7px; padding-top: 10px;'>Name / title:</label>"+
								"<input id='title' style='max-width:260px;margin-left: 5px;width: 255px' name='title' data-mini='true' type='text' autofocus = 'autofocus' required='required'/>"+
								"<table syle='padding-left: 2px;'>"+
									"<tr style='margin-left: 5px; width: 120px'>"+
										"<td style='padding-left: 5px;'>Starting date:</td>"+
										"<td style='padding-left: 7px;'>and time:</td>"+
									"</tr>"+
									"<tr>"+
										"<td>"+
											"<input id='startingDate' style='margin-left: 3px; width: 120px' name='startingDate' required='required' type='date'/>"+
										"</td>"+
										"<td>"+
											"<input id='startingTime' style='margin-left: 5px; width: 100px' name='startingTime' type='time' required='required'/>"+
										"</td>"+
									"</tr>"+
								"</table>"+
								"<label for='duration' style='margin-left: 7px;padding-top: 10px;'>Duration: </label>"+
								"<input id='duration' style='margin-left: 5px' max='300' min='1' name='duration' type='range' data-mini='true' value='5' />"+
								"<button rel='close' id='postEntry' type='submit' data-mini='true'>Confirm</button>"+
								"<button rel='close' data-mini='true' data-theme='e' href='#' id='deleteEntry'>Delete</a>"+
							"</form>"+
						"</div>",

		callbackOpen: function() {
			
			// Block scrolling while dialog is open.
			isDialogOpen = true;
			
			// First off, find in the collection the model that is being updated/viewed/deleted,
			// based on the id that is passed as argument to displayDialog().
			for (var i = 0; i < events.models.length; i++) {
				
				if (model_id == events.at(i).get('id')) break;

			}

			console.log('date, time, title, duration');
			console.log(events.at(i).get('date'), events.at(i).get('time'), events.at(i).get('title'), events.at(i).get('duration'));

			// Populate the form with the visible data of the model.
			$('#startingDate').val(events.at(i).get('date'));
			$('#startingTime').val(events.at(i).get('time'));
			$('#title').val(events.at(i).get('title'));
			$('#duration').val(events.at(i).get('duration'));
			// $('#page').page();
			$('#duration').slider('refresh');

			// Hijack the submit ('Confirm') button so that data is manipulated by Backbone instead of the default HTML form mechanism.
			$(postEntry).on('click', function(event) {
				
				// Override default click event for submit button.
				event.preventDefault();

				// Request that Backbone update model information.
				events.at(i).save({
					'longitude'	: events.at(i).get('longitude'),
					'latitude'	: events.at(i).get('latitude'),
					'title'		: $('#title').val(),
					'id'		: events.at(i).get('id'),
					'date'		: $('#startingDate').val(),
					'time'		: $('#startingTime').val(),
					'duration'	: $('#duration').val()
				});

				// The dialog will close (rel='close'). Announce it closed so that scrolling may be reactivated.
				isDialogOpen = false;
			});

			// Hijack the delete button so that data is manipulated by Backbone instead of the default HTML form mechanism.
			$(deleteEntry).on('click', function(event) {
				
				// Override default click event for the delete button.
				event.preventDefault();

				// Request that Backbone update model information.
				events.at(i).destroy();

				// The dialog will close (rel='close'). Announce it closed so that scrolling may be reactivated.
				isDialogOpen = false;
			});
		},

		callbackClose: function() {
			
			// Announce to the event touchmove handler that the dialog is closed, so that scrolling can be reenabled.
			isDialogOpen = false;
			
		}

	});

	// Announce to the event touchmove handler that the dialog is open so that scrolling is disabled.
	isDialogOpen = true;

};



// Attach a click event listener to the "List view" button of the home screen.
$(document).on("click", "#openEditEventDialog", function() {
	
	displayDialog();

});



// Create touchmove handler to disable scrolling when the dialog is open.
$(function() {

	$('body').on('touchmove', function(event){

		if (isDialogOpen) event.preventDefault();

	});

});
