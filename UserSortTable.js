"use strict";

const UserSortTable = () => {

    // Common React pattern. Display a "...Loading..." UI (don't try to render)
    // until ajax call is complete.  
    const [isLoading, setIsLoading] = React.useState(true);

    // this is data read (just once) from the DB.
    const [dbList, setDbList] = React.useState([]);

    // if there is an  error (ajax or database), set this state variable
    // and show the error message in the UI.
    const [error, setError] = React.useState(null);

    // useEffect takes two params. The first param is the function to be run. 
    // The second param is a list of state variables that (if they change) will 
    // cause the function (first param) to be run again.
    // RUN ONCE PATTERN: With [] as 2nd param, it runs the 1st param (fn) just once. 
    React.useEffect(() => {

        // ajax_alt takes three parameters: the URL to read, Success Fn, Failure Fn.
        ajax_alt(

            "webUser/getAll", // URL for AJAX call to invoke

            // success function (anonymous)
            function (obj) {   // success function gets obj from ajax_alt
                if (obj.dbError.length > 0) {
                    setError(obj.dbError);
                } else {
                    console.log("in AjaxUserTable here is web user list (next line):");
                    console.log(obj.webUserList);
                    setDbList(obj.webUserList);
                }
                setIsLoading(false);
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                setError(msg);
                setIsLoading(false);
            }
        );
    }, []);

    function sortByProp(propName, sortType) {
        // sort the user list based on property name and type
        jsSort(dbList, propName, sortType);
        console.log("Sorted list is below");
        console.log(dbList);

        // For state variables that are objects or arrays, you have to do 
        // something like this or else React does not think that the state 
        // variable (dbList) has changed. Therefore, React will not re-render 
        // the component.
        let listCopy = JSON.parse(JSON.stringify(dbList)); 
        setDbList(listCopy);
    }

    if (isLoading) {
        console.log("initial rendering, Data not ready yet...");
        return <div> Loading... </div>
    }

    if (error) {
        console.log(`there must have been an ajax error (e.g., bad URL), 
        or database error (e.g., connection error because not tunnelled in)...`);
        return <div>Error: {error} </div>;
    } 

    console.log("Rendering sorted UserTable. sorted list is on next line...");
    console.log(dbList);

    // NOTE: onClick in React has a capital C, unlike the regular JS onclick.
    return (
        <div className="clickSort">
            <h3>Sortable User List</h3>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => sortByProp("userEmail", "text")} >
                            <img src="icons/dark/blackDownSort.png" />Email
                        </th>
                        <th className="textAlignCenter">Image</th>
                        <th onClick={() => sortByProp("birthday", "date")}
                            className="textAlignCenter">
                            <img src="icons/dark/blackDownSort.png" />Birthday
                        </th>
                        <th onClick={() => sortByProp("membershipFee", "number")}
                            className="textAlignRight" >
                            <img src="icons/dark/blackDownSort.png" />Membership Fee
                        </th>
                        <th onClick={() => sortByProp("userRoleType", "text")}>
                            <img src="icons/dark/blackDownSort.png" />Role
                        </th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dbList.map((listObj) =>
                            <tr key={listObj.webUserId}>
                                <td>{listObj.userEmail}</td>
                                <td className="shadowImage textAlignCenter"><img src={listObj.userImage} /></td>
                                <td className="textAlignCenter">{listObj.birthday}</td>
                                <td className="textAlignRight">{listObj.membershipFee}</td>
                                <td className="nowrap">{listObj.userRoleType}</td>
                                <td>{listObj.errorMsg}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};