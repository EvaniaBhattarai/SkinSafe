package com.bhattarai_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dbUtils.*;
import com.model.role.StringDataList;
import com.view.RoleView;

@RestController
public class RoleController {

    @RequestMapping(value = "/role/getAll", produces = "application/json")
    public String allRoles() {
        StringDataList list = new StringDataList(); // dbError empty, list empty
        DbConn dbc = new DbConn();
        list = RoleView.getAllRoles(dbc);
        dbc.close();
        
        return Json.toJson(list);
    }
}
