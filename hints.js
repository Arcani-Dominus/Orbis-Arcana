import { db, auth } from "./firebase-config.js";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// UI Elements
const hintButton = document.getElementById("hint-button");
const hintContainer = document.getElementById("hint-container");

// Listen for auth state
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // If user doc doesn’t exist, create it
      await setDoc(userRef, {
        totalHintsUsed: 0,
        usedHints: {} // to track per level
      });
    }

    // Attach button click handler
    hintButton.addEventListener("click", async () => {
      const updatedSnap = await getDoc(userRef);
      const userData = updatedSnap.data();

      const totalHintsUsed = userData.totalHintsUsed || 0;
      const usedHints = userData.usedHints || {};

      // Get current level (from localStorage or however your app stores it)
      const currentLevel = localStorage.getItem("currentLevel");

      // Case 1: Already reached total limit
      if (totalHintsUsed >= 3) {
        hintContainer.textContent = "❌ You have used all 3 hints for the game.";
        hintButton.disabled = true;
        return;
      }

      // Case 2: Already used a hint for this level
      if (usedHints[currentLevel]) {
        hintContainer.textContent = "⚠️ You already used a hint for this level.";
        hintButton.disabled = true;
        return;
      }

      // ✅ Fetch the hint for this level
      const hintRef = doc(db, "hints", currentLevel);
      const hintSnap = await getDoc(hintRef);

      if (hintSnap.exists()) {
        const hintData = hintSnap.data();
        const hintText = hintData.text;

        // Show the hint
        hintContainer.textContent = `💡 Hint: ${hintText}`;

        // Update Firestore → increment totalHintsUsed, mark this level as used
        await updateDoc(userRef, {
          totalHintsUsed: totalHintsUsed + 1,
          [`usedHints.${currentLevel}`]: true
        });

        // Disable button for this level
        hintButton.disabled = true;
      } else {
        hintContainer.textContent = "❌ No hint available for this level.";
      }
    });
  }
});
