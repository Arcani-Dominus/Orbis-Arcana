// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    query, 
    orderBy, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyChs_NAolpqRZ-dV22bZ5KXhqXa5XuNJTI",
    authDomain: "orbis-arcana.firebaseapp.com",
    projectId: "orbis-arcana",
    storageBucket: "orbis-arcana.appspot.com",
    messagingSenderId: "474107878031",
    appId: "1:474107878031:web:0869ada48ff6a446356efa"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Load Real-Time Leaderboard
export function loadLeaderboard() {
    console.log("🏆 Fetching leaderboard...");

    const leaderboardRef = collection(db, "players");
    const q = query(leaderboardRef, orderBy("level", "desc"));

    onSnapshot(q, (snapshot) => {
        let leaderboardHTML = "<ol>";

        if (snapshot.empty) {
            leaderboardHTML = "<p>No players found.</p>";
        } else {
            snapshot.forEach((doc, index) => {
                const player = doc.data();
                leaderboardHTML += `<li>#${index + 1} ${player.name} (Level ${player.level})</li>`;
            });
            leaderboardHTML += "</ol>";
        }

        const leaderboardElement = document.getElementById("leaderboard");
        if (leaderboardElement) {
            leaderboardElement.innerHTML = leaderboardHTML;
        } else {
            console.error("❌ Leaderboard element not found!");
        }

        console.log("✅ Leaderboard updated successfully!");
    });
}
