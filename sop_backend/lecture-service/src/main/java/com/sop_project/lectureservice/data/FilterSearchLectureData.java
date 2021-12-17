package com.sop_project.lectureservice.data;

import lombok.Data;

import java.util.ArrayList;

@Data
public class FilterSearchLectureData {

    private String title;
    private String ownerName;
    private String ownerEmail;
    private ArrayList<String> tag;
    private String photoUrl;

    public FilterSearchLectureData() {
        this("", "", "", new ArrayList<>(), "");
    }

    public FilterSearchLectureData(String title, String ownerName, String ownerEmail, ArrayList<String> tag, String photoUrl) {
        this.title = title;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
        this.tag = tag;
        this.photoUrl = photoUrl;
    }
}
