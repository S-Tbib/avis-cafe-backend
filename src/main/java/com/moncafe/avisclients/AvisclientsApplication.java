package com.moncafe.avisclients;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@SpringBootApplication
public class AvisclientsApplication {

    public static void main(String[] args) {
        SpringApplication.run(AvisclientsApplication.class, args);
    }

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
        return builder -> builder.modules(new JavaTimeModule());
    }
<<<<<<< HEAD
// PasswordEncoder bean is provided in SecurityConfig to avoid duplicate bean definitions
=======

>>>>>>> cfcb295429da9ce9ba549af75919b3215a049b60
}
