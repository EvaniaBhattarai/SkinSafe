package com.model.product;

public class StringData {
    public String product_id = "";
    public String name = "";
    public String product_img = "";
    public String category = "";
    public String manufacturer = "";
    public String price = "";
    public String description = "";
    public String rating = "";
    public String web_user_id = "";
    public String user_email = "";
    public String user_image = "";
    public String errorMsg = "";

    // Returns total number of characters across all field-level error message fields.
    // If > 0, at least one field failed validation.
    public int characterCount() {
        int count = 0;
        count += name.length();
        count += product_img.length();
        count += category.length();
        count += manufacturer.length();
        count += price.length();
        count += description.length();
        count += rating.length();
        count += web_user_id.length();
        return count;
    }
}