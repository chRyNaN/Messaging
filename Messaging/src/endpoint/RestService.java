package endpoint;

import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

@Path("/message")
@Stateless
public class RestService {
	
	@GET
	@Path("/isAvailable/{userId}")
	public boolean isUserIDAvailable(@PathParam("userId") String userId){
		return MessageServer.containsUser(userId);
	}
	
}
