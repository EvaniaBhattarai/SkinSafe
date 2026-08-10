"use strict";

const ProductInsertOrUpdate = (props) => {

    const id = props.match && props.match.params.id ? props.match.params.id : null;
    const action = id ? "update" : "insert";

    const [formData, setFormData] = React.useState({
        product_id: "",
        name: "",
        product_img: "",
        category: "",
        manufacturer: "",
        price: "",
        description: "",
        rating: "",
        web_user_id: ""
    });

    const [errorMsgs, setErrorMsgs] = React.useState({});
    const [recordMsg, setRecordMsg] = React.useState("");
    const [successMsg, setSuccessMsg] = React.useState("");
    const [userList, setUserList] = React.useState([]);
    const [isLoadingUser, setIsLoadingUser] = React.useState(action === "update");
    const [isLoadingUserList, setIsLoadingUserList] = React.useState(true);

    // Always load user list for the dropdown
    React.useEffect(() => {
        ajax_alt(
            "webUser/getAll",
            function (obj) {
                if (obj.dbError && obj.dbError.length > 0) {
                    setRecordMsg("Could not load users: " + obj.dbError);
                } else {
                    let sorted = [...obj.webUserList];
                    jsSort(sorted, "userEmail", "text");
                    setUserList(sorted);
                }
                setIsLoadingUserList(false);
            },
            function (msg) {
                setRecordMsg("Ajax error loading users: " + msg);
                setIsLoadingUserList(false);
            }
        );
    }, []);

    // If update mode, load the existing product data
    React.useEffect(() => {
        if (action === "update") {
            ajax_alt(
                "product/getById?productId=" + id,
                function (obj) {
                    if (obj.errorMsg && obj.errorMsg.length > 0) {
                        setRecordMsg("Could not load product: " + obj.errorMsg);
                    } else {
                        setFormData({
                            product_id:   obj.product_id,
                            name:         obj.name,
                            product_img:  obj.product_img,
                            category:     obj.category,
                            manufacturer: obj.manufacturer,
                            price:        obj.price,
                            description:  obj.description,
                            rating:       obj.rating,
                            web_user_id:  obj.web_user_id
                        });
                    }
                    setIsLoadingUser(false);
                },
                function (msg) {
                    setRecordMsg("Ajax error loading product: " + msg);
                    setIsLoadingUser(false);
                }
            );
        }
    }, []);

    if (isLoadingUser || isLoadingUserList) {
        return <div className="productForm">Loading...</div>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        setRecordMsg("");
        setSuccessMsg("");
        setErrorMsgs({});

        const jsonData = JSON.stringify(formData);

        ajax_alt(
            "product/" + action + "?jsonData=" + encodeURIComponent(jsonData),
            function (obj) {
                setErrorMsgs({
                    name:         obj.name         || "",
                    product_img:  obj.product_img  || "",
                    category:     obj.category     || "",
                    manufacturer: obj.manufacturer || "",
                    price:        obj.price        || "",
                    description:  obj.description  || "",
                    rating:       obj.rating       || "",
                    web_user_id:  obj.web_user_id  || ""
                });
                if (obj.errorMsg && obj.errorMsg.length > 0) {
                    setRecordMsg(obj.errorMsg);
                } else {
                    setSuccessMsg(action === "insert" ? "Product successfully added!" : "Product successfully updated!");
                    if (action === "insert") {
                        setFormData({
                            product_id: "", name: "", product_img: "",
                            category: "", manufacturer: "", price: "",
                            description: "", rating: "", web_user_id: ""
                        });
                    }
                }
            },
            function (msg) {
                setRecordMsg("Ajax error: " + msg);
            }
        );
    };

    return (
        <div className="productForm">
            <h3>{action === "insert" ? "Add New Product" : "Update Product"}</h3>

            {successMsg && <div className="productForm-success">{successMsg}</div>}

            <table className="productForm-table">
                <tbody>
                    <tr>
                        <td className="productForm-label">Product ID:</td>
                        <td><input className="productForm-input" name="product_id" value={formData.product_id} disabled /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="productForm-label">Name:</td>
                        <td><input className="productForm-input" name="name" value={formData.name} onChange={handleChange} /></td>
                        <td className="productForm-error">{errorMsgs.name}</td>
                    </tr>
                    <tr>
                        <td className="productForm-label">Image URL:</td>
                        <td><input className="productForm-input" name="product_img" value={formData.product_img} onChange={handleChange} /></td>
                        <td className="productForm-error">{errorMsgs.product_img}</td>
                    </tr>
                    <tr>
                        <td className="productForm-label">Category:</td>
                        <td><input className="productForm-input" name="category" value={formData.category} onChange={handleChange} /></td>
                        <td className="productForm-error">{errorMsgs.category}</td>
                    </tr>
                    <tr>
                        <td className="productForm-label">Manufacturer:</td>
                        <td><input className="productForm-input" name="manufacturer" value={formData.manufacturer} onChange={handleChange} /></td>
                        <td className="productForm-error">{errorMsgs.manufacturer}</td>
                    </tr>
                    <tr>
                        <td className="productForm-label">Price ($):</td>
                        <td><input className="productForm-input" name="price" value={formData.price} onChange={handleChange} /></td>
                        <td className="productForm-error">{errorMsgs.price}</td>
                    </tr>
                    <tr>
                        <td className="productForm-label">Description:</td>
                        <td><input className="productForm-input" name="description" value={formData.description} onChange={handleChange} /></td>
                        <td className="productForm-error">{errorMsgs.description}</td>
                    </tr>
                    <tr>
                        <td className="productForm-label">Rating (0-10):</td>
                        <td><input className="productForm-input" name="rating" value={formData.rating} onChange={handleChange} /></td>
                        <td className="productForm-error">{errorMsgs.rating}</td>
                    </tr>
                    <tr>
                        <td className="productForm-label">Added By:</td>
                        <td>
                            <select className="productForm-select" name="web_user_id" value={formData.web_user_id} onChange={handleChange}>
                                <option value="">-- Select User --</option>
                                {userList.map(user => (
                                    <option key={user.webUserId} value={user.webUserId}>
                                        {user.userEmail}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="productForm-error">{errorMsgs.web_user_id}</td>
                    </tr>
                </tbody>
            </table>

            <br />
            <button className="productForm-btn" onClick={handleSubmit}>
                {action === "insert" ? "Add Product" : "Save Changes"}
            </button>

            {recordMsg && (
                <div className="productForm-recordError"
                    dangerouslySetInnerHTML={{ __html: recordMsg }}>
                </div>
            )}
        </div>
    );
};