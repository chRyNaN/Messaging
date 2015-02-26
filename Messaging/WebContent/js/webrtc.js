(function(){
	
	var WebRTC = function(){
		if(!(this instanceof WebRTC)){
			throw Error("Forgot new keyword when creating an instance of the WebRTC object.");
		}
	};
	
	//older cross browser support
	var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	var IceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
	var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
	navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
	
	var localStream, remoteStream;
	
	var errorHandler = function (err){
		console.error(err);
	};
	
	var constraints = {
		offerToReceiveAudio: true,
		offerToReceiveVideo: true
	};
	
	var servers = {
		iceServers: [
		     //need to find a turn server and possibly more appropriate stun servers
		     {url: "stun:23.21.150.121"},
		     {url: "stun:stun.1.google.com:19302"}
		]	
	};
	
	var options = {
		optional: [
		     //this is used to communicate between Chrome and Firefox browsers
		     {DtlsSrtpKeyAgreement: true}
		]	
	};
	
	//initial settings
	var mediaOptions = {
		audio: true,
		video: true
	};
	
	var pc = new PeerConnection(servers, options);
	pc.onaddstream = function(event){
		remoteStream = event.stream;
	};
	pc.onicecandidate = function(event){
		if(event.candidate == null){
			return;
		}
		candidate = event.candidate;
		pc.onicecandidate = null;
	};
	
	WebRTC.prototype.createOffer = function(callback){
		pc.createOffer(function(offer){
			pc.setLocalDescription(offer);
			callback(offer);
		}, errorHandler, constraints);
	};
	
	WebRTC.prototype.createAnswer = function(offer, callback){
		pc.setRemoteDescription(new SessionDescription(offer), function(){
			pc.createAnswer(function(answer){
				pc.setLocalDescription(answer);
				callback(answer);
			}, errorHandler, constraints);
		});
	};
	
	WebRTC.prototype.setAnswer = function(answer){
		pc.setRemoteDescription(new SessionDescription(answer));
	};
	
	WebRTC.prototype.getLocalStream = function(callback){
		navigator.getUserMedia(mediaOptions, function(stream){
			localStream = stream;
			pc.addStream(stream);
			callback(stream);
		}, errorHandler);
	};
	
	WebRTC.prototype.getRemoteStream = function(callback){
		if(typeof remoteStream !== "undefined" && remoteStream != null){
			callback(remoteStream);
		}else{
			//what if remote stream is never reachable?
			window.setTimeout(function(){getRemoteStream(callback)}, 1000);
		}
	};
	
	WebRTC.prototype.getIceCandidate = function(callback){
		if(typeof candidate !== "undefined" && candidate != null){
			callback(candidate);
		}else{
			//what if candidate is never reachable?
			window.setTimeout(function(){getIceCandidate(callback)}, 1000);
		}
	};
	
	WebRTC.prototype.setRemoteIceCandidate = function(candidate){
		pc.addIceCandidate(new IceCandidate(candidate));
	};
	
	//shouldn't pollute the global name space, instead, should have one module containing all object names
	window.WebRTC = WebRTC;
	
})();