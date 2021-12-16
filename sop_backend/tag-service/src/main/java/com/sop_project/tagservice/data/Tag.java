package com.sop_project.tagservice.data;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("tags")
public class Tag {

    @Id
    private String _id;
    private String tagName;
    private int count;

    public Tag() {
    }

    public Tag(String _id, String tagName, int count) {
        this._id = _id;
        this.tagName = tagName;
        this.count = count;
    }
}
