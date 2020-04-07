package com.example.exptraining.service;

import com.example.exptraining.model.Topic;
import com.example.exptraining.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class TopicService {

    @Autowired
    private TopicRepository topicRepo;

    public String saveTopic(Topic topic){
        topicRepo.save(topic);
        return "Added Topic With ID : "+topic.getId();
    }
    public List<Topic> getTopics(){
        return (List<Topic>) topicRepo.findAll();
    }
    public Topic getTopic(int id){
        return topicRepo.findById(id).orElse(null);
    }
    public String deleteTopic(int id){
        topicRepo.deleteById(id);
        return "Deleted Topic With ID : "+id;
    }
}
