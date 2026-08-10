"use strict";

const AjaxUsers = (url) => {

    const [isLoading, setIsLoading] = React.useState(true);
    const [dbList, setDbList] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [filterInput, setFilterInput] = React.useState("");
    const [filteredList, setFilteredList] = React.useState([]);

    React.useEffect(() => {
        ajax_alt(
            url,
            function (obj) {
                if (obj.dbError.length > 0) {
                    setError(obj.dbError);
                } else {
                    setDbList(obj.webUserList);
                    setFilteredList(obj.webUserList);
                }
                setIsLoading(false);
            },
            function (msg) {
                setError(msg);
                setIsLoading(false);
            }
        );
    }, []);

    function callInsert() {
        window.location.hash = "#/userInsert";
    }

    function sortByProp(propName, sortType) {
        jsSort(filteredList, propName, sortType);
        let listCopy = JSON.parse(JSON.stringify(filteredList));
        setFilteredList(listCopy);
    }

    const doFilter = (filterInputVal) => {
        let newList = filterObjList(dbList, filterInputVal);
        setFilteredList(newList);
    };

    const clearFilter = () => {
        setFilterInput("");
        doFilter("");
    };

    function deleteUser(userId) {
        modalFw.confirm("Are you sure you want to delete this user?", function () {
            ajax_alt(
                "webUser/delete?userId=" + userId,
                function (obj) {
                    if (obj.errorMsg && obj.errorMsg.length > 0) {
                        modalFw.alert("Could not delete user: " + obj.errorMsg);
                    } else {
                        setDbList(function (prevList) {
                            return prevList.filter(function (u) {
                                return u.webUserId !== userId;
                            });
                        });
                        setFilteredList(function (prevList) {
                            return prevList.filter(function (u) {
                                return u.webUserId !== userId;
                            });
                        });
                        modalFw.snackBar("User successfully deleted.", 3000);
                    }
                },
                function (msg) {
                    modalFw.alert("Network error while trying to delete: " + msg);
                }
            );
        });
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="clickSort">
            <h3>
                Web User List &nbsp;
                <button onClick={callInsert} title="Register new user"
                    style={{
                        cursor: "pointer",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        border: "none",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        lineHeight: "1",
                        verticalAlign: "middle"
                    }}>
                    +
                </button>
            </h3>
            <h4>
                Filter: &nbsp;
                <input value={filterInput} onChange={(e) => setFilterInput(e.target.value)} />
                &nbsp;
                <button onClick={() => doFilter(filterInput)}>Search</button>
                &nbsp;
                <button onClick={clearFilter}>Clear</button>
            </h4>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th onClick={() => sortByProp("userEmail", "text")}>
                            <img src="icons/dark/blackDownSort.png" />Email
                        </th>
                        <th className="textAlignCenter">Image</th>
                        <th onClick={() => sortByProp("birthday", "date")} className="textAlignCenter">
                            <img src="icons/dark/blackDownSort.png" />Birthday
                        </th>
                        <th onClick={() => sortByProp("membershipFee", "number")} className="textAlignRight">
                            <img src="icons/dark/blackDownSort.png" />Membership Fee
                        </th>
                        <th onClick={() => sortByProp("userRoleType", "text")}>
                            <img src="icons/dark/blackDownSort.png" />Role
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList.map((listObj) =>
                        <tr key={listObj.webUserId}>
                            <td className="textAlignCenter">
                                <img
                                    src="icons/delete_icon.png"
                                    alt="Delete"
                                    title="Delete this user"
                                    style={{ width: "20px", cursor: "pointer" }}
                                    onClick={() => deleteUser(listObj.webUserId)}
                                />
                            </td>
                            <td>
                                <a href={"#/userUpdate/" + listObj.webUserId}>
                                    <img src="icons/dark/editicon.png" title="Edit this user"
                                        style={{ width: "20px", cursor: "pointer" }} />
                                </a>
                            </td>
                            <td>{listObj.userEmail}</td>
                            <td className="shadowImage textAlignCenter">
                                <img src={listObj.userImage} />
                            </td>
                            <td className="textAlignCenter">
                                {listObj.birthday.length > 0 ? listObj.birthday : "N/A"}
                            </td>
                            <td className="textAlignRight">
                                {listObj.membershipFee.length > 0 ? listObj.membershipFee : "N/A"}
                            </td>
                            <td className="nowrap">{listObj.userRoleType}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};