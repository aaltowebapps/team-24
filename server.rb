require 'sinatra'
require 'haml'
require 'json'

set :port, 5678

#$events = [{:title => "Event", 
#            :duration => 60,
#            :latitude => 60.1804469,
#            :longitude => 24.8315503,
#            :date => "1.1.2012 10:20:30"}]

def timestamp
  Time.now.strftime("%d.%m.%Y %H:%M:%S")
end

get '/' do
  locationFile = File.open("locationData.json", "r")
  @rawLocationData = locationFile.read
  content_type :json
  @jsonLocationData = JSON.load(@rawLocationData)      # Serialize json string
  puts @jsonLocationData
  @locationCount = @jsonLocationData["locations"].count  # Number of locations in DB

  #load all events into the global variable $events 
  $events = Array.new
  j=0
  @jsonLocationData["locations"].each do |current_hash|
    ev = {}  # current event
    ev[:title] = current_hash["locName"]
    ev[:duration] = 60+j
    ev[:latitude] = current_hash["lat"]
    ev[:longitude] = current_hash["lat"]
    ev[:date] = timestamp
    $events << ev  #append ev to the array
    j+=1
  end
  puts $events

  content_type "text/html"
  haml :index
end

