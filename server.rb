require 'sinatra'
require 'haml'
require 'json'

get '/' do
	locationFile = File.open("locationData.json", "r")
	@rawLocationData = locationFile.read
	content_type :json
	@jsonLocationData = JSON.load(@rawLocationData)			# Serialize json string
	puts @jsonLocationData
	@locationCount = @jsonLocationData["locations"].count	# Number of locations in DB

	content_type "text/html"
	haml :index
end

