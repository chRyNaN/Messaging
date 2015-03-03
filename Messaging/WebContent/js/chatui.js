(function(){
/** Handles the view of the Messenger **/

	var windowString = '<section class="chat-window"><header class="chat-header"><h1 class="message-name"></h1><button class="close-message entypo-cancel" title="Close"></button></header>' + 
			'<div class="chat-container"><div class="chat-content"><ol class="message-list"></ol></div>' +
			'<div class="chat-input-container"><div class="chat-text-container"><textarea class="chat-text-input" cols="22" rows="10" wrap="hard"></textarea></div>' +
			'<div class="chat-button-container"><button class="chat-button attachment-button entypo-attach" title="Attach File"></button><button class="chat-button video-chat-button entypo-camera" title="Start Video Chat"></button>' +
			'</div></div></div></section>';
	var messageItemString = '<li><div class="arrow"></div><div class="message"><time class="time" datetime=""></time></div></li>';
	var hiddenDiv = document.createElement("div");
	hiddenDiv.classList.add("hidden-div");
	hiddenDiv.style.fontFamily = window.getComputedStyle(createChatWindow().getElementsByClassName("chat-text-input")[0]).getPropertyValue("font-family");
	document.querySelector("body").appendChild(hiddenDiv);
	var supportedImageTypes = ["jpeg", "gif", "png", "svg", "bmp"];
	
	function minimize(event){
		var content = this.parentNode.getElementsByClassName("chat-container")[0];
		if(!content.classList.contains("minimize")){
			content.classList.add("minimize");
			content.parentNode.classList.add("minimize-width");
			content.getElementsByClassName("chat-button-container")[0].style.display = "none";
		}else{
			content.classList.remove("minimize");
			content.parentNode.classList.remove("minimize-width");
			content.getElementsByClassName("chat-button-container")[0].style.display = "inline-block";
		}
	}
	
	function closeWindow(event){
		var section = this.parentNode.parentNode;
		var event = new CustomEvent("closechat", {"detail": section});
		window.dispatchEvent(event);
	}
	
	function createChatWindow(){
		var div = document.createElement("div");
		div.innerHTML = windowString;
		div.getElementsByClassName("chat-header")[0].addEventListener("click", minimize);
		div.getElementsByClassName("close-message")[0].addEventListener("click", closeWindow);
		return div.children[0];
	}
	
	function createMessageItem(){
		var div = document.createElement("div");
		div.innerHTML = messageItemString;
		return div.children[0];
	}
		
	function fileSelected(event){
		
	}
	
	//ChatWindow object
	var ChatWindow = function(userId, name, conversation){
		if(!(this instanceof ChatWindow)){
			throw Error("ChatWindow object not initialized using the new keyword.");
		}
		var self = this;
		this.htmlElem = createChatWindow();
		this.messageList = this.htmlElem.getElementsByClassName("message-list")[0];
		if(typeof userId !== "undefined"){
			this.userId = userId;
		}
		if(typeof name !== "undefined"){
			this.name = name;
			this.htmlElem.getElementsByClassName("message-name")[0].textContent = name;
		}
		if(typeof conversation !== "undefined"){
			this.conversation = conversation;
			this.htmlElem.conversation = conversation; //possibly moving over to this format; keeping both for now for backward compatibility 
			if(typeof this.conversation.messages !== "undefined"){
				var m = this.conversation.messages;
				for(var i = 0; i < m.length; i++){
					//TODO add each message item to the ChatWindow
				}
			}
		}
	};
	
	ChatWindow.prototype.addMessage = function(m, type){
		console.log("addMessage");
		this.conversation.addMessage(m);
		type = type || "self";
		if(typeof m === "string" || m instanceof Message){
			var tm = createTextMessage(m);
			if(type == "self"){
				tm.classList.add("self");
				var arrow = tm.getElementsByClassName("arrow")[0];
				//place the arrow at the correct position
				tm.removeChild(arrow);
				tm.appendChild(arrow);
			}else{
				tm.classList.add("other");
			}
			this.messageList.appendChild(tm);
		}else if (m instanceof MultimediaMessage){
			var fm = createFileMessage(m);
			if(type == "self"){
				fm.classList.add("self");
				var arrow = tm.getElementsByClassName("arrow")[0];
				fm.removeChild(arrow);
				fm.appendChild(arrow);
			}else{
				fm.classList.add("other");
			}
			this.messageList.appendChild(fm);
		}
	}
	
	function createTextMessage(m){
		var item = createMessageItem();
		var p = document.createElement("p");
		var messageElem = item.getElementsByClassName("message")[0];
		if(typeof m === "string"){
			p.textContent = m;
			messageElem.appendChild(p);
		}else{
			p.textContent = m.message;
			messageElem.appendChild(p);
			if(typeof m.sentTime !== "undefined"){
				var date = messageElem.getElementsByClassName("time")[0];
				date.datetime = m.sentTime;
			}
		}
		return item;
	}
	
	function createFileMessage(m){
		var item = createMessageItem();
		if(supportedImageTypes.indexOf(m.fileType) != -1){
			var img = document.createElement("img");
			img.height = 60;
			img.src = window.URL.createObjectURL(m.file);
			item.appendChild(img);
		}else{
			//TODO display other file types
		}
		return item;
	}
	
	var ChatController = function(userId, sendMessageCallback){
		if(!(this instanceof ChatController)){
			throw Error("Forgot new keyword when creating an instance of ChatController.");
		}
		//chatcontroller should hold the userId probably not the chatWindow object
		this.userId = userId;
		this.openSessions = [];
		this.sendMessageCallback;
		var self = this;
		window.addEventListener("resize", function(event){
			var width = window.innerWidth || document.documentElement.clientWidth;
			if(width > 600){
				//closes sessions that can't fit on the screen
				var n = (width - 200) / 320;
				while(n < self.openSessions.length){
					var w = self.openSessions.splice(0, 1)[0].htmlElem;
					document.body.removeChild(w);
					self.alignItems();
				}
			}
		});
		window.addEventListener("closechat", function(event){
			//need a better way to check if elements are the same
			//problem has to do with ChatWindow not being an HTMLElement object but contains an html element
			//so can't directly check if objects equal each other
			var w = event.detail;
			for(var i = 0; i < self.openSessions.length; i++){
				if(self.openSessions[i].htmlElem.conversation == w.conversation){
					document.body.removeChild(w);
					self.openSessions.splice(i, 1);
					break;
				}
			}
		});
	};
	
	ChatController.prototype.addMessage = function(){
		
	};
	
	ChatController.prototype.addSession = function(conversation, name){
		var controller = this;
		var a = this.containsSession(conversation.participants);
		console.log(a);
		if(!a){
			var width = window.innerWidth || document.documentElement.clientWidth;
			if(width > 600){
				var n = (width - 200) / 320;
				var elem, chat;
				if(this.openSessions.length < n){
					chat = new ChatWindow(this.userId, name, conversation);
					this.openSessions.push(chat);
					elem = this.openSessions[this.openSessions.length - 1].htmlElem;
					elem.style.right = 210 + (300 * (this.openSessions.length - 1)) + "px";
					document.body.appendChild(elem);
				}else{
					while(n < this.openSessions.length - 1){
						document.body.removeChild(this.openSessions.splice(0, 1)[0].htmlElem);
					}
					chat = new ChatWindow(this.userId, name, conversation);
					this.openSessions.push(chat);
					elem = this.openSessions[this.openSessions.length - 1].htmlElem;
					elem.style.right = 210 + (300 * (this.openSessions.length - 1)) + "px";
					document.body.appendChild(elem);
				}
				
				elem.getElementsByClassName("chat-text-input")[0].addEventListener("keydown", function(event){
					if(event.keyCode != 13){
						hiddenDiv.style.fontFamily = window.getComputedStyle(this).getPropertyValue("font-family");
						hiddenDiv.innerHTML = this.value.replace(/\n/g, "<br/>");
						this.style.height = hiddenDiv.clientHeight + "px";
						elem.getElementsByClassName("chat-content")[0].style.height = 250 - (parseInt(this.style.height) - 16) + "px";
					}else{
						var message = new Message(this.value, "text", conversation.participants);
						this.value = "";
						chat.addMessage(message);
						controller.sendMessageCallback(message);
					}
				});
				var hiddenInput = document.createElement("input");
				hiddenInput.type = "file";
				hiddenInput.classList.add("hidden-input");
				hiddenInput.addEventListener("change", function(event){
					var message = new MultimediaMessage(this.files[0], conversation.participants);
					chat.addMessage(message);
					controller.sendMessageCallback(message);
				});
				elem.appendChild(hiddenInput);
				elem.getElementsByClassName("attachment-button")[0].addEventListener("click", function(event){
					elem.getElementsByClassName("hidden-input")[0].click();
				});
				
			}
		}
	};

	ChatController.prototype.removeSession = function(recipients){
		var index = this.currentIndexOfSession(recipients);
		if(index != -1){
			document.body.removeChild(this.openSessions.splice(index, 1)[0].htmlElem);
		}
	};
	
	ChatController.prototype.containsSession = function(recipients){
		//best way to compare and get a session is by the recipients
		//if all the recipients match then it is the same "session"
		//loop through all the open sessions
		console.log(this.openSessions.length);
		for(var i = 0; i < this.openSessions.length; i++){
			console.log(JSON.stringify(this.openSessions[i]));
			console.log(JSON.stringify(this.openSessions[i].conversation));
			console.log(JSON.stringify(this.openSessions[i].conversation.participants));
			var r = this.openSessions[i].conversation.participants;
			if(r.length != recipients.length){
				continue;
			}
			r.sort();
			recipients.sort();
			for(var j = 0; j < r.length; j++){
				if(r[j] != recipients[j]){
					break;
				}else if(j + 1 == r.length){
					return true;
				}
			}
		}
		return false;
	};
	
	ChatController.prototype.currentIndexOfSession = function(recipients){
		for(var i = 0; i < this.openSessions.length; i++){
			var r = this.openSessions[i].conversation.participants;
			if(r.length != recipients.length){
				continue;
			}
			r.sort();
			recipients.sort();
			for(var j = 0; j < r.length; j++){
				if(r[j] != recipients[j]){
					break;
				}else if(j + 1 == r.length){
					return i;
				}
			}
		}
		return -1;
	};
	
	ChatController.prototype.getSession = function(recipients){
		var index = this.currentIndexOfSession(recipients);
		if(index != -1){
			return this.openSessions[index];
		}else{
			return null;
		}
	}
	
	ChatController.prototype.alignItems = function(){
		for(var i = 0; i < this.openSessions.length; i++){
			var elem = this.openSessions[i].htmlElem;
			elem.style.right = 210 + (300 * i) + "px";
		}
	};
	
	var chatController = new ChatController();
	chatController.addSession(new Conversation("123456"), "Chris");
	chatController.addSession(new Conversation("654321"), "Rebekah");

})();