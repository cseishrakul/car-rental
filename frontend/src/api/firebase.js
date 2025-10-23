import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAi-tAm6TU8JzOO971UaNIUY_pOnv_G8eQ",
  authDomain: "car-rental-4d171.firebaseapp.com",
  projectId: "car-rental-4d171",
  storageBucket: "car-rental-4d171.firebasestorage.app",
  messagingSenderId: "813494467261",
  appId: "1:813494467261:web:e1753ef2273dbae1f195d4",
  measurementId: "G-TYCLXF4YFV",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
