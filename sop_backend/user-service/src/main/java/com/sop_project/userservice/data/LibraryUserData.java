package com.sop_project.userservice.data;

import lombok.Data;

import java.util.ArrayList;

@Data
public class LibraryUserData {

    private String userFirstName;
    private String userLastName;
    private String userImage;
    private String userEmail;
    private double rating;
    private int postCount;
    private int userFollower;
    private int userFollowing;
    private ArrayList<FilterLectureData> userLecture;
    private boolean isFollow;

    public LibraryUserData() {
        this("", "", "", "", 0, 0, 0, 0, new ArrayList<>(), false);
    }

    public LibraryUserData(String userFirstName, String userLastName, String userImage, String userEmail, double rating, int postCount, int userFollower, int userFollowing, ArrayList<FilterLectureData> userLecture, boolean isFollow) {
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.userImage = userImage;
        this.userEmail = userEmail;
        this.rating = rating;
        this.postCount = postCount;
        this.userFollower = userFollower;
        this.userFollowing = userFollowing;
        this.userLecture = userLecture;
        this.isFollow = isFollow;
    }

}
