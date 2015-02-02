package entity;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ElementCollection;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MapKeyColumn;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.json.JSONObject;

@Entity
public class Message {
	@Id @GeneratedValue
	private long databaseId;
	
	@Temporal(TemporalType.TIMESTAMP)
	private Date sentTime;
	
	@ElementCollection(fetch = FetchType.LAZY)
	@CollectionTable(name = "messageViewed")
	@MapKeyColumn(name = "userId")
	@Column(name = "time")
	@Temporal(TemporalType.TIMESTAMP)
	private Map<String, Date> viewedTimes;
	
	private String type;
	private String message;
	private String multimediaURI;
	
	private String fromUserId;
	
	public Message(){
		this.viewedTimes = new HashMap<String, Date>();
	}
	
	public Message(Date sentTime, String message){
		this.setSentTime(sentTime);
		this.setMessage(message);
		this.viewedTimes = new HashMap<String, Date>();
	}
	
	public Message(Date sentTime, String type, String message){
		this.setSentTime(sentTime);
		this.setType(type);
		this.setMessage(message);
		this.viewedTimes = new HashMap<String, Date>();
	}

	public Date getSentTime() {
		return sentTime;
	}

	public void setSentTime(Date sentTime) {
		this.sentTime = sentTime;
	}

	public Map<String, Date> getViewedTime() {
		return viewedTimes;
	}

	public void setViewedTime(String userId, Date viewedTime) {
		if(this.viewedTimes == null){
			this.viewedTimes = new HashMap<String, Date>();
		}
		viewedTimes.put(userId, viewedTime);
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getMultimediaURI() {
		return multimediaURI;
	}

	public void setMultimediaURI(String multimediaURI) {
		this.multimediaURI = multimediaURI;
	}

	public String getFromUserId() {
		return fromUserId;
	}

	public void setFromUserId(String fromUserId) {
		this.fromUserId = fromUserId;
	}
	
	public String toJSONString(){
		try{
			JSONObject obj = new JSONObject(this);
			return obj.toString();
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}
	
}
