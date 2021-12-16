package com.sop_project.userservice.data;

import lombok.Data;

@Data
public class LibraryLectureData {

    private String title;
    private String privacy;

    public LibraryLectureData() {
        this("", "");
    }

    public LibraryLectureData(String title, String privacy) {
        this.title = title;
        this.privacy = privacy;
    }
}
