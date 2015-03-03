(function(){
	
	var Conversation = function(participants, messages){
		if(!(this instanceof Conversation)){
			throw "Forgot new keyword when creating Conversation object.";
		}
		var that = this;
		if(typeof messages !== "undefined"){
			this.messages = (typeof messages === "array") ? messages : [messages];
		}
		if(typeof participants !== "undefined"){
			this.participants = (typeof participants === "array") ? participants : [participants];
		}
		this.addParticipant = function(userId){
			if(typeof userId === "string"){
				if(typeof this.participants === "undefined") this.participants = [];
				if(this.participants.indexOf(userId) == -1) this.participants.push(userId);
			}
		};
		this.removeParticipant = function(userId){
			var index = this.participants.indexOf(userId);
			if(index > -1){
				this.participants.splice(index, 1);
			}
		};
		this.addMessage = function(m){
			if(typeof this.messages === "undefined") this.messages = [];
			if(this.messages.indexOf(m) == -1) this.messages.push(m);
		};
		this.removeMessage = function(m){
			var index = this.messages.indexOf(m);
			if(index > -1){
				this.messages.splice(index, 1);
			}
		};
	};
	
	var Message = function(message, type, recipients, viewedTimes){
		if(!(this instanceof Message)){
			throw "Forgot new keyword when creating Message object.";
		}
		this.message;
		this.recipients;
		this.fromUserId;
		this.type;
		this.sentTime = Date.now().toString();
		this.viewedTimes;
		Object.freeze(this.sentTime);
		if(typeof message !== "undefined"){
			this.message = message;
		}
		if(typeof recipients !== "undefined"){
			this.recipients = recipients;
		}
		if(typeof type !== "undefined"){
			this.type = type;
		}
		if(typeof viewedTimes !== "undefined"){
			this.viewedTimes = viewedTimes;
		}
	}
		
	
	//For WebRTC signaling
	var SignalMessage = function(message, signalType, recipients){
		 if(!(this instanceof SignalMessage)){
			 throw Error("Forgot new keyword when creating an instance of the SignalMessage object.");
		 }
		 //call the Message object using this objects instance of "this" for inheritance
		 Message.call(this, message, "Signalling", recipients);
		 this.signalType = signalType;
	}
	
	//inherit the Message objects prototype
	SignalMessage.prototype = new Message(null, null, null, null);
	
	
	//for images and files
	var MultimediaMessage = function(f, recipients, message){
		if(!(this instanceof MultimediaMessage)){
			throw Error("Forgot new keyword when creating an instance of the MultimediaMessage object");
		}
		if(typeof f === "undefined"){
			console.error("File property in MultimediaMessage object is undefined");
			return;
		}
		
		//for referencing this multimedia message object within other objects methods and event handlers
		var self = this;
		this.fileLoaded = false;
		this.type = "Multimedia";
		this.sentTime = Date.now().toString();
		this.fromUserId;
		this.viewedTimes;
		if(f instanceof File){
			this.fileType = f.name.substr((~-f.name.lastIndexOf(".") >>> 0) + 2);
			var reader = new FileReader();
			reader.onload = function(){
				//here "this" refers to the reader object, so use the self variable to refer to this instance of the MultimediaMessage object
				self.file = this.result;
				self.fileLoaded = true;
			};
			reader.readAsDataURL(f);
		}else{
			throw Error("File property of MultimediaMessage is not of type File");
		}
		
		if(typeof recipients !== "undefined"){
			this.recipients = recipients;
		}
		if(typeof message !== "undefined"){
			this.message = message;
		}
	};
	
	
	var MessageSocket = function(userId, location){
		//Check to make sure that this constructor function was called using the new keyword
		if(!(this instanceof MessageSocket)){
			throw Error("Forgot new keyword when creating an instance of the MessageSocket object");
		}
		location = (typeof location !== "undefined") ? location : "ws://localhost:8080/Messaging/message";
		//For use within WebSocket event functions and methods when referring to this instance of a MessageSocket
		var that = this;
		//Event handler for when message is received. Don't instantiate; leave that for when using the MessageSocket object.
		this.onmessage;
		//Open WebSocket
		var webSocket = new WebSocket(location + "/" + userId);
		
		//WebSocket Events
		webSocket.onopen = function(event){
			console.log("WebSocket opened");
		};
		
		webSocket.onerror = function(error){
			throw Error("WebSocket error: " + JSON.stringify(error));
		};
		
		webSocket.onclose = function(event){
			console.log("WebSocket closing");
		};
		
		webSocket.onmessage = function(event){
			console.log("webSocket.onmessage");
			//turn the string message received into an object
			var msg;
			try{
				//try block is for making sure the string received can be parsed into an object
				//should be in the form of a message object
				msg = (typeof event.data === "string") ? JSON.parse(event.data) : event.data;
			}catch(error){
				console.error(error);
				msg = new Message(event.data);
			}
			if(typeof that.onmessage !== "undefined"){
				console.log("that.onmessage !== undefined");
				//send the received message to the MessageSocket.onmessage event handler
				that.onmessage(msg);
			}
		};
		
		//MessageSocket methods
		this.send = function(message){
			if(webSocket.readyState == 1){
				//connection open; send the message
				if(message instanceof MultimediaMessage){
					console.log("message instanceof MultimediaMessage");
					if(message.fileLoaded){
						console.log("fileLoaded = true");
						message = (typeof message === "string") ? message : JSON.stringify(message);
						webSocket.send(message);
					}else{
						window.setTimeout(function(){that.send(message)}, 1000);
						return;
					}
				}else{
					message = (typeof message === "string") ? message : JSON.stringify(message);
					webSocket.send(message);
				}
				console.log("Sent Message");
			}else if(webSocket.readyState == 0){
				//connection is still connecting; wait for connection to open then send the message
				//this may cause a weird error where the method gets called twice, be cautious
				window.setTimeout(function(){that.send(message)}, 1000);
			}else{
				//connection is closing or closed
				throw Error("Can't send message, connection is closed");
			}
		};
		
		//when the window is about to unload its resources, close the websocket
		window.addEventListener("beforeunload", function(){
			webSocket.close();
		});
	};
	
	
	//polluting the global name space; watch for name clashes
	window.Conversation = Conversation;
	window.Message = Message;
	window.MultimediaMessage = MultimediaMessage;
	window.SignalMessage = SignalMessage;
	window.MessageSocket = MessageSocket;
	
})();