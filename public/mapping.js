var map;

function placeMarker (loc) {
    var latitude;
    var longitude;
    var markLocation = new google.maps.Marker({
            position: loc,
            draggable: true,
            map: map
        });
    map.setCenter(loc);
    latitude = loc.lat();  // to be saved in the new event!
    longitude = loc.lng();
}

$(function() {
	var marker;
	var mapOptions;
	
	navigator.geolocation.getCurrentPosition(function(geodata) {
		// Get current position and set map options.
		var currentLatLng = new google.maps.LatLng(geodata.coords.latitude, geodata.coords.longitude);
		mapOptions = {center: currentLatLng, zoom: 14, mapTypeId: google.maps.MapTypeId.ROADMAP};				

		// Initialize map with current position.
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
		marker = new google.maps.Marker({position: currentLatLng, map: map, title: "You are here"});
	
		// Display pins with data from JSON database.
		var jsonLocationData = $.parseJSON($("#jsonLoc").html());			// Parse div-stored JSON string.

		// Before event pins are added to the map, ensure that it has been fully loaded.
		google.maps.event.addListenerOnce(map, 'idle', function() {
			for (var i = 0; i < jsonLocationData.locations.length; i++) {
				var currentLoc = jsonLocationData.locations[i];
				currentLatLng = new google.maps.LatLng(currentLoc.lat, currentLoc.lng);		// Create Google location object. 
				marker = new google.maps.Marker({position: currentLatLng, map: map, title: currentLoc.locName});
				console.log(jsonLocationData);
			}
        });         
		
		google.maps.event.addListener(map, 'click', function(event){
            placeMarker(event.latLng);		
		});			
	});
});