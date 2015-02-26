package endpoint;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath("rs")
public class ApplicationConfig extends Application{
	private final Set<Class<?>> classes;
	
	public ApplicationConfig(){
		HashSet<Class<?>> c = new HashSet<>();
		c.add(RestService.class);
		classes = Collections.unmodifiableSet(c);
	}
	
}
