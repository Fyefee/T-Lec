package com.sop_project.lectureservice.data;

import lombok.Data;

@Data
public class RatingData {

    private String lecTitle;
    private int rating;
    private String userEmail;

    public RatingData() {
        this("", 0, "");
    }

    public RatingData(String lecTitle, int rating, String userEmail) {
        this.lecTitle = lecTitle;
        this.rating = rating;
        this.userEmail = userEmail;
    }
}
