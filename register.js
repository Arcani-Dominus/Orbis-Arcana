import { db } from "./firebase-config.js";
import { collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// ✅ Export the function properly
export async function submitDetails() {
    console.log("✅ Submit button clicked!");

    const name = document.getElementById("nameInput").value.trim();
    const studentID = document.getElementById("studentIDInput").value.trim();
    const result = document.getElementById("result");

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
            level: 2,
            timestamp: new Date()
        });
        console.log("✅ Data successfully saved!");

        result.innerHTML = "<span class='success-text'>Registration successful! Redirecting to Level 2...</span>";

        setTimeout(() => {
            console.log("🔄 Redirecting to Level 2...");
            window.location.href = "level.html?level=2";
        }, 2000);
    } catch (error) {
        console.error("❌ Error writing to Firestore:", error);
        result.innerHTML = "<span style='color: red;'>Error submitting details. Check console.</span>";
    }
}


// ✅ Make function globally available
window.submitDetails = submitDetails;
