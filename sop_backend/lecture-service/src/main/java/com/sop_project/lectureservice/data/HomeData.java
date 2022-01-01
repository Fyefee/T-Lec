package com.sop_project.lectureservice.data;

import lombok.Data;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

@Data
public class HomeData {

    private ArrayList<FilterHomeLectureData> recentView;
    private ArrayList<FilterHomeLectureData> newLec;

    public HomeData() {
        this(new ArrayList<>(), new ArrayList<>());
    }

    public HomeData(ArrayList<FilterHomeLectureData> recentView, ArrayList<FilterHomeLectureData> newLec) {
        this.recentView = recentView;
        this.newLec = newLec;
    }
}
