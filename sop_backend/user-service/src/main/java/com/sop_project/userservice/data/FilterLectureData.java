package com.sop_project.userservice.data;

import lombok.Data;

@Data
public class FilterLectureData {

    private String title;
    private String privacy;
    private double ratingAvg;

    public FilterLectureData() {
        this("", "", 0);
    }

    public FilterLectureData(String title, String privacy, double ratingAvg) {
        this.title = title;
        this.privacy = privacy;
        this.ratingAvg = ratingAvg;
    }
}
