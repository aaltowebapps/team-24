require 'sinatra'
require 'haml'
require 'json'



set :port, 5678



# $events = [{:title => "Event", 
#            :duration => 60,
#            :latitude => 60.1804469,
#            :longitude => 24.8315503,
#            :date => "1.1.2012 10:20:30"}]



def timestamp
  Time.now.strftime("%d.%m.%Y %H:%M:%S")
end

$events = Array.new
$nextID = 0;

get '/' do
  # eventDB = File.open("eventData.json", "r")
  # @rawEventData = eventDB.read
  # content_type :json
  # @jsonEventData = JSON.load(@rawEventData)      # Serialize json string
  # puts @jsonEventData
  # @eventCount = @jsonEventData["events"].count  # Number of events in DB
  # load all events into the local variable @events 
  # @jsonEventData["events"].each do |current_hash|
  #   ev = {}  # current event
  #   ev[:title] = current_hash["title"]
  #   ev[:duration] = 60 + j
  #   ev[:latitude] = current_hash["lat"]
  #   ev[:longitude] = current_hash["lat"]
  #   ev[:date] = timestamp
  #   $events << ev  #append ev to the array
  #   j+=1
  # end
  # puts $events
  content_type "text/html"
  haml :index
end



get '/events' do
  content_type :json
  puts "====== EVENTS LIST ======"
  puts $events
  $events.to_json
end



get '/events/:id' do
  puts "/ / / / / / Requesting event with id: #{params[:id]}"
  if params[:id].to_i > $events.length
    status 404
  else
    content_type :json
    puts"     Server return event with id: {params[:id]}"
    $events[params[:id].to_i].to_json
  end
end



post '/events' do
  puts "+ + + + + + Creating event with content: #{request.body.string}"
  data = JSON.parse(request.body.string)
  if data.nil?
    status 400
  else
    event = {}
    [:title, :duration, :latitude, :longitude, :date].each do |field|
      event[field] = data[field.to_s] || ""
    end
    event[:timestamp] = timestamp
    event[:id] = $nextID; $nextID += 1
    $events.unshift(event)
    puts "  Created event with content: #{event}"
    event.to_json
  end
end



put '/events/:id' do
  puts "> > > > > > Updating event with id: #{params[:id]}"
  data = JSON.parse(request.body.string)
  if data.nil?
    status 400
  else
    event = {}
    [:title, :duration, :latitude, :longitude, :date].each do |field|
      event[field] = data[field.to_s] || ""
    end
    event[:timestamp] = timestamp
    event[:id] = params[:id].to_i
    # Replace the event in the list of events
    puts "  Updated event with id: #{params[:id]}"
    $events[event[:id].to_i].merge!(event)
  end
end



delete '/events/:id' do
  puts  "Deleting event with id: #{params[:id]}"
  if params[:id].to_i > $events.length
    status 404
  else
    puts "  Deleted event with id: #{params[:id]}"
    $events.delete_at(params[:id].to_i)
  end
end