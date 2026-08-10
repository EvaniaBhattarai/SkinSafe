"use strict";

const UserInsertOrUpdate = (props) => {

    const id = props.match && props.match.params.id ? props.match.params.id : null;
    const action = id ? "update" : "insert";

    const [formData, setFormData] = React.useState({
        webUserId: "",
        userEmail: "",
        userPassword: "",
        userPassword2: "",
        userImage: "",
        birthday: "",
        membershipFee: "",
        userRoleId: ""
    });

    const [errorMsgs, setErrorMsgs] = React.useState({});
    const [recordMsg, setRecordMsg] = React.useState("");
    const [roleList, setRoleList] = React.useState([]);
    const [successMsg, setSuccessMsg] = React.useState("");
    const [isLoadingUser, setIsLoadingUser] = React.useState(action === "update");
    const [isLoadingRoleList, setIsLoadingRoleList] = React.useState(true);

    React.useEffect(() => {
        ajax_alt(
            "role/getAll",
            function (obj) {
                if (obj.dbError && obj.dbError.length > 0) {
                    setRecordMsg("Could not load roles: " + obj.dbError);
                } else {
                    setRoleList(obj.roleList);
                }
                setIsLoadingRoleList(false);
            },
            function (msg) {
                setRecordMsg("Could not load roles: " + msg);
                setIsLoadingRoleList(false);
            }
        );
    }, []);

    React.useEffect(() => {
        if (action === "update") {
            ajax_alt(
                "webUser/getById?userId=" + id,
                function (obj) {
                    if (obj.errorMsg && obj.errorMsg.length > 0) {
                        setRecordMsg("Could not load user: " + obj.errorMsg);
                    } else {
                        setFormData({
                            webUserId:     obj.webUserId,
                            userEmail:     obj.userEmail,
                            userPassword:  obj.userPassword,
                            userPassword2: obj.userPassword,
                            userImage:     obj.userImage,
                            birthday:      obj.birthday,
                            membershipFee: obj.membershipFee,
                            userRoleId:    obj.userRoleId
                        });
                    }
                    setIsLoadingUser(false);
                },
                function (msg) {
                    setRecordMsg("Ajax error loading user: " + msg);
                    setIsLoadingUser(false);
                }
            );
        }
    }, []);

    if (isLoadingUser || isLoadingRoleList) {
        return <div className="userForm">Loading...</div>;
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
            "webUser/" + action + "?jsonData=" + encodeURIComponent(jsonData),
            function (obj) {
                setErrorMsgs({
                    userEmail:     obj.userEmail     || "",
                    userPassword:  obj.userPassword  || "",
                    userPassword2: obj.userPassword2 || "",
                    userImage:     obj.userImage     || "",
                    birthday:      obj.birthday      || "",
                    membershipFee: obj.membershipFee || "",
                    userRoleId:    obj.userRoleId    || ""
                });
                if (obj.errorMsg && obj.errorMsg.length > 0) {
                    setRecordMsg(obj.errorMsg);
                } else {
                    setSuccessMsg(action === "insert" ? "User successfully registered!" : "User successfully updated!");
                    if (action === "insert") {
                        setFormData({
                            webUserId: "", userEmail: "", userPassword: "",
                            userPassword2: "", userImage: "", birthday: "",
                            membershipFee: "", userRoleId: ""
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
        <div className="userForm">
            <h3>{action === "insert" ? "Register New User" : "Update User"}</h3>

            {successMsg && <div className="userForm-success">{successMsg}</div>}

            <table className="userForm-table">
                <tbody>
                    <tr>
                        <td className="userForm-label">User ID:</td>
                        <td><input className="userForm-input" name="webUserId" value={formData.webUserId} disabled /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="userForm-label">Email:</td>
                        <td><input className="userForm-input" name="userEmail" value={formData.userEmail} onChange={handleChange} /></td>
                        <td className="userForm-error">{errorMsgs.userEmail}</td>
                    </tr>
                    <tr>
                        <td className="userForm-label">Password:</td>
                        <td><input className="userForm-input" type="password" name="userPassword" value={formData.userPassword} onChange={handleChange} /></td>
                        <td className="userForm-error">{errorMsgs.userPassword}</td>
                    </tr>
                    <tr>
                        <td className="userForm-label">Confirm Password:</td>
                        <td><input className="userForm-input" type="password" name="userPassword2" value={formData.userPassword2} onChange={handleChange} /></td>
                        <td className="userForm-error">{errorMsgs.userPassword2}</td>
                    </tr>
                    <tr>
                        <td className="userForm-label">Image URL:</td>
                        <td><input className="userForm-input" name="userImage" value={formData.userImage} onChange={handleChange} /></td>
                        <td className="userForm-error">{errorMsgs.userImage}</td>
                    </tr>
                    <tr>
                        <td className="userForm-label">Birthday (MM/DD/YYYY):</td>
                        <td><input className="userForm-input" name="birthday" value={formData.birthday} onChange={handleChange} /></td>
                        <td className="userForm-error">{errorMsgs.birthday}</td>
                    </tr>
                    <tr>
                        <td className="userForm-label">Membership Fee:</td>
                        <td><input className="userForm-input" name="membershipFee" value={formData.membershipFee} onChange={handleChange} /></td>
                        <td className="userForm-error">{errorMsgs.membershipFee}</td>
                    </tr>
                    <tr>
                        <td className="userForm-label">User Role:</td>
                        <td>
                            <select className="userForm-select" name="userRoleId" value={formData.userRoleId} onChange={handleChange}>
                                <option value="">-- Select Role --</option>
                                {roleList.map(role => (
                                    <option key={role.userRoleId} value={role.userRoleId}>
                                        {role.userRoleType}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td className="userForm-error">{errorMsgs.userRoleId}</td>
                    </tr>
                </tbody>
            </table>

            <br />
            <button className="userForm-btn" onClick={handleSubmit}>
                {action === "insert" ? "Register" : "Save Changes"}
            </button>

            {recordMsg && (
                <div className="userForm-recordError"
                    dangerouslySetInnerHTML={{ __html: recordMsg }}>
                </div>
            )}
        </div>
    );
};