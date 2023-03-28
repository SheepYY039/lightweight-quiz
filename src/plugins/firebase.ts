import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyBjMrwfj0ExeO2tPAXQknThBXsQL7sWqg4",
  authDomain: "lighweight-quiz.firebaseapp.com",
  projectId: "lighweight-quiz",
  storageBucket: "lighweight-quiz.appspot.com",
  messagingSenderId: "211806024123",
  appId: "1:211806024123:web:beb93dd738d77b1959549e",
  measurementId: "G-Q02RLSQEXD",
});

// used for the firestore refs
const db = getFirestore(firebaseApp);

export const questionsRef = collection(db, "questions");
