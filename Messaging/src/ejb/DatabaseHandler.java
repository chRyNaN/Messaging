package ejb;

import java.nio.ByteBuffer;
import java.util.Set;
import java.util.concurrent.Future;

import javax.ejb.Asynchronous;
import javax.ejb.Stateless;

@Stateless
public class DatabaseHandler {

	@Asynchronous
	public void saveMessage(String message, String userId, Set<String> recipients){
		
	}
	
	@Asynchronous
	public Future<String> saveFile(ByteBuffer buffer, String userId){
		return null;
	}
	
}
