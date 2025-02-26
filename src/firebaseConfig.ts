import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your Firebase configuration (replace with your Firebase credentials)
const firebaseConfig = {
  apiKey: "AIzaSyBXWJo1upC59s68Dw_9EPjBg3tjqWvxWv0",
  authDomain: "reverb-a3702.firebaseapp.com",
  projectId: "reverb-a3702",
  storageBucket: "reverb-a3702.firebasestorage.app",
  messagingSenderId: "166688706505",
  appId: "1:166688706505:web:e7a10cb9c41482eaca6218",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign-In Function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User signed in:", result.user);
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};

// Google Sign-Out Function
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

export { auth };
