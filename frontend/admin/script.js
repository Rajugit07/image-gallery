const form = document.querySelector("form");
const loader = document.getElementById("loader");
const formElement = document.querySelector("#uploadSection form");

// upload image
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const image = document.getElementById("image").files[0];
    const year = document.getElementById("year").value.trim();
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    // Validate required fields
    if (!image || !year || !location || !description) {
        console.log("All fields are required.");
        return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append("image", image);
    formData.append("year", year);
    formData.append("location", location);
    formData.append("description", description);

    try {
        showLoader();
        const res = await fetch("http://localhost:8000/api/v1/image/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        hideLoader();

        if (!data.success) {
            console.log("Upload failed:", data.message);
            return;
        }

        console.log("Upload successful!");
        alert("Image uploaded successfully.");

        form.reset();
    } catch (error) {
        hideLoader();
        console.log("Upload error:", error);
    }
});

// logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
    try {
        const res = await fetch("http://localhost:8000/api/v1/user/logout", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            console.log("Logout request failed with status:", res.status);
            alert("Logout failed. Try again.");
            return;
        }

        const data = await res.json();

        if (!data.success) {
            console.log("Logout failed:", data.message);
            alert("Logout failed.");
            return;
        }

        alert("Logout successful!");

        // Give alert time to show
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 300);
    } catch (error) {
        console.log("Logout error:", error);
        alert("Something went wrong.");
    }
});

// loader helper function
function showLoader() {
    loader.style.display = "block";
    formElement.classList.add("hidden");
}

function hideLoader() {
    loader.style.display = "none";
    formElement.classList.remove("hidden");
}
