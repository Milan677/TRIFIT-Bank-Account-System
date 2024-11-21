const deposit_btn=document.getElementById("deposit-btn");
const username=document.getElementById("username");
const pin=document.getElementById("Pin");
const amount=document.getElementById("amount")

//.........Withdraw elements................
const Withdraw_btn=document.getElementById("Withdraw-btn");
const w_username=document.getElementById("w-username");
const w_pin=document.getElementById("w-Pin");
const w_amount=document.getElementById("w-amount");

//.........transfer form elements.........
const transfer_btn=document.getElementById("transfer-btn");
const sender=document.getElementById("sender");
const sender_pin=document.getElementById("sender-Pin");
const recipient=document.getElementById("Reciever");
const t_amount=document.getElementById("t-amount");

//..........Logout.................
const logout_btn=document.getElementById("logout-btn");


deposit_btn.addEventListener("click",async(e)=>{
    e.preventDefault();

    const payload={
       username:username.value ,
       pin:pin.value ,
       amount:+amount.value
    }

    console.log(payload);

    try {
        const response = await fetch("https://trifit-bank-account-system.onrender.com/user/deposit", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization:  `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload),
            
        });

        const res = await response.json();

        if(res.message=='User not found'){
            Swal.fire({
                title: "Wrong userName?",
                text: "User not found?",
                icon: "question"
              });
        }
        if(res.message=="Please Login !"){
            swal.fire("Invalid !", "Pls login before deposite !", "warning");
        } 
        if(res.message=='Account is locked.'){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Account is locked. Try again later.!",
                
              });
        }
        if(res.message=='Invalid PIN'){
            swal.fire("Invalid !", "Pls enter a valid pin", "warning");
        }

        if(res.message=='Deposit successful'){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Deposit successful...",
                showConfirmButton: false,
                timer: 1500
              });
        }

    } catch (error) {
        console.log(error)
    }
})

//withdraw
Withdraw_btn.addEventListener("click",async(e)=>{
    e.preventDefault();

    const payload={
        username:w_username.value,
        pin:w_pin.value,
        amount:+w_amount.value
    }

    console.log(payload);

    try {
        const response = await fetch("https://trifit-bank-account-system.onrender.com/user/withdraw", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization:  `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload),
            
        });

        const res = await response.json();
        if(res.message=='User not found'){
            Swal.fire({
                title: "Wrong userName?",
                text: "User not found?",
                icon: "question"
              });
        }
        if(res.message=="Please Login !"){
            swal.fire("Invalid !", "Please login before withdrawl !", "warning");
        } 
        if(res.message=='Account is locked.'){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Account is locked. Try again later.!",
                
              });
        }
        if(res.message=='Invalid PIN'){
            swal.fire("Invalid !", "Pls enter a valid pin", "warning");
        }
        if(res.message=='Insufficient balance'){
            Swal.fire({
                title: "Insufficient balance?",
                text: "Your account does not have sufficient balance?",
                icon: "question"
              });
        }

        if(res.message=='Withdrawal successful'){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Withdrawl successful...",
                showConfirmButton: false,
                timer: 1500
              });
        }
    } catch (error) {
        console.log(error);
    }
})

//Transfer Money

transfer_btn.addEventListener("click",async(e)=>{
    e.preventDefault();
    const payload={
        senderUsername:sender.value,
        pin:sender_pin.value,
        recipientUsername:recipient.value,
        amount:+t_amount.value
    }

    try {
        const response = await fetch("https://trifit-bank-account-system.onrender.com/user/transfer", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization:  `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload),
            
        });

        const res = await response.json();
        if(res.message=='Sender account is locked.'){
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Account is locked. Try again later.!",
                
              });
        }

        if(res.message=='Invalid users'){
            Swal.fire({
                title: "Wrong userName?",
                text: "User not found?",
                icon: "question"
              });
        }

        if(res.message=='Invalid PIN'){
            swal.fire("Invalid !", "Pls enter a valid pin", "warning");
        }
        if(res.message=="Please Login !"){
            swal.fire("Invalid !", "Pls login before doing a transaction !", "warning");
        }

        if(res.message=='Insufficient balance'){
            Swal.fire({
                title: "Insufficient balance?",
                text: "Your account does not have sufficient balance?",
                icon: "question"
              });
        }

        if(res.message=='Transfer successful'){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Transaction successful...",
                showConfirmButton: false,
                timer: 1500
              });
        }

    } catch (error) {
        console.log(error.message);
    }
})

//logout
// logout_btn.addEventListener("click",async(e)=>{
//     try {
//         const response = await fetch("http://localhost:4567/user/logout", {
//             method: "POST",
//             headers: {
//                 "Content-type": "application/json",
//                 Authorization:  `Bearer ${localStorage.getItem("token")}`
//             },
            
            
//         });

//         const res = await response.json();
//         if(res.message=="Logged out successfully"){
//             Swal.fire({
//                 position: "centre",
//                 icon: "success",
//                 title: "Logout successful...",
//                 showConfirmButton: false,
//                 timer: 1500
//               });

//               setTimeout(()=>{
//                  window.location.href="login.html";
//               },2000)
//         }
//     } catch (error) {
//         console.log(error)
//     }
// })

logout_btn.addEventListener("click", async (e) => {
    try {
        const token = localStorage.getItem("token");
        console.log(token)

        if (!token) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "No token found. Please log in.",
                showConfirmButton: true,
            });
            return;
        }

        const response = await fetch("https://trifit-bank-account-system.onrender.com/user/logout", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // if (!response.ok) {
        //     // Handle non-2xx status codes
        //     throw new Error(`Request failed with status ${response.status}`);
        // }

        const res = await response.json();
        console.log(res)

        if (res.message === "Logged out successfully") {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Logout successful...",
                showConfirmButton: false,
                timer: 1500,
            });

            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            Swal.fire({
                position: "center",
                icon: "error",
                title: res.message || "Logout failed.",
                showConfirmButton: true,
            });
        }
    } catch (error) {
        console.error(error.message);
        Swal.fire({
            position: "center",
            icon: "error",
            title: "An error occurred. Please try again.",
            showConfirmButton: true,
        });
    }
});