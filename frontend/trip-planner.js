
const tripForm = document.getElementById("tripForm");

tripForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Get user input
    const destination = document.getElementById("destination").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const travellers = Number(document.getElementById("travellers").value);
    const difficulty = document.getElementById("difficulty").value;
    const transport = document.getElementById("transport").value;

    // Validate details
    if (!destination || !startDate || !endDate || !difficulty) {
        alert("Please fill in all required details.");
        return;
    }

    if (travellers < 1 || travellers > 50) {
        alert("Please enter between 1 and 50 travellers.");
        return;
    }

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (end < start) {
        alert("End date must be after or equal to start date.");
        return;
    }

    // Calculate trip duration
    const days = Math.round(
        (end - start) / (1000 * 60 * 60 * 24)
    ) + 1;

    // Generate trip result
    const result = document.getElementById("tripResult");

    result.style.display = "block";

    result.innerHTML = `
        <h2>🎉 Your Trip Plan is Ready!</h2>

        <p><b>📍 Destination:</b> ${escapeHTML(destination)}</p>
        <p><b>📅 Start Date:</b> ${startDate}</p>
        <p><b>📅 End Date:</b> ${endDate}</p>
        <p><b>⏳ Total Days:</b> ${days}</p>
        <p><b>👥 Travellers:</b> ${travellers}</p>
        <p><b>🥾 Difficulty:</b> ${escapeHTML(difficulty)}</p>
        <p><b>🚗 Transport:</b> ${escapeHTML(transport)}</p>

        <hr>

        <h3>Your Trekking Schedule</h3>

        <p><b>Day 1:</b> Reach your destination and complete local arrangements.</p>

        ${days > 1
            ? `<p><b>Following days:</b> Follow your selected trekking itinerary and local guide's instructions.</p>`
            : `<p><b>Day 1:</b> Complete your trek according to local trail conditions and timings.</p>`
        }

        <p><b>Final Day:</b> Return safely and check your belongings.</p>

        <h3>🏔️ Have a safe and happy trek!</h3>

        <p class="safety-note">
            This is a basic trip schedule, not a verified trail itinerary.
            Confirm trail access, permits, weather and guide requirements
            before travelling.
        </p>
    `;

    result.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

// Protect displayed user text
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

// Get destination from homepage
const params = new URLSearchParams(window.location.search);

const selectedDestination = params.get("destination");

if (selectedDestination) {
    document.getElementById("destination").value =
        selectedDestination;
}
