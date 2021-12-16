package com.sop_project.userservice.data;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.util.ArrayList;

@Data
public class FilterUserData implements Serializable {

    private String firstname;
    private String lastname;
    private String image;
    private String email;

    public FilterUserData() {
    }

    public FilterUserData(String firstname, String lastname, String image, String email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.image = image;
        this.email = email;
    }
}
