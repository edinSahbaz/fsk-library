// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6bcGPfiXzobRI7qgiuNG2NzDLgzdo7Ik",
  authDomain: "fsk-library.firebaseapp.com",
  projectId: "fsk-library",
  storageBucket: "fsk-library.appspot.com",
  messagingSenderId: "469411610643",
  appId: "1:469411610643:web:4aa3992dfbde0f7ccbffe6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);
