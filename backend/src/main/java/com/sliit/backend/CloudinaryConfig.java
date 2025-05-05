package com.sliit.backend;
 
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
 
//import java.util.Map;
 
@Configuration
public class CloudinaryConfig {
 
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dqnrdlpcn",
            "api_key", "946169137896348",
            "api_secret", "37J71jcETqxIl6AfFMeh0xXgdZE"
        ));
    }
}