package com.sop_project.lectureservice.data;

import lombok.Data;

import java.util.ArrayList;

@Data
public class UpdateLectureData {

    private String title;
    private String oldTitle;
    private String description;
    private String contact;
    private ArrayList<String> tag;
    private ArrayList<String> permission;
    private String privacy;

    public UpdateLectureData() {
        this("", "", "", "", new ArrayList<>(), new ArrayList<>(), "");
    }

    public UpdateLectureData(String title, String oldTitle, String description, String contact, ArrayList<String> tag, ArrayList<String> permission, String privacy) {
        this.title = title;
        this.oldTitle = oldTitle;
        this.description = description;
        this.contact = contact;
        this.tag = tag;
        this.permission = permission;
        this.privacy = privacy;
    }

}
