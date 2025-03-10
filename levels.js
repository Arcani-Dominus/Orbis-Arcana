// ✅ Define riddles for each level
const riddles = {
    1: "I have no substance, yet I follow you close. I vanish in darkness but thrive in the glow. What am I?",
    2: "The more you take, the more you leave behind. What am I?",
    3: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"
};

// ✅ Load the current level and riddle
export function loadLevel() {
    document.addEventListener("DOMContentLoaded", () => {
        const params = new URLSearchParams(window.location.search);
        const level = params.get("level") || 1;

        console.log(`📌 Loading Level ${level}`);

        // ✅ Check if elements exist before updating them
        const levelTitle = document.getElementById("levelTitle");
        const riddleText = document.getElementById("riddleText");

        if (levelTitle) {
            levelTitle.innerText = `Level ${level}`;
        } else {
            console.error("❌ Error: Element #levelTitle not found!");
        }

        if (riddleText) {
            riddleText.innerText = riddles[level] || "No riddle available for this level.";
        } else {
            console.error("❌ Error: Element #riddleText not found!");
        }
    });
}

// ✅ Ensure function runs when page loads
loadLevel();
