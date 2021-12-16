package com.sop_project.lectureservice.repository;

import com.sop_project.lectureservice.data.Lecture;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureRepository extends MongoRepository<Lecture, String> {

    @Query(value = "{owner: '?0'}")
    public List<Lecture> findByOwner(String owner);

    @Query(value = "{title: '?0'}")
    public Lecture findByTitle(String title);

//    @Query(sort = "{ createdDate: -1 }")
//    public List<Lecture> getSortedLectureAndLimit();

}
