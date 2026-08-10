"use strict";

function LogOff() {
    const [message, setMessage] = React.useState("");

    React.useEffect(() => {
        ajax_alt(
            "/webUser/logoff",
            function(data) {
                setMessage(data.errorMsg);
            },
            function(eMsg) {
                setMessage(eMsg);
            }
        );
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
            {message && <p>{message}</p>}
        </div>
    );
}