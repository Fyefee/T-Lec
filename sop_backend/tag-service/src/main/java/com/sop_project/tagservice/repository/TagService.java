package com.sop_project.tagservice.repository;

import com.sop_project.tagservice.data.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    @Autowired
    private TagRepository repository;

    public TagService(TagRepository repository) {
        this.repository = repository;
    }

    @Cacheable(value="tags")
    public List<Tag> getAllTag(){
        return repository.findAllTag();
    }

    @Cacheable(value="tags")
    public Tag getTagByName(String name){
        return repository.findByTagName(name);
    }

    public Tag updateTag(Tag tag){
        return repository.save(tag);
    }

    @Cacheable(value="tags")
    public Tag createdNewTag(Tag tag){
        System.out.println(tag);
        return repository.save(tag);
    }
}
