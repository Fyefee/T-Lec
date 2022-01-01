package com.sop_project.lectureservice.controller;

import com.mongodb.client.gridfs.model.GridFSFile;
import com.sop_project.lectureservice.data.*;
import com.sop_project.lectureservice.repository.LectureService;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import javax.xml.bind.DatatypeConverter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
public class LectureController {

    @Autowired
    private LectureService lectureService;

    @RequestMapping(value = "/getHomeData/{email}", method = RequestMethod.GET)
    public ResponseEntity<?> getHomeData(@PathVariable("email") String userEmail){

        HomeData homeData = new HomeData();

        Page<Lecture> data = lectureService.getSortedLectureAndLimit();
        for (Lecture lecture : data.getContent()){
            FilterUserData user = getUserByEmail(lecture.getOwner());
            homeData.getNewLec().add(new FilterHomeLectureData(lecture.getTitle(),
                    user.getImage(), lecture.getTag(), lecture.getDescription(), lecture.getRatingAvg(),
                    lecture.getOwner()));
        }

        ArrayList<String> recentView = getRecentView(userEmail);
        //ArrayList<String> recentView = getRecentView("62070166@it.kmitl.ac.th");
        for (String lecTitle : recentView){
            Lecture lecture = lectureService.getLectureByTitle(lecTitle);
            if (lecture != null){
                FilterUserData user = getUserByEmail(lecture.getOwner());
                homeData.getRecentView().add(new FilterHomeLectureData(lecture.getTitle(),
                        user.getImage(), lecture.getTag(), lecture.getDescription(), lecture.getRatingAvg(),
                        lecture.getOwner()));
            }
        }

        return ResponseEntity.ok(homeData);
    }

    @RequestMapping(value = "/checkLecDuplicate/{title}", method = RequestMethod.POST)
    public ResponseEntity<?> checkLecDuplicate(@PathVariable String title){

        Lecture lecture = lectureService.getLectureByTitle(title);
        if (lecture == null){
            return ResponseEntity.ok(true);
        }
        else {
            return ResponseEntity.ok(false);
        }
    }

    @RequestMapping(value = "/uploadLec", method = RequestMethod.POST)
    public ResponseEntity<?> uploadLec(@RequestBody CreateLectureData data){

        ArrayList<String> allTag = new ArrayList<>();
        for (String tag : data.getNewTag()){
            connectTagAPI("createTag", tag);
            allTag.add(tag);
        }
        for (String tag : data.getOldTag()){
            connectTagAPI("updateTag", tag);
            allTag.add(tag);
        }

        addNotification(data.getOwner(), data.getTitle());

        byte[] fileData = Base64.getDecoder().decode(data.getFileBase64());
        String path = System.getProperty("user.dir") + "/files/" + data.getOwner() + "/" + data.getTitle() + "/" + data.getFileName();

        File file = new File(System.getProperty("user.dir") + "/files/" + data.getOwner() + "/" + data.getTitle());
        file.mkdirs();

        Lecture newLecture = lectureService.createLecture(new Lecture(null, data.getTitle(), data.getDescription(),
                data.getContact(), allTag, data.getPrivacy(), data.getPermission(), data.getOwner(),
                new ArrayList<>(), new ArrayList<>(), 0, data.getFileName(), path, new ArrayList<>(),
                new Date()));

        try( OutputStream stream = new FileOutputStream(path) )
        {
            stream.write(fileData);
        }
        catch (Exception e)
        {
            System.out.println(e);
            System.err.println("Couldn't write to file...");
        }
        return ResponseEntity.ok("Create Complete");
    }

    @RequestMapping(value = "/getLectureByOwner/{owner}", method = RequestMethod.GET)
    public ResponseEntity<?> getLectureByOwner(@PathVariable("owner") String owner){
        List<Lecture> lectures = lectureService.getLectureByOwner(owner);
        ArrayList<FilterLectureData> filterLectureData = new ArrayList<>();
        for (Lecture lecture : lectures){
            filterLectureData.add(new FilterLectureData(lecture.getTitle(), lecture.getPrivacy(), lecture.getRatingAvg()));
        }
        return ResponseEntity.ok(filterLectureData);
    }

