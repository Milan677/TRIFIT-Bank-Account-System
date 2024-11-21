const login_btn = document.getElementById("login-btn");
const username = document.getElementById("username");
const pin = document.getElementById("Pin");

login_btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const payload = {
        username: username.value.trim(),
        pin: pin.value.trim()
    };
    console.log(payload);

    try {
        const response = await fetch("https://trifit-bank-account-system.onrender.com/user/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // Check for non-200 HTTP status codes
        // if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        // }

        const res = await response.json();
        console.log(res.message)

        // Handle various response messages
        if(res.message=='Pin should be of 4 digits'){
            Swal.fire("Invalid!", "Pin should be of 4 digits", "warning");
        }
        if (res.message === "User not found") {
            Swal.fire({
                title: "Wrong Username?",
                text: "User not found.",
                icon: "question"
            });
        } else if (res.message === "Account is locked. Try again later.") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Account is locked. Try again later!",
            });
        } else if (res.message === "Invalid credentials") {
            Swal.fire("Invalid!", "Please enter a valid pin.", "warning");
        } else if (res.message === "Login successful") {
            localStorage.setItem("token", res.token);
            document.cookie=`token=${res.token}`;
            console.log(res);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Login successful...",
                showConfirmButton: false,
                timer: 1500 // Automatically closes after 1.5 seconds
            });

            setTimeout(() => {
                window.location.href = "BankDetail.html";
            }, 2000); // Redirect after 2 seconds
        } else {
            // Handle unexpected responses
            Swal.fire({
                icon: "error",
                title: "Unexpected Response",
                text: res.message || "An unknown error occurred."
            });
        }
    } catch (error) {
        console.error("Error:", error);

        Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Could not connect to the server. Please try again later."
        });
    }
});
