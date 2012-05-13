var map;
var bubble;

function placeMarker(loc) {
    // Create pin.
    var latitude;
    var longitude;
    var markLocation = new google.maps.Marker({
        position: loc,
        draggable: true,
        map: map
    });
    
    // Attach event listener to open modal dialog upon clicking on pin.
    google.maps.event.addListener(markLocation, 'click', function() {
		displayDialog();		// This is declared in dialog.js
    });

    // Only center the map around the new pin if the new pin is outside the map's viewport
    // (to avoid confusing panning of the viewport whenever the user creates event by tapping the map).
    if (!map.getBounds().contains(markLocation.getPosition())) map.setCenter(loc);
    latitude = loc.lat();  // to be saved in the new event!
    longitude = loc.lng();
}

$(function() {
	var marker;
	var mapOptions;
	
	// Hide address bar and adjust map div dimensions according to the device at hand.
	// This needs to be done after every device rotation (i.e. window size change).
	function resetMapDivDimensions() {
		window.scrollTo(0, 1);
		var mapViewportHeight = window.innerHeight - $("#header").height();
		$("#map").height(mapViewportHeight);
	}

	navigator.geolocation.getCurrentPosition(function(geodata) {
		// Get current position, set map options.
		var currentLatLng = new google.maps.LatLng(geodata.coords.latitude, geodata.coords.longitude);
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
			placeMarker(currentLatLng);
			// Pin locations stored in database.
			for (var i = 0; i < jsonLocationData.locations.length; i++) {
				var currentLoc = jsonLocationData.locations[i];
				currentLatLng = new google.maps.LatLng(currentLoc.lat, currentLoc.lng);
				placeMarker(currentLatLng);
				console.log(jsonLocationData);
			}
        });
		
		// Attach event handler for map to create a pin upon tapping.
		google.maps.event.addListener(map, 'click', function(event) {
            placeMarker(event.latLng);
        });

		// On the mobile, window is resized when the device is rotated. In those cases, we resize the div accordingly and trigger a resize event for the map.
		$(window).resize(function (){
			resetMapDivDimensions();		// Resize the div in which the map is locate.
			google.maps.event.trigger(map, 'resize');		// Resize the map to fully occupy its div.
		});
	});
});