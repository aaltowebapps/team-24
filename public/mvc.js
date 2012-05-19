var Templates = {};
var events;



var Event = Backbone.Model.extend ({

	initialize: function() {

		// When an event has been added to the collection, assign a new pin to it.
		this.on('add', function(e) {
			
			// Create pin.
			var p = placeMarker(new google.maps.LatLng(this.get('latitude'), this.get('longitude')));
			
			// Associate the model ID with the pin ID...
			p['id'] = this.id;
			
			//... and append the pin to the pins array.
			pins.push(p);
		});

		// The pin must excuse itself when its event is deleted.
		this.on('destroy', function() {

			// We find the pin whose id matches that of the event.
			for (var i = 0; i <= pins.length - 1; i++) {
			
				if (pins[i].id == this.id) {
					// Then we remove the pin from the map...
					pins[i].setMap(null);
					// ... and we remove it from the pins array, as well.
					pins.splice(i,1);
				}
			}
		});

		// When event coordinates change, the respective pin must be asked to move accordingly.
		this.on('change:longitude change:latitude', function() {

			// We find the pin whose id matches that of the event.
			for (var i = 0; i <= pins.length - 1; i++) {
				
				if (pins[i].id == this.id) {

					// Then we move the pin accordingly.
					var newPosition = new google.maps.LatLng(this.get('latitude'), this.get('longitude'));
					pins[i].setPosition(newPosition);

				}
			}
		});
	}
});



var Events = Backbone.Collection.extend ({

	model: Event,
	
	url: '/events',

	initialize: function() {

		// When the app is launched and data fetched, populated the client with preexisting pins.
		this.on('reset', function() {
			
			// First efface all pins.
			for (var i = 0; i < pins.length; i++) {
				pins[i].setMap(null);
			}
			pins.length = 0;

			// Then replace the pins based on fresh data from the models.
			for (var j = 0; j <= this.models.length - 1; j++) {
				
				// Create pin.
				var p = placeMarker(new google.maps.LatLng(this.at(j).get('latitude'), this.at(j).get('longitude')));
				
				// Associate the model ID with the pin ID...
				p['id'] = this.at(j).id;
				
				//... and append the pin to the pins array.
				pins.push(p);

			}
		});
	}
});


		
$(function() {

	// Compile the templates using Handlebars.js and store them in the Templates[] global variable.
	$('script[type="text/x-handlebars-template"]').each(function () {

		Templates[this.id] = Handlebars.compile($(this).html());
	});

	//View for rendering one event in the list view.
	var EventView = Backbone.View.extend ({
		
		tagName: "li",
		
		initialize: function() {

			this.model.on('change', this.render, this);
			this.template = Templates.eventListTemplate;
		},
		
		render: function() {

			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},

		events: {

			'click' : 'focusOnPin'
		},

		focusOnPin: function() {

			// Find the id of the model.
			var id = this.model.get('id');
			console.log("You just clicked on event with id# ", id);

			var pindex;

			// Find the corresponding marker.
			for (pindex = 0; pindex < pins.length; pindex++) {
				if (pins[pindex].id == id) break;
			}
			console.log('pindex = ', pindex);
			// Make transition to map page.
			$.mobile.changePage($("#main"));

			// When map is ready, center map to that pin.
			map.setCenter(pins[pindex].getPosition());

			// Indicate the event a little better.
			// Pending... (e.g. a circle narrowing down on the pin, or a flashing pin).
			map.setZoom(17);
		}
	});

	//View for rendering the list of events.
	var ListView = Backbone.View.extend ({
		
		el: $("#eventList"),
		
		events: {
		},
		
		initialize: function() {

			this.collection.on('reset', this.render, this);
			this.collection.on('all', this.render, this);
		},
		
		render: function() {
			
			var thisEl = this.$el;
			thisEl.empty();

			// _sortBy(events, 'duration');		// Sort events in this list by remaining duration.
			this.collection.each(function(item) {

				var eventView = new EventView({model: item});
				thisEl.append(eventView.render().el);
			});
			
			if ($("#eventList").hasClass('ui-listview')) {		// Without this, this ver of jQuery throws an exception here. Details available on request :-)
				$("#eventList").listview('refresh');		// jQuery listview not refreshed automatically when its html is changed.
			}
	
			return this;
		}
	});

	// View for updating the event counter in the header.
	var EventCounterView = Backbone.View.extend({
		
		events: {
		},
		
		initialize: function() {
			
			this.template = Templates.eventCounterTemplate;
			this.collection.on('reset', this.render, this);
			this.collection.on('all', this.render, this);
		},
		
		render: function() {

			$("#eventCounter1").html(this.template(this.collection.toJSON()));
			$("#eventCounter2").html(this.template(this.collection.toJSON()));
		}
	
	});

	// Instantiation of views.
	events = new Events();	// Backbone.js Collection of events.

	var listView = new ListView({collection: events});	// Backbone.js views.

	var eventCounterView = new EventCounterView({collection: events});

});