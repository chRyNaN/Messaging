(function(){
	
	var Conversation = function(messages, participants){
		if(!(this instanceof Conversation)){
			throw "Forgot new keyword when creating Conversation object.";
		}
		var that = this;
		this.messages = (typeof messages === "array") ? messages : [messages];
		this.participants = (typeof participants === "array") ? participants : [participants];
		this.addParticipant = function(userId){
			if(typeof userId === "string"){
				if(that.participants.indexOf(userId) == -1) that.participants.push(userId);
			}
		};
		this.removeParticipant = function(userId){
			var index = that.participants.indexOf(userId);
			if(index > -1){
				that.participants.splice(index, 1);
			}
		};
		this.addMessage = function(m){
			if(!(m instanceof Message)){
				throw "Paramater message for addMessage method in Conversation object must be of type Message.";
			}
			if(that.messages.indexOf(m) == -1) that.messages.push(m);
		};
		this.removeMessage = function(m){
			var index = that.messages.indexOf(m);
			if(index > -1){
				that.messages.splice(index, 1);
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
		Object.seal(this);
	}
		
	var MessageSocket = function(userId, location){
		if(!(this instanceof MessageSocket)){
			throw "Forgot new keyword when creating MessageSocket object.";
		}
		if(typeof userId !== "string"){
			throw "Parameter userId of MessageSocket must be specified and of type String.";
		}
		var that = this;
		this.userId = userId;
		this.location = (typeof location !== "undefined") ? location : "ws://localhost:8080/Messaging/message";
		Object.freeze(that.userId);
		Object.freeze(that.location);
		this.onmessage;
		var connectionOpen = false;
		var webSocket = new WebSocket(location + "/" + userId) || 
								MozWebSocket(location + "/" + userId) || 
									WebkitWebSocket(location + "/" + userId);
		webSocket.onopen = function(event){
			connectionOpen = true;
		};
		webSocket.onmessage = function(event){
			var data;
			try{
				data = JSON.parse(event.data);
			}catch(error){
				data = event.data;
			}
			if(typeof data.message !== "undefined"){
				if(typeof that.onmessage !== "undefined"){
					that.onmessage(data);
				}
			}
		};
		this.send = function(message){
			if(!(message instanceof Message)){
				throw "Paramater message for send method in MessageSocket must be of type Message.";
			}
			if(connectionOpen){
				message.fromUserId = that.userId;
				webSocket.send(JSON.stringify(message));
			}else{
				window.setTimeout(function(){that.send(message)}, 1000);
			}
		}
		Object.freeze(that.send);
		Object.seal(this);
	};
	
	window.Conversation = Conversation;
	window.Message = Message;
	window.MessageSocket = MessageSocket;
	
	
	//example use case
	var s = new MessageSocket("123456", "ws://localhost:8080/Messaging/message");
	s.send(new Message("test", "test", "123456"));
	
})();