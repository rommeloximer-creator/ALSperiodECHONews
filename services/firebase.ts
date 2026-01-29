import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgvnHGxu_G5euXHrIoov07GxS08CtvG4Y",
  authDomain: "als-periodecho.firebaseapp.com",
  projectId: "als-periodecho",
  storageBucket: "als-periodecho.firebasestorage.app",
  messagingSenderId: "969937604443",
  appId: "1:969937604443:web:fead3fe0aa71a6f2d7147e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the tools we need
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();