require 'sinatra'
require 'haml'
require 'json'
require 'pusher'



set :port, 5678



Pusher.app_id = '20691'
Pusher.key = '428fa18abbaf98f5b0b6'
Pusher.secret = '7efd4f23919374217721'



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
  puts "\n\n====== FETCHING DATABASE ======"
  puts "> > > Events list:"
  puts $events
  $events.to_json
end



get '/events/:id' do
  puts "\n\n====== SERVING EVENT WITH ID: #{params[:id]} ======"
  @ev = $events.select {|e| e[:id] == params[:id].to_i}
  if @ev == nil
    status 404
  else
    content_type :json
    puts "> > > Events list:"
    puts $events
    @ev[0].to_json
  end
end



post '/events' do
  data = JSON.parse(request.body.string)
  if data.nil?
    status 400
  else
    event = {}
    [:title, :duration, :latitude, :longitude, :date].each do |field|
      event[field] = data[field.to_s] || ""
    end
    event[:timestamp] = timestamp
    event[:id] = $nextID
    $events.unshift(event)
    puts "\n\n====== CREATING EVENT WITH ID: #{$nextID} ======"
    puts "> > > Events list:"
    puts $events
    $nextID += 1
    Pusher['livenow'].trigger('posted', event.to_json, request.env["HTTP_X_PUSHER_SOCKET_ID"])
    event.to_json
  end
end



put '/events/:id' do
  puts "\n\n====== UPDATING EVENT WITH ID: #{params[:id]} ======"
  data = JSON.parse(request.body.string)
  if data.nil?
    status 400
  else
    event = {}
    [:title, :duration, :latitude, :longitude, :date].each do |field|
      event[field] = data[field.to_s] || ""
    end
    event[:timestamp] = timestamp
    event[:id] = data[:id.to_s]
    # Replace the event in the list of events
    @ev = $events.select {|e| e[:id] == params[:id].to_i}
    $events.delete(@ev[0])
    $events.unshift(event)
    puts "> > > Events list:"
    puts $events
    Pusher['livenow'].trigger('put', event.to_json, request.env["HTTP_X_PUSHER_SOCKET_ID"])
    event.to_json
  end
end



delete '/events/:id' do
  puts  "\n\n====== DELETING EVENT WITH ID: #{params[:id]} ======"
  @ev = $events.select {|e| e[:id] == params[:id].to_i}
  if @ev == nil
    status 404
  else
    $events.delete(@ev[0])
    puts "> > > Events list:"
    puts $events
    Pusher['livenow'].trigger('deleted', params[:id].to_i, request.env["HTTP_X_PUSHER_SOCKET_ID"])
    params[:id].to_i
  end
end