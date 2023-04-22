// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU1AvQKVcPatgVI3-OFEFMcs8DQVmq94Q",
  authDomain: "safehouse-ca939.firebaseapp.com",
  projectId: "safehouse-ca939",
  storageBucket: "safehouse-ca939.appspot.com",
  messagingSenderId: "710104299287",
  appId: "1:710104299287:web:2864392f415a9fbabba952",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
export const db = getFirestore(app);
