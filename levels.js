// levels.js

import { auth, db } from "./firebase-config.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Elements
const levelNumberEl = document.getElementById("level-number");
const riddleTextEl = document.getElementById("riddle-text");
const answerInput = document.getElementById("answer");
const submitBtn = document.getElementById("submit-answer");
const feedbackEl = document.getElementById("feedback");

// Load the current level for the logged-in user
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const userData = userSnap.data();
    const currentLevel = userData.currentLevel || 1;
    loadLevel(currentLevel);
  } else {
    // If new user, initialize
    await setDoc(userRef, {
      currentLevel: 1,
      hintsUsed: {},
      score: 0,
    });
    loadLevel(1);
  }
});

// Function to load level content
async function loadLevel(levelNumber) {
  const levelRef = doc(db, "levels", `level${levelNumber}`);
  const levelSnap = await getDoc(levelRef);

  if (levelSnap.exists()) {
    const levelData = levelSnap.data();
    levelNumberEl.textContent = `Level ${levelNumber}`;
    riddleTextEl.textContent = levelData.riddle || "No riddle found!";
    feedbackEl.textContent = "";
  } else {
    levelNumberEl.textContent = "🎉 Congratulations!";
    riddleTextEl.textContent = "You have completed all levels!";
    submitBtn.style.display = "none";
    answerInput.style.display = "none";
  }
}

// Handle answer submission
submitBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const answer = answerInput.value.trim().toLowerCase();
  if (!answer) {
    feedbackEl.textContent = "⚠️ Please enter an answer.";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;
  const userData = userSnap.data();
  const currentLevel = userData.currentLevel || 1;

  const levelRef = doc(db, "levels", `level${currentLevel}`);
  const levelSnap = await getDoc(levelRef);

  if (!levelSnap.exists()) return;
  const levelData = levelSnap.data();

  // Validate answer
  if (levelData.answer && answer === levelData.answer.toLowerCase()) {
    feedbackEl.textContent = "✅ Correct! Proceeding to next level...";
    answerInput.value = "";

    // Update user progress
    await updateDoc(userRef, {
      currentLevel: currentLevel + 1,
      score: increment(10), // +10 points per correct answer
    });

    // Small delay before loading next level
    setTimeout(() => {
      loadLevel(currentLevel + 1);
    }, 1500);
  } else {
    feedbackEl.textContent = "❌ Incorrect answer. Try again!";
  }
});
