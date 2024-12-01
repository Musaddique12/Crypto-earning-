import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMxsBh4PIPSUqF6HtsNc1eQFhbGnK9skk",
  authDomain: "crypto-d48f6.firebaseapp.com",
  projectId: "crypto-d48f6",
  storageBucket: "crypto-d48f6.appspot.com",
  messagingSenderId: "556678186737",
  appId: "1:556678186737:web:b124dc0ee8f6eff9a04b50",
  measurementId: "G-HZ84YNFQ11"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore_database = getFirestore(app);