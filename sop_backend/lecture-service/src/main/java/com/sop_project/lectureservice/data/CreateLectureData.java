package com.sop_project.lectureservice.data;

import lombok.Data;

import java.util.ArrayList;

@Data
public class CreateLectureData {

    private String title;
    private String description;
    private String contact;
    private ArrayList<String> newTag;
    private ArrayList<String> oldTag;
    private ArrayList<String> permission;
    private String privacy;
    private String owner;
    private String fileName;
    private String fileBase64;

}
