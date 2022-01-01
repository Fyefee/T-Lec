package com.sop_project.userservice.data;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Document("users")
public class User implements Serializable {

    @Id
    private String _id;
    private String firstname;
    private String lastname;
    private String image;
    private String email;
    private ArrayList<String> following;
    private ArrayList<String> follower;
    private ArrayList<String> post;
    private ArrayList<String> recentView;
    private ArrayList<Notification> notification;

    public User() {
        this("", "", "", "", "", new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
    }

    public User(String _id, String firstname, String lastname, String image, String email, ArrayList<String> following, ArrayList<String> follower, ArrayList<String> post, ArrayList<String> recentView, ArrayList<Notification> notification) {
        this._id = _id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.image = image;
        this.email = email;
        this.following = following;
        this.follower = follower;
        this.post = post;
        this.recentView = recentView;
        this.notification = notification;
    }
}
