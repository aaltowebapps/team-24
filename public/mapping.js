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

    // Only center the map around the new pin if the new pin is outside the map's viewport
    // (to avoid confusing panning of the viewport whenever the user creates event by tapping the map).
    if (!map.getBounds().contains(markLocation.getPosition())) map.setCenter(loc);
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
		// Get current position, set map options, create map.
		var currentLatLng = new google.maps.LatLng(geodata.coords.latitude, geodata.coords.longitude);
		mapOptions = {center: currentLatLng, zoom: 14, mapTypeId: google.maps.MapTypeId.ROADMAP};
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
		
		google.maps.event.addListener(map, 'click', function(event) {
            placeMarker(event.latLng);
        });
	});
});