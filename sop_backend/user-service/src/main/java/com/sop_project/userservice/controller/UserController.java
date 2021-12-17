package com.sop_project.userservice.controller;

import com.sop_project.userservice.data.*;
import com.sop_project.userservice.repository.UserService;
import org.bson.json.JsonObject;
import org.json.JSONObject;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@RestController
public class UserController {

    @Autowired
    private Environment env;

    @Autowired
    private UserService userService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestBody LoginUser loginUser){
        if (loginUser.getEmail().contains("@it.kmitl.ac.th")) {
            User user = userService.getUserByEmail(loginUser.getEmail());
            if (user == null){
                User newUser = new User(null, loginUser.getGivenName(), loginUser.getFamilyName(),
                        loginUser.getPhotoUrl(), loginUser.getEmail(), new ArrayList<>(),
                        new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
                FilterUserData userFromRabbit = (FilterUserData) rabbitTemplate.convertSendAndReceive("UserExchange", "new", newUser);
                return ResponseEntity.ok(userFromRabbit);
            } else {
                FilterUserData userFromRabbit = (FilterUserData) rabbitTemplate.convertSendAndReceive("UserExchange", "old", loginUser);
                return ResponseEntity.ok(userFromRabbit);
            }
        }
        else {
            return ResponseEntity.ok("wrong domain");
        }
    }

    @RequestMapping(value = "/getUserByEmail/{email}", method = RequestMethod.GET)
    public ResponseEntity<?> getUserByEmail(@PathVariable("email") String email){
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(createUserData(user));
        }
        else {
            return ResponseEntity.ok(null);
        }
    }

    @RequestMapping(value = "/getRecentViewByEmail/{email}", method = RequestMethod.GET)
    public ResponseEntity<?> getRecentViewByEmail(@PathVariable("email") String email){
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user.getRecentView());
        }
        else {
            return ResponseEntity.ok(null);
        }
    }

    @RequestMapping(value = "/getNotificationByEmail/{email}", method = RequestMethod.GET)
    public ResponseEntity<?> getNotificationByEmail(@PathVariable("email") String email){
        User user = userService.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok(user.getNotification());
        }
        else {
            return ResponseEntity.ok(null);
        }
    }

    @RequestMapping(value = "/getAllUserEmail", method = RequestMethod.GET)
    public ResponseEntity<?> getAllUserEmail(){

        List<User> users = userService.getAllUser();
        ArrayList<String> allUserEmail = new ArrayList<>();

        for (User user : users){
            allUserEmail.add(user.getEmail());
        }

        return ResponseEntity.ok(allUserEmail);
    }

    @RequestMapping(value = "/getDataForLibrary", method = RequestMethod.GET)
    public ResponseEntity<?> getDataForLibrary(@RequestParam("email") String email, @RequestParam("userEmail") String userEmail){

        User user = userService.getUserByEmail(email);
        ArrayList<FilterLectureData> lectureData = getLectureByOwner(email);

        double rating = 0;
        double ratingCount = 0;

        int postCount = lectureData.size();
        int followerCount = user.getFollower().size();
        int followingCount = user.getFollowing().size();

        for (FilterLectureData lecture : lectureData){
            rating += lecture.getRatingAvg();
            postCount += 1;

            if (lecture.getRatingAvg() > 0){
                ratingCount += 1;
            }
        }

        if (ratingCount > 0){
            rating /= ratingCount;
        }

        boolean isFollow = user.getFollower().contains(userEmail);

        LibraryUserData libraryUserData = new LibraryUserData(user.getFirstname(), user.getLastname(),
                user.getImage(), user.getEmail(), rating, postCount, followerCount, followingCount,
                lectureData, isFollow);

        return ResponseEntity.ok(libraryUserData);
    }

    @RequestMapping(value = "/updateRecentView/{title}/{email}", method = RequestMethod.POST)
    public ResponseEntity<?> updateRecentView(@PathVariable("title") String title, @PathVariable("email") String email){

        User user = userService.getUserByEmail(email);
        ArrayList<String> recentView = user.getRecentView();
        if (recentView.size() >= 5){
            recentView.remove(0);
        }
        if(!recentView.contains(title))
            recentView.add(title);

        user.setRecentView(recentView);
        userService.updateUser(user);

        return ResponseEntity.ok("Update Complete");
    }

    @RequestMapping(value = "/deleteNotification", method = RequestMethod.POST)
    public ResponseEntity<?> deleteNotification(@RequestBody DeleteNotificationData data){
        User user = userService.getUserByEmail(data.getEmail());
        ArrayList<Notification> notifications = user.getNotification();
        notifications.remove(data.getNotification());
        user.setNotification(notifications);
        userService.updateUser(user);
        return ResponseEntity.ok("Delete Notification Complete");
    }

    @RequestMapping(value = "/followUser", method = RequestMethod.GET)
    public ResponseEntity<?> followUser(@RequestParam("userEmail") String userEmail, @RequestParam("followEmail") String followEmail){

        User followUserData = userService.getUserByEmail(followEmail);
        followUserData.setFollower(toggleFollow(followUserData.getFollower(), userEmail));
        userService.updateUser(followUserData);

        User userData = userService.getUserByEmail(userEmail);
        userData.setFollowing(toggleFollow(userData.getFollowing(), followEmail));
        userService.updateUser(userData);

        return ResponseEntity.ok("Update Follow Complete");
    }

    private ArrayList<String> toggleFollow(ArrayList<String> follow, String email){
        if (follow.contains(email))
            follow.remove(email);
        else
            follow.add(email);
        return follow;
    }

    private FilterUserData createUserData(User user){
        FilterUserData userData = new FilterUserData(user.getFirstname(), user.getLastname(),
                user.getImage(), user.getEmail());
        return userData;
    }

    public ArrayList<FilterLectureData> getLectureByOwner(String email){
        ArrayList out = WebClient.create()
                .get()
                .uri("http://192.168.1.9:3001/lecture-service/getLectureByOwner/" + email)
                .retrieve()
                .bodyToMono(ArrayList.class)
                .block();
        ArrayList<FilterLectureData> filterLectureData = new ArrayList<>();
        for (Object data : out){
            filterLectureData.add(new FilterLectureData((String)((LinkedHashMap) data).get("title"), (String)((LinkedHashMap) data).get("privacy"), (double)((LinkedHashMap) data).get("ratingAvg")));
        }
        return filterLectureData;
    }

}
