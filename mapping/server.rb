require 'sinatra'
require 'haml'
require 'json'

configure do
  mime_type :js, 'application/x-javascript'
end

get '/' do
	locationFile = File.open("locationData.json", "r")
	@rawLocationData = locationFile.read
	content_type :json
	@jsonLocationData = JSON.load(@rawLocationData)			# Get JSON data
	puts @jsonLocationData
	@locationCount = @jsonLocationData["locations"].count	# Number of locations in DB

	content_type "text/html"
	haml :index
end

