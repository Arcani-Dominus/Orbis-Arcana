import { db } from "./firebase-config.js";
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// ✅ Function to Register the Player
async function submitDetails() {
    console.log("✅ Submit button clicked!");

    const name = document.getElementById("nameInput").value.trim();
    const studentID = document.getElementById("studentIDInput").value.trim();
    const result = document.getElementById("result");

    console.log("📌 Name entered:", name);
    console.log("📌 Student ID entered:", studentID);

    if (!name || !studentID) {
        console.warn("❌ Missing details!");
        result.innerHTML = "<span style='color: red;'>Please enter all details.</span>";
        return;
    }

    try {
        console.log("⏳ Saving player data to Firestore...");
        await setDoc(doc(db, "players", studentID), {
            name: name,
            studentID: studentID,
            level: 2, // Players start at Level 2
            timestamp: new Date()
        });
        console.log("✅ Data successfully saved!");

        // 🔹 Store Player Data in Local Storage
        localStorage.setItem("studentID", studentID);
        localStorage.setItem("playerName", name);
        localStorage.setItem("playerLevel", 2); // Start at Level 2

        result.innerHTML = "<span class='success-text'>Registration successful! Redirecting to Level 2...</span>";

        setTimeout(() => {
            console.log("🔄 Redirecting to Level 2...");
            window.location.href = "level.html?level=2"; // ✅ Redirect to Level 2
        }, 2000);
    } catch (error) {
        console.error("❌ Error writing to Firestore:", error);
        result.innerHTML = "<span style='color: red;'>Error submitting details. Check console.</span>";
    }
}

// ✅ Make function available globally
window.submitDetails = submitDetails;
