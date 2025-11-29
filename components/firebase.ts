import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4GqjifWsIk6jxyQkdh_BK_0YoUExvZIM",
  authDomain: "capkit-et.firebaseapp.com",
  projectId: "capkit-et",
  storageBucket: "capkit-et.firebasestorage.app",
  messagingSenderId: "590666611170",
  appId: "1:590666611170:web:ea6d92a087fa6bd766e1bb",
  measurementId: "G-XS2VEBCHH6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);