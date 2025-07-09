
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore"
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAoPMDyFogXRsot3kh12B5iEQZB4Hwvbgg",
  authDomain: "al-shathibi.firebaseapp.com",
  projectId: "al-shathibi",
  storageBucket: "al-shathibi.appspot.com",
  messagingSenderId: "377674704726",
  appId: "1:377674704726:web:c98c3831594c41ee3418f7",
  measurementId: "G-1N8LY2MLBG"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app);
const analytics = getAnalytics(app);