// This file is currently mocked to avoid build errors with missing Firebase credentials/modules.
// In a real production environment, you would uncomment the imports and configuration below.

/*
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAYrt2Z6NnRhcSzbhtUyJtNzJDZqu6WH38",
  authDomain: "smartfinance-1b246.firebaseapp.com",
  projectId: "smartfinance-1b246",
  storageBucket: "smartfinance-1b246.firebasestorage.app",
  messagingSenderId: "10936824598",
  appId: "1:10936824598:web:e9f5f5b8ae7c0101c79637"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
*/

export const auth = {} as any;
export const db = {} as any;