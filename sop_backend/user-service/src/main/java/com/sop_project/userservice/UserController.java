package com.sop_project.userservice;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class UserController {

    @Autowired
    private Environment env;

    @GetMapping
    public ResponseEntity<?> getPort(){
        String text = "port : " + env.getProperty("local.server.port");
        return ResponseEntity.ok(text);
    }

}
