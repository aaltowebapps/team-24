require 'sinatra'
require 'haml'
require 'json'

get '/' do
	locationFile = File.open("locationData.json", "r")
	rawLocationData = locationFile.read
	content_type :json
	@jsonLocationData = JSON.load(rawLocationData)					# Get JSON data
	@locationCount = @jsonLocationData.fetch("locations").count		# Number of locations in DB
	haml :index
end

