package endpoint;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import javax.inject.Inject;
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

import ejb.DatabaseHandler;
import entity.Message;

@ServerEndpoint("/message/{userId}")
public class MessageServer {
	private static ConcurrentMap<String, Session> activeSessions;
	@Inject
	DatabaseHandler handler;
	
	public static boolean containsUser(String userId){
		if(MessageServer.activeSessions == null){
			return false;
		}else if(MessageServer.activeSessions.containsKey(userId)){
			return true;
		}else{
			return false;
		}
	}
	
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
		System.out.println("onmessage");
		try{
			JSONObject j = new JSONObject(message);
			JSONArray a;
			Set<String> recipients = new HashSet<String>();
			if(j.has("recipients")){
				System.out.println("has recipients");
				try{
					a = j.getJSONArray("recipients");
					for(int i = 0; i < a.length(); i++){
						recipients.add(a.getJSONObject(i).toString());
					}
				}catch(JSONException ex){
					recipients.add(j.getString("recipients"));
				}
				Message m = new Message(message, userId);
				if(m != null){
					System.out.println("m != null");
					if(m.getType().toLowerCase().equals("multimedia")){
						System.out.println("type = multimedia");
						if(j.has("file")){
							System.out.println("has file");
							//TODO save to the database: Future<String> fileURI = handler.saveFile(j.getString("file");
							//TODO add fileURI to multimediaURI of Message object
							sendMultimediaMessage(m, recipients, j.getString("file"));
							//TODO save the message to the database
						}
					}else{
						//TODO should save the message to the database before sending
						sendMessage(m, recipients);
					}
				}
			}
		}catch(JSONException e){
			e.printStackTrace();
		}
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
		try{
			Session session;
			JSONObject obj = new JSONObject(message);
			obj.put("recipients", recipients);
			for(String userId : recipients){
				if(MessageServer.activeSessions.containsKey(userId)){
					session = MessageServer.activeSessions.get(userId);
					if(session != null){
						session.getAsyncRemote().sendText(obj.toString());
					}
				}
			}
		}catch(JSONException e){
			e.printStackTrace();
		}
	}
	
	private void sendMultimediaMessage(Message message, Set<String> recipients, String binaryFileString){
		System.out.println("sendMultimediaMessage method");
		try{
			Session session;
			JSONObject obj = new JSONObject(message);
			obj.put("recipients", recipients);
			obj.put("file", binaryFileString);
			for(String userId : recipients){
				if(MessageServer.activeSessions.containsKey(userId)){
					session = MessageServer.activeSessions.get(userId);
					if(session != null){
						session.getAsyncRemote().sendText(obj.toString());
					}
				}
			}
		}catch(JSONException e){
			e.printStackTrace();
		}
	}
	
}
