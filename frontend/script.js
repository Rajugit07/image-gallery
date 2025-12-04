const yearSelect = document.getElementById("yearSelect");
const locationSelect = document.getElementById("locationSelect");
const gallery = document.getElementById("gallery");
const imgLocation = document.getElementById("img-location");
const imgYear = document.getElementById("img-year");
const loader = document.getElementById("loader");

// Pagination state
let currentPage = 1;
let totalPages = 1;
const limit = 8;

// Load filters (year + location dropdown)

async function dropDownFilters() {
    try {
        const res = await fetch("http://13.204.8.22/api/v1/image/dropdown");
        const data = await res.json();

        if (!data.success) return;

        const years = data.years || [];
        const locations = data.locations || [];

        // Clear dropdowns (optional)
        yearSelect.innerHTML = '<option value="">Select Year</option>';
        locationSelect.innerHTML = '<option value="">Select Location</option>';

        // Years dropdown
        years.forEach((year) => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });

        // Locations dropdown
        locations.sort().forEach((loc) => {
            const option = document.createElement("option");
            option.value = loc;
            option.textContent = loc;
            locationSelect.appendChild(option);
        });
    } catch (error) {
        console.log("Filter load error:", error);
    }
}

dropDownFilters();

// Load Images (with filters + pagination)
async function loadImages() {
    const year = yearSelect.value;
    const location = locationSelect.value;

    const params = new URLSearchParams();
    if (year) params.append("year", year);
    if (location) params.append("location", location);
    params.append("page", currentPage);
    params.append("limit", limit);

    try {
        showLoader();
        const response = await fetch(
            `http://13.204.8.22/api/v1/image/filter-images?${params.toString()}`
        );

        const data = await response.json();
        // console.log(data);

        hideLoader();

        if (!data.success) return;

        totalPages = data.totalPages;

        // Update heading
        imgLocation.textContent = location || "All";
        imgYear.textContent = year || "All";

        // Clear gallery
        gallery.innerHTML = "";

        // Render images
        data.images.forEach((img) => {
            const el = document.createElement("img");

            const small = img.url.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_412/"
            );
            const medium = img.url.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_800/"
            );
            const large = img.url.replace(
                "/upload/",
                "/upload/f_auto,q_auto,w_1280/"
            );

            el.src = medium;

            el.srcset = `
            ${small} 360w,
            ${medium} 800w,
            ${large} 1280w
            `;

            el.sizes = `
            (max-width: 500px) 412px,
            (max-width: 900px) 800px,
            1280px
            `;
            el.loading = "lazy";
            el.alt = img.location;
            el.className = "image-gallery-images-container-img lazy";
            gallery.appendChild(el);
        });

        updateButtons();
    } catch (err) {
        hideLoader();
        console.error("Error loading images:", err);
    }
}

// Enable/Disable pagination buttons
function updateButtons() {
    document.getElementById("prev-btn").disabled = currentPage <= 1;
    document.getElementById("next-btn").disabled = currentPage >= totalPages;
}

// Pagination button events
document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadImages();
    }
});

document.getElementById("next-btn").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadImages();
    }
});

// Reload images when filters change
yearSelect.addEventListener("change", () => {
    currentPage = 1;
    loadImages();
});

locationSelect.addEventListener("change", () => {
    currentPage = 1;
    loadImages();
});

document.addEventListener("DOMContentLoaded", () => {
    currentPage = 1;
    loadImages();
});

// loader  halper function
function showLoader() {
    loader.style.display = "block";
    gallery.style.display = "none";
}

function hideLoader() {
    loader.style.display = "none";
    gallery.style.display = "grid";
}
