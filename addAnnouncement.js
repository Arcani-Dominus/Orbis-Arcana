import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

async function addAnnouncement(title, message) {
    try {
        await addDoc(collection(db, "announcements"), {
            title: title,
            message: message,
            timestamp: serverTimestamp()  // ✅ Ensures Firestore stores it correctly
        });
        console.log("✅ Announcement added successfully!");
    } catch (error) {
        console.error("❌ Error adding announcement:", error);
    }
}

// Example Usage
addAnnouncement("System Update", "A new feature has been added!");
