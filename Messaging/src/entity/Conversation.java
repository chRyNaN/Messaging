package entity;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.ElementCollection;
import javax.persistence.FetchType;

public class Conversation {
	
	@ElementCollection(fetch = FetchType.EAGER)
	Set<String> participants;
	@ElementCollection(fetch = FetchType.LAZY)
	Set<Message> messages;
	
	public Conversation(){
		this.participants = new HashSet<String>();
		this.messages = new HashSet<Message>();
	}
	
	public Conversation(Set<String> participants, Set<Message> messages){
		this.participants = participants;
		this.messages = messages;
	}
	
	public Conversation(Set<String> participants, Message message){
		this.participants = participants;
		this.messages = new HashSet<Message>();
		this.messages.add(message);
	}
	
	public Set<String> getParticipants(){
		return participants;
	}
	
	public void setParticipants(Set<String> participants){
		this.participants = participants;
	}
	
	public void addParticipant(String userId){
		this.participants.add(userId);
	}
	
	public Boolean removeParticipant(String userId){
		return this.participants.remove(userId);
	}
	
	public Set<Message> getMessages(){
		return messages;
	}
	
	public void setMessages(Set<Message> messages){
		this.messages = messages;
	}
	
	public void addMessage(Message message){
		this.messages.add(message);
	}
	
	public Boolean removeMessage(Message message){
		return this.messages.remove(message);
	}
	
}
