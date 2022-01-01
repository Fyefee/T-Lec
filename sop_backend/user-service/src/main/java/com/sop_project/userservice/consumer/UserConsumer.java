package com.sop_project.userservice.consumer;

import com.sop_project.userservice.data.FilterUserData;
import com.sop_project.userservice.data.LoginUser;
import com.sop_project.userservice.data.User;
import com.sop_project.userservice.repository.UserService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserConsumer {

    @Autowired
    UserService userService;

    @RabbitListener(queues = "NewUserQueue")
    public FilterUserData createNewUser(User user){
        userService.createdNewUser(user);
        return new FilterUserData(user.getFirstname(), user.getLastname(), user.getImage(), user.getEmail());
    }

    @RabbitListener(queues = "OldUserQueue")
    public FilterUserData updateOldUser(LoginUser loginUser){
        User user = userService.getUserByEmail(loginUser.getEmail());
        user.setFirstname(loginUser.getGivenName());
        user.setLastname(loginUser.getFamilyName());
        user.setImage(loginUser.getPhotoUrl());
        userService.updateUser(user);
        return new FilterUserData(user.getFirstname(), user.getLastname(), user.getImage(), user.getEmail());
    }
}
