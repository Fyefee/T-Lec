package com.sop_project.tagservice.controller;

import com.sop_project.tagservice.data.Tag;
import com.sop_project.tagservice.data.UpdateTag;
import com.sop_project.tagservice.repository.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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
        System.out.println(data);
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
}
