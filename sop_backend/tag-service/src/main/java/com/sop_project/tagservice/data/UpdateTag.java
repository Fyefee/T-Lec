package com.sop_project.tagservice.data;

import lombok.Data;

import java.util.ArrayList;

@Data
public class UpdateTag {

    private ArrayList<String> newTag;
    private ArrayList<String> oldTag;
    private ArrayList<String> oldDataTag;

    public UpdateTag() {
        this(new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
    }

    public UpdateTag(ArrayList<String> newTag, ArrayList<String> oldTag, ArrayList<String> oldDataTag) {
        this.newTag = newTag;
        this.oldTag = oldTag;
        this.oldDataTag = oldDataTag;
    }
}
