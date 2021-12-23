package com.sop_project.lectureservice.data;

import lombok.Data;

import java.util.Date;

@Data
public class Comment {

    private String userImage;
    private String userName;
    private String userEmail;
    private String comment;
    private double createdDate;

}
