package com.sop_project.lectureservice.data;

import lombok.Data;

@Data
public class FilterRankingLectureData {

    private String title;
    private String owner;
    private String ownerImage;
    private double score;

    public FilterRankingLectureData() {
        this("", "", "", 0);
    }

    public FilterRankingLectureData(String title, String owner, String ownerImage, double score) {
        this.title = title;
        this.owner = owner;
        this.ownerImage = ownerImage;
        this.score = score;
    }

}
