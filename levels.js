// ✅ Define riddles for each level
const riddles = {
    1: "I have no substance, yet I follow you close. I vanish in darkness but thrive in the glow. What am I?",
    2: "The more you take, the more you leave behind. What am I?",
    3: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"
};

// ✅ Load the current level and riddle
export function loadLevel() {
    const params = new URLSearchParams(window.location.search);
    const level = params.get("level") || 1;

    console.log(`📌 Loading Level ${level}`);
    
    document.getElementById("levelTitle").innerText = `Level ${level}`;

    // ✅ Set riddle text if it exists
    if (riddles[level]) {
        document.getElementById("riddleText").innerText = riddles[level];
    } else {
        document.getElementById("riddleText").innerText = "No riddle available for this level.";
    }
}

// ✅ Ensure function is called when page loads
document.addEventListener("DOMContentLoaded", loadLevel);
