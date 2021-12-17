package com.sop_project.lectureservice.data;

import lombok.Data;

@Data
public class AddCommentData {

    private String lecTitle;
    private Comment comment;

    public AddCommentData() {
        this("", null);
    }

    public AddCommentData(String lecTitle, Comment comment) {
        this.lecTitle = lecTitle;
        this.comment = comment;
    }

}
