// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    query, 
    orderBy, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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

// 🔥 Real-Time Leaderboard Updates
function loadLeaderboard() {
    const leaderboardRef = collection(db, "players");
    const q = query(leaderboardRef, orderBy("level", "desc")); // Sorting by highest level

    onSnapshot(q, (snapshot) => {
        let leaderboardHTML = "<ol>";
        snapshot.forEach(doc => {
            const player = doc.data();
            leaderboardHTML += `<li>${player.name} (Level ${player.level})</li>`;
        });
        leaderboardHTML += "</ol>";

        document.getElementById("leaderboard").innerHTML = leaderboardHTML;
    });
}

// 🔥 Real-Time Announcements Updates
function loadAnnouncements() {
    const announcementsRef = collection(db, "announcements");

    onSnapshot(announcementsRef, (snapshot) => {
        let announcementsHTML = "<ul>";
        snapshot.forEach(doc => {
            const announcement = doc.data();
            announcementsHTML += `<li><strong>${announcement.title}</strong>: ${announcement.message}</li>`;
        });
        announcementsHTML += "</ul>";

        document.getElementById("announcements").innerHTML = announcementsHTML;
    });
}

// Load real-time data when the page loads
export { db, loadLeaderboard, loadAnnouncements };
