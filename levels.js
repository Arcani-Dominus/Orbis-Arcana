// ✅ Import dependencies once at the top
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { 
    getDocs, collection, doc, updateDoc, serverTimestamp, getDoc, query, orderBy, limit 
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// ✅ Import hint function from hints.js
import { getHint } from "./hints.js";

const feedback = document.getElementById("feedback");
const answerInput = document.getElementById("answerInput");

// ✅ Show loading indicator
function showLoadingIndicator(message = "⏳ Checking answer...") {
    feedback.innerHTML = `<span style="color: blue;">${message}</span>`;
}

// ✅ Load the riddle
export async function loadRiddle() {
    const riddleElement = document.getElementById("riddleText");

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const level = parseInt(urlParams.get("level")) || 1;

        const levelRef = doc(db, "answers", level.toString());
        const levelSnap = await getDoc(levelRef);

        if (!levelSnap.exists()) {
            riddleElement.innerText = "⚠️ Riddle not found!";
            return;
        }

        const riddleData = levelSnap.data();
        riddleElement.innerText = riddleData.riddle || "Riddle not found!";
    } catch (error) {
        console.error("❌ Error loading riddle:", error);
        riddleElement.innerText = "❌ Error loading riddle.";
    }
}

// ✅ Submit the answer
export async function submitAnswer() {
    const user = auth.currentUser;
    if (!user) {
        feedback.innerHTML = `<span style='color: red;'>❌ Error: You need to log in first.</span>`;
        return;
    }

    const studentID = user.uid;
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get("level")) || 1;
    const answer = answerInput.value.trim().toLowerCase();

    if (!answer) {
        feedback.innerHTML = `<span style='color: red;'>⚠️ Please enter an answer.</span>`;
        return;
    }

    showLoadingIndicator();

    try {
        const levelRef = doc(db, "answers", level.toString());
        const levelSnap = await getDoc(levelRef);

        if (!levelSnap.exists()) {
            feedback.innerHTML = `<span style='color: red;'>⚠️ No riddle found for this level.</span>`;
            return;
        }

        const correctAnswer = levelSnap.data().answer.toLowerCase();

        if (answer === correctAnswer) {
            feedback.innerHTML = `<span class='success-text'>✅ Correct! Proceeding to next level...</span>`;

            const playerRef = doc(db, "players", studentID);
            await updateDoc(playerRef, { 
                level: level + 1,
                timestamp: serverTimestamp()
            });

            setTimeout(() => {
                window.location.href = `level.html?level=${level + 1}`;
            }, 2000);

        } else {
            feedback.innerHTML = `<span style='color: red;'>❌ Wrong answer! Try again.</span>`;
        }
    } catch (error) {
        console.error("❌ Error checking answer:", error);
        feedback.innerHTML = `<span style='color: red;'>❌ Error checking answer. Try again.</span>`;
    }
}

// ✅ Load announcements
export async function getAnnouncement() {
    try {
        const announcementRef = doc(db, "announcements", "latest");
        const announcementSnap = await getDoc(announcementRef);

        if (!announcementSnap.exists()) {
            return "No announcements available.";
        }

        return announcementSnap.data().message || "No announcements available.";
    } catch (error) {
        console.error("❌ Error fetching announcements:", error);
        return "Error loading announcements.";
    }
}

// ✅ Load leaderboard (top 10)
export async function loadLeaderboard() {
    try {
        const leaderboardDiv = document.getElementById("leaderboard");
        leaderboardDiv.innerHTML = "<p>Loading...</p>";

        const leaderboardQuery = query(
            collection(db, "players"),
            orderBy("level", "desc"),
            orderBy("timestamp", "asc"),
            limit(10)
        );

        const querySnapshot = await getDocs(leaderboardQuery);

        if (querySnapshot.empty) {
            leaderboardDiv.innerHTML = "<p>No players found.</p>";
            return;
        }

        let leaderboardHTML = "<ol>";
        querySnapshot.forEach((doc) => {
            const player = doc.data();
            leaderboardHTML += `<li>${player.name || "Unknown"} - Level ${player.level}</li>`;
        });
        leaderboardHTML += "</ol>";

        leaderboardDiv.innerHTML = leaderboardHTML;
        leaderboardDiv.classList.remove("hidden");
        leaderboardDiv.style.display = "block";

    } catch (error) {
        console.error("❌ Error loading leaderboard:", error);
        document.getElementById("leaderboard").innerHTML = "<p>Error loading leaderboard.</p>";
    }
}

// ✅ Show current level in UI
export async function showCurrentLevel() {
    const user = auth.currentUser;
    if (!user) return;

    const playerRef = doc(db, "players", user.uid);
    const playerSnap = await getDoc(playerRef);

    if (playerSnap.exists()) {
        const currentLevel = playerSnap.data().level || 1;
        const levelElement = document.getElementById("levelTitle");
        if (levelElement) levelElement.innerText = `Level ${currentLevel}`;
    }
}

// ✅ On auth state change, load riddle & level
onAuthStateChanged(auth, async (user) => {
    if (user) {
        await loadRiddle();
        await showCurrentLevel();
    }
});

// ✅ Export getHint to bind in level.html
export { getHint };
