package com.model.webUser;

public class StringData {
    public String webUserId = "";     // auto-increment primary key
    public String userEmail = "";     // varChar 45, must be unique
    public String userPassword = "";  // varChar 45, required (length >=1)
    public String userImage = "";     // varChar 500, required (length >=1)
    public String birthday = "";      // type date, optional
    public String membershipFee = ""; // type decimal, optional
    public String userRoleId = "";    // foreign key (integer), required by DB
    public String userRoleType = "";  // varChar, joined from user_role table.
    public String errorMsg = "";      // not actually in the database, used by the app
                                      // to convey success or failure.
    public String userPassword2 = ""; // used for password confirmation, not in DB

    // Returns total number of characters across all field-level error message fields.
    // If > 0, at least one field failed validation.
    public int characterCount() {
        int count = 0;
        count += userEmail.length();
        count += userPassword.length();
        count += userPassword2.length();
        count += userImage.length();
        count += birthday.length();
        count += membershipFee.length();
        count += userRoleId.length();
        return count;
    }
}