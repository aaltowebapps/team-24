var Templates = {};
var events;



var Event = Backbone.Model.extend ({
});



var Events = Backbone.Collection.extend ({
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
			this.model.bind('change', this.render, this);
			this.template = Templates.eventListTemplate;
		},
		render: function() {
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
			var el = this.$el;
			el.empty();
			this.collection.each(function(item) {
				var eventView = new EventView({model: item});
				el.append(eventView.render().el);	// Note that el refers to different elements in each case.
			});
			this.$el.listview('refresh');
			return this;
		}
	});

	// View for updating the event counter in the header.
	var EventCounterView = Backbone.View.extend({
		el: $("#eventCounter"),
		events: {
		},
		initialize: function() {
			this.template = Templates.eventCounterTemplate;
			this.collection.on('reset', this.render, this);
			this.collection.on('all', this.render, this);
		},
		render: function() {
			console.log("**** The counter renderer is now running");
			$(this.el).html(this.template(this.collection.toJSON()));
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
	// var listView = new ListView({collection: events});
	var eventCounterView = new EventCounterView({collection: events});

	//Fetch the latest tasks and trigger an update of the views
	events.fetch();

});