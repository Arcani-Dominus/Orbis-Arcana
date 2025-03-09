import { db } from "./firebase-config.js";
import { collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

export async function loadLeaderboard() {
    const leaderboardRef = collection(db, "players");
    const q = query(leaderboardRef, orderBy("level", "desc"), limit(10));
    const snapshot = await getDocs(q);

    const leaderboardElement = document.getElementById("leaderboard");

    if (snapshot.empty) {
        leaderboardElement.innerHTML = "<p>No players yet.</p>";
    } else {
        let leaderboardHTML = "<ol>";
        snapshot.forEach((doc, index) => {
            const player = doc.data();
            leaderboardHTML += `<li>#${index + 1} ${player.name} (Level ${player.level})</li>`;
        });
        leaderboardHTML += "</ol>";

        leaderboardElement.innerHTML = leaderboardHTML;
    }
}
