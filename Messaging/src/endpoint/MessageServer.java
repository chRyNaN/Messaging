package endpoint;

import java.nio.ByteBuffer;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import entity.Message;

@ServerEndpoint("/message/{userId}")
public class MessageServer {
	private static ConcurrentMap<String, Session> activeSessions;
	
	@OnOpen
	public void open(Session session, @PathParam("userId") String userId){
		if(MessageServer.activeSessions == null){
			MessageServer.activeSessions = new ConcurrentHashMap<String, Session>();
		}
		if(!MessageServer.activeSessions.containsKey(userId)){
			MessageServer.activeSessions.put(userId, session);
		}
	}
	
	@OnMessage
	public void message(Session session, String message, @PathParam("userId") String userId){
		System.out.println("Message: " + message);
		try{
			JSONObject j = new JSONObject(message);
			JSONArray a;
			Set<String> recipients = new HashSet<String>();
			if(j.has("recipients")){
				try{
					a = j.getJSONArray("recipients");
					for(int i = 0; i < a.length(); i++){
						recipients.add(a.getJSONObject(i).toString());
					}
				}catch(JSONException ex){
					recipients.add(j.getString("recipients"));
				}
				Message m = createMessageFromJSON(j, userId);
				if(m != null){
					//TODO should save the message to the database before sending
					sendMessage(m, recipients);
				}
			}
		}catch(JSONException e){
			e.printStackTrace();
		}
	}
	
	@OnMessage
	public void message(Session session, ByteBuffer buffer, @PathParam("userId") String userId){
		//For multi-media such as pictures.
		
	}
	
	@OnError
	public void error(Session session, Throwable t){
		t.printStackTrace();
	}
	
	@OnClose
	public void close(Session session, CloseReason reason, @PathParam("userId") String userId){
		if(MessageServer.activeSessions.containsKey(userId)){
			MessageServer.activeSessions.remove(userId);
		}
	}
	
	private void sendMessage(Message message, Set<String> recipients){
		for(String userId : recipients){
			if(MessageServer.activeSessions.containsKey(userId)){
				Session session = MessageServer.activeSessions.get(userId);
				if(session != null){
					try{
						JSONObject obj = new JSONObject(message);
						obj.put("recipients", recipients);
						session.getAsyncRemote().sendText(obj.toString());
						System.out.println("Sending message: " + message.toString());
					}catch(JSONException e){
						e.printStackTrace();
					}
				}
			}
		}
	}
	
	private Message createMessageFromJSON(JSONObject obj, String userId){
		try{
			System.out.println("Try to create Message from JSON");
			Message m = new Message();
			m.setFromUserId(userId);
			if(obj.has("sentTime")){
				m.setSentTime(new Date(obj.getLong("sentTime"))); 
			}
			if(obj.has("type")){
				m.setType(obj.getString("type"));
			}
			if(obj.has("message")){
				m.setMessage(obj.getString("message"));
			}
			return m;
		}catch(JSONException e){
			System.out.println("JSONException");
			e.printStackTrace();
			return null;
		}catch(Exception ex){
			System.out.println("Exception");
			ex.printStackTrace();
			return null;
		}
	}
	
}
