

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
    let main = document.getElementById("t-body");
    // main.innerHTML = null;

    if (Array.isArray(data)) {
        data.forEach((element) => {
            const row = document.createElement("tr");
            row.innerHTML += `
               <td>${element.userId || "N/A"}</td>
                <td>${ element.type|| "N/A"}</td>
                <td>${element.amount || 0}</td>
                <td>${element.balanceAfter || 0}</td>
                <td>${element.sender || "N/A"}</td>
                <td>${element.recipient || "N/A"}</td>
                <td>${new Date(element.date).toLocaleDateString() || "N/A"}</td>
            `;
            main.appendChild(row);
        });
    } else {
        main.innerHTML = `<p>No data available</p>`;
    }
}
