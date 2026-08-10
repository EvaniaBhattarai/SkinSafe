"use strict";

//function UserTable() {
const UserTable = () => {

    // Normal JS array Destructuring... 
    //var myArray =[50,60,70];
    //var [a,b] = myArray;

    // Common React pattern. Display a "...Loading..." UI while the page
    // is loading. Don't try to render the component until this is false.  
    const [isLoading, setIsLoading] = React.useState(true);

    // this is the data initially read (just once) from the DB.
    const [dbList, setDbList] = React.useState([]);

    // if there is an ajax error (not able to read the data, set this state variable)
    const [error, setError] = React.useState(null);

    console.log("UserTable running...");

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


    if (isLoading) {
        console.log("initial rendering, Data not ready yet...");
        return <div> Loading... </div>
    }

    if (error) {
        console.log(`there must have been an ajax error (e.g., bad URL), 
        or database error (e.g., connection error because not tunnelled in)...`);
        return <div>Error: {error} </div>;
    }

    // NOTE: onClick in react has a capital C, unlike regular JS onclick which does not.
    return (
        <div className="clickSort">
            <table>
                <thead>
                    <tr>
                        <th className="textAlignRight">ID</th>
                        <th>Email</th>
                        <th className="textAlignCenter">Image</th>
                        <th className="textAlignCenter">Birthday</th>
                        <th className="textAlignRight">Membership Fee</th>
                        <th>Role</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dbList.map((listObj, index) =>
                            <tr key={listObj.webUserId}>
                                <td className="textAlignRight">{listObj.webUserId}</td>
                                <td>{listObj.userEmail} </td>
                                <td className="shadowImage textAlignCenter"><img src={listObj.userImage} /></td>
                                <td className="textAlignCenter">{listObj.birthday}</td>
                                <td className="textAlignRight">{listObj.membershipFee}</td>
                                <td className="nowrap">{listObj.userRoleId} {listObj.userRoleType}</td>
                                <td>{listObj.errorMsg}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};