import { db } from "./firebase-config.js";
import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// 🔥 Define Riddles & Answers
const riddles = {
    2: "The more you take, the more you leave behind. What am I?",
    3: "I have no substance, yet I follow you close. I vanish in darkness but thrive in the glow. What am I?"
};
const answers = {
    2: "footsteps",
    3: "shadow"
};

// 🔹 Load Level & Riddle
function loadLevel() {
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get("level")) || 2;

    document.getElementById("levelTitle").innerText = `Level ${level}`;
    document.getElementById("riddleText").innerText = riddles[level] || "Riddle not found!";
}

// 🔹 Check Answer & Progress
async function submitAnswer() {
    const studentID = localStorage.getItem("studentID");
    const answer = document.getElementById("answerInput").value.trim().toLowerCase();
    const feedback = document.getElementById("feedback");

    if (!studentID) {
        feedback.innerHTML = "<span style='color: red;'>Error: You need to register first.</span>";
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get("level")) || 2;

    if (answer === answers[level]) {
        feedback.innerHTML = "<span class='success-text'>Correct! Proceeding to next level...</span>";

        try {
            const playerRef = doc(db, "players", studentID);
            await updateDoc(playerRef, { level: level + 1 });

            const nextLevel = level + 1;

            // ✅ Check if the next level exists in riddles object
            if (riddles[nextLevel]) {
                setTimeout(() => window.location.href = `level.html?level=${nextLevel}`, 2000);
            } else {
                console.log("⌛ No new levels yet. Redirecting to waiting page...");
                setTimeout(() => window.location.href = `waiting.html?level=${level}`, 2000);
            }
        } catch (error) {
            console.error("Error updating level:", error);
            feedback.innerHTML = "<span style='color: red;'>Error proceeding. Try again.</span>";
        }
    } else {
        feedback.innerHTML = "<span style='color: red;'>Wrong answer! Try again.</span>";
    }
}

// 🔥 Attach Events on Page Load
document.addEventListener("DOMContentLoaded", () => {
    loadLevel();
    document.getElementById("submitAnswer").addEventListener("click", submitAnswer);
});
