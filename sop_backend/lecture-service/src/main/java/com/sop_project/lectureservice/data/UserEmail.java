package com.sop_project.lectureservice.data;

import lombok.Data;

@Data
public class UserEmail {

    private String owner;

    public UserEmail() {
    }

    public UserEmail(String owner) {
        this.owner = owner;
    }
}
