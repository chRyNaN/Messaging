package entity;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "APP_USER")
@NamedQuery(name = "FIND_WITH_USER_ID", query="SELECT DISTINCT u FROM User u WHERE u.userId = :userId")
public class User implements Serializable{
	private static final long serialVersionUID = 2468889149889625824L;
	@Id @GeneratedValue
	private long databaseId;
	private String userId;
	
	private UserInfo info;
	private UserSocial social;
	
	public User(){
		userId = UUID.randomUUID().toString();
		info = new UserInfo();
		social = new UserSocial();
	}
	
	public User(String firstName, String lastName, String email, String userName){
		userId = UUID.randomUUID().toString();
		info = new UserInfo(firstName, lastName, email, userName);
		social = new UserSocial();
	}
	
	public User(String firstName, String lastName, String email, String userName, Date birthday){
		userId = UUID.randomUUID().toString();
		info = new UserInfo(firstName, lastName, email, userName, birthday);
		social = new UserSocial();
	}
	
	/** Getters and Setters */
	
	public String getUserId(){
		return userId;
	}
	
	public void setUserId(String userId){
		this.userId = userId;
	}
	
	public String getFirstName() {
		return info.getFirstName();
	}

	public void setFirstName(String firstName) {
		this.info.setFirstName(firstName);
	}

	public String getLastName() {
		return info.getLastName();
	}

	public void setLastName(String lastName) {
		this.info.setLastName(lastName);;
	}

	public String getEmail() {
		return info.getEmail();
	}

	public void setEmail(String email) {
		this.info.setEmail(email);;
	}

	public String getUserName() {
		return info.getUserName();
	}

	public void setUserName(String userName) {
		this.info.setUserName(userName);;
	}
	
	public Date getBirthday(){
		return info.getBirthday();
	}
	
	public void setBirthday(Date birthday){
		this.info.setBirthday(birthday);
	}
	
	public Date getSignUpDate(){
		return info.getSignUpDate();
	}
	
	public void addFriend(User friend){
		this.social.addFriend(friend);
	}
	
	public boolean deleteFriend(User friend){
		return this.social.deleteFriend(friend);
	}
	
	public Set<User> getFriends(){
		return social.getFriends();
	}
	
	public void setFriends(Set<User> friends){
		this.social.setFriends(friends);
	}
	
	public void addSentRequest(User rec){
		this.social.addSentRequest(rec);
	}
	
	public boolean removeSentRequest(User rec){
		return this.social.removeSentRequest(rec);
	}
	
	public Set<User> getSentRequests(){
		return social.getSentRequests();
	}
	
	public void setSentRequests(Set<User> requests){
		this.social.setSentRequests(requests);
	}
	
	public void addFriendRequest(User request){
		this.social.addFriendRequest(request);
	}
	
	public boolean removeFriendRequest(User request){
		return this.social.removeFriendRequest(request);
	}
	
	public Map<User, Boolean> getFriendRequests(){
		return this.social.getFriendRequests();
	}
	
	public void setFriendRequests(Map<User, Boolean> requests){
		this.social.setFriendRequests(requests);
	}
	
	public Set<Conversation> getConversations(){
		return this.social.getConversations();
	}
	
	public void setConversations(Set<Conversation> conversations){
		this.social.setConversations(conversations);
	}
	
}
