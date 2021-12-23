package com.sop_project.lectureservice.data;

import lombok.Data;

import java.util.ArrayList;

@Data
public class LecturePageData {

    private String title;
    private String contact;
    private String description;
    private ArrayList<String> permission;
    private String privacy;
    private ArrayList<String> tag;
    private double rating;
    private ArrayList<Comment> comment;
    private String ownerName;
    private String ownerEmail;
    private String ownerImage;
    private int downloadCount;
    private int userRating;

    public LecturePageData(String title, String contact, String description, ArrayList<String> permission, String privacy, ArrayList<String> tag, double rating, ArrayList<Comment> comment, String ownerName, String ownerEmail, String ownerImage, int downloadCount, int userRating) {
        this.title = title;
        this.contact = contact;
        this.description = description;
        this.permission = permission;
        this.privacy = privacy;
        this.tag = tag;
        this.rating = rating;
        this.comment = comment;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
        this.ownerImage = ownerImage;
        this.downloadCount = downloadCount;
        this.userRating = userRating;
    }
}
