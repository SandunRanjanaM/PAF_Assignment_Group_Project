package com.sliit.backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dz2kgputl",
                "api_key", "645982481859273",
                "api_secret", "VX8xD5hVCRY4qWIR8Bg0ial4BJw"
        ));
    }
}
