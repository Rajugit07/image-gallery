const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const payload = { fullname, email, password };

    try {
        const response = await fetch(
            "http://13.203.100.181/api/v1/user/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            return;
        }

        const data = await response.json();
        window.location.href = "/frontend/login/index.html";
        console.log("Success:", data);
    } catch (err) {
        console.error("Network/Fetch Error:", err);
    }
});
