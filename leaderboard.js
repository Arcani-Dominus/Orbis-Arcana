import { db } from "./firebase-config.js";
import { collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const leaderboardElement = document.getElementById("leaderboard");
const leaderboardButton = document.getElementById("loadLeaderboardBtn");

async function loadLeaderboard() {
    console.log("Loading leaderboard...");

    if (!leaderboardElement) {
        console.error("❌ Leaderboard element not found in the DOM.");
        return;
    }

    try {
        const leaderboardRef = collection(db, "players");
        const q = query(leaderboardRef, orderBy("level", "desc"), limit(10)); // 🔹 Limit to top 10 players
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.warn("No players found in Firestore.");
            leaderboardElement.innerHTML = "<p>No players yet.</p>";
        } else {
            let leaderboardHTML = "<h3>🏆 Top 10 Players</h3><ol>";
            snapshot.forEach((doc, index) => {
                const player = doc.data();
                leaderboardHTML += `<li>#${index + 1} ${player.name} (Level ${player.level})</li>`;
            });
            leaderboardHTML += "</ol>";
            leaderboardElement.innerHTML = leaderboardHTML;
        }

        console.log("✅ Leaderboard updated successfully!");

    } catch (error) {
        console.error("❌ Error loading leaderboard:", error);
        leaderboardElement.innerHTML = "<p>Error loading leaderboard.</p>";
    }
}

// 🔹 Toggle leaderboard visibility on button click
leaderboardButton.addEventListener("click", async () => {
    if (leaderboardElement.style.display === "none" || leaderboardElement.classList.contains("hidden")) {
        leaderboardElement.classList.remove("hidden");
        leaderboardElement.style.display = "block"; // Show leaderboard
        await loadLeaderboard(); // Fetch leaderboard only when opening
    } else {
        leaderboardElement.classList.add("hidden");
        leaderboardElement.style.display = "none"; // Hide leaderboard
    }
});
