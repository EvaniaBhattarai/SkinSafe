"use strict";

const UserFilterTable = () => {

    // Common React pattern. Display a "...Loading..." UI while the page
    // is loading. Don't try to render the component until this is false.  
    const [isLoading, setIsLoading] = React.useState(true);

    // this is the data initially read (just once) from the DB.
    const [dbList, setDbList] = React.useState([]);

    // if there is an ajax error (or db connection error, set this state variable)
    const [error, setError] = React.useState(null);

    // the user's input that filters the list. 
    const [filterInput, setFilterInput] = React.useState("");

    // this is the filtered list.
    const [filteredList, setFilteredList] = React.useState([]);

    console.log("UserFilterTable running!!");

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
                    console.log("Database error was " + obj.dbError);
                    setError(obj.dbError);
                } else {
                    console.log("Data was read from the DB. See next line,");
                    console.log(obj.webUserList);
                    setDbList(obj.webUserList);
                    setFilteredList(obj.webUserList);
                }
                setIsLoading(false); // allow the component to be rendered
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                console.log("Ajax error encountered: " + msg);
                setError(msg);
                setIsLoading(false); // allow the component to be rendered
            }
        );
    }, []);

    const doFilter = (filterInputVal) => {
        let newList = filterObjList(dbList, filterInputVal);
        console.log("function doFilter. filterInputVal is: " + filterInputVal +
            ". See filtered list on next line:");
        console.log(newList);
        setFilteredList(newList);
    };

    const clearFilter = () => {
        setFilterInput("");
        doFilter("");
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

    return (
        <div className="clickSort">
            <h3>
                Filterable User List &nbsp;
                <input value={filterInput} onChange={(e) => setFilterInput(e.target.value)} />
                &nbsp;
                <button onClick={() => doFilter(filterInput)}>Search</button>
                &nbsp;
                <button onClick={clearFilter}>Clear</button>
            </h3>

            <table>
                <thead>
                    <tr>
                        <th>
                            Email
                        </th>
                        <th className="textAlignCenter">Image</th>
                        <th className="textAlignCenter">
                            Birthday
                        </th>
                        <th className="textAlignRight" >
                            Membership Fee
                        </th>
                        <th>
                            Role
                        </th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredList.map((listObj) =>
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