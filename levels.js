import { db, auth } from "./firebase-config.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// DOM elements
const riddleElement = document.getElementById("riddle");
const answerInput = document.getElementById("answer");
const submitButton = document.getElementById("submit-answer");
const feedbackElement = document.getElementById("feedback");
const announcementElement = document.getElementById("announcement");
const hintButton = document.getElementById("get-hint");
const hintContainer = document.getElementById("hint-container");

let currentLevel = 1;
let userId = null;

// ✅ Load current user and level
auth.onAuthStateChanged(async (user) => {
    if (user) {
        userId = user.uid;
        await loadLevel();
    } else {
        window.location.href = "login.html";
    }
});

// ✅ Load current level data
async function loadLevel() {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            currentLevel = userSnap.data().currentLevel || 1;
        }

        // Get riddle from Firestore
        const riddleRef = doc(db, "riddles", `level${currentLevel}`);
        const riddleSnap = await getDoc(riddleRef);

        if (riddleSnap.exists()) {
            riddleElement.textContent = riddleSnap.data().question;
        } else {
            riddleElement.textContent = "🎉 Congratulations! You’ve completed all levels!";
            submitButton.style.display = "none";
            hintButton.style.display = "none";
        }

        // Get announcement from Firestore
        const announcementRef = doc(db, "announcements", "latest");
        const announcementSnap = await getDoc(announcementRef);

        if (announcementSnap.exists()) {
            announcementElement.textContent = announcementSnap.data().message;
        }

        // Reset hints UI
        hintContainer.textContent = "";
        hintButton.disabled = false;

    } catch (error) {
        console.error("Error loading level:", error);
    }
}

// ✅ Submit answer
submitButton.addEventListener("click", async () => {
    const userAnswer = answerInput.value.trim().toLowerCase();
    if (!userAnswer) return;

    try {
        const riddleRef = doc(db, "riddles", `level${currentLevel}`);
        const riddleSnap = await getDoc(riddleRef);

        if (riddleSnap.exists()) {
            const correctAnswer = riddleSnap.data().answer.toLowerCase();

            if (userAnswer === correctAnswer) {
                feedbackElement.textContent = "✅ Correct! Proceeding to next level...";
                feedbackElement.style.color = "green";

                // Update user progress
                const userRef = doc(db, "users", userId);
                await updateDoc(userRef, { currentLevel: currentLevel + 1 });

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                feedbackElement.textContent = "❌ Incorrect! Try again.";
                feedbackElement.style.color = "red";
            }
        }
    } catch (error) {
        console.error("Error checking answer:", error);
    }
});

// ✅ Handle hints using hints.js
hintButton.addEventListener("click", async () => {
    try {
        const hintModule = await import("./hints.js");
        const hint = await hintModule.getHint(currentLevel);

        if (hint) {
            const hintLine = document.createElement("p");
            hintLine.textContent = `💡 ${hint}`;
            hintContainer.appendChild(hintLine);
        } else {
            hintContainer.textContent = "⚠️ No more hints available for this level.";
            hintButton.disabled = true;
        }
    } catch (error) {
        console.error("Error fetching hint:", error);
    }
});
