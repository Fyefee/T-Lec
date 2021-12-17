package com.sop_project.lectureservice.data;

import lombok.Data;

@Data
public class UserEmail {

    private String owner;

    public UserEmail() {
        this("");
    }

    public UserEmail(String owner) {
        this.owner = owner;
    }
}
