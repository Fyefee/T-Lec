package com.sop_project.userservice.data;

import lombok.Data;

@Data
public class Notification {

    private String ownerName;
    private String lectureTitle;

    public Notification() {
    }

    public Notification(String ownerName, String lectureTitle) {
        this.ownerName = ownerName;
        this.lectureTitle = lectureTitle;
    }
}
