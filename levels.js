import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDoc, doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

export async function getRiddle(level) {
    try {
        const levelRef = doc(db, "answers", level.toString());
        const levelSnap = await getDoc(levelRef);

        if (levelSnap.exists()) {
            return levelSnap.data().riddle;
        } else {
            console.warn(`⚠️ No riddle found for Level ${level}`);
            return null;
        }
    } catch (error) {
        console.error("❌ Firestore error while fetching riddle:", error);
        return null;
    }
}

export async function getAnswer(level) {
    try {
        const levelRef = doc(db, "answers", level.toString());
        const levelSnap = await getDoc(levelRef);

        if (levelSnap.exists()) {
            return levelSnap.data().answer.toLowerCase();
        } else {
            console.warn(`⚠️ No answer found for Level ${level}`);
            return null;
        }
    } catch (error) {
        console.error("❌ Firestore error while fetching answer:", error);
        return null;
    }
}

export async function getAnnouncement() {
    try {
        const announcementRef = doc(db, "announcements", "latest");
        const announcementSnap = await getDoc(announcementRef);

        if (announcementSnap.exists()) {
            return announcementSnap.data().message;
        } else {
            console.warn("⚠️ No announcement found in Firestore.");
            return "No announcements available.";
        }
    } catch (error) {
        console.error("❌ Firestore error while fetching announcement:", error);
        return "Error loading announcements.";
    }
}

// ✅ Get a hint for the current level (max 3 across entire game)
export async function getHint(level) {
    const user = auth.currentUser;
    if (!user) {
        document.getElementById("hintDisplay").innerText = "❌ You must be logged in to use hints.";
        return;
    }

    const playerRef = doc(db, "players", user.uid);
    const playerSnap = await getDoc(playerRef);

    if (!playerSnap.exists()) return;

    const playerData = playerSnap.data();
    let totalHintsUsed = playerData.hintsUsed || 0;
    let unlockedHints = playerData.hintsUnlocked || {}; // { "2": true, "3": true }

    // 🚨 Check global limit
    if (totalHintsUsed >= 3) {
        document.getElementById("hintDisplay").innerText = "⚠️ You have used all 3 hints!";
        return;
    }

    // 🚨 Check if already unlocked for this level
    if (unlockedHints[level]) {
        // Just re-show the hint, don’t consume a new one
        const levelRef = doc(db, "answers", level.toString());
        const levelSnap = await getDoc(levelRef);
        if (levelSnap.exists()) {
            const hints = levelSnap.data().hints || [];
            document.getElementById("hintDisplay").innerText = `💡 Hint: ${hints[0] || "No hint available"}`;
        }
        return;
    }

    // ✅ Otherwise, unlock hint for this level
    const levelRef = doc(db, "answers", level.toString());
    const levelSnap = await getDoc(levelRef);

    if (!levelSnap.exists()) {
        document.getElementById("hintDisplay").innerText = "⚠️ No hint found for this level.";
        return;
    }

    const hints = levelSnap.data().hints || [];
    if (hints.length === 0) {
        document.getElementById("hintDisplay").innerText = "⚠️ No hints set for this riddle.";
        return;
    }

    const hint = hints[0]; // 👈 Only 1 hint per level
    document.getElementById("hintDisplay").innerText = `💡 Hint: ${hint}`;

    // Update Firestore: consume 1 global hint + mark unlocked for this level
    await updateDoc(playerRef, {
        hintsUsed: totalHintsUsed + 1,
        [`hintsUnlocked.${level}`]: true
    });

    // Update counter in UI
    document.getElementById("hintCounter").innerText = `Hints used: ${totalHintsUsed + 1}/3`;
}


// ✅ Ensure Users Stay Logged In & Redirect to Their Level
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("✅ User is already logged in:", user.email);

        const playerRef = doc(db, "players", user.uid);
        const playerSnap = await getDoc(playerRef);

        if (playerSnap.exists()) {
            const lastLevel = playerSnap.data().level || 2;
            const urlParams = new URLSearchParams(window.location.search);
            const currentLevel = parseInt(urlParams.get("level")) || 2;

            if (lastLevel !== currentLevel) {
                console.log(`🔄 Redirecting user to their correct level: ${lastLevel}`);
                window.location.href = `level.html?level=${lastLevel}`;
            } else {
                console.log(`✅ User is already on the correct level: ${currentLevel}`);
                const riddle = await getRiddle(currentLevel);
                if (!riddle) {
                    console.warn(`⚠ No riddle found for Level ${currentLevel}. Redirecting to waiting page...`);
                    window.location.href = `waiting.html?level=${currentLevel}`;
                }
            }
        }
    }
});
