$(function() {
	var map;
	var marker;
	var mapOptions;
	navigator.geolocation.getCurrentPosition(function(geodata) {
		// Get current position and set map options.
		var currentLatLng = new google.maps.LatLng(geodata.coords.latitude, geodata.coords.longitude);
		mapOptions = {center: currentLatLng, zoom: 8, mapTypeId: google.maps.MapTypeId.ROADMAP};				

		// Initialize map with current position.
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
		marker = new google.maps.Marker({position: currentLatLng, map: map, title: "You are here"});
	
		// Display pins with data from JSON database.
		var jsonLocationData = $.parseJSON($("#jsonLoc").html());			// Parse div-stored JSON string.
		
		for (var i = 0; i < jsonLocationData.locations.length; i++) {
			var currentLoc = jsonLocationData.locations[i];
			console.log(currentLoc);														// Print iterator's current location in server console (for debugging).
			currentLatLng = new google.maps.LatLng(currentLoc.lat, currentLoc.long);		// Create Google location object. 
			marker = new google.maps.Marker({position: currentLatLng, map: map, title: currentLoc.locName});
		}		
			
	
	});
});