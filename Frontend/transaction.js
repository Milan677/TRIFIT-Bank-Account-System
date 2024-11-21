

const showdata = () => {
    fetch("https://trifit-bank-account-system.onrender.com/user/statement", {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then((res) => {
            if (!res.ok) {
                // Handle HTTP errors (e.g., 401)
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            return res.json(); // Parse JSON if response is valid
        })
        .then((data) => {
            console.log(data.transactions);
            displaydata(data.transactions);
        })
        .catch((err) => {
            console.error("Fetch error:", err.message);
        });
    }    

showdata();

function displaydata(data) {
    let main = document.getElementById("t-box");
    main.innerHTML = null;

    if (Array.isArray(data)) {
        data.forEach((element) => {
            main.innerHTML += `
              <div class="card">
                ${JSON.stringify(element)}
              </div>
            `;
        });
    } else {
        main.innerHTML = `<p>No data available</p>`;
    }
}
