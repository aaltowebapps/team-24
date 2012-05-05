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
    
    // Add event listener to pin to display bubble on click.
    google.maps.event.addListener(markLocation, 'click', function() {
		bubble.open(map, markLocation);
    });

    map.setCenter(loc);
    latitude = loc.lat();  // to be saved in the new event!
    longitude = loc.lng();
}

$(function() {
	var marker;
	var mapOptions;
	
	// Create the info window (hereby referred to as 'bubble').
	bubble = new google.maps.InfoWindow({
		maxWidth: '40px',
		content: '<div contentEditable = "true">Placeholder Text</div>'
    });

	navigator.geolocation.getCurrentPosition(function(geodata) {
		// Get current position and set map options.
		var currentLatLng = new google.maps.LatLng(geodata.coords.latitude, geodata.coords.longitude);
		mapOptions = {center: currentLatLng, zoom: 14, mapTypeId: google.maps.MapTypeId.ROADMAP};

		// Initialize map with current position.
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
		placeMarker(currentLatLng);
	
		// Display pins with data from JSON database.
		var jsonLocationData = $.parseJSON($("#jsonLoc").html());			// Parse div-stored JSON string.

		// Before event pins are added to the map, ensure that it has been fully loaded.
		google.maps.event.addListenerOnce(map, 'idle', function() {
			for (var i = 0; i < jsonLocationData.locations.length; i++) {
				var currentLoc = jsonLocationData.locations[i];
				currentLatLng = new google.maps.LatLng(currentLoc.lat, currentLoc.lng);		// Create Google location object.
				placeMarker(currentLatLng);
				console.log(jsonLocationData);
			}
        });
		
		google.maps.event.addListener(map, 'click', function(event) {
            placeMarker(event.latLng);
        });
	});
});