package com.sop_project.lectureservice;

import com.sop_project.lectureservice.repository.LectureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

	@EnableDiscoveryClient
	@SpringBootApplication
	@EnableMongoRepositories
public class LectureServiceApplication {

	@Autowired
	LectureRepository lectureRepository;

	public static void main(String[] args) {
		SpringApplication.run(LectureServiceApplication.class, args);
	}

}
