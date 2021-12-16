package com.sop_project.lectureservice.comsumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class LectureConsumer {

    @RabbitListener(queues = "HavePermissionQueue")
    public void test(String text){
        System.out.println(text);
    }
}
