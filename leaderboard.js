import { db } from "./firebase.js"; // Ensure Firebase is properly imported
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

export async function loadLeaderboard() {
    const leaderboardElement = document.getElementById("leaderboard");

    try {
        const querySnapshot = await getDocs(collection(db, "leaderboard")); // Fetch from Firebase
        let leaderboardData = [];

        querySnapshot.forEach(doc => {
            const entry = doc.data();
            leaderboardData.push(`<p>🏆 ${entry.username}: ${entry.score} points</p>`);
        });

        leaderboardElement.innerHTML = leaderboardData.length > 0 ? leaderboardData.join("") : "No scores yet.";
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        leaderboardElement.innerText = "Error loading leaderboard.";
    }
}

// ✅ Load leaderboard when button is clicked
document.getElementById("loadLeaderboardBtn").addEventListener("click", loadLeaderboard);
