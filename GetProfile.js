"use strict";

function UserProfile({ user }) {
    return (
        <div class="profileBlock" style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}>
            <h2>Web User {user.webUserId}</h2>
            <p>Email: {user.userEmail}</p>
            <p>Birthday: {user.birthday}</p>
            <p>Membership Fee: {user.membershipFee}</p>
            <p>User Role: {user.userRoleId} {user.userRoleType}</p>
            <img
                src={user.userImage}
                alt="User Profile"
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
        </div>
    );
}

function GetProfile() {
    const [profileData, setProfileData] = React.useState(null);
    const [errorMsg, setErrorMsg] = React.useState("");

    // Make ajax call immediately on page load no button click needed
    React.useEffect(() => {
        ajax_alt(
            "/webUser/getProfile",
            function(data) {
                if (data.errorMsg && data.errorMsg.length > 0) {
                    setErrorMsg(data.errorMsg);
                    setProfileData(null);
                } else {
                    setProfileData(data);
                    setErrorMsg("");
                }
            },
            function(eMsg) {
                setErrorMsg(eMsg);
                setProfileData(null);
            }
        );
    }, []); // runs once when the component first loads

    return (
        <div style={{ textAlign: "center" }}>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            {profileData && <UserProfile user={profileData} />}
        </div>
    );
}