    @RequestMapping(value = "/getLectureData", method = RequestMethod.GET)
    public ResponseEntity<?> getLectureData(@RequestParam("title") String title, @RequestParam("userEmail") String userEmail){
        System.out.println(title);
        Lecture lecture = lectureService.getLectureByTitle(title);
        FilterUserData ownerData = getUserByEmail(lecture.getOwner());

        int userRating = 0;

        for (UserRating rating : lecture.getRating()){
            if (rating.getEmail().equals(userEmail))
                userRating = rating.getRating();
        }

        String result = updateUser(title, userEmail);

        LecturePageData data = new LecturePageData(lecture.getTitle(), lecture.getContact(), lecture.getDescription(),
                lecture.getUserPermission(), lecture.getPrivacy(), lecture.getTag(), lecture.getRatingAvg(),
                lecture.getComment(), ownerData.getFirstname() + " " + ownerData.getLastname(), ownerData.getEmail(),
                ownerData.getImage(), lecture.getDownloadFromUser().size(), userRating);

        return ResponseEntity.ok(data);
    }

    @RequestMapping(value = "/addComment", method = RequestMethod.POST)
    public ResponseEntity<?> addComment(@RequestBody AddCommentData data){
        Lecture lecture = lectureService.getLectureByTitle(data.getLecTitle());
        ArrayList<Comment> commentList = lecture.getComment();
        commentList.add(data.getComment());
        lecture.setComment(commentList);
        lectureService.updateLecture(lecture);
        return ResponseEntity.ok("Update Comment Complete");
    }

    @RequestMapping(value = "/deleteComment", method = RequestMethod.POST)
    public ResponseEntity<?> deleteComment(@RequestBody AddCommentData data){
        Lecture lecture = lectureService.getLectureByTitle(data.getLecTitle());
        ArrayList<Comment> commentList = lecture.getComment();
        commentList.remove(data.getComment());
        lecture.setComment(commentList);
        lectureService.updateLecture(lecture);
        return ResponseEntity.ok("Delete Comment Complete");
    }

    @RequestMapping(value = "/rateLecture", method = RequestMethod.POST)
    public ResponseEntity<?> rateLecture(@RequestBody RatingData data){
        Lecture lecture = lectureService.getLectureByTitle(data.getLecTitle());
        ArrayList<UserRating> rating = lecture.getRating();
        boolean isDuplicate = false;
        int duplicateIndex = -1;
        int index = 0;

        for (UserRating userRating : rating){
            if (userRating.getEmail().equals(data.getUserEmail())){
                isDuplicate = true;
                duplicateIndex = index;
            }
            index += 1;
        }

        if (isDuplicate)
            rating.remove(duplicateIndex);
        rating.add(new UserRating(data.getUserEmail(), data.getRating()));

        double rate = 0;
        if (rating.size() > 0) {
            for (UserRating userRating : rating) {
                rate += userRating.getRating();
            }
            rate /= rating.size();
        }

        lecture.setRating(rating);
        lecture.setRatingAvg(rate);
        lectureService.updateLecture(lecture);

        return ResponseEntity.ok("Rating Lecture Complete");
    }

    @RequestMapping(value = "/getDataForSearch", method = RequestMethod.GET)
    public ResponseEntity<?> getDataForSearch(){
        List<Lecture> lectures = lectureService.getAllLecture();
        ArrayList<FilterSearchLectureData> data = new ArrayList<>();
        for (Lecture lecture : lectures){
            FilterUserData user = getUserByEmail(lecture.getOwner());
            data.add(new FilterSearchLectureData(lecture.getTitle(), user.getFirstname() + " " + user.getLastname(),
                    user.getEmail(), lecture.getTag(), user.getImage()));
        }
        return ResponseEntity.ok(data);
    }

