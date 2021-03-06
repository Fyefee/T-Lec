package com.sop_project.lectureservice.data;

import lombok.Data;

@Data
public class LectureTag {

    private String tagName;
    private int count;

    public LectureTag() {
        this("", 0);
    }

    public LectureTag(String tagName, int count) {
        this.tagName = tagName;
        this.count = count;
    }
}
