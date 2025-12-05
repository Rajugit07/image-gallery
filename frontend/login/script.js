const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const payload = { email, password };

    try {
        const response = await fetch(
            "http://13.203.100.181/api/v1/user/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                credentials: "include",
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            return;
        }

        const data = await response.json();
        console.log("Success:", data);
        window.location.href = "/frontend/admin/index.html";
    } catch (err) {
        console.error("Network/Fetch Error:", err);
    }
});
