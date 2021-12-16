package com.sop_project.lectureservice.data;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;

@Data
public class FilterLectureData implements Serializable {

    private String title;
    private String privacy;
    private double ratingAvg;

    public FilterLectureData() {
    }

    public FilterLectureData(String title, String privacy, double ratingAvg) {
        this.title = title;
        this.privacy = privacy;
        this.ratingAvg = ratingAvg;
    }
}
