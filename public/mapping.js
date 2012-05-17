var map;				// The map.
var pins = [];			// Associative array containing all pins.
var currentLatLng;		// Google LatLng object for the current position.


// The following function adds a pin to the map at the location loc.
function placeMarker(loc, isCurrentPos) {
    // The isCurrentPos argument is a boolean value indicating if the new pin represents the current position.
    // We want this argument to be optional, for the sake of simplicity.
    if (typeof isCurrentPos == 'undefined') isCurrentPos = false;

    // Create pin object on map (and store it in markLocation).
    // Use default icon for new events and custom icon for the current location.
    var markLocation;
    if (isCurrentPos === false) {
			markLocation = new google.maps.Marker({
				position: loc,
				draggable: true,
				map: map
			});
    } else {
			markLocation = new google.maps.Marker({
				position: loc,
				draggable: false,	// Current position not draggable.
				map: map,
				zIndex: 0,			// Current position should not obstruct view to event pins.
				icon: "arrow.png"
			});
	}

	// Handler for updating the coordinates of the event on dragging the pin.
	if (!isCurrentPos) {
		google.maps.event.addListener(markLocation, 'dragend', function(event) {
			console.log("Pin dragging handler fired! Event coordinates updated.");
			// Find the model whose id matches the id of the pin.
			for (var i = 0; i <= events.models.length - 1; i++) {
				if (markLocation.id == events.at(i).get('id')) {
					// Update the model with the new coordinates
					events.at(i).set({'longitude':markLocation.getPosition().lng(), 'latitude':markLocation.getPosition().lat()});
					events.at(i).save();
				}
			}
		});
	}

    // Attach event listener to open modal dialog upon clicking on pin.
    // But do this for new event pins, not for the pin representing the current location.
    if (isCurrentPos === false) {
			google.maps.event.addListener(markLocation, 'click', function() {
				displayDialog();		// This is declared in dialog.js
			});
    }

    // Only center the map to the new pin if the pin is outside the map's current viewport.
    // (this is to done avoid a confusing "panning" of the viewport whenever the user taps on the map to create an event).
    if (!map.getBounds().contains(markLocation.getPosition())) map.setCenter(loc);

	// Return the created pin.
    return markLocation;
}



// Bind the "Locate Me" button.
$(function() {
	$("#locateMe").on("click", function() {
		map.setCenter(currentLatLng);
	});
});



$(function() {
	// Hide address bar and adjust map div dimensions according to the device at hand.
	// This needs to be done after every device rotation (i.e. window size change).
	function resetMapDivDimensions() {
		window.scrollTo(0, 1);
		var mapViewportHeight = window.innerHeight - $("#header").height();
		$("#map").height(mapViewportHeight);
	}

	// Initialize map and mapping functions.
	navigator.geolocation.getCurrentPosition(function(geodata) {
		// Create current position object, set map options.
		currentLatLng = new google.maps.LatLng(geodata.coords.latitude, geodata.coords.longitude);
		var mapOptions = {
			center: currentLatLng,
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoomControl: false,
			streetViewControl: false
		};
		
		// Create appropriately sized div for the map.
		resetMapDivDimensions();
	
		// Create map.
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
		
		// Before proceeding with mapping functions, ensure the map has been fully loaded.
		google.maps.event.addListenerOnce(map, 'idle', function() {
			// Pin current location onto map.
			var currentPosMarker = placeMarker(currentLatLng, true);
			// Refresh the current location every 30 sec at most.
			navigator.geolocation.watchPosition(
				function(geodata) {
					currentLatLng = new google.maps.LatLng(geodata.coords.latitude, geodata.coords.longitude);
					currentPosMarker.setPosition(currentLatLng);
				},
				function() {},
				{enableHighAccuracy:true, maximumAge:30000, timeout:5000}
			);
			// Create an event by tapping on the map.
			google.maps.event.addListener(map, 'click', function(event) {
				// Create (add & save) a model in the collection (sends a POST request to server).
				var i = events.create({
					'title'		: 'My New Event',
					'duration'	: 60,
					'longitude' : event.latLng.lng(),
					'latitude'	: event.latLng.lat()
				});
				displayDialog();
			});
			//Fetch the latest tasks and trigger an update of the views
			events.fetch();
        });
		
		// On the mobile, the window is resized when the device is rotated.
		// In those cases, we resize the div accordingly and trigger a resize event for the map.
		$(window).resize(function (){
			resetMapDivDimensions();						// Resize the div in which the map is locate.
			google.maps.event.trigger(map, 'resize');		// Resize the map to fully occupy its div.
		});
	});
});