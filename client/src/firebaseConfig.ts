import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAx1RXnMx2YaSYsWoFHPs9QHLxPJwGZLwQ",
  authDomain: "utak-test-70a83.firebaseapp.com",
  databaseURL:
    "https://utak-test-70a83-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "utak-test-70a83",
  storageBucket: "utak-test-70a83.appspot.com",
  messagingSenderId: "387099864132",
  appId: "1:387099864132:web:09050bf04be030a0196011",
  measurementId: "G-HTKCYGC81V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { database };
