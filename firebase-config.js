// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

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

// Fetch Leaderboard Data
async function loadLeaderboard() {
    const leaderboardRef = collection(db, "players");
    const q = query(leaderboardRef, orderBy("level", "desc")); // Sorting by highest level
    const snapshot = await getDocs(q);

    let leaderboardHTML = "<ol>";
    snapshot.forEach(doc => {
        const player = doc.data();
        leaderboardHTML += `<li>${player.name} (Level ${player.level})</li>`;
    });
    leaderboardHTML += "</ol>";

    document.getElementById("leaderboard").innerHTML = leaderboardHTML;
}

// Fetch Announcements
async function loadAnnouncements() {
    const announcementsRef = collection(db, "announcements");
    const snapshot = await getDocs(announcementsRef);

    let announcementsHTML = "<ul>";
    snapshot.forEach(doc => {
        const announcement = doc.data();
        announcementsHTML += `<li><strong>${announcement.title}</strong>: ${announcement.message}</li>`;
    });
    announcementsHTML += "</ul>";

    document.getElementById("announcements").innerHTML = announcementsHTML;
}

// Load data when page loads
export { db, loadLeaderboard, loadAnnouncements };
