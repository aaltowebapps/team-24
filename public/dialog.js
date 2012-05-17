// Note that displayDialog and isDialogOpen, as declared below, are global variables. It is bad practice to have a global variable in this file we're in a hurry.



// By default, the dialog is closed.
isDialogOpen = false;



// The following function opens a modal dialog using the SimpleDialog2 jQuery plugin.
displayDialog = function() {
  $('<div>').simpledialog2({
    mode: 'blank',
    headerText: 'Event details',
    headerClose: true,
    blankContent: "<div class='content' style='margin-left=10px;' data-role='content'>"+
                    "<form action='/newEvent' method='post'>"+
                      "<label for='title' style='margin-left:7px; padding-top: 10px;'>Name / title:</label>"+
                        "<input id='title' style='max-width:260px;margin-left: 5px;width: 255px' name='title' data-mini='true' type='text' autofocus = 'autofocus' required='required'/>"+
                    "<table>"+
                          "<tr style='margin-left: 5px; width: 120px'>"+
                              "<td>Starting date:</td>"+
                              "<td>and time:</td>"+
                          "</tr>"+
                          "<tr>"+
                              "<td>"+
                                  "<input id='startingDate' style='margin-left: 5px; width: 120px' name='startingDate' type='date'/>"+
                              "</td>"+
                              "<td>"+
                                  "<input id='startingTime' style='margin-left: 5px; width: 100px' name='startingTime' type='time'/>"+
                              "</td>"+
                          "</tr>"+
                      "</table>"+
                      "<label for='duration' style='margin-left: 7px;padding-top: 10px;'>Duration: </label>"+
                        "<input id='duration' style='margin-left: 5px' max='300' min='1' type='range' data-mini='true' value='5' />"+
                      "<button id='postEntry' type='submit' data-mini='true'>Add</button>"+
                      "<button id='deleteEntry' type='button' data-theme='e' data-mini='true'>Delete</button></form></div>",
    callbackOpen: function() {
        $( "#startingDate" ).datepicker();
    },
    callbackOpenArgs: function() {

    },
    callbackCloseArgs: function() {
    
    },
    callbackClose: function() {
      // Announce to the event touchmove handler that the dialog is closed, so that scrolling can be reenabled.
      isDialogOpen = false;
    }
  });
  // Announce to the event touchmove handler that the dialog is open so that scrolling is disabled.
  isDialogOpen = true;
};



// Customize the error message of the jQuery form validator.
$(function () {
  $.mobile.pageLoadErrorMessage = 'Event title missing!';
});



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
