import { db } from "./firebase-config.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

async function submitDetails() {
    console.log("Submit button clicked!");

    const name = document.getElementById("nameInput").value.trim();
    const studentID = document.getElementById("studentIDInput").value.trim();
    const result = document.getElementById("result");

    console.log("Name entered:", name);
    console.log("Student ID entered:", studentID);

    if (!name || !studentID) {
        console.log("Missing details!");
        result.innerHTML = "<span style='color: red;'>Please enter all details.</span>";
        return;
    }

    try {
        console.log("Attempting to write to Firestore...");
        await setDoc(doc(db, "players", studentID), {
            name: name,
            studentID: studentID,
            level: 2,
            timestamp: new Date()
        });
        console.log("Data successfully written to Firestore!");
    


        result.innerHTML = "<span class='success-text'>Registration successful! Proceeding to Level 2...</span>";
// Store Student ID in local storage
localStorage.setItem("studentID", studentID);

        setTimeout(() => {
            console.log("Redirecting to Level 2...");
            window.location.href = "level2.html";
        }, 2000);
    } catch (error) {
        console.error("Error writing to Firestore:", error);
        result.innerHTML = "<span style='color: red;'>Error submitting details. Check console.</span>";
    }
}

// ✅ Fix: Make sure function is available globally
window.submitDetails = submitDetails;
