var Templates = {};
var events;



var Event = Backbone.Model.extend ({
	initialize: function() {
		// Set an event handler to remove the pin when its event is deleted.
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
		this.on('change:longitude change:latitude', function() {
			// When event coordinates change, the respective pin must be asked to move.
		});
	}
});



var Events = Backbone.Collection.extend ({
	initialize: function() {
	// When an event has been added to the collection, assign a new pin to it.
	},
	model: Event,
	url: '/events'
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
			console.log("---- The list item renderer is now running");
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
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
			console.log("++++ The listview renderer is now running");
			var thisEl = this.$el;
			thisEl.empty();
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
			console.log("**** The counter renderer is now running");
			$("#eventCounter1").html(this.template(this.collection.toJSON()));
			$("#eventCounter2").html(this.template(this.collection.toJSON()));
		}
	});
	
	// //View for creating a new entry
	// var NewView = Backbone.View.extend({
	// 	el: $("#newEvent"),
	// 	events: {
	// 		"click #eventEntry": "createNew"
	// 	},
	// 	initialize: function() {
	// 		this.title = this.$("#title");
	// 		this.date = this.$("#date");
	// 		this.duration = this.$("#duration");
	// 	},
	// 	createNew: function() {
	// 		this.$(".invalid").removeClass("invalid");
	// 		if (this.$(":invalid").length) {
	// 			this.$(":invalid").addClass("invalid");
	// 			return false;
	// 		}
	// 		this.collection.create({
	// 			title: this.title.val(),
	// 			date: this.date.val(),
	// 			duration: this.duration.val()
	// 			//email: localStorage.email,
	// 			//name: localStorage.name
	// 		}, {at: 0});
	// 		this.title.val("");
	// 		this.date.val("");
	// 		this.duration.val("");
	// 	}
	// });

	//Trigger an update of the tasks collection
	//$("#refresh").live('click',function () {
	//  events.fetch();
	//});

	//Instantiate the collection of articles
	events = new Events();

	//Instantiate the views
	var listView = new ListView({collection: events});
	var eventCounterView = new EventCounterView({collection: events});

	//Fetch the latest tasks and trigger an update of the views
	events.fetch();

});