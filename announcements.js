import { db } from "./firebase-config.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

export function loadAnnouncements() {
    const announcementsRef = collection(db, "announcements");
    const q = query(announcementsRef, orderBy("timestamp", "desc"));

    const announcementsElement = document.getElementById("announcements");

    // Real-time Firestore listener to update announcements automatically
    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            announcementsElement.textContent = "📢 No announcements at the moment.";
        } else {
            let announcementText = "";
            snapshot.forEach(doc => {
                const announcement = doc.data();
                announcementText += `🔔 ${announcement.title}: ${announcement.message} <br>`;
            });
            announcementsElement.innerHTML = announcementText;
        }
    });
}
