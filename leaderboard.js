import { db } from "./firebase-config.js";
import { collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// ✅ Load leaderboard from Firestore
export async function loadLeaderboard() {
    console.log("🏆 Loading leaderboard...");

    const leaderboardRef = collection(db, "players");
    const q = query(leaderboardRef, orderBy("level", "desc"), limit(10));

    try {
        const snapshot = await getDocs(q);
        const leaderboardElement = document.getElementById("leaderboard");

        if (snapshot.empty) {
            console.warn("ℹ️ No players found.");
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
    } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        document.getElementById("leaderboard").innerHTML = "<p>Error loading leaderboard.</p>";
    }
}

// ✅ Ensure function runs when button is clicked
document.getElementById("loadLeaderboardBtn").addEventListener("click", () => {
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.classList.toggle("hidden");
    if (!leaderboard.classList.contains("hidden")) {
        loadLeaderboard();
    }
});
