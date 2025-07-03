// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDvx6M7cKL5w5r0tG2fnle4oTGACBFaVY",
  authDomain: "kpopduel.firebaseapp.com",
  projectId: "kpopduel",
  storageBucket: "kpopduel.firebasestorage.app",
  messagingSenderId: "987718918327",
  appId: "1:987718918327:web:f25c9913204d1eede5ad32",
  measurementId: "G-QTECS722BB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
