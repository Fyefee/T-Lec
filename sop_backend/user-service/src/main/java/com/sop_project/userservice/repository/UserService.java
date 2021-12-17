package com.sop_project.userservice.repository;

import com.sop_project.userservice.data.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    @Cacheable(value="users")
    public List<User> getAllUser(){
        return repository.findAll();
    }

    @Cacheable(value="users")
    public User getUserByEmail(String email){
        return repository.findByEmail(email);
    }

    @Cacheable(value="users")
    public User createdNewUser(User user){
        return repository.save(user);
    }

    public User updateUser(User user){
        return repository.save(user);
    }
}
