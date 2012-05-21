require 'sinatra'
require 'haml'
require 'json'
require 'pusher'



set :port, 5678



Pusher.app_id = '20691'
Pusher.key = '428fa18abbaf98f5b0b6'
Pusher.secret = '7efd4f23919374217721'



def timestamp

	Time.now.strftime("%d.%m.%Y %H:%M:%S")

end



$events = Array.new
$nextID = -1;



get '/' do

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

	# Find the event with ID equal to :id.
	@ev = $events.select {|e| e[:id] == params[:id].to_i}

	if @ev == nil
	
		status 404
	
	else
	
		content_type :json
		
		puts "\n\n====== SERVING EVENT WITH ID: #{params[:id]} ======"
		puts "> > > Events list:"
		puts $events
		
		@ev[0].to_json
	
	end

end


# Provision of GUID.
get '/nextid' do

	content_type 'application/json'
	
	$nextID += 1
	puts "\n\n====== GENERATED ID: "+$nextID.to_json+" ======"
	$nextID.to_json

end



post '/events' do

	data = JSON.parse(request.body.string)
	
	if data.nil?
	
		status 400
	
	else
	
		event = {}
		[:title, :duration, :latitude, :longitude, :date, :time, :id, :started].each do |field|
			event[field] = data[field.to_s] || ""
		end
		event[:timestamp] = timestamp
		$events.unshift(event)
	
		puts "\n\n====== CREATING EVENT WITH ID: #{event[:id]} ======"
		puts "> > > Events list:"
		puts $events
	
		Pusher['livenow'].trigger('posted', event.to_json, request.env["HTTP_X_PUSHER_SOCKET_ID"])
	
		event.to_json
	
	end

end



post '/newEvent' do

  data = JSON.parse(request.body.string)
  
  puts "part 1"
  
  if data.nil?
  
    status 400
  
  else
  
    puts "part 2"

    event = {}
    [:title, :latitude, :longitude, :startingDate, :startingTime, :duration,].each do |field|
      event[field] = data[field.to_s] || ""
    end

  puts "part 3"

    event[:id] = data[:id]
    $events.unshift(event)
  
    puts "\n\n====== CREATING EVENT WITH ID: #{event[:id]} ======"
    puts "> > > Events list:"
    puts $events
  
    Pusher['livenow'].trigger('posted', event.to_json, request.env["HTTP_X_PUSHER_SOCKET_ID"])

    puts "part 4"
  
    event.to_json
  
    puts "part 5"

  end

  puts "part 6"

end



put '/events/:id' do

	puts "\n\n====== UPDATING EVENT WITH ID: #{params[:id]} ======"

	data = JSON.parse(request.body.read)

	if data.nil?

		status 400

	else

		event = {}
		[:title, :duration, :latitude, :longitude, :date, :time, :id, :started].each do |field|
			event[field] = data[field.to_s] || ""
		end
		event[:timestamp] = timestamp

		# Replace the event in the list of events
		@ev = $events.select {|e| e[:id] == params[:id].to_i}
		$events.delete(@ev[0])
		$events.unshift(event)

		puts "> > > Events list:"
		puts $events

		Pusher['livenow'].trigger('put', params[:id].to_i, request.env["HTTP_X_PUSHER_SOCKET_ID"])

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