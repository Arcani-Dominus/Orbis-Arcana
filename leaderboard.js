import { db } from "./firebase-config.js";
import { collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const leaderboardElement = document.getElementById("leaderboard");
const leaderboardButton = document.getElementById("loadLeaderboardBtn");
let leaderboardLoaded = false; // ✅ Prevents unnecessary API calls

async function loadLeaderboard() {
    console.log("📌 Fetching top 10 players...");

    if (!leaderboardElement) {
        console.error("❌ Leaderboard element not found in the DOM.");
        return;
    }

    try {
        const leaderboardRef = collection(db, "players");
        const q = query(leaderboardRef, orderBy("level", "desc"), orderBy("timestamp", "asc"), limit(10)); // ✅ Strictly limits to 10 players
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.warn("⚠ No players found in Firestore.");
            leaderboardElement.innerHTML = "<p>No players yet.</p>";
        } else {
            let leaderboardHTML = "<h3>🏆 Top 10 Players</h3><ol>";
            let count = 0; // ✅ Manually limit results to 10, ensuring safety
            snapshot.forEach((doc) => {
                if (count < 10) { // ✅ Extra safeguard
                    const player = doc.data();
                    leaderboardHTML += `<li>#${count + 1} ${player.name} (Level ${player.level})</li>`;
                    count++;
                }
            });
            leaderboardHTML += "</ol>";
            leaderboardElement.innerHTML = leaderboardHTML;
        }

        console.log("✅ Leaderboard updated successfully!");
        leaderboardLoaded = true; // ✅ Mark as loaded to prevent unnecessary fetches

    } catch (error) {
        console.error("❌ Error loading leaderboard:", error);
        leaderboardElement.innerHTML = "<p>Error loading leaderboard.</p>";
    }
}

// 🔹 Toggle leaderboard visibility
leaderboardButton.addEventListener("click", async () => {
    if (leaderboardElement.style.display === "none" || leaderboardElement.classList.contains("hidden")) {
        leaderboardElement.classList.remove("hidden");
        leaderboardElement.style.display = "block"; // Show leaderboard

        if (!leaderboardLoaded) {
            await loadLeaderboard(); // ✅ Fetch only if not loaded before
        }
    } else {
        leaderboardElement.classList.add("hidden");
        leaderboardElement.style.display = "none"; // Hide leaderboard
    }
});
