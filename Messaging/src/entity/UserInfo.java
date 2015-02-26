package entity;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
public class UserInfo implements Serializable{
	private static final long serialVersionUID = 3662319727588854078L;

	@Id @GeneratedValue
	private long databaseId;
	
	private String firstName;
	private String lastName;
	private String email;
	private String userName;
	
	private String phoneNumber;
	private String gender;
	
	@Temporal(TemporalType.TIMESTAMP)
	private Date signUpDate;
	@Temporal(TemporalType.DATE)
	private Date birthday;
	
	public UserInfo(){
		signUpDate = (Calendar.getInstance()).getTime();
	}
	
	public UserInfo(String firstName, String lastName, String email, String userName){
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.userName = userName;
		signUpDate = (Calendar.getInstance()).getTime();
	}
	
	public UserInfo(String firstName, String lastName, String email, String userName, Date birthday){
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.userName = userName;
		this.birthday = birthday;
		signUpDate = (Calendar.getInstance()).getTime();
	}
	
	/** Getters and Setters */
	
	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public Date getBirthday(){
		return birthday;
	}
	
	public void setBirthday(Date birthday){
		this.birthday = birthday;
	}
	
	public Date getSignUpDate(){
		return signUpDate;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	
}
