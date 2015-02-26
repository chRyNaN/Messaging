(function(){
	var otherUser, startedIt = false;
	var localVideo = document.getElementById("local-video");
	var remoteVideo = document.getElementById("remote-video");
	var input = document.getElementById("user-name-input");
	var submit = document.getElementById("submit");
	submit.addEventListener("click", function(event){
		var name = input.value;
		checkNameAvailability(name, function(result){
			if(result){
				userName = name;
				document.getElementById("user-name-container").style.display = "none";
				document.getElementById("connect-container").style.display = "block";
			}else{
				alert("User Name not available");
			}
		});
		event.preventDefault();
		event.stopPropagation();
	});
	var connect = document.getElementById("connect");
	connect.addEventListener("click", function(event){
		otherUser = document.getElementById("connect-to").value;
		w.createOffer(function(offer){
			startedIt = true;
			s.send(new SignalMessage(offer, "offer", otherUser));
		});
	});
	
	var userName;
	var w = new WebRTC();
	w.getLocalStream(function(stream){
		localVideo.src = window.URL.createObjectURL(stream);
	});
	
	var s = new MessageSocket("123456");
	s.onmessage = function(message){
		console.log(JSON.stringify(message));
		switch(message.type.toLowerCase()){
		case "signalling":
			switch(message.signalType.toLowerCase()){
			case "offer":
				otherUser = message.fromUserId;
				w.createAnswer(message.message, function(answer){
					s.send(new SignalMessage(answer, "answer", otherUser));
				});
				break;
			case "answer":
				w.setAnswer(message.message);
				w.getIceCandidate(function(candidate){
					s.send(new SignalMessage(candidate, "candidate", otherUser));
				});
				break;
			case "candidate":
				w.setRemoteIceCandidate(message.message);
				if(!startedIt){
					w.getIceCandidate(function(candidate){
						s.send(new SignalMessage(candidate, "candidate", otherUser));
					});
				}
				w.getRemoteStream(function(stream){
					remoteVideo.src = window.URL.createObjectURL(stream);
				});
				break;
			}
			break;
		case "multimedia":
			
			break;
		case "text":
		default:
				
			break;
		}
	};
	
	function checkNameAvailability(userId, callback){
		$.ajax({
			url: "http://localhost:8080/Messaging/rs/message/isAvailable/" + userId,
			type: "GET",
			success: callback
		});
	}
	
})();