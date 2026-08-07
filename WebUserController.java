package com.bhattarai_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import com.dbUtils.DbConn;
import com.dbUtils.Json;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.webUser.DbMods;
import com.model.webUser.StringData;
import com.model.webUser.StringDataList;
import com.view.WebUserView;

@RestController
public class WebUserController {

    @RequestMapping(value = "/webUser/getAll", produces = "application/json")
    public String allUsers() {
        StringDataList list = new StringDataList();
        DbConn dbc = new DbConn();
        list = WebUserView.getAllUsers(dbc);
        dbc.close();
        return Json.toJson(list);
    }

    @RequestMapping(value = "/webUser/logon", params = {"email", "password"}, produces = "application/json")
    public String logon(@RequestParam("email") String email,
                        @RequestParam("password") String password,
                        HttpServletRequest request) {
        StringData sd = new StringData();
        HttpSession session = request.getSession();
        DbConn dbc = new DbConn();

        if (dbc.getErr() != null && dbc.getErr().length() > 0) {
            sd.errorMsg = dbc.getErr();
            session.invalidate();
            return Json.toJson(sd);
        }

        sd = DbMods.logonFind(dbc, email, password);

        if (sd.errorMsg == null || sd.errorMsg.length() == 0) {
            session.setAttribute("loggedOnUser", sd);
        } else {
            session.invalidate();
        }

        dbc.close();
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/getProfile", produces = "application/json")
    public String getProfile(HttpServletRequest request) {
        StringData sd = new StringData();
        HttpSession session = request.getSession();

        if (session.getAttribute("loggedOnUser") != null) {
            sd = (StringData) session.getAttribute("loggedOnUser");
        } else {
            sd.errorMsg = "Cannot show profile -- no user is logged in.";
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/logoff", produces = "application/json")
    public String logoff(HttpServletRequest request) {
        StringData sd = new StringData();
        HttpSession session = request.getSession();
        session.invalidate();
        sd.errorMsg = "User is now logged off.";
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/insert", params = {"jsonData"}, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {
        StringData errorMsgs = new StringData();

        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No user data was provided in JSON format";
        } else {
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData insertData = mapper.readValue(jsonInsertData, StringData.class);
                DbConn dbc = new DbConn();
                errorMsgs.errorMsg = dbc.getErr();
                if (errorMsgs.errorMsg.length() == 0) {
                    errorMsgs = DbMods.insert(insertData, dbc);
                }
                dbc.close();
            } catch (Exception e) {
                String msg = "Could not convert jsonData to model.webUser.StringData obj: " +
                        jsonInsertData + " - or other error in controller for 'user/insert': " +
                        e.getMessage();
                System.out.println(msg);
                errorMsgs.errorMsg += ". " + msg;
            }
        }
        return Json.toJson(errorMsgs);
    }

    @RequestMapping(value = "/webUser/getById", params = {"userId"}, produces = "application/json")
    public String getById(@RequestParam("userId") String userId) {
        StringData sd = new StringData();
        if (userId == null || userId.length() == 0) {
            sd.errorMsg = "Error: userId param is required.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                sd = DbMods.getById(dbc, userId);
            }
            dbc.close();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/webUser/update", params = {"jsonData"}, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonInsertData) {
        StringData errorData = new StringData();
        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorData.errorMsg = "Cannot update. No user data was provided in JSON format";
        } else {
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonInsertData, StringData.class);
                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();
            } catch (Exception e) {
                errorData.errorMsg = "Unexpected error in webUser/update: " + e.getMessage();
            }
        }
        return Json.toJson(errorData);
    }

    // ===================== DELETE =====================
    @RequestMapping(value = "/webUser/delete", params = {"userId"}, produces = "application/json")
    public String deleteUser(@RequestParam("userId") String userId) {
        StringData sd = new StringData();
        if (userId == null || userId.length() == 0) {
            sd.errorMsg = "Error: userId param is required.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                sd = DbMods.delete(dbc, userId);
            }
            dbc.close();
        }
        return Json.toJson(sd);
    }

}