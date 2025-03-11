import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const result = document.getElementById("result");

    if (!email || !password) {
        result.innerHTML = "<span style='color: red;'>Please enter all details.</span>";
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        localStorage.setItem("userId", user.uid); // ✅ Save session
        result.innerHTML = "<span class='success-text'>Login successful! Redirecting...</span>";

        setTimeout(() => {
            window.location.href = "level.html?level=2";
        }, 2000);
    } catch (error) {
        console.error("❌ Login failed:", error);
        result.innerHTML = `<span style='color: red;'>Error: ${error.message}</span>`;
    }
});
