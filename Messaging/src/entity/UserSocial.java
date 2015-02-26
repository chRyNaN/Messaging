package entity;

import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapKeyJoinColumn;
import javax.persistence.OneToMany;

@Entity
public class UserSocial implements Serializable{
	private static final long serialVersionUID = -6187614907440608973L;

	@Id @GeneratedValue
	private long databaseId;
	
	@OneToMany
	@JoinColumn(name = "FRIENDS")
	private Set<User> friends;
	
	@ElementCollection(fetch = FetchType.LAZY)
	@MapKeyJoinColumn(name = "FRIEND_REQUESTS")
	private Map<User, Boolean> friendRequests; //map to save seen state
	
	@OneToMany
	@JoinColumn(name = "SENT_REQUESTS")
	private Set<User> sentRequests; //don't need seen state for sent friend requests
	
	@OneToMany
	@JoinColumn
	private Set<Conversation> conversations;
	
	public UserSocial(){
		friends = new LinkedHashSet<User>();
		sentRequests = new LinkedHashSet<User>();
		friendRequests = new ConcurrentHashMap<User, Boolean>();
	}
	
	public void addFriend(User friend){
		this.friends.add(friend);
	}
	
	public boolean deleteFriend(User friend){
		if (this.friends.contains(friend)){
			return this.friends.remove(friend);
		}else{
			return false;
		}
	}
	
	public Set<User> getFriends(){
		return friends;
	}
	
	public void setFriends(Set<User> friends){
		this.friends = friends;
	}
	
	public void addSentRequest(User rec){
		this.sentRequests.add(rec);
	}
	
	public boolean removeSentRequest(User rec){
		if (this.sentRequests.contains(rec)){
			return this.sentRequests.remove(rec);
		}else{
			return false;
		}
	}
	
	public Set<User> getSentRequests(){
		return sentRequests;
	}
	
	public void setSentRequests(Set<User> requests){
		this.sentRequests = requests;
	}
	
	public void addFriendRequest(User request){
		this.friendRequests.put(request, false);
	}
	
	public boolean removeFriendRequest(User request){
		if (this.friendRequests.containsKey(request)){
			return this.friendRequests.remove(request);	
		}else{
			return false;
		}
	}
	
	public Map<User, Boolean> getFriendRequests(){
		return friendRequests;
	}
	
	public void setFriendRequests(Map<User, Boolean> requests){
		this.friendRequests = requests;
	}
	
	public Set<Conversation> getConversations(){
		return conversations;
	}
	
	public void setConversations(Set<Conversation> conversations){
		this.conversations = conversations;
	}
	
}
