package com.sop_project.userservice.data;

import lombok.Data;

import java.io.Serializable;

@Data
public class LoginUser implements Serializable {

    private String email;
    private String familyName;
    private String givenName;
    private String id;
    private String name;
    private String photoUrl;

}
