package com.sop_project.lectureservice.data;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;

@Data
@Document("lectures")
public class Lecture implements Serializable {

    @Id
    private String _id;
    private String title;
    private String description;
    private String contact;
    private ArrayList<String> tag;
    private String privacy;
    private ArrayList<String> userPermission;
    private String owner;
    private ArrayList<String> downloadFromUser;
    private ArrayList<UserRating> rating;
    private double ratingAvg;
    private String fileName;
    private String fileUrl;
    private ArrayList<Comment> comment;
    private Date createdDate;

    public Lecture(String _id, String title, String description, String contact, ArrayList<String> tag, String privacy, ArrayList<String> userPermission, String owner, ArrayList<String> downloadFromUser, ArrayList<UserRating> rating, double ratingAvg, String fileName, String fileUrl, ArrayList<Comment> comment, Date createdDate) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.contact = contact;
        this.tag = tag;
        this.privacy = privacy;
        this.userPermission = userPermission;
        this.owner = owner;
        this.downloadFromUser = downloadFromUser;
        this.rating = rating;
        this.ratingAvg = ratingAvg;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.comment = comment;
        this.createdDate = createdDate;
    }
}
