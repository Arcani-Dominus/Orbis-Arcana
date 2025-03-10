// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// ✅ Firebase configuration (Use your existing credentials)
const firebaseConfig = {
  apiKey: "AIzaSyChs_NAolpqRZ-dV22bZ5KXhqXa5XuNJTI",
  authDomain: "orbis-arcana.firebaseapp.com",
  projectId: "orbis-arcana",
  storageBucket: "orbis-arcana.appspot.com", // Fixed incorrect domain
  messagingSenderId: "474107878031",
  appId: "1:474107878031:web:0869ada48ff6a446356efa"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Initialize Firestore

// ✅ Export Firestore database
export { db };
