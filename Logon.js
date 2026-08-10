"use strict";

function Logon() {
    const [loggedInUser, setLoggedInUser] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState("");

    function handleLogin() {
        const email = document.querySelector("input[name='email']").value;
        const password = document.querySelector("input[name='password']").value;

        const url = `/webUser/logon?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

        ajax_alt(
            url,
            function(data) {
                if (data.errorMsg && data.errorMsg.length > 0) {
                    setErrorMsg(data.errorMsg);
                    setLoggedInUser(null);
                } else {
                    setLoggedInUser(data);
                    setErrorMsg("");
                }
            },
            function(eMsg) {
                setErrorMsg(eMsg);
                setLoggedInUser(null);
            }
        );
    }

    return (
        <div className="logon loginForm" style={{ textAlign: "center" }}>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                <label>Email Address: </label>
                <input type="text" name="email" placeholder="Email" />
                <label>Password: </label>
                <input type="password" name="password" placeholder="Password" />
                <button type="button" onClick={handleLogin}>Login</button>
            </div>

            {loggedInUser && (
                <div style={{ marginTop: "20px", fontWeight: "bold" }}>
                    <h2>Welcome Web User {loggedInUser.webUserId}!</h2>
                    <p>Email: {loggedInUser.userEmail}</p>
                    <p>Birthday: {loggedInUser.birthday}</p>
                    <p>Membership Fee: {loggedInUser.membershipFee}</p>
                    <p>User Role: {loggedInUser.userRoleId} {loggedInUser.userRoleType}</p>
                    <img
                        src={loggedInUser.userImage}
                        alt="User Profile"
                        style={{ width: "200px", height: "200px", objectFit: "cover" }}
                    />
                </div>
            )}
        </div>
    );
}