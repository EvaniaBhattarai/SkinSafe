package com.model.webUser;

import com.dbUtils.*;

public class DbMods {

    private static StringData validate(StringData inputData) {
        StringData errorMsgs = new StringData();

        errorMsgs.userEmail = Validate.stringMsg(inputData.userEmail, 45, true);
        errorMsgs.userPassword = Validate.stringMsg(inputData.userPassword, 45, true);

        if (inputData.userPassword.compareTo(inputData.userPassword2) != 0) {
            errorMsgs.userPassword2 = "Both passwords must match";
        }

        errorMsgs.userImage = Validate.stringMsg(inputData.userImage, 300, false);
        errorMsgs.birthday = Validate.dateMsg(inputData.birthday, false);
        errorMsgs.membershipFee = Validate.decimalMsg(inputData.membershipFee, false);
        errorMsgs.userRoleId = Validate.integerMsg(inputData.userRoleId, true);

        return errorMsgs;
    }

    public static StringData insert(StringData insertData, DbConn dbc) {
        StringData errorMsgs = new StringData();
        errorMsgs = validate(insertData);

        if (errorMsgs.characterCount() > 0) {
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;
        }

        String sql = "INSERT INTO web_user (user_email, user_password, user_image, membership_fee, birthday, " +
                "user_role_id) VALUES (?,?,?,?,?,?)";

        PrepStatement pStatement = new PrepStatement(dbc, sql);
        pStatement.setString(1, insertData.userEmail);
        pStatement.setString(2, insertData.userPassword);
        pStatement.setString(3, insertData.userImage);
        pStatement.setBigDecimal(4, Validate.convertDecimal(insertData.membershipFee));
        pStatement.setDate(5, Validate.convertDate(insertData.birthday));
        pStatement.setInt(6, Validate.convertInteger(insertData.userRoleId));

        int numRows = pStatement.executeUpdate();
        errorMsgs.errorMsg = pStatement.getErrorMsg();

        if (errorMsgs.errorMsg.length() == 0) {
            if (numRows != 1) {
                errorMsgs.errorMsg = numRows + " records were inserted when exactly 1 was expected.";
            }
        } else if (errorMsgs.errorMsg.contains("foreign key")) {
            errorMsgs.errorMsg = "Invalid User Role Id - " + errorMsgs.errorMsg;
        } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
            errorMsgs.errorMsg = "That email address is already taken - " + errorMsgs.errorMsg;
        }

        return errorMsgs;
    }

    public static StringData getById(DbConn dbc, String userId) {
        StringData sd = new StringData();

        String sql = "SELECT web_user_id, user_email, user_password, user_image, " +
                "birthday, membership_fee, user_role_id " +
                "FROM web_user WHERE web_user_id = ?";
        try {
            java.sql.PreparedStatement ps = dbc.getConn().prepareStatement(sql);
            ps.setInt(1, Integer.parseInt(userId));
            java.sql.ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                sd.webUserId = rs.getString("web_user_id");
                sd.userEmail = rs.getString("user_email");
                sd.userPassword = rs.getString("user_password");
                sd.userImage = rs.getString("user_image") != null ? rs.getString("user_image") : "";
                sd.userRoleId = rs.getString("user_role_id");

                java.sql.Date bd = rs.getDate("birthday");
                if (bd != null) {
                    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("MM/dd/yyyy");
                    sd.birthday = sdf.format(bd);
                } else {
                    sd.birthday = "";
                }

                java.math.BigDecimal fee = rs.getBigDecimal("membership_fee");
                sd.membershipFee = (fee != null) ? fee.toString() : "";
            } else {
                sd.errorMsg = "No user found with id: " + userId;
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

        String sql = "UPDATE web_user SET user_email=?, user_password=?, user_image=?, " +
                "membership_fee=?, birthday=?, user_role_id=? " +
                "WHERE web_user_id=?";

        PrepStatement pStatement = new PrepStatement(dbc, sql);
        pStatement.setString(1, updateData.userEmail);
        pStatement.setString(2, updateData.userPassword);
        pStatement.setString(3, updateData.userImage);
        pStatement.setBigDecimal(4, Validate.convertDecimal(updateData.membershipFee));
        pStatement.setDate(5, Validate.convertDate(updateData.birthday));
        pStatement.setInt(6, Validate.convertInteger(updateData.userRoleId));
        pStatement.setInt(7, Validate.convertInteger(updateData.webUserId));

        int numRows = pStatement.executeUpdate();
        errorMsgs.errorMsg = pStatement.getErrorMsg();

        if (errorMsgs.errorMsg.length() == 0) {
            if (numRows != 1) {
                errorMsgs.errorMsg = numRows + " records updated when exactly 1 was expected.";
            }
        } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
            errorMsgs.errorMsg = "That email address is already taken.";
        }

        return errorMsgs;
    }

    public static StringData logonFind(DbConn dbc, String email, String password) {
        throw new UnsupportedOperationException("Unimplemented method 'logonFind'");
    }

    // ===================== DELETE =====================
    public static StringData delete(DbConn dbc, String userId) {
        StringData sd = new StringData();

        if (dbc.getErr() != null && dbc.getErr().length() > 0) {
            sd.errorMsg = "The database is currently unavailable. Please try later or contact support. "
                        + dbc.getErr();
            return sd;
        }

        if (userId == null || userId.trim().length() == 0) {
            sd.errorMsg = "Error: no userId provided.";
            return sd;
        }

        try {
            String sql = "DELETE FROM web_user WHERE web_user_id = ?";
            java.sql.PreparedStatement pst = dbc.getConn().prepareStatement(sql);
            pst.setInt(1, Integer.parseInt(userId.trim()));

            int rowsDeleted = pst.executeUpdate();
            pst.close();

            if (rowsDeleted == 0) {
                sd.errorMsg = "This user record must have already been deleted by another user. "
                            + "Please refresh the page.";
            }
            // errorMsg stays "" on success

        } catch (java.sql.SQLIntegrityConstraintViolationException e) {
            sd.errorMsg = "This user could not be deleted because they have products associated "
                        + "with their account. Technical detail: " + e.getMessage();
        } catch (Exception e) {
            sd.errorMsg = "An unexpected error occurred while trying to delete the user. "
                        + "Technical detail: " + e.getMessage();
        }

        return sd;
    }

}