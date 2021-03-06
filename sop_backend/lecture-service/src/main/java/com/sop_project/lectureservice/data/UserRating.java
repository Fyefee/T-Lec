package com.sop_project.lectureservice.data;

import lombok.Data;

@Data
public class UserRating {

    private String email;
    private int rating;

    public UserRating() {
        this("", 0);
    }

    public UserRating(String email, int rating) {
        this.email = email;
        this.rating = rating;
    }
}
