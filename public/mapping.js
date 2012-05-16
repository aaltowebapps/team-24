var map;
var pins = [];			// Associative area contains all pins.
var currentLatLng;		// Google API LatLng object for the current position of the device.



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
				map: map});
    } else {
			markLocation = new google.maps.Marker({
				position: loc,
				draggable: false,	// Current position not draggable.
				map: map,
				zIndex: 0,			// Current position should not obstruct view to event pins.
				icon: "arrow.png"});
	}

	if (!isCurrentPos) {
		// Create (add & save) a model in the collection.
		var i = events.create({
			'title' : 'My New Event',
			'duration' : 60,
			'longitude' : loc.lng(),
			'latitude' : loc.lat()});
		// Wait until the server's response to this POST request, which includes the ID of the new event,
		// is received by the browser.
		i.on('change', function() {
			// Then create a hash to associate this ID with the newly created pin,
			// and add append the hash to the pins array.
			pins.push({'id':i['id'], 'pin':markLocation});
		});
		console.log('pins: ', pins);
	}

    // Attach event listener to open modal dialog upon clicking on pin.
    // But only do that for new events, not for the pin representing the current location.
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
	var currentPosMarker;
	var mapOptions;
		
	// Hide address bar and adjust map div dimensions according to the device at hand.
	// This needs to be done after every device rotation (i.e. window size change).
	function resetMapDivDimensions() {
		window.scrollTo(0, 1);
		var mapViewportHeight = window.innerHeight - $("#header").height();
		$("#map").height(mapViewportHeight);
	}

	// Get current position from geolocation API on app startup, and initialize mapping functions.
	navigator.geolocation.getCurrentPosition(function(geodata) {
		// Create current position object, set map options.
		currentLatLng = new google.maps.LatLng(geodata.coords.latitude, geodata.coords.longitude);
		mapOptions = {
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
	
		// Parse JSON previously stored in invisible div.
		var jsonLocationData = $.parseJSON($("#jsonLoc").html());

		// Before event pins are added to the map, ensure that it has been fully loaded.
		google.maps.event.addListenerOnce(map, 'idle', function() {
			// Pin current location onto map.
			currentPosMarker = placeMarker(currentLatLng, true);
			// Pin locations stored in database.
			for (var i = 0; i < jsonLocationData.locations.length; i++) {
				var tempLoc = jsonLocationData.locations[i];
				var tempLatLng = new google.maps.LatLng(tempLoc.lat, tempLoc.lng);
				placeMarker(tempLatLng);
			}
        });
		
		// Handler to create pins on tap.
		google.maps.event.addListener(map, 'click', function(event) {
            placeMarker(event.latLng);
            displayDialog();
        });

		// On the mobile, window is resized when the device is rotated.
		// In those cases, we resize the div accordingly and trigger a resize event for the map.
		$(window).resize(function (){
			resetMapDivDimensions();		// Resize the div in which the map is locate.
			google.maps.event.trigger(map, 'resize');		// Resize the map to fully occupy its div.
		});
	});
	
	// Refresh the current location coordinates and pin every 30 sec at most.
	navigator.geolocation.watchPosition(
		function(geodata) {
			currentLatLng = new google.maps.LatLng(geodata.coords.latitude, geodata.coords.longitude);
			currentPosMarker.setPosition(currentLatLng);
		},
		function() {},
		{enableHighAccuracy:true, maximumAge:30000, timeout:5000}
	);
});