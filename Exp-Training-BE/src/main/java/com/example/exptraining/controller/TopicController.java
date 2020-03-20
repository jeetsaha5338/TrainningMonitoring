package com.example.exptrainning.controller;

import com.example.exptrainning.model.Topic;
import com.example.exptrainning.service.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Training/Topic")
@CrossOrigin(origins = "*")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @PostMapping("/addTopic")
    public String saveTopic(@RequestBody Topic topic){
        return topicService.saveTopic(topic);
    }

    @GetMapping("/getTopics")
    public List<Topic> getTopics(){
        return topicService.getTopics();
    }

    @GetMapping("/getTopic/{id}")
    public Topic getTopic(@PathVariable("id") int id){
        return topicService.getTopic(id);
    }

    @PostMapping("/deleteTopic/{id}")
    public String deleteTopic(@PathVariable("id") int id){
        return topicService.deleteTopic(id);
    }

    @PostMapping("/EditTopic")
    public String editTopic(@RequestBody Topic topic){
        return topicService.saveTopic(topic);
    }
}

