document.addEventListener("DOMContentLoaded", () => {
    const levelData = {
        1: { riddle: "I have no substance, yet I follow you close. I vanish in darkness but thrive in the glow. What am I?", answer: "shadow" },
        2: { riddle: "The more you take, the more you leave behind. What am I?", answer: "footsteps" },
        3: { riddle: "I can be cracked, made, told, and played. What am I?", answer: "joke" },
        4: { riddle: "The more you remove from me, the bigger I get. What am I?", answer: "hole" }
    };

    // Get current level from URL (e.g., level.html?level=2)
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get("level") || 1;

    // Set riddle and title
    document.getElementById("level-title").innerText = `Level ${level}`;
    document.getElementById("riddle").innerText = levelData[level].riddle;

    // Submit Answer Function
    document.getElementById("submitAnswer").addEventListener("click", () => {
        const answer = document.getElementById("answerInput").value.trim().toLowerCase();
        const feedback = document.getElementById("feedback");

        if (answer === levelData[level].answer) {
            feedback.innerHTML = "<span class='success-text'>Correct! Proceeding to the next level...</span>";
            
            // Save player progress
            localStorage.setItem("playerLevel", parseInt(level) + 1);

            setTimeout(() => {
                window.location.href = `level.html?level=${parseInt(level) + 1}`;
            }, 2000);
        } else {
            feedback.innerHTML = "<span style='color: red;'>Wrong answer! Try again.</span>";
        }
    });
});
