package com.sop_project.lectureservice.repository;

import com.sop_project.lectureservice.data.Lecture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LectureService {

    @Autowired
    private LectureRepository lectureRepository;

    public LectureService(LectureRepository lectureRepository) {
        this.lectureRepository = lectureRepository;
    }

    public List<Lecture> getLectureByOwner(String owner){
        return lectureRepository.findByOwner(owner);
    }

    public Lecture getLectureByTitle(String title){
        return lectureRepository.findByTitle(title);
    }

    public Page<Lecture> getSortedLectureAndLimit(){
        return lectureRepository.findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdDate")));
    }

    public Lecture updateLecture(Lecture lecture){
        return lectureRepository.save(lecture);
    }

}
