package com.view;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.dbUtils.*;
import com.model.product.*;

public class productView {
    public static StringDataList getAllProducts(DbConn dbc) {

        // sdl will be an empty array and DbError with ""
        StringDataList sdl = new StringDataList();

        sdl.dbError = dbc.getErr(); // returns "" if connection is good, else db error msg.
        if (sdl.dbError.length() > 0) {
            return sdl; // cannot proceed, db error (and that's been recorded in return object).
        }

        // sd will have all of it's fields initialized to ""
        StringData sd = new StringData();

        try {
            String sql = "SELECT product_id, name, img, category, manufacturer, price, description, rating, product.web_user_id, web_user.user_email, web_user.user_image FROM product, web_user "
                    + "WHERE web_user.web_user_id = product.web_user_id "
                    + "ORDER BY product_id ";
            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);
            ResultSet results = stmt.executeQuery();

            while (results.next()) {

                sd = new StringData();

                // the Format methods do not throw exceptions. If they find illegal data (like
                // you
                // tried to format a date as an integer), they return an error message (instead
                // of
                // returning the formatted value). So, you'll see these error messages right in
                // the
                // API output (JSON data) and/or you'll see it on the page in the UI.

                sd.product_id = Format.fmtInteger(results.getObject("product_id"));
                sd.name = Format.fmtString(results.getObject("name"));
                sd.product_img = Format.fmtString(results.getObject("img"));
                sd.category = Format.fmtString(results.getObject("category"));
                sd.manufacturer = Format.fmtString(results.getObject("manufacturer"));
                sd.price = Format.fmtDollar(results.getObject("price"));
                sd.description = Format.fmtString(results.getObject("description"));
                sd.rating = results.getObject("rating") != null ? results.getObject("rating").toString() : "";
                sd.web_user_id = Format.fmtInteger(results.getObject("web_user_id"));
                sd.user_email = Format.fmtString(results.getObject("user_email"));
                sd.user_image = Format.fmtString(results.getObject("user_image"));
                sdl.add(sd);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            sd.errorMsg = "Exception thrown in productView.getAllUsers(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;
    }

}
