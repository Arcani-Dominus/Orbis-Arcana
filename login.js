import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const result = document.getElementById("result");

    if (!email || !password) {
        result.innerHTML = "<span style='color: red;'>Please enter both email and password.</span>";
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("✅ User logged in:", user.email);

        // ✅ Fetch the user's saved level from Firestore
        const playerRef = doc(db, "players", user.uid);
        const playerSnap = await getDoc(playerRef);

        if (playerSnap.exists()) {
            const playerData = playerSnap.data();
            const lastLevel = playerData.level || 2; // ✅ Default to Level 2 if no data found

            console.log(`🔄 Redirecting player to Level ${lastLevel}...`);
            result.innerHTML = `<span class='success-text'>Login successful! Redirecting to Level ${lastLevel}...</span>`;

            setTimeout(() => {
                window.location.href = `level.html?level=${lastLevel}`;
            }, 2000);
        } else {
            console.warn("⚠ No player data found. Redirecting to Level 2...");
            window.location.href = "level.html?level=2";
        }
    } catch (error) {
        console.error("❌ Login failed:", error);
        result.innerHTML = `<span style='color: red;'>Error: ${error.message}</span>`;
    }
});
