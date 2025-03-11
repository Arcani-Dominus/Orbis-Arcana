import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

// ✅ Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.warn("⚠️ User not logged in! Redirecting to login page...");
        window.location.href = "login.html"; // ✅ Redirect to login
    } else {
        console.log("✅ User is logged in:", user.email);
    }
});

import { db } from "./firebase-config.js";
import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// 🔥 Define Riddles & Answers
const riddles = {
    2: "The more you take, the more you leave behind. What am I?",
    3: "I have no substance, yet I follow you close. I vanish in darkness but thrive in the glow. What am I?",
    4: "Follow Me!",
    5: "Really?",
    6: "ok?"
};
const answers = {
    2: "footsteps",
    3: "shadow",
    4: "arcana42",
    5: "yes",
    6: "ok"
};

// 🔹 Load Level & Riddle (With Error Prevention)
function loadLevel() {
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get("level")) || 2;

    // ✅ Check if elements exist before modifying them
    const levelTitle = document.getElementById("levelTitle");
    const riddleText = document.getElementById("riddleText");

    if (levelTitle && riddleText) {
        levelTitle.innerText = `Level ${level}`;
        riddleText.innerText = riddles[level] || "Riddle not found!";
    } else {
        console.warn("⚠️ WARNING: Level elements not found on this page. Skipping update.");
    }
}

// 🔹 Check Answer & Progress
async function submitAnswer() {
    const user = auth.currentUser; // ✅ Get logged-in user
    const feedback = document.getElementById("feedback");

    if (!user) {
        feedback.innerHTML = "<span style='color: red;'>Error: You need to log in first.</span>";
        console.warn("⚠️ No logged-in user found. Redirecting to login page...");
        setTimeout(() => {
            window.location.href = "login.html"; // ✅ Redirect to login page
        }, 2000);
        return;
    }

    const studentID = user.uid; // ✅ Use Firebase Auth User ID instead of localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get("level")) || 2;

    const answer = document.getElementById("answerInput").value.trim().toLowerCase();
    const correctAnswer = answers[level].toLowerCase(); // ✅ Normalize stored answer

    if (answer === correctAnswer) { 
        feedback.innerHTML = "<span class='success-text'>Correct! Proceeding to next level...</span>";
        console.log(`✅ Correct answer entered for Level ${level}. Updating Firestore...`);

        try {
            const playerRef = doc(db, "players", studentID);
            await updateDoc(playerRef, { level: level + 1 });

            console.log("✅ Firestore update successful! Moving to next level...");

            const nextLevel = level + 1;

            // ✅ Ensure the update is confirmed before redirecting
            setTimeout(() => {
                console.log(`🔄 Checking if Level ${nextLevel} exists in riddles...`);
                if (riddles[nextLevel]) {
                    console.log(`🎉 Level ${nextLevel} found! Redirecting now...`);
                    window.location.href = `level.html?level=${nextLevel}`;
                } else {
                    console.log("⌛ No new levels yet. Redirecting to waiting page...");
                    window.location.href = `waiting.html?level=${level}`;
                }
            }, 2000); // ✅ Ensures Firestore update is complete

        } catch (error) {
            console.error("❌ Firestore update failed:", error);
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

export { riddles };
