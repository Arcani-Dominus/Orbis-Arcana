import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    query, 
    orderBy, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// 🔥 Firebase Configuration
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

// 🔥 Real-Time Leaderboard Updates
function loadLeaderboard() {
    console.log("🏆 Loading leaderboard...");
    
    const leaderboardRef = collection(db, "players");
    const q = query(leaderboardRef, orderBy("level", "desc"));

    onSnapshot(q, (snapshot) => {
        let leaderboardHTML = "<ol>";
        snapshot.forEach((doc, index) => {
            const player = doc.data();
            leaderboardHTML += `<li>#${index + 1} ${player.name} (Level ${player.level})</li>`;
        });
        leaderboardHTML += "</ol>";

        document.getElementById("leaderboard").innerHTML = leaderboardHTML;
        console.log("✅ Leaderboard updated successfully!");
    });
}

// Export Firebase Functions
export { db, loadLeaderboard };
