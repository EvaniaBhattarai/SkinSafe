package com.bhattarai_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
    @RequestMapping("/irritants")
    public String irritants() {
        return "<h1>You can learn more about the different types of skin irritants here!</h1>";
    }
}
