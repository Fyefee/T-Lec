package com.sop_project.lectureservice.data;

import lombok.Data;

import java.util.ArrayList;

@Data
public class FilterHomeLectureData {

    private String title;
    private String photoUrl;
    private ArrayList<String> lecTag;
    private String lecDescription;
    private double lecRating;
    private String owner;

    public FilterHomeLectureData() {
    }

    public FilterHomeLectureData(String title, String photoUrl, ArrayList<String> lecTag, String lecDescription, double lecRating, String owner) {
        this.title = title;
        this.photoUrl = photoUrl;
        this.lecTag = lecTag;
        this.lecDescription = lecDescription;
        this.lecRating = lecRating;
        this.owner = owner;
    }

}
