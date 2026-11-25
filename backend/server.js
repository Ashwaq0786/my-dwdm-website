
const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Read Excel dataset
const filePath = path.join(
    __dirname,
    "data",
    "south_india_large_trekking_dataset.xlsx"
);

const workbook = XLSX.readFile(filePath);

const sheet = workbook.Sheets["Master Dataset"];

const trekkingData = XLSX.utils.sheet_to_json(sheet, {
    defval: null
});

console.log("Trekking dataset loaded:", trekkingData.length);

// Test backend
app.get("/api/health", (req, res) => {
    res.json({
        message: "TrekSmart backend is running!",
        status: "success",
        totalTreks: trekkingData.length
    });
});

// Get all trekking destinations
app.get("/api/treks", (req, res) => {
    res.json({
        total: trekkingData.length,
        treks: trekkingData
    });
});

// Search and filter trekking destinations
app.get("/api/search", (req, res) => {
    const { state, difficulty, search } = req.query;

    let results = trekkingData;

    if (state) {
        results = results.filter(trek =>
            String(trek.State || "").toLowerCase() ===
            state.toLowerCase()
        );
    }

    if (difficulty) {
        results = results.filter(trek =>
            String(trek.Difficulty || "").toLowerCase() ===
            difficulty.toLowerCase()
        );
    }

    if (search) {
        results = results.filter(trek =>
            String(trek["Trek / Trail"] || "")
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }

    res.json({
        total: results.length,
        treks: results
    });
});

// Get available states
app.get("/api/states", (req, res) => {
    const states = [
        ...new Set(
            trekkingData
                .map(trek => trek.State)
                .filter(Boolean)
        )
    ];

    res.json(states);
});

// Get summary information
app.get("/api/summary", (req, res) => {
    const summary = {};

    trekkingData.forEach(trek => {
        const state = trek.State || "Unknown";
        summary[state] = (summary[state] || 0) + 1;
    });

    res.json({
        totalTreks: trekkingData.length,
        stateWiseTreks: summary
    });
});

// Start server
app.listen(PORT, () => {
    console.log("--------------------------------");
    console.log("TrekSmart Backend Started!");
    console.log(`Server: http://localhost:${PORT}`);
    console.log("--------------------------------");
});
