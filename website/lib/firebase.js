// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnJ3OsYpplFiGQ3nMuhNjEGEiMEdptzPw",
  authDomain: "fsk-library-48d52.firebaseapp.com",
  projectId: "fsk-library-48d52",
  storageBucket: "fsk-library-48d52.appspot.com",
  messagingSenderId: "925626513064",
  appId: "1:925626513064:web:f5937f95fe12e45bef349d",
  measurementId: "G-KVW5ZSBZN4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);
