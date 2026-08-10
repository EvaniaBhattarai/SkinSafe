package com.bhattarai_web;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dbUtils.DbConn;
import com.dbUtils.Json;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.product.DbMods;
import com.model.product.StringData;
import com.model.product.StringDataList;
import com.view.productView;

@RestController
public class ProductController {

    @RequestMapping(value = "/product/getAll", produces = "application/json")
    public String allProducts() {
        StringDataList list = new StringDataList();
        DbConn dbc = new DbConn();
        if (dbc.getErr().length() > 0) {
            list.dbError = "<strong>Database currently unavailable.</strong> " + dbc.getErr();
            dbc.close();
            return Json.toJson(list);
        }
        list = productView.getAllProducts(dbc);
        dbc.close();
        return Json.toJson(list);
    }

    @RequestMapping(value = "/product/insert", params = {"jsonData"}, produces = "application/json")
    public String insert(@RequestParam("jsonData") String jsonInsertData) {
        StringData errorMsgs = new StringData();
        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorMsgs.errorMsg = "Cannot insert. No product data was provided in JSON format";
        } else {
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData insertData = mapper.readValue(jsonInsertData, StringData.class);
                DbConn dbc = new DbConn();
                if (dbc.getErr().length() > 0) {
                    errorMsgs.errorMsg = "<strong>Database currently unavailable.</strong> " + dbc.getErr();
                    return Json.toJson(errorMsgs);
                }
                errorMsgs = DbMods.insert(insertData, dbc);
                dbc.close();
            } catch (Exception e) {
                errorMsgs.errorMsg = "Error in product/insert: " + e.getMessage();
            }
        }
        return Json.toJson(errorMsgs);
    }

    @RequestMapping(value = "/product/getById", params = {"productId"}, produces = "application/json")
    public String getById(@RequestParam("productId") String productId) {
        StringData sd = new StringData();
        if (productId == null || productId.length() == 0) {
            sd.errorMsg = "Error: productId param is required.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                sd = DbMods.getById(dbc, productId);
            }
            dbc.close();
        }
        return Json.toJson(sd);
    }

    @RequestMapping(value = "/product/update", params = {"jsonData"}, produces = "application/json")
    public String update(@RequestParam("jsonData") String jsonInsertData) {
        StringData errorData = new StringData();
        if ((jsonInsertData == null) || jsonInsertData.length() == 0) {
            errorData.errorMsg = "Cannot update. No product data was provided in JSON format";
        } else {
            try {
                ObjectMapper mapper = new ObjectMapper();
                StringData updateData = mapper.readValue(jsonInsertData, StringData.class);
                DbConn dbc = new DbConn();
                errorData = DbMods.update(updateData, dbc);
                dbc.close();
            } catch (Exception e) {
                errorData.errorMsg = "Unexpected error in product/update: " + e.getMessage();
            }
        }
        return Json.toJson(errorData);
    }

    // ===================== DELETE =====================
    @RequestMapping(value = "/product/delete", params = {"productId"}, produces = "application/json")
    public String deleteProduct(@RequestParam("productId") String productId) {
        StringData sd = new StringData();
        if (productId == null || productId.length() == 0) {
            sd.errorMsg = "Error: productId param is required.";
        } else {
            DbConn dbc = new DbConn();
            sd.errorMsg = dbc.getErr();
            if (sd.errorMsg.length() == 0) {
                sd = DbMods.delete(dbc, productId);
            }
            dbc.close();
        }
        return Json.toJson(sd);
    }

}