package com.sop_project.tagservice.controller;

import com.sop_project.tagservice.repository.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TagController {

    @Autowired
    private TagService tagService;

    @RequestMapping(value = "/getAllTag", method = RequestMethod.GET)
    public ResponseEntity<?> getAllTag(){
        return ResponseEntity.ok(tagService.getAllTag());
    }
}
