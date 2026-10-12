package com.cinehub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CineHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(CineHubApplication.class, args);
    }
}
