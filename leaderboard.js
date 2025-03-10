import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyChs_NAolpqRZ-dV22bZ5KXhqXa5XuNJTI",
    authDomain: "orbis-arcana.firebaseapp.com",
    projectId: "orbis-arcana",
    storageBucket: "orbis-arcana.appspot.com",
    messagingSenderId: "474107878031",
    appId: "1:474107878031:web:0869ada48ff6a446356efa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function loadLeaderboard() {
    console.log("Loading leaderboard...");

    try {
        const leaderboardRef = collection(db, "players");
        const snapshot = await getDocs(leaderboardRef);
        const leaderboardElement = document.getElementById("leaderboard");

        if (!leaderboardElement) {
            console.error("Leaderboard element not found in DOM.");
            return;
        }

        let leaderboardHTML = "<h3>Leaderboard</h3><ol>";
        snapshot.forEach(doc => {
            const player = doc.data();
            leaderboardHTML += `<li>${player.name} - ${player.score} points</li>`;
        });
        leaderboardHTML += "</ol>";

        leaderboardElement.innerHTML = leaderboardHTML;
        console.log("✅ Leaderboard updated successfully!");
    } catch (error) {
        console.error("❌ Error loading leaderboard:", error);
        document.getElementById("leaderboard").innerHTML = "<p>Error loading leaderboard.</p>";
    }
}
