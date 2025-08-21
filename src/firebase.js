// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDzK81NivbizqNt-zPEN4NlCTBgcaq2Is",
  authDomain: "dashboard-ae110.firebaseapp.com",
  projectId: "dashboard-ae110",
  storageBucket: "dashboard-ae110.appspot.com", // ✅ fixed
  messagingSenderId: "521304157661",
  appId: "1:521304157661:web:6ddd0b24fe117206015a34",
  measurementId: "G-VP94XQXL2N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
