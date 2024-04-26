// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2TwBZHP9rRFC2CxeXA8SNYuOyf9dycPc",
  authDomain: "gestiondelolivar-48d30.firebaseapp.com",
  projectId: "gestiondelolivar-48d30",
  storageBucket: "gestiondelolivar-48d30.appspot.com",
  messagingSenderId: "395277959461",
  appId: "1:395277959461:web:debbdd783846228e8b9acc",
  measurementId: "G-6ZSMR5H9M1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
