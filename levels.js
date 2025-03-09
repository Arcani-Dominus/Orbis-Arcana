document.addEventListener("DOMContentLoaded", () => {
    const levelData = {
        1: { riddle: "I have no substance, yet I follow you close. I vanish in darkness but thrive in the glow. What am I?", answer: "shadow" },
        2: { riddle: "The more you take, the more you leave behind. What am I?", answer: "footsteps" },
        3: { riddle: "I can be cracked, made, told, and played. What am I?", answer: "joke" },
        4: { riddle: "The more you remove from me, the bigger I get. What am I?", answer: "hole" }
    };

    // Get the current level from URL or saved progress
    const urlParams = new URLSearchParams(window.location.search);
    let level = parseInt(urlParams.get("level")) || parseInt(localStorage.getItem("playerLevel")) || 1;

    if (!levelData[level]) level = 1; // Reset if level doesn't exist

    document.getElementById("level-title").innerText = `Level ${level}`;
    document.getElementById("riddle").innerText = levelData[level].riddle;

    document.getElementById("submitAnswer").addEventListener("click", () => {
        const answer = document.getElementById("answerInput").value.trim().toLowerCase();
        const feedback = document.getElementById("feedback");

        if (answer === levelData[level].answer) {
            feedback.innerHTML = "<span class='success-text'>Correct! Proceeding to the next level...</span>";
            localStorage.setItem("playerLevel", level + 1);

            setTimeout(() => {
                window.location.href = `level.html?level=${level + 1}`;
            }, 2000);
        } else {
            feedback.innerHTML = "<span style='color: red;'>Wrong answer! Try again.</span>";
        }
    });
});
