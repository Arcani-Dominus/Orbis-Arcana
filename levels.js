// ✅ levels.js
import { db, auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

/**
 * Fetch the riddle for a given level from Firestore
 * @param {number} level
 * @returns {Promise<string>} riddle text
 */
export async function getRiddle(level) {
    try {
        const levelRef = doc(db, "answers", level.toString());
        const levelSnap = await getDoc(levelRef);

        if (levelSnap.exists()) {
            return levelSnap.data().riddle || "Riddle not set.";
        } else {
            console.warn(`No riddle found for Level ${level}`);
            return "Riddle not found!";
        }
    } catch (error) {
        console.error("Firestore error while fetching riddle:", error);
        return "Error loading riddle.";
    }
}

/**
 * Fetch the answer for a given level from Firestore
 * @param {number} level
 * @returns {Promise<string>} answer text
 */
export async function getAnswer(level) {
    try {
        const levelRef = doc(db, "answers", level.toString());
        const levelSnap = await getDoc(levelRef);

        if (levelSnap.exists()) {
            return (levelSnap.data().answer || "").toLowerCase();
        } else {
            console.warn(`No answer found for Level ${level}`);
            return "";
        }
    } catch (error) {
        console.error("Firestore error while fetching answer:", error);
        return "";
    }
}

/**
 * Fetch the latest announcement from Firestore
 * @returns {Promise<string>} announcement message
 */
export async function getAnnouncement() {
    try {
        const announcementRef = doc(db, "announcements", "latest");
        const announcementSnap = await getDoc(announcementRef);

        if (announcementSnap.exists()) {
            return announcementSnap.data().message || "No announcements available.";
        } else {
            console.warn("No announcements found in Firestore.");
            return "No announcements available.";
        }
    } catch (error) {
        console.error("Firestore error while fetching announcement:", error);
        return "Error loading announcements.";
    }
}

/**
 * Optional: redirect user to correct level if logged in
 */
onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
        const playerRef = doc(db, "players", user.uid);
        const playerSnap = await getDoc(playerRef);

        if (!playerSnap.exists()) return;

        const lastLevel = playerSnap.data().level || 1;
        const urlParams = new URLSearchParams(window.location.search);
        const currentLevel = parseInt(urlParams.get("level")) || 1;

        if (currentLevel !== lastLevel) {
            window.location.href = `level.html?level=${lastLevel}`;
        }
    } catch (error) {
        console.error("Error checking user level:", error);
    }
});
