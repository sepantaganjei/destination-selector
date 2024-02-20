// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYa364emgtpIC1CHc2PNIs0Tmve-KPOe0",
  authDomain: "fjell-og-fjord.firebaseapp.com",
  projectId: "fjell-og-fjord",
  storageBucket: "fjell-og-fjord.appspot.com",
  messagingSenderId: "569390587340",
  appId: "1:569390587340:web:256e08d2dcdf464c60d169",
  measurementId: "G-ZV4604V0Y2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };