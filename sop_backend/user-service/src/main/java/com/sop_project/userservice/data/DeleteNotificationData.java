package com.sop_project.userservice.data;

import lombok.Data;

import java.util.ArrayList;

@Data
public class DeleteNotificationData {

    private String email;
    private Notification notification;

    public DeleteNotificationData() {
        this("", null);
    }

    public DeleteNotificationData(String email, Notification notification) {
        this.email = email;
        this.notification = notification;
    }
}
