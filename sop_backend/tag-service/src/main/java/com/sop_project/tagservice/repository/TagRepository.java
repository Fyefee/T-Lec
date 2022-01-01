package com.sop_project.tagservice.repository;

import com.sop_project.tagservice.data.Tag;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends MongoRepository<Tag, String> {

    @Query(value = "{}", fields = "{'_id': 0, 'tagName': 1, 'count': 1}")
    public List<Tag> findAllTag();

    @Query(value = "{tagName: '?0'}")
    public Tag findByTagName(String tagName);
}
