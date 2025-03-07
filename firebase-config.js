// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyChs_NAolpqRZ-dV22bZ5KXhqXa5XuNJTI",
    authDomain: "orbis-arcana.firebaseapp.com",
    projectId: "orbis-arcana",
    storageBucket: "orbis-arcana.appspot.com",  // Fixed incorrect ".app" to ".com"
    messagingSenderId: "474107878031",
    appId: "1:474107878031:web:0869ada48ff6a446356efa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to submit player details
async function submitDetails() {
    const name = document.getElementById("nameInput").value.trim();
    const studentID = document.getElementById("studentIDInput").value.trim();
    const result = document.getElementById("result");

    if (!name || !studentID) {
        result.innerHTML = "<span style='color: red;'>Please enter all details.</span>";
        return;
    }

    try {
        // Save to Firestore
        await setDoc(doc(db, "players", studentID), {
            name: name,
            studentID: studentID,
            level: 2,
            timestamp: new Date()
        });

        // Store student ID locally
        localStorage.setItem("studentID", studentID);

        result.innerHTML = "<span style='color: #66ffcc;'>Registration successful! Proceeding to Level 2...</span>";
        setTimeout(() => window.location.href = "level2.html", 2000);
    } catch (error) {
        console.error("Error writing document: ", error);
        result.innerHTML = "<span style='color: red;'>An error occurred. Check console.</span>";
    }
}

// Export database
export { db, submitDetails };
