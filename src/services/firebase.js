// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALHU5n6ua363zJxV4Z61fFMQxzAK0zVeY",
  authDomain: "studyflow-vb.firebaseapp.com",
  projectId: "studyflow-vb",
  storageBucket: "studyflow-vb.firebasestorage.app",
  messagingSenderId: "1062016676738",
  appId: "1:1062016676738:web:728f0ac2275c4b2121559b",
  measurementId: "G-CGMXW2TMT7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
