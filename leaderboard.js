import { db } from "./firebase-config.js";
import { collection, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

export function loadLeaderboard() {
    console.log("📢 Loading leaderboard from Firebase...");

    const leaderboardRef = collection(db, "players");
    const q = query(leaderboardRef, orderBy("level", "desc"), limit(10));
    const leaderboardElement = document.getElementById("leaderboard");

    // 🔹 Real-time listener for leaderboard
    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            console.warn("No players found in Firestore.");
            leaderboardElement.innerHTML = "<p>No players yet.</p>";
            return;
        }

        let leaderboardHTML = "<ol>";
        snapshot.forEach((doc, index) => {
            const player = doc.data();
            leaderboardHTML += `<li>#${index + 1} ${player.name} (Level ${player.level})</li>`;
        });
        leaderboardHTML += "</ol>";

        leaderboardElement.innerHTML = leaderboardHTML;
        console.log("✅ Leaderboard updated successfully!");
    }, (error) => {
        console.error("❌ Error fetching leaderboard:", error);
        leaderboardElement.innerHTML = "<p>Error loading leaderboard.</p>";
    });
}