    @RequestMapping(value = "/editLecture", method = RequestMethod.POST)
    public ResponseEntity<?> editLecture(@RequestBody UpdateLectureData data) {
        Lecture lecture = lectureService.getLectureByTitle(data.getOldTitle());

        if (!data.getOldTitle().equals(data.getTitle())){
            File file = new File(System.getProperty("user.dir") + "/files/" + lecture.getOwner() + "/" + data.getTitle());
            file.mkdirs();
            String path = System.getProperty("user.dir") + "/files/" + lecture.getOwner() + "/" + data.getTitle() + "/" + lecture.getFileName();
            try {
                Path temp = Files.move(Paths.get(lecture.getFileUrl()), Paths.get(path));
                FileUtils.deleteDirectory(new File(System.getProperty("user.dir") + "/files/" + lecture.getOwner() + "/" + data.getOldTitle()));
            } catch (Exception e){
                System.out.println("Move Error");
            }
            lecture.setFileUrl(path);
        }

        lecture.setTitle(data.getTitle());
        lecture.setDescription(data.getDescription());
        lecture.setContact(data.getContact());
        lecture.setTag(data.getTag());
        lecture.setPrivacy(data.getPrivacy());
        lecture.setUserPermission(data.getPermission());
        lectureService.updateLecture(lecture);
        return ResponseEntity.ok("Update Lecture Complete");
    }

    @RequestMapping(value = "/deleteLec", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteLec(@RequestParam("title") String title){

        Lecture lecture = lectureService.getLectureByTitle(title);

        try {
            FileUtils.deleteDirectory(new File(System.getProperty("user.dir") + "/files/" + lecture.getOwner() + "/" + lecture.getTitle()));
        } catch (Exception e){
            System.out.println("Delete File Error");
        }

        lectureService.deleteLecture(lecture);

        return ResponseEntity.ok("Delete Lecture Complete");
    }

    @RequestMapping(value = "/getRanking", method = RequestMethod.GET)
    public ResponseEntity<?> getRanking(){
        List<Lecture> lectureList = lectureService.getAllLecture();
        ArrayList<FilterRankingLectureData> lectureWithScore = new ArrayList<>();
        for (Lecture lecture : lectureList){
            if (lecture.getRating().size() != 0){
                double score = 0;
                if (lecture.getDownloadFromUser().size() == 0)
                    score = lecture.getRatingAvg();
                else
                    score = lecture.getDownloadFromUser().size() * lecture.getRatingAvg();
                FilterUserData user = getUserByEmail(lecture.getOwner());
                lectureWithScore.add(new FilterRankingLectureData(lecture.getTitle(), lecture.getOwner(),
                        user.getImage(), score));
            }
        }
        Collections.sort(lectureWithScore, (o1, o2) -> {
            if (o1.getScore() > o2.getScore())
                return -1;
            else if (o1.getScore() == o2.getScore())
                return 0;
            else
                return 1;
        });

        List<FilterRankingLectureData> newList = lectureWithScore;
        if (lectureWithScore.size() > 10){
            newList = lectureWithScore.subList(0, 10);
        }
        return ResponseEntity.ok(newList);
    }

    @RequestMapping(value = "/downloadFile", method = RequestMethod.GET)
    public ResponseEntity<?> downloadFile(@RequestParam("title") String title){

        Lecture lecture = lectureService.getLectureByTitle(title);

        try {
            String base64 = DatatypeConverter.printBase64Binary(Files.readAllBytes(
                    Paths.get(lecture.getFileUrl())));
            return ResponseEntity.ok(base64);
        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.ok(null);
        }

    }

    public FilterUserData getUserByEmail(String email){
        FilterUserData out = WebClient.create()
                .get()
                .uri("http://192.168.1.9:3001/user-service/getUserByEmail/" + email)
                .retrieve()
                .bodyToMono(FilterUserData.class)
                .block();
        return out;
    }

    public ArrayList<String> getRecentView(String email){
        ArrayList out = WebClient.create()
                .get()
                .uri("http://192.168.1.9:3001/user-service/getRecentViewByEmail/" + email)
                .retrieve()
                .bodyToMono(ArrayList.class)
                .block();
        return out;
    }

    public String updateUser(String title, String email){
        String out = WebClient.create()
                .post()
                .uri("http://192.168.1.9:3001/user-service/updateRecentView/" + title + "/" + email)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return out;
    }

    public boolean connectTagAPI(String path, String tagName){
        Boolean out = WebClient.create()
                .post()
                .uri("http://192.168.1.9:3001/tag-service/" + path + "/" + tagName)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();
        return out;
    }

    public String addNotification(String email, String title){
        String out = WebClient.create()
                .post()
                .uri("http://192.168.1.9:3001/user-service/addNotification/" + email + "/" + title)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return out;
    }
}
