package com.model.product;

import com.dbUtils.*;

public class DbMods {

    private static StringData validate(StringData inputData) {

        StringData errorMsgs = new StringData();

        errorMsgs.name = Validate.stringMsg(inputData.name, 45, true);
        errorMsgs.product_img = Validate.stringMsg(inputData.product_img, 200, false);
        errorMsgs.category = Validate.stringMsg(inputData.category, 200, false);
        errorMsgs.manufacturer = Validate.stringMsg(inputData.manufacturer, 45, false);
        errorMsgs.price = Validate.decimalMsg(inputData.price, false);
        errorMsgs.description = Validate.stringMsg(inputData.description, 255, false);
        errorMsgs.web_user_id = Validate.integerMsg(inputData.web_user_id, true);
        errorMsgs.rating = Validate.integerMsg(inputData.rating, false);

        return errorMsgs;
    }

    public static StringData insert(StringData insertData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(insertData);

        if (errorMsgs.characterCount() > 0) {
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        }

        String sql = "INSERT INTO product (name, img, category, manufacturer, " +
                     "price, description, web_user_id, rating) " +
                     "VALUES (?,?,?,?,?,?,?,?)";

        PrepStatement pStatement = new PrepStatement(dbc, sql);
        pStatement.setString(1, insertData.name);
        pStatement.setString(2, insertData.product_img);
        pStatement.setString(3, insertData.category);
        pStatement.setString(4, insertData.manufacturer);
        pStatement.setBigDecimal(5, Validate.convertDecimal(insertData.price));
        pStatement.setString(6, insertData.description);
        pStatement.setInt(7, Validate.convertInteger(insertData.web_user_id));
        pStatement.setInt(8, Validate.convertInteger(insertData.rating));

        int numRows = pStatement.executeUpdate();
        errorMsgs.errorMsg = pStatement.getErrorMsg();

        if (errorMsgs.errorMsg.length() == 0) {
            if (numRows != 1) {
                errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
            }
        } else if (errorMsgs.errorMsg.contains("foreign key")) {
            errorMsgs.errorMsg = "Invalid Web User - " + errorMsgs.errorMsg;
        } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
            errorMsgs.errorMsg = "That product name is already taken.";
        }

        return errorMsgs;
    }

    public static StringData getById(DbConn dbc, String productId) {
        StringData sd = new StringData();

        String sql = "SELECT product_id, name, img, category, manufacturer, " +
                     "price, description, web_user_id, rating " +
                     "FROM product WHERE product_id = ?";
        try {
            java.sql.PreparedStatement ps = dbc.getConn().prepareStatement(sql);
            ps.setInt(1, Integer.parseInt(productId));
            java.sql.ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                sd.product_id    = rs.getString("product_id");
                sd.name          = rs.getString("name")         != null ? rs.getString("name")         : "";
                sd.product_img   = rs.getString("img")          != null ? rs.getString("img")           : "";
                sd.category      = rs.getString("category")     != null ? rs.getString("category")      : "";
                sd.manufacturer  = rs.getString("manufacturer") != null ? rs.getString("manufacturer")  : "";
                sd.description   = rs.getString("description")  != null ? rs.getString("description")   : "";
                sd.web_user_id   = rs.getString("web_user_id");

                java.math.BigDecimal price = rs.getBigDecimal("price");
                sd.price = (price != null) ? price.toString() : "";

                Integer rating = rs.getObject("rating", Integer.class);
                sd.rating = (rating != null) ? rating.toString() : "";

            } else {
                sd.errorMsg = "No product found with id: " + productId;
            }
            rs.close();
            ps.close();
        } catch (Exception e) {
            sd.errorMsg = "Database error in getById: " + e.getMessage();
        }
        return sd;
    }

    public static StringData update(StringData updateData, DbConn dbc) {

        StringData errorMsgs = new StringData();
        errorMsgs = validate(updateData);

        if (errorMsgs.characterCount() > 0) {
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        }

        String sql = "UPDATE product SET name=?, img=?, category=?, manufacturer=?, " +
                     "price=?, description=?, web_user_id=?, rating=? " +
                     "WHERE product_id=?";

        PrepStatement pStatement = new PrepStatement(dbc, sql);
        pStatement.setString(1,     updateData.name);
        pStatement.setString(2,     updateData.product_img);
        pStatement.setString(3,     updateData.category);
        pStatement.setString(4,     updateData.manufacturer);
        pStatement.setBigDecimal(5, Validate.convertDecimal(updateData.price));
        pStatement.setString(6,     updateData.description);
        pStatement.setInt(7,        Validate.convertInteger(updateData.web_user_id));
        pStatement.setInt(8,        Validate.convertInteger(updateData.rating));
        pStatement.setInt(9,        Validate.convertInteger(updateData.product_id));

        int numRows = pStatement.executeUpdate();
        errorMsgs.errorMsg = pStatement.getErrorMsg();

        if (errorMsgs.errorMsg.length() == 0) {
            if (numRows != 1) {
                errorMsgs.errorMsg = numRows + " records updated when exactly 1 was expected.";
            }
        } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
            errorMsgs.errorMsg = "That product name is already taken.";
        }

        return errorMsgs;
    }

    // ===================== DELETE =====================
    public static StringData delete(DbConn dbc, String productId) {
        StringData sd = new StringData();

        if (dbc.getErr() != null && dbc.getErr().length() > 0) {
            sd.errorMsg = "The database is currently unavailable. Please try later or contact support. "
                        + dbc.getErr();
            return sd;
        }

        if (productId == null || productId.trim().length() == 0) {
            sd.errorMsg = "Error: no productId provided.";
            return sd;
        }

        try {
            String sql = "DELETE FROM product WHERE product_id = ?";
            java.sql.PreparedStatement pst = dbc.getConn().prepareStatement(sql);
            pst.setInt(1, Integer.parseInt(productId.trim()));

            int rowsDeleted = pst.executeUpdate();
            pst.close();

            if (rowsDeleted == 0) {
                sd.errorMsg = "This product record must have already been deleted by another user. "
                            + "Please refresh the page.";
            }
            // errorMsg stays "" on success

        } catch (java.sql.SQLIntegrityConstraintViolationException e) {
            sd.errorMsg = "This product could not be deleted because other records are linked to it. "
                        + "Technical detail: " + e.getMessage();
        } catch (Exception e) {
            sd.errorMsg = "An unexpected error occurred while trying to delete the product. "
                        + "Technical detail: " + e.getMessage();
        }

        return sd;
    }

}