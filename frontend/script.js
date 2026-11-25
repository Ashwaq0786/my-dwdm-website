
let allTreks = [];

async function loadTreks() {
    const state = document.getElementById("stateFilter").value;
    const search = document.getElementById("searchInput").value;

    const url = `http://localhost:5000/api/search?state=${encodeURIComponent(state)}&search=${encodeURIComponent(search)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        allTreks = data.treks || [];

        document.getElementById("trekCount").textContent =
            `Found ${allTreks.length} trekking destinations`;

        const container = document.getElementById("trekCards");
        container.innerHTML = "";

        if (allTreks.length === 0) {
            container.innerHTML = "<p>No trekking destinations found.</p>";
            return;
        }

        allTreks.forEach((trek, index) => {
            container.innerHTML += `
                <div class="trek-card">
                    <h3>${trek["Trek / Trail"] || "Unknown Trek"}</h3>
                    <p><b>State:</b> ${trek.State || "Not available"}</p>
                    <p><b>District:</b> ${trek.District || "Not available"}</p>
                    <p><b>Difficulty:</b> ${trek.Difficulty || "Not available"}</p>
                    <p><b>Distance:</b> ${trek["Distance (km)"] ?? "Not available"} km</p>
                    <p><b>Best Season:</b> ${trek["Best Season"] || "Not available"}</p>
                    <button onclick="viewTrek(${index})">View Details</button>
                </div>
            `;
        });

    } catch (error) {
        document.getElementById("trekCards").innerHTML =
            "<p>Unable to connect to the backend. Please start the server.</p>";
        console.error(error);
    }
}


function viewTrek(index) {
    const trek = allTreks[index];

    if (!trek) return;

    const trekName = trek["Trek / Trail"] || "Unknown Trek";

    const details = `
        ${trekName}

        State: ${trek.State || "Not available"}
        District: ${trek.District || "Not available"}
        Difficulty: ${trek.Difficulty || "Not available"}
        Distance: ${trek["Distance (km)"] ?? "Not available"} km
        Best Season: ${trek["Best Season"] || "Not available"}
    `;

    const choice = confirm(
        details + "\n\nDo you want to plan a trip to this destination?"
    );

    if (choice) {
        window.location.href =
            "trip-planner.html?destination=" +
            encodeURIComponent(trekName);
    }
}
x
document.addEventListener("DOMContentLoaded", () => {
    loadTreks();

    document.getElementById("stateFilter")
        .addEventListener("change", loadTreks);

    document.getElementById("searchInput")
        .addEventListener("input", loadTreks);
});

async function getRecommendations() {
    const state = document.getElementById("recommendState").value;
    const season = document.getElementById("recommendSeason").value;

    const result = document.getElementById("recommendResults");

    result.innerHTML = "Finding suitable trekking destinations...";

    try {
        const response = await fetch("http://localhost:5000/api/treks");
        const data = await response.json();

        let treks = data.treks || data;

        const recommendations = treks.filter(trek => {
            const stateMatch =
                !state || trek.State === state;

            const seasonMatch =
                !season ||
                (trek["Best Season"] || "").toLowerCase()
                    .includes(season.toLowerCase());

            return stateMatch && seasonMatch;
        });

        if (recommendations.length === 0) {
            result.innerHTML = "<p>No matching destinations found.</p>";
            return;
        }

        result.innerHTML = `
            <h3>Recommended Destinations</h3>
            <div class="recommend-grid">
                ${recommendations.slice(0, 10).map(trek => `
                    <div class="trek-card">
                        <h3>${trek["Trek / Trail"] || "Unknown Trek"}</h3>
                        <p>State: ${trek.State || "Not available"}</p>
                        <p>Difficulty: ${trek.Difficulty || "Not available"}</p>
                        <p>Season: ${trek["Best Season"] || "Not available"}</p>
                    </div>
                `).join("")}
            </div>
        `;

    } catch (error) {
        result.innerHTML = "<p>Backend connection failed. Start your server.</p>";
        console.error(error);
    }
}

async function loadAnalytics() {
    try {
        const response = await fetch("http://localhost:5000/api/treks");
        const data = await response.json();

        const treks = data.treks || data;

        const states = [...new Set(
            treks.map(t => t.State).filter(Boolean)
        )];

        const moderate = treks.filter(
            t => (t.Difficulty || "").toLowerCase() === "moderate"
        ).length;

        const permit = treks.filter(
            t => (t["Permit Required"] || "").toString().toLowerCase() === "yes"
        ).length;

        document.getElementById("totalTreks").textContent = treks.length;
        document.getElementById("totalStates").textContent = states.length;
        document.getElementById("moderateTreks").textContent = moderate;
        document.getElementById("permitTreks").textContent = permit;

        const stateCounts = {};

        treks.forEach(trek => {
            if (trek.State) {
                stateCounts[trek.State] =
                    (stateCounts[trek.State] || 0) + 1;
            }
        });

        const container = document.getElementById("stateAnalytics");

        container.innerHTML = Object.entries(stateCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([state, count]) => `
                <div class="state-row">
                    <span>${state}</span>
                    <div class="state-bar">
                        <div class="state-fill"
                             style="width:${count / treks.length * 100}%">
                        </div>
                    </div>
                    <b>${count}</b>
                </div>
            `).join("");

    } catch (error) {
        console.error("Analytics error:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadAnalytics);
