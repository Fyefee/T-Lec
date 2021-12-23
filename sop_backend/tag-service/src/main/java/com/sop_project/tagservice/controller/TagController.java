package com.sop_project.tagservice.controller;

import com.sop_project.tagservice.data.Tag;
import com.sop_project.tagservice.data.UpdateTag;
import com.sop_project.tagservice.repository.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class TagController {

    @Autowired
    private TagService tagService;

    @RequestMapping(value = "/getAllTag", method = RequestMethod.GET)
    public ResponseEntity<?> getAllTag(){
        return ResponseEntity.ok(tagService.getAllTag());
    }

    @RequestMapping(value = "/updateLectureTag", method = RequestMethod.POST)
    public ResponseEntity<?> updateLectureTag(@RequestBody UpdateTag data){
        ArrayList<String> oldTagForUpdate = new ArrayList<>();
        for (String tag : data.getOldTag()){
            if (!data.getOldDataTag().contains(tag))
                oldTagForUpdate.add(tag);
        }
        for (String tag : oldTagForUpdate){
            Tag tagData = tagService.getTagByName(tag);
            tagData.setCount(tagData.getCount() + 1);
            tagService.updateTag(tagData);
        }

        for (String tag : data.getNewTag()){
            tagService.createdNewTag(new Tag(null, tag, 1));
        }

        return ResponseEntity.ok("Update Tag Complete");
    }

    @RequestMapping(value = "/createTag/{name}", method = RequestMethod.POST)
    public ResponseEntity<?> createTag(@PathVariable("name") String tagName){
        tagService.createdNewTag(new Tag(null ,tagName, 1));
        return ResponseEntity.ok(true);
    }

    @RequestMapping(value = "/updateTag/{name}", method = RequestMethod.POST)
    public ResponseEntity<?> updateTag(@PathVariable("name") String tagName){
        Tag tag = tagService.getTagByName(tagName);
        tag.setCount(tag.getCount() + 1);
        tagService.updateTag(tag);
        return ResponseEntity.ok(true);
    }

}
