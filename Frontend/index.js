const registration_btn=document.getElementById("registration-btn");
const username=document.getElementById("username");
const pin=document.getElementById("Pin");
const deposite=document.getElementById("deposit");

registration_btn.addEventListener("click",async(e)=>{
     e.preventDefault();
     const payload={
        username:username.value ,
        pin:pin.value , 
        initialDeposit:+deposite.value   
     }
     console.log(payload);

     try {
        const response = await fetch("https://trifit-bank-account-system.onrender.com/user/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if(res.message=='Username already exists'){
            swal("Invalid !", "UserName alredy exist", "warning");
        }

        if(res.message=='Pin should be of 4 charecter'){
            swal("Invalid !", "PIN should be of 4 digits", "warning");
        }
        if(res.message=='Deposit amount cannot be negative.Please enter a valid amount'){
            swal("Invalid !",'Deposit amount cannot be negative.Please enter a valid amount' , "warning");
        }

        if(res.message=='User registered successfully'){
            window.location.href="login.html"
        }


     } catch (error) {
        console.log(error);
     }
})