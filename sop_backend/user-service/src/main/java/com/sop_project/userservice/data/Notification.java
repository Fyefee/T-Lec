package com.sop_project.userservice.data;

import lombok.Data;

import java.io.Serializable;

@Data
public class Notification implements Serializable {

    private String ownerName;
    private String lectureTitle;

    public Notification() {
        this("", "");
    }

    public Notification(String ownerName, String lectureTitle) {
        this.ownerName = ownerName;
        this.lectureTitle = lectureTitle;
    }
}
