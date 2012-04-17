var currentLatLng;
var curLatDeg;
var curLngDeg;
var map;
var marker;
var mapOptions;

$(function() {

	// Get current position and set map options.
	navigator.geolocation.getCurrentPosition(function(geodata) {
		curLatDeg = geodata.coords.latitude;
		curLngDeg = geodata.coords.longitude;
			
		// Initialize map with current position.
		currentLatLng = new google.maps.LatLng(curLatDeg, CurLngDeg);
		mapOptions = {center: currentLatLng, zoom: 8, mapTypeId: google.maps.MapTypeId.ROADMAP};				
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
		marker = new google.maps.Marker({position: currentLatLng, map: map, title: "You are here"});
	});
				
	// Display pins with data from JSON database.
	var jsonLocationData = $.parseJSON($("#jsonLoc").html());			// Parse div-stored JSON string.
	$.each(jsonLocationData.locations, function() {						// Grab every location.
		console.log(this);												// Print iterator's location in server console (for debugging).
		currentLatLng = new google.maps.LatLng(this.lat, this.long);	// Create Google location object. 
		marker = new google.maps.Marker({position: currentLatLng, map: map, title: this.locName});
	});

});